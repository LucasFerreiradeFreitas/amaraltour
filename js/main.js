// js/main.js

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  loadTripsFromAPI();
});

// 1. Menu Mobile (Cabeçalho sempre visível, apenas alternando a classe)
function initMobileMenu() {
  const btn = document.getElementById("mobileMenuBtn");
  const nav = document.getElementById("mainNav");

  if (btn && nav) {
    btn.addEventListener("click", () => {
      btn.classList.toggle("active");
      nav.classList.toggle("active");
    });
  }
}

// 2. Consumo da API do Netlify e Renderização
async function loadTripsFromAPI() {
  const tripsGrid = document.getElementById("trips-grid");
  if (!tripsGrid) return;

  // Limpa o grid e mostra um estado de carregamento
  tripsGrid.innerHTML =
    '<div style="grid-column: 1 / -1; text-align: center; color: var(--color-text-secondary);">Buscando destinos incríveis...</div>';

  try {
    // O ?t=Date.now() evita que o navegador faça cache de viagens antigas
    const response = await fetch(`/.netlify/functions/trips?t=${Date.now()}`);

    if (!response.ok) {
      // Tratamento de erros seguro e explícito
      if (response.status === 404) {
        throw new Error("A rota de viagens não foi encontrada.");
      } else if (response.status === 500) {
        throw new Error("Erro interno no servidor do Netlify.");
      } else {
        throw new Error(`Erro na comunicação. Status: ${response.status}`);
      }
    }

    const trips = await response.json();

    if (!Array.isArray(trips) || trips.length === 0) {
      tripsGrid.innerHTML =
        '<div style="grid-column: 1 / -1; text-align: center;">Nenhum roteiro programado no momento.</div>';
      return;
    }

    // Limpa o grid para receber os cards reais
    tripsGrid.innerHTML = "";

    trips.forEach((trip) => {
      const tripCard = createTripCard(trip);
      tripsGrid.appendChild(tripCard);
    });
  } catch (error) {
    console.error("Falha ao carregar viagens:", error);
    tripsGrid.innerHTML =
      '<div style="grid-column: 1 / -1; text-align: center; color: #EF4444;">Não foi possível carregar as viagens. Tente recarregar a página.</div>';
  }
}

// 3. Criação do Card Semântico
function createTripCard(trip) {
  const card = document.createElement("article");
  card.className = "trip-card";

  const isAvailable = trip.status === "available";
  const badgeClass = isAvailable ? "" : "esgotado";
  const badgeText = isAvailable ? "Disponível" : "Esgotado";

  // Usamos Template Literals para um código HTML muito mais limpo
  card.innerHTML = `
    <div class="trip-image-wrapper">
      <span class="trip-badge ${badgeClass}">${badgeText}</span>
      <img src="${trip.image}" alt="Viagem para ${trip.title}" loading="lazy" />
    </div>
    <div class="trip-content">
      <h3 class="trip-title">${trip.title}</h3>
      <p class="trip-date">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        ${trip.date}
      </p>
      <p class="trip-description">${trip.description || ""}</p>
      <a href="${trip.link || "#"}" class="btn btn-primary">Ver Detalhes</a>
    </div>
  `;

  return card;
}
