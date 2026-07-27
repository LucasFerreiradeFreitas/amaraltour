// ==========================================
// js/admin.js - Amaraltour Dashboard
// ==========================================

// --- DADOS GLOBAIS ---
let trips = []; // Aqui você carregará os dados reais do Netlify Blobs

// --- LÓGICA DE LOGIN E TRANSIÇÃO DE TELA ---
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  loginBtn.addEventListener("click", async function (e) {
    e.preventDefault();
    const password = document.getElementById("adminPassword").value;
    const errorMsg = document.getElementById("loginError");

    if (!password) {
      errorMsg.innerText = "Digite a senha!";
      errorMsg.style.display = "block";
      return;
    }

    // Feedback visual de carregamento
    const originalText = loginBtn.innerText;
    loginBtn.innerText = "Verificando...";
    loginBtn.disabled = true;

    try {
      // Faz a requisição POST para a sua função auth.js no Netlify
      const response = await fetch("/.netlify/functions/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      // Se o backend retornar statusCode 200 e authenticated: true
      if (response.ok && data.authenticated) {
        errorMsg.style.display = "none";

        // Faz a transição de tela
        document.getElementById("login-screen").style.display = "none";
        document.getElementById("admin-panel").style.display = "flex";

        showToast("Bem-vindo ao painel da Amaraltour!", "success");

        // Carrega as viagens da sua função de Blobs
        // loadTrips(); // Certifique-se de que esta função está implementada para chamar a API de viagens
        renderTrips();
      } else {
        // Se a senha estiver errada (statusCode 401)
        errorMsg.innerText = "Senha incorreta!";
        errorMsg.style.display = "block";
      }
    } catch (error) {
      console.error("Erro no login:", error);
      errorMsg.innerText = "Erro ao conectar com o servidor.";
      errorMsg.style.display = "block";
    } finally {
      // Restaura o botão
      loginBtn.innerText = originalText;
      loginBtn.disabled = false;
    }
  });
}

// Lógica para sair do sistema (Logout)
window.logout = function () {
  document.getElementById("admin-panel").style.display = "none";
  document.getElementById("login-screen").style.display = "flex";
  document.getElementById("adminPassword").value = "";
};

// --- LÓGICA DO MODAL (EVITANDO VAZAMENTO VISUAL) ---
window.openAddModal = function () {
  const modal = document.getElementById("trip-modal");
  if (modal) {
    modal.style.display = "flex"; // Exibe o modal centralizado
    document.getElementById("modal-title").innerText = "Nova Viagem";
    document.getElementById("trip-form").reset();
  }
};

window.closeModal = function () {
  const modal = document.getElementById("trip-modal");
  if (modal) {
    modal.style.display = "none"; // Oculta o modal
    document.getElementById("trip-form").reset();
  }
};

// --- MENSAGENS E NOTIFICAÇÕES (TOASTS) ---
window.showToast = function (message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<p style="color: var(--color-brand-primary); font-weight: 500;">${message}</p>`;

  container.appendChild(toast);

  // Remove o toast automaticamente após 3.5 segundos
  setTimeout(() => {
    toast.style.animation = "slideInRight 0.3s ease reverse forwards";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
};

// --- RENDERIZAÇÃO DA TABELA ---
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
};

// --- FORMULÁRIO E AÇÕES CRUD ---
const tripForm = document.getElementById("trip-form");
if (tripForm) {
  tripForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    // ... sua lógica de montar o objeto tripData ...

    try {
      // await syncTrips(); (Sua chamada para salvar no netlify blobs)

      showToast("Viagem salva com sucesso!", "success");
      closeModal();
      renderTrips();
    } catch (error) {
      showToast("Erro ao salvar viagem. Tente novamente.", "error");
    }
  });
}

// Ações dos botões na tabela
window.editTrip = function (id) {
  // Lógica para popular o formulário de edição
  openAddModal();
  document.getElementById("modal-title").innerText = "Editar Viagem";
};

window.deleteTrip = function (id) {
  if (confirm("Tem certeza que deseja excluir esta viagem?")) {
    // Lógica para deletar do banco
    showToast("Viagem excluída com sucesso!", "success");
    renderTrips();
  }
};

// Aba de Exportação/Backup
window.toggleExportData = function () {
  const exportSec = document.getElementById("export-section");
  if (exportSec) {
    exportSec.style.display =
      exportSec.style.display === "none" ? "block" : "none";
  }
};
