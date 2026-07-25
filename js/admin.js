// js/admin.js

// ... (Mantenha a sua lógica de Login e de carregar viagens intacta) ...

// Nova função elegante para exibir mensagens
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<p style="color: var(--color-brand-primary); font-weight: 500;">${message}</p>`;

  container.appendChild(toast);

  // Remove o toast automaticamente após 3.5 segundos
  setTimeout(() => {
    toast.style.animation = "slideInRight 0.3s ease reverse forwards";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Renderização na Tabela em vez de Grid
function renderTrips() {
  const tbody = document.getElementById("trips-tbody");
  const loading = document.getElementById("loading");
  const emptyState = document.getElementById("empty-state");

  loading.style.display = "none";

  if (trips.length === 0) {
    tbody.innerHTML = "";
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";

  tbody.innerHTML = trips
    .map((trip) => {
      const statusClass =
        trip.status === "available" ? "badge-success" : "esgotado";
      const statusText =
        trip.status === "available" ? "Disponível" : "Esgotado";

      return `
      <tr>
        <td><span class="badge-pill ${statusClass}">${statusText}</span></td>
        <td style="font-weight: 600;">${trip.title}</td>
        <td style="color: var(--color-text-secondary);">${trip.date}</td>
        <td>
          <button class="btn btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.85rem; margin-right: 0.5rem;" onclick="editTrip('${trip.id}')">Editar</button>
          <button class="btn btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.85rem; color: #EF4444; border-color: #FCA5A5;" onclick="deleteTrip('${trip.id}')">Excluir</button>
        </td>
      </tr>
    `;
    })
    .join("");
}

// Exemplo de como usar o Toast ao salvar:
async function saveTrip(event) {
  event.preventDefault();
  // ... sua lógica de montar o objeto tripData ...

  try {
    // await syncTrips(); (Sua chamada para o netlify blobs)

    // Substituindo o alert nativo:
    showToast("Viagem salva com sucesso!", "success");
    closeModal();
    renderTrips();
  } catch (error) {
    showToast("Erro ao salvar viagem. Tente novamente.", "error");
  }
}
