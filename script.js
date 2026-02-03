// Mobile menu toggle
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mainNav = document.getElementById("mainNav");

mobileMenuBtn.addEventListener("click", function () {
  this.classList.toggle("active");
  mainNav.classList.toggle("active");
});

// Close mobile menu when clicking on a link
const navLinks = mainNav.querySelectorAll("a");
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenuBtn.classList.remove("active");
    mainNav.classList.remove("active");
  });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Add animation on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe trip cards for animation
document.querySelectorAll(".trip-card").forEach((card) => {
  card.style.opacity = "0";
  card.style.transform = "translateY(20px)";
  card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  observer.observe(card);
});

// ─── Carrega viagens da nuvem (Netlify Function → Blobs) ───
async function loadTripsFromStorage() {
  try {
    const response = await fetch("/.netlify/functions/trips");
    if (!response.ok) throw new Error("Erro " + response.status);

    const trips = await response.json();

    if (Array.isArray(trips) && trips.length > 0) {
      renderDynamicTrips(trips);
    }
  } catch (error) {
    console.log("Não foi possível carregar viagens extras:", error);
  }
}

// Função para renderizar viagens dinamicamente
function renderDynamicTrips(trips) {
  const tripsGrid = document.querySelector(".trips-grid");

  trips.forEach((trip) => {
    const tripCard = createTripCard(trip);
    tripsGrid.appendChild(tripCard);

    // aplica a mesma animação de entrada dos cards estáticos
    tripCard.style.opacity = "0";
    tripCard.style.transform = "translateY(20px)";
    tripCard.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(tripCard);
  });
}

// Função para criar card de viagem
function createTripCard(trip) {
  const card = document.createElement("div");
  card.className = "trip-card";

  const statusColor = trip.status === "available" ? "#10b981" : "#ff3616";
  const statusText = trip.status === "available" ? "Disponível" : "Esgotado";

  card.innerHTML = `
    <div class="trip-image">
      <img src="${trip.image}" alt="${trip.title}" />
      <span class="trip-badge" style="background-color: ${statusColor};">${statusText}</span>
    </div>
    <div class="trip-content">
      <h3 class="trip-title">${trip.title}</h3>
      <p class="trip-date">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        ${trip.date}
      </p>
      <p class="trip-description">
        ${trip.description}
      </p>
      <a href="${trip.link || "#"}" class="btn-saiba-mais">Saiba Mais</a>
    </div>
  `;

  return card;
}

// Carrega as viagens quando a página carregar
window.addEventListener("DOMContentLoaded", loadTripsFromStorage);
