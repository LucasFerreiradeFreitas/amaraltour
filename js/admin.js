// ==========================================
// js/admin.js - Amaraltour Dashboard
// ==========================================

// --- DADOS GLOBAIS ---
let trips = [];
let editingTripId = null; // Controla se estamos criando ou editando

// --- 1. COMUNICAÇÃO COM O SERVIDOR (API BLOBS) ---
window.loadTrips = async function () {
  const loading = document.getElementById("loading");
  if (loading) loading.style.display = "block";

  try {
    const response = await fetch("/.netlify/functions/trips?t=" + Date.now());
    if (response.ok) {
      trips = await response.json();
    } else {
      showToast("Erro ao buscar dados do servidor.", "error");
    }
  } catch (error) {
    showToast("Falha de conexão com a API.", "error");
  }

  renderTrips(); // Atualiza a tabela com os dados reais
};

window.syncTrips = async function () {
  // Envia a lista atualizada para o Netlify Blobs
  const response = await fetch("/.netlify/functions/trips", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ trips: trips }),
  });

  if (!response.ok) throw new Error("Falha ao salvar no banco");
};

// --- 2. LÓGICA DE LOGIN ---
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  loginBtn.addEventListener("click", async function (e) {
    e.preventDefault();
    const password = document.getElementById("adminPassword").value.trim();
    const errorMsg = document.getElementById("loginError");

    if (!password) {
      errorMsg.innerText = "Digite a senha!";
      errorMsg.style.display = "block";
      return;
    }

    const originalText = loginBtn.innerText;
    loginBtn.innerText = "Verificando...";
    loginBtn.disabled = true;

    try {
      const response = await fetch("/.netlify/functions/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      let data = {};
      try {
        data = await response.json();
      } catch (err) {}

      if (response.ok && data.authenticated) {
        errorMsg.style.display = "none";
        document.getElementById("login-screen").style.display = "none";
        document.getElementById("admin-panel").style.display = "flex";
        showToast("Bem-vindo ao painel da Amaraltour!", "success");

        // MÁGICA AQUI: Busca as viagens reais ao logar
        loadTrips();
      } else {
        errorMsg.innerText = `Erro ${response.status}: ${data.message || "Falha no servidor"}`;
        errorMsg.style.display = "block";
      }
    } catch (error) {
      errorMsg.innerText = "Erro de conexão (API offline)";
      errorMsg.style.display = "block";
    } finally {
      loginBtn.innerText = originalText;
      loginBtn.disabled = false;
    }
  });
}

window.logout = function () {
  document.getElementById("admin-panel").style.display = "none";
  document.getElementById("login-screen").style.display = "flex";
  document.getElementById("adminPassword").value = "";
};

// --- 3. LÓGICA DO MODAL (EVITANDO BUGS) ---
window.openAddModal = function () {
  editingTripId = null; // Reseta o ID para garantir que é uma NOVA viagem
  const modal = document.getElementById("trip-modal");
  if (modal) {
    modal.style.display = "flex";
    document.getElementById("modal-title").innerText = "Nova Viagem";

    // Proteção extra para evitar travamentos
    const form = document.getElementById("trip-form");
    if (form) form.reset();
  }
};

window.closeModal = function () {
  const modal = document.getElementById("trip-modal");
  if (modal) {
    modal.style.display = "none";
    const form = document.getElementById("trip-form");
    if (form) form.reset();
  }
};

// --- 4. FORMULÁRIO E AÇÕES CRUD (SALVAR E EDITAR) ---
const tripForm = document.getElementById("trip-form");
if (tripForm) {
  tripForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const status = document.getElementById("status").value;

    // Cria o objeto da viagem (você pode adicionar os campos de data e preço aqui depois)
    const tripData = {
      id: editingTripId || Date.now().toString(), // Gera ID único se for nova
      title: title,
      status: status,
      date: new Date().toLocaleDateString("pt-BR"), // Data provisória
    };

    if (editingTripId) {
      // Atualiza a viagem existente
      const index = trips.findIndex((t) => t.id === editingTripId);
      if (index !== -1) trips[index] = { ...trips[index], ...tripData };
    } else {
      // Adiciona a nova viagem
      trips.push(tripData);
    }

    try {
      await syncTrips(); // Salva no Netlify
      showToast("Viagem salva com sucesso!", "success");
      closeModal();
      renderTrips();
    } catch (error) {
      showToast("Erro ao salvar viagem no servidor.", "error");
    }
  });
}

// Ações dos botões na tabela
window.editTrip = function (id) {
  const trip = trips.find((t) => t.id === id);
  if (!trip) return;

  editingTripId = id; // Marca que estamos editando

  const modal = document.getElementById("trip-modal");
  if (modal) modal.style.display = "flex";

  document.getElementById("modal-title").innerText = "Editar Viagem";

  // Preenche os campos atuais no modal
  const titleInput = document.getElementById("title");
  const statusInput = document.getElementById("status");
  if (titleInput) titleInput.value = trip.title;
  if (statusInput) statusInput.value = trip.status;
};

window.deleteTrip = async function (id) {
  if (confirm("Tem certeza que deseja excluir esta viagem?")) {
    trips = trips.filter((t) => t.id !== id);
    try {
      await syncTrips();
      showToast("Viagem excluída com sucesso!", "success");
      renderTrips();
    } catch (e) {
      showToast("Erro ao excluir", "error");
      loadTrips(); // Restaura a lista em caso de falha
    }
  }
};

// --- 5. RENDERIZAÇÃO DA TABELA ---
window.renderTrips = function () {
  const tbody = document.getElementById("trips-tbody");
  const loading = document.getElementById("loading");
  const emptyState = document.getElementById("empty-state");

  if (loading) loading.style.display = "none";

  if (trips.length === 0) {
    if (tbody) tbody.innerHTML = "";
    if (emptyState) emptyState.style.display = "block";
    return;
  }

  if (emptyState) emptyState.style.display = "none";

  if (tbody) {
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
          <td style="color: var(--color-text-secondary);">${trip.date || "-"}</td>
          <td>
            <button class="btn btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.85rem; margin-right: 0.5rem;" onclick="editTrip('${trip.id}')">Editar</button>
            <button class="btn btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.85rem; color: #EF4444; border-color: #FCA5A5;" onclick="deleteTrip('${trip.id}')">Excluir</button>
          </td>
        </tr>
      `;
      })
      .join("");
  }
};

// --- 6. MENSAGENS (TOASTS) & EXTRAS ---
window.showToast = function (message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<p style="color: var(--color-brand-primary); font-weight: 500;">${message}</p>`;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = "slideInRight 0.3s ease reverse forwards";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
};

window.toggleExportData = function () {
  const exportSec = document.getElementById("export-section");
  if (exportSec) {
    exportSec.style.display =
      exportSec.style.display === "none" ? "block" : "none";
  }
};
