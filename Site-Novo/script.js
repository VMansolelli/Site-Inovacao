(() => {
  "use strict";

  const SELECTORS = {
    navLinks: "#navLinks",
    toast: "#toast",
    muralGrid: "#muralGrid",
    acoesGrid: "#acoesGrid",
    formIdeia: "#formIdeia",
    formNoticia: "#formNoticia",
    formOficina: "#formOficina",
    formInscricao: "#formInscricao",
    restritoDialog: "#restritoDialog",
  };

  const STORAGE_KEYS = {
    ideias: "ideias",
    noticias: "noticias",
    oficinas: "oficinas",
  };

  const ADMIN_PASSWORD = "salto2026";

  const ACOES = [
    { icon: "🗣️", title: "Ouvir, Agir e Transformar", description: "Canais de escuta ativa para captar necessidades e ideias de toda a comunidade Senac Salto." },
    { icon: "📰", title: "Mural de Notícias", description: "Vitrine das ações realizadas pelas turmas, publicadas em formato de portal de notícias." },
    { icon: "🧑‍🏫", title: "Senac Troca de Saberes", description: "Oficinas rápidas entre docentes e funcionários para compartilhar conhecimento prático." },
    { icon: "🔬", title: "Experimentar, Compartilhar e Transformar", description: "Espaço para testar novos formatos de aula e experiências imersivas." },
    { icon: "🎬", title: "Produzir, Comunicar, Aprender", description: "Produção de conteúdo multimodal e portfólios digitais dos cursos." },
    { icon: "👨‍🏫", title: "Docência com Tecnologias Emergentes", description: "Formação avançada em metodologias ativas e ferramentas digitais para docentes." },
    { icon: "👥", title: "Clube de Inovação Docente", description: "Comunidade de prática entre professores da unidade para troca de experiências." },
    { icon: "🌍", title: "Programa de Embaixadores", description: "Projetos que conectam os cursos do Senac Salto com demandas reais da cidade." },
    { icon: "📚", title: "Vitrine de Soluções", description: "Repositório de projetos de sucesso para replicação em outras turmas." },
    { icon: "☕", title: "Café com Comitê", description: "Encontros presenciais informais para escuta ativa e humanizada." },
    { icon: "🛠️", title: "Espaço Maker", description: "Apoio ao desenvolvimento de soluções e empreendedorismo estudantil." },
    { icon: "🤝", title: "Ideação Rápida", description: "Apoio direto a docentes no uso de metodologias ativas e ferramentas de IA." },
    { icon: "💼", title: "Diálogo com o Mercado", description: "Encontros com empresas da região para alinhar a oferta educacional." },
    { icon: "⭐", title: "Reconhecimento à Inovação", description: "Programa de reconhecimento para inovadores da comunidade Senac Salto." },
  ];

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

  const createId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
  const nowIso = () => new Date().toISOString();

  function escapeHtml(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function showToast(message) {
    const element = $(SELECTORS.toast);
    element.textContent = message;
    element.classList.add("show");

    clearTimeout(window.__toastTimeout);
    window.__toastTimeout = setTimeout(() => element.classList.remove("show"), 2600);
  }

  const storage = {
    async get(key) {
      try {
        if (window.storage?.get) {
          const result = await window.storage.get(key, true);
          return result ? JSON.parse(result.value) : null;
        }

        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
      } catch (error) {
        console.warn(`Não foi possível ler ${key}:`, error);
        return null;
      }
    },

    async set(key, value) {
      try {
        const serialized = JSON.stringify(value);

        if (window.storage?.set) {
          await window.storage.set(key, serialized, true);
        } else {
          localStorage.setItem(key, serialized);
        }

        return true;
      } catch (error) {
        console.error(`Não foi possível salvar ${key}:`, error);
        showToast("Não foi possível salvar os dados.");
        return false;
      }
    },
  };

  function formatDate(isoDate) {
    if (!isoDate) return "";
    const [year, month, day] = isoDate.split("-");
    return `${day}/${month}/${year}`;
  }

  function openModal(id) {
    $(`#${id}`)?.classList.add("open");
  }

  function closeModal(id) {
    $(`#${id}`)?.classList.remove("open");
  }

  function renderAcoes() {
    $(SELECTORS.acoesGrid).innerHTML = ACOES.map((acao, index) => `
      <article class="mcard acao-card">
        <span class="acao-num">AÇÃO ${String(index + 1).padStart(2, "0")}</span>
        <div class="acao-icon" aria-hidden="true">${acao.icon}</div>
        <h4>${acao.title}</h4>
        <p>${acao.description}</p>
      </article>
    `).join("");
  }

  function setupNavigation() {
    $("#burgerBtn").addEventListener("click", () => {
      $(SELECTORS.navLinks).classList.toggle("open");
    });

    $$("#navLinks a").forEach((link) => {
      link.addEventListener("click", () => $(SELECTORS.navLinks).classList.remove("open"));
    });
  }

  function setupChoiceGroup(selector) {
    const group = $(selector);
    if (!group) return;

    $$(".choice", group).forEach((button) => {
      button.addEventListener("click", () => {
        $$(".choice", group).forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        group.dataset.value = button.dataset.val;
      });
    });
  }

  function setupModals() {
    $("#openNoticiaModal").addEventListener("click", () => openModal("modalNoticia"));

    $$(".modal-close").forEach((button) => {
      button.addEventListener("click", () => closeModal(button.dataset.close));
    });

    $$(".modal-overlay").forEach((overlay) => {
      overlay.addEventListener("click", (event) => {
        if (event.target === overlay) overlay.classList.remove("open");
      });
    });
  }

  async function renderStats() {
    const [ideias, noticias, oficinas] = await Promise.all([
      storage.get(STORAGE_KEYS.ideias),
      storage.get(STORAGE_KEYS.noticias),
      storage.get(STORAGE_KEYS.oficinas),
    ]);

    $("#statIdeias").textContent = (ideias || []).length;
    $("#statAcoes").textContent = (noticias || []).filter((item) => item.aprovado).length;
    $("#statOficinasHero").textContent = (oficinas || []).length;
  }

  async function renderMural() {
    const noticias = (await storage.get(STORAGE_KEYS.noticias)) || [];
    const aprovadas = noticias.filter((noticia) => noticia.aprovado);
    const grid = $(SELECTORS.muralGrid);

    if (!aprovadas.length) {
      grid.innerHTML = '<div class="empty-state empty-state-full">Nenhuma ação publicada ainda. Seja a primeira turma! 🚀</div>';
      return;
    }

    grid.innerHTML = aprovadas.map((noticia) => `
      <article class="ncard">
        <img src="${noticia.imagem}" alt="${escapeHtml(noticia.titulo)}">
        <div class="ncard-body">
          <span class="tag">${escapeHtml(noticia.categoria || "")}</span>
          <h4>${escapeHtml(noticia.titulo)}</h4>
          <p>${escapeHtml(noticia.descricao)}</p>
          <div class="meta">
            ${escapeHtml(noticia.turma)} · ${escapeHtml(noticia.curso)}${noticia.autor ? ` · ${escapeHtml(noticia.autor)}` : ""}
          </div>
        </div>
      </article>
    `).join("");
  }

  function resetChoiceGroup() {
    const group = $("#ideiaPerfil");
    $$(".choice", group).forEach((button, index) => button.classList.toggle("active", index === 0));
    group.dataset.value = "Aluno";
  }

  function setupIdeias() {
    $(SELECTORS.formIdeia).addEventListener("submit", async (event) => {
      event.preventDefault();

      const ideias = (await storage.get(STORAGE_KEYS.ideias)) || [];
      ideias.unshift({
        id: createId(),
        nome: $("#ideiaNome").value.trim() || "Anônimo",
        perfil: $("#ideiaPerfil").dataset.value,
        categoria: $("#ideiaCategoria").value,
        texto: $("#ideiaTexto").value.trim(),
        data: nowIso(),
      });

      if (!(await storage.set(STORAGE_KEYS.ideias, ideias))) return;

      event.target.reset();
      resetChoiceGroup();
      showToast("Ideia enviada! Obrigado por contribuir 💡");
      await Promise.all([renderStats(), renderIdeiasAdmin()]);
    });
  }

  let selectedNewsImage = null;

  function resetNewsImage() {
    selectedNewsImage = null;
    $("#uploadPreview").src = "";
    $("#uploadPreview").classList.add("hidden");
    $("#uploadLabel").textContent = "📸 Clique aqui para enviar a foto";
    $("#ntInput").value = "";
  }

  function resizeImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const image = new Image();

      reader.onerror = () => reject(new Error("Falha ao ler o arquivo."));
      image.onerror = () => reject(new Error("Falha ao abrir a imagem."));

      reader.onload = (event) => {
        image.onload = () => {
          const maxWidth = 800;
          const scale = Math.min(1, maxWidth / image.width);
          const canvas = document.createElement("canvas");

          canvas.width = Math.round(image.width * scale);
          canvas.height = Math.round(image.height * scale);
          canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);

          resolve(canvas.toDataURL("image/jpeg", 0.72));
        };

        image.src = event.target.result;
      };

      reader.readAsDataURL(file);
    });
  }

  function setupNewsImageUpload() {
    $("#uploadBox").addEventListener("click", () => $("#ntInput").click());

    $("#ntInput").addEventListener("change", async (event) => {
      const [file] = event.target.files;
      if (!file) return;

      try {
        selectedNewsImage = await resizeImage(file);
        $("#uploadPreview").src = selectedNewsImage;
        $("#uploadPreview").classList.remove("hidden");
        $("#uploadLabel").textContent = "✅ Foto pronta — clique para trocar";
      } catch (error) {
        console.error(error);
        resetNewsImage();
        showToast("Não foi possível processar a imagem.");
      }
    });
  }

  function setupNoticias() {
    $(SELECTORS.formNoticia).addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!selectedNewsImage) {
        showToast("Adicione uma foto antes de enviar");
        return;
      }

      const noticias = (await storage.get(STORAGE_KEYS.noticias)) || [];
      noticias.unshift({
        id: createId(),
        titulo: $("#ntTitulo").value.trim(),
        turma: $("#ntTurma").value.trim(),
        curso: $("#ntCurso").value.trim(),
        autor: $("#ntAutor").value.trim(),
        descricao: $("#ntDescricao").value.trim(),
        categoria: $("#ntCategoria").value,
        imagem: selectedNewsImage,
        aprovado: false,
        data: nowIso(),
      });

      if (!(await storage.set(STORAGE_KEYS.noticias, noticias))) return;

      event.target.reset();
      resetNewsImage();
      closeModal("modalNoticia");
      showToast("Publicação enviada! Vai aparecer no mural após aprovação 🎉");
      await renderNoticiasAdmin();
    });
  }

  function setupOficinaForm() {
    $("#openOficinaForm").addEventListener("click", () => {
      $(SELECTORS.formOficina).classList.toggle("hidden");
    });

    $(SELECTORS.formOficina).addEventListener("submit", async (event) => {
      event.preventDefault();

      const oficinas = (await storage.get(STORAGE_KEYS.oficinas)) || [];
      oficinas.unshift({
        id: createId(),
        nome: $("#ofNome").value.trim(),
        ministrante: $("#ofMinistrante").value.trim(),
        area: $("#ofArea").value.trim(),
        data: $("#ofData").value,
        inicio: $("#ofInicio").value,
        termino: $("#ofTermino").value,
        local: $("#ofLocal").value,
        vagas: $("#ofVagas").value ? Number.parseInt($("#ofVagas").value, 10) : null,
        inscritos: [],
      });

      if (!(await storage.set(STORAGE_KEYS.oficinas, oficinas))) return;

      event.target.reset();
      $(SELECTORS.formOficina).classList.add("hidden");
      showToast("Oficina publicada! ✅");
      await Promise.all([renderSaberes(), renderStats(), renderOficinasAdmin()]);
    });
  }

  async function renderSaberes() {
    const oficinas = (await storage.get(STORAGE_KEYS.oficinas)) || [];
    const list = $("#saberesLista");

    if (!oficinas.length) {
      list.innerHTML = '<div class="empty-state">Nenhuma oficina publicada ainda. Que tal ser o primeiro docente? 🧑‍🏫</div>';
      return;
    }

    list.innerHTML = oficinas.map((oficina) => {
      const totalInscritos = (oficina.inscritos || []).length;
      const cheia = Boolean(oficina.vagas && totalInscritos >= oficina.vagas);
      const vagas = oficina.vagas
        ? `${Math.max(oficina.vagas - totalInscritos, 0)} de ${oficina.vagas} vagas`
        : `${totalInscritos} inscrito(s)`;

      return `
        <article class="oficina-card">
          <div class="oficina-info">
            <h4>🧑‍🏫 ${escapeHtml(oficina.nome)}</h4>
            <div class="oficina-meta">
              <span>👤 ${escapeHtml(oficina.ministrante)} · ${escapeHtml(oficina.area)}</span>
              <span>📅 ${formatDate(oficina.data)}</span>
              <span>🕒 ${escapeHtml(oficina.inicio)}–${escapeHtml(oficina.termino)}</span>
              <span>${escapeHtml(oficina.local)}</span>
              <span class="vagas-badge">${vagas}</span>
            </div>
          </div>
          <button type="button" class="btn btn-ghost btn-sm" data-inscrever="${oficina.id}" ${cheia ? "disabled" : ""}>
            ${cheia ? "Vagas esgotadas" : "Inscrever-se"}
          </button>
        </article>
      `;
    }).join("");

    $$('[data-inscrever]', list).forEach((button) => {
      button.addEventListener("click", () => {
        const oficina = oficinas.find((item) => item.id === button.dataset.inscrever);
        if (!oficina) return;

        $(SELECTORS.formInscricao).dataset.oficina = oficina.id;
        $("#inscricaoOficinaNome").textContent = `${oficina.nome} · ${formatDate(oficina.data)} · ${oficina.inicio}–${oficina.termino}`;
        openModal("modalInscricao");
      });
    });
  }

  function setupInscricao() {
    $(SELECTORS.formInscricao).addEventListener("submit", async (event) => {
      event.preventDefault();

      const oficinas = (await storage.get(STORAGE_KEYS.oficinas)) || [];
      const oficina = oficinas.find((item) => item.id === event.target.dataset.oficina);

      if (!oficina) {
        showToast("Oficina não encontrada");
        return;
      }

      oficina.inscritos ||= [];

      if (oficina.vagas && oficina.inscritos.length >= oficina.vagas) {
        showToast("Essa oficina já está com vagas esgotadas");
        closeModal("modalInscricao");
        return;
      }

      oficina.inscritos.push({
        nome: $("#inscNome").value.trim(),
        cargo: $("#inscCargo").value.trim(),
        area: $("#inscArea").value.trim(),
        email: $("#inscEmail").value.trim(),
        data: nowIso(),
      });

      if (!(await storage.set(STORAGE_KEYS.oficinas, oficinas))) return;

      event.target.reset();
      closeModal("modalInscricao");
      showToast("Inscrição confirmada! ✅");
      await Promise.all([renderSaberes(), renderOficinasAdmin(), renderStats()]);
    });
  }

  function setupRestrictedArea() {
    const dialog = $(SELECTORS.restritoDialog);
    const open = () => dialog.showModal();

    $("#navRestrito").addEventListener("click", open);
    $("#footRestrito").addEventListener("click", open);
    $("#closeRestrito").addEventListener("click", () => dialog.close());

    $("#adminEnter").addEventListener("click", async () => {
      if ($("#adminPass").value !== ADMIN_PASSWORD) {
        showToast("Senha incorreta");
        return;
      }

      $("#adminGate").classList.add("hidden");
      $("#adminPanel").classList.remove("hidden");
      await Promise.all([renderNoticiasAdmin(), renderOficinasAdmin(), renderIdeiasAdmin(), renderStats()]);
    });

    $$(".admin-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        $$(".admin-tab").forEach((item) => item.classList.remove("active"));
        $$(".admin-panel").forEach((panel) => panel.classList.remove("active"));
        tab.classList.add("active");
        $(`#apanel-${tab.dataset.atab}`).classList.add("active");
      });
    });
  }

  async function approveNews(id) {
    const noticias = (await storage.get(STORAGE_KEYS.noticias)) || [];
    const noticia = noticias.find((item) => item.id === id);
    if (!noticia) return;

    noticia.aprovado = true;
    await storage.set(STORAGE_KEYS.noticias, noticias);
    await Promise.all([renderNoticiasAdmin(), renderMural(), renderStats()]);
  }

  async function deleteNews(id) {
    const noticias = (await storage.get(STORAGE_KEYS.noticias)) || [];
    await storage.set(STORAGE_KEYS.noticias, noticias.filter((item) => item.id !== id));
    await Promise.all([renderNoticiasAdmin(), renderMural(), renderStats()]);
  }

  async function renderNoticiasAdmin() {
    const noticias = (await storage.get(STORAGE_KEYS.noticias)) || [];
    const pendentes = noticias.filter((noticia) => !noticia.aprovado);
    const aprovadas = noticias.filter((noticia) => noticia.aprovado);

    $("#noticiasPendentesList").innerHTML = pendentes.length
      ? pendentes.map((noticia) => `
          <div class="admin-row">
            <div class="admin-item-main">
              <img class="admin-item-image" src="${noticia.imagem}" alt="">
              <div>
                <b>${escapeHtml(noticia.titulo)}</b>
                <div class="meta">${escapeHtml(noticia.turma)} · ${escapeHtml(noticia.curso)} · <span class="badge">pendente</span></div>
              </div>
            </div>
            <div class="admin-actions">
              <button type="button" class="btn btn-ghost btn-sm" data-approve="${noticia.id}">Aprovar</button>
              <button type="button" class="btn btn-danger btn-sm" data-reject="${noticia.id}">Recusar</button>
            </div>
          </div>
        `).join("")
      : '<p class="field-hint admin-empty">Nenhuma ação aguardando aprovação.</p>';

    $("#noticiasAprovadasList").innerHTML = aprovadas.length
      ? aprovadas.map((noticia) => `
          <div class="admin-row">
            <div class="admin-item-main">
              <img class="admin-item-image" src="${noticia.imagem}" alt="">
              <div>
                <b>${escapeHtml(noticia.titulo)}</b>
                <div class="meta">${escapeHtml(noticia.turma)} · <span class="badge ok">no mural</span></div>
              </div>
            </div>
            <button type="button" class="btn btn-danger btn-sm" data-remove="${noticia.id}">Remover</button>
          </div>
        `).join("")
      : '<p class="field-hint admin-empty">Nenhuma ação publicada ainda.</p>';

    $("#statNoticiasPendentes").textContent = pendentes.length;

    $$('[data-approve]', $("#noticiasPendentesList")).forEach((button) => {
      button.addEventListener("click", () => approveNews(button.dataset.approve));
    });

    $$('[data-reject]', $("#noticiasPendentesList")).forEach((button) => {
      button.addEventListener("click", () => deleteNews(button.dataset.reject));
    });

    $$('[data-remove]', $("#noticiasAprovadasList")).forEach((button) => {
      button.addEventListener("click", () => deleteNews(button.dataset.remove));
    });
  }

  async function renderOficinasAdmin() {
    const oficinas = (await storage.get(STORAGE_KEYS.oficinas)) || [];
    $("#statOficinasAdmin").textContent = oficinas.length;

    $("#oficinasAdminList").innerHTML = oficinas.length
      ? oficinas.map((oficina) => `
          <div class="admin-row">
            <div>
              <b>${escapeHtml(oficina.nome)}</b>
              <div class="meta">
                ${escapeHtml(oficina.ministrante)} · ${formatDate(oficina.data)} · ${escapeHtml(oficina.inicio)}–${escapeHtml(oficina.termino)} ·
                ${escapeHtml(oficina.local)} · ${(oficina.inscritos || []).length} inscrito(s)${oficina.vagas ? ` / ${oficina.vagas} vagas` : ""}
              </div>
            </div>
            <button type="button" class="btn btn-danger btn-sm" data-delofic="${oficina.id}">Excluir</button>
          </div>
        `).join("")
      : '<p class="field-hint admin-empty">Nenhuma oficina publicada.</p>';

    $$('[data-delofic]', $("#oficinasAdminList")).forEach((button) => {
      button.addEventListener("click", async () => {
        const atualizadas = oficinas.filter((item) => item.id !== button.dataset.delofic);
        await storage.set(STORAGE_KEYS.oficinas, atualizadas);
        await Promise.all([renderOficinasAdmin(), renderSaberes(), renderStats()]);
      });
    });
  }

  async function renderIdeiasAdmin() {
    const ideias = (await storage.get(STORAGE_KEYS.ideias)) || [];
    $("#statIdeiasAdmin").textContent = ideias.length;

    $("#ideiasAdminList").innerHTML = ideias.length
      ? ideias.map((ideia) => `
          <div class="admin-row">
            <div>
              <b>${escapeHtml(ideia.categoria)}</b>
              <div class="meta">
                ${escapeHtml(ideia.nome)} · ${escapeHtml(ideia.perfil)} · ${new Date(ideia.data).toLocaleDateString("pt-BR")}
              </div>
              <p class="admin-idea-text">${escapeHtml(ideia.texto)}</p>
            </div>
            <button type="button" class="btn btn-danger btn-sm" data-delideia="${ideia.id}">Excluir</button>
          </div>
        `).join("")
      : '<p class="field-hint admin-empty">Nenhuma ideia recebida ainda.</p>';

    $$('[data-delideia]', $("#ideiasAdminList")).forEach((button) => {
      button.addEventListener("click", async () => {
        const atualizadas = ideias.filter((item) => item.id !== button.dataset.delideia);
        await storage.set(STORAGE_KEYS.ideias, atualizadas);
        await Promise.all([renderIdeiasAdmin(), renderStats()]);
      });
    });
  }

  async function init() {
    renderAcoes();
    setupNavigation();
    setupChoiceGroup("#ideiaPerfil");
    setupModals();
    setupIdeias();
    setupNewsImageUpload();
    setupNoticias();
    setupOficinaForm();
    setupInscricao();
    setupRestrictedArea();

    await Promise.all([renderMural(), renderSaberes(), renderStats()]);
  }

  init();
})();
