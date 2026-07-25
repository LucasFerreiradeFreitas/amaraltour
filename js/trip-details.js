// js/trip-details.js

document.addEventListener("DOMContentLoaded", initTripDetails);

async function initTripDetails() {
  // 1. Pega o ID da URL (ex: ?id=12345)
  const params = new URLSearchParams(window.location.search);
  const tripId = params.get("id");

  if (!tripId) {
    showError();
    return;
  }

  // 2. Busca os dados da API (Netlify Blobs)
  try {
    const response = await fetch(`/.netlify/functions/trips?t=${Date.now()}`);

    if (!response.ok) throw new Error("Erro ao buscar as viagens do servidor");

    const trips = await response.json();

    // 3. Procura a viagem com o ID correspondente
    const trip = trips.find((t) => t.id === tripId);

    if (trip) {
      renderTrip(trip);
    } else {
      showError();
    }
  } catch (error) {
    console.error("Erro ao carregar detalhes:", error);
    showError();
  }
}

function renderTrip(trip) {
  // Oculta o loading e exibe o conteúdo com display: grid (conforme nosso CSS)
  document.getElementById("loading").style.display = "none";
  document.getElementById("content").style.display = "grid";

  // 1. SEO e Título da Página
  document.title = `${trip.title} | Amaraltour`;

  // 2. Preencher Cabeçalho da Viagem
  document.getElementById("detail-title").textContent = trip.title;
  document.getElementById("detail-date").textContent = `📅 ${trip.date}`;

  const imgElement = document.getElementById("detail-image");
  imgElement.src = trip.image;
  imgElement.alt = `Foto de ${trip.title}`;

  // 3. Preencher a Introdução (Aceita quebras de linha)
  const introText = trip.fullIntro || trip.description || "";
  document.getElementById("detail-intro").innerHTML = introText.replace(
    /\n/g,
    "<br>",
  );

  // 4. Preencher Preço na Sidebar
  document.getElementById("detail-price").textContent =
    trip.price || "Consulte-nos";

  // 5. Preencher Listas (Usando uma função utilitária para evitar código repetido)
  renderList("section-boarding", "detail-boarding", trip.boardingInfo);
  renderList("section-activities", "detail-activities", trip.activities);
  renderList("section-items", "detail-items", trip.includedItems);

  // A lista de pagamento fica dentro da Sidebar
  renderList("payment-container", "detail-payment", trip.paymentInfo);
}

// Função Utilitária DRY (Don't Repeat Yourself) para processar as listas
function renderList(sectionId, listId, textData) {
  const section = document.getElementById(sectionId);
  const list = document.getElementById(listId);

  if (!section || !list) return; // Proteção contra erros no DOM

  list.innerHTML = "";

  if (textData && textData.trim() !== "") {
    section.style.display = "block"; // Mostra a seção

    // Divide o texto por quebras de linha e cria os <li>
    const items = textData.split("\n");
    items.forEach((item) => {
      if (item.trim()) {
        const li = document.createElement("li");
        li.innerHTML = item.trim();
        list.appendChild(li);
      }
    });
  } else {
    // Se não houver dados para esta categoria, oculta a seção inteira
    section.style.display = "none";
  }
}

function showError() {
  document.getElementById("loading").style.display = "none";
  document.getElementById("error-state").style.display = "block";
}
