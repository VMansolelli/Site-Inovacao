(function(){
'use strict';


/* ---------------- helpers ---------------- */
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const uid = () => Date.now().toString(36)+Math.random().toString(36).slice(2,7);
function toast(msg){
  const t=$('#toast'); t.textContent=msg; t.classList.add('show');
  clearTimeout(window.__toastT); window.__toastT=setTimeout(()=>t.classList.remove('show'),2600);
}
const STORAGE_PREFIX = 'senac-salto-inovacao:';

async function storeGet(key, shared = true){
  try {
    if (window.storage?.get) {
      const result = await window.storage.get(key, shared);
      return result ? JSON.parse(result.value) : null;
    }

    const value = localStorage.getItem(STORAGE_PREFIX + key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(`Erro ao ler ${key}:`, error);
    return null;
  }
}

async function storeSet(key, value, shared = true){
  try {
    if (window.storage?.set) {
      await window.storage.set(key, JSON.stringify(value), shared);
      return true;
    }

    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Erro ao salvar ${key}:`, error);
    return false;
  }
}

/* ---------------- nav ---------------- */
$('#burgerBtn').addEventListener('click', ()=> $('#navLinks').classList.toggle('open'));
$$('#navLinks a').forEach(a=>a.addEventListener('click', ()=> $('#navLinks').classList.remove('open')));

/* ---------------- 14 ações ---------------- */
const ACOES = [
  {icon:"🗣️", t:"Ouvir, Agir e Transformar", d:"Canais de escuta ativa para captar necessidades e ideias de toda a comunidade do Senac Salto."},
  {icon:"🗺️", t:"Trilhas de Futuro", d:"Jornadas de formação estruturadas para o desenvolvimento contínuo dos funcionários."},
  {icon:"🔬", t:"Experimentar, Compartilhar e Transformar", d:"Espaço para testes de novos formatos de aula, layouts e experiências imersivas."},
  {icon:"🎬", t:"Produzir, Comunicar, Aprender", d:"Produção de conteúdo multimodal, podcasts e portfólios digitais dos cursos."},
  {icon:"👨‍🏫", t:"Docência - Trilhas Avançadas", d:"Formação avançada em tecnologias emergentes e metodologias ativas para docentes."},
  {icon:"👥", t:"Clube de Inovação Docente", d:"Comunidade de prática entre professores da unidade para troca de experiências."},
  {icon:"🌍", t:"Programa de Embaixadores", d:"Projetos que conectam os cursos do Senac Salto com demandas reais da cidade."},
  {icon:"📚", t:"Vitrine de Soluções", d:"Repositório de projetos de sucesso para replicação em outras turmas e unidades."},
  {icon:"📈", t:"Visitas Técnicas Imersivas", d:"Monitoramento de impacto e satisfação com base em visitas e devolutivas das equipes."},
  {icon:"☕", t:"Café com Comitê", d:"Encontros presenciais informais para escuta ativa e humanizada com alunos e equipe."},
  {icon:"🛠️", t:"Trilhas de Aprendizagem Flexíveis", d:"Espaço maker para desenvolvimento de soluções e empreendedorismo estudantil."},
  {icon:"🤝", t:"Espaço de Ideação Rápida", d:"Apoio direto a docentes no uso de metodologias ativas e ferramentas de IA."},
  {icon:"💼", t:"Failure Festival Senac Salto", d:"Painéis com ex-alunos e empresas da região para alinhar a oferta educacional."},
  {icon:"⭐", t:"Laboratório de Aprendizagem Aberta", d:"Programa de reconhecimento para inovadores da comunidade Senac Salto."},
];
$('#acoesGrid').innerHTML = ACOES.map((a,i)=>`
  <div class="fold-card acao-card">
    <span class="acao-num">AÇÃO ${String(i+1).padStart(2,'0')}</span>
    <div class="acao-icon">${a.icon}</div>
    <h4>${a.t}</h4>
    <p>${a.d}</p>
  </div>`).join('');

/* ---------------- trilhas ---------------- */
const TRILHAS_SABER = [
  {icon:"🏛️", tag:"TRILHA 01", nome:"Raízes Senac", desc:"Identidade institucional e missão do Senac. Entender o Senac é o primeiro passo para transformá-lo.", cursos:"5 cursos", horas:"~14h"},
  {icon:"🌱", tag:"TRILHA 02", nome:"Eu em Movimento", desc:"Competências pessoais, emocionais e relacionais. Quem se conhece melhor, trabalha e vive melhor.", cursos:"7 cursos", horas:"~17h"},
  {icon:"🌍", tag:"TRILHA 03", nome:"Senac Responsável", desc:"Ética, sustentabilidade e diversidade. Responsabilidade não é opção — é parte de quem somos.", cursos:"7 cursos", horas:"~12h"},
  {icon:"🤖", tag:"TRILHA 04", nome:"Inovação e IA", desc:"Cultura de inovação e IA aplicada ao dia a dia do Senac Salto.", cursos:"14 cursos", horas:"~55h"},
  {icon:"📊", tag:"TRILHA 05", nome:"Dados que Decidem", desc:"Análise de dados para gestão e tomada de decisão, do básico ao Power BI.", cursos:"3 cursos", horas:"~7h"},
  {icon:"🧭", tag:"TRILHA 06", nome:"Quem Lidera, Transforma", desc:"Liderança e gestão de pessoas. Líderes não nascem prontos — eles se desenvolvem aqui.", cursos:"12 cursos", horas:"~15h"},
];
$('#trilhasSaber').innerHTML = TRILHAS_SABER.map(t=>`
  <div class="trilha-card">
    <span class="trilha-tag">${t.tag}</span>
    <h4 class="trilha-title">${t.icon} ${t.nome}</h4>
    <p class="trilha-copy">${t.desc}</p>
    <div class="trilha-meta"><span>📚 ${t.cursos}</span><span>⏱ ${t.horas}</span></div>
    <span class="trilha-cta">saber.senac.br →</span>
  </div>`).join('');

const TRILHAS_CORP = [
  {icon:"🤖", nome:"Docência com IA", desc:"Integra IA à prática pedagógica dentro do Jeito Senac de Educar. Para MEP e professores.", meta:"~26h · MEP e Professores"},
  {icon:"🏢", nome:"Gestão e Inovação", desc:"Para gerentes, coordenadores e lideranças. Líderes que dominam IA multiplicam o impacto.", meta:"~15h · Lideranças"},
  {icon:"💼", nome:"IA no Trabalho", desc:"Para equipes administrativas, secretaria, atendimento e biblioteca. Foco em produtividade real.", meta:"~14h · Todos os funcionários"},
];
$('#trilhasCorp').innerHTML = TRILHAS_CORP.map(t=>`
  <div class="trilha-card">
    <span class="trilha-tag">EDUCAÇÃO CORPORATIVA</span>
    <h4 class="trilha-title">${t.icon} ${t.nome}</h4>
    <p class="trilha-copy">${t.desc}</p>
    <div class="trilha-meta"><span>${t.meta}</span></div>
    <span class="trilha-cta">Acessar trilha →</span>
  </div>`).join('');

$$('.tab-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    $$('.tab-btn').forEach(b=>b.classList.remove('active'));
    $$('.tab-panel').forEach(p=>p.classList.remove('active'));
    btn.classList.add('active');
    $('#tab-'+btn.dataset.tab).classList.add('active');
  });
});

/* ---------------- choice pills (ideia / foto perfil) ---------------- */
function wireChoice(containerSel){
  const el = $(containerSel);
  el.querySelectorAll('.choice').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      el.querySelectorAll('.choice').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      el.dataset.value = btn.dataset.val;
    });
  });
}
wireChoice('#ideiaPerfil');
wireChoice('#fotoPerfil');

/* ---------------- modals ---------------- */
function openModal(id){ $('#'+id).classList.add('open'); }
function closeModal(id){ $('#'+id).classList.remove('open'); }
$('#openFotoModal').addEventListener('click', ()=>openModal('modalFoto'));
$$('.modal-close').forEach(b=>b.addEventListener('click', ()=>closeModal(b.dataset.close)));
$$('.modal-overlay').forEach(ov=>ov.addEventListener('click', e=>{ if(e.target===ov) ov.classList.remove('open'); }));

/* ---------------- ideias ---------------- */
$('#formIdeia').addEventListener('submit', async e=>{
  e.preventDefault();
  const ideias = (await storeGet('ideias', true)) || [];
  ideias.unshift({
    id: uid(),
    nome: $('#ideiaNome').value.trim() || 'Anônimo',
    perfil: $('#ideiaPerfil').dataset.value,
    categoria: $('#ideiaCategoria').value,
    texto: $('#ideiaTexto').value.trim(),
    data: new Date().toISOString()
  });
  await storeSet('ideias', ideias, true);
  e.target.reset();
  $('#ideiaPerfil').querySelectorAll('.choice').forEach((b,i)=>b.classList.toggle('active', i===0));
  $('#ideiaPerfil').dataset.value='Aluno';
  toast('Ideia enviada! Obrigado por contribuir 💡');
  renderStats();
  if(!adminGateOpen) renderIdeiasAdmin();
});

/* ---------------- foto upload ---------------- */
let fotoBase64 = null;
$('#uploadBox').addEventListener('click', ()=> $('#fotoInput').click());
$('#fotoInput').addEventListener('change', e=>{
  const file = e.target.files[0];
  if(!file) return;
  const img = new Image();
  const reader = new FileReader();
  reader.onload = ev=>{
    img.onload = ()=>{
      const maxW = 800;
      const scale = Math.min(1, maxW/img.width);
      const canvas = document.createElement('canvas');
      canvas.width = img.width*scale; canvas.height = img.height*scale;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img,0,0,canvas.width,canvas.height);
      fotoBase64 = canvas.toDataURL('image/jpeg', 0.72);
      $('#uploadPreview').src = fotoBase64;
      $('#uploadPreview').classList.remove('hidden');
      $('#uploadLabel').textContent = '✅ Foto pronta — clique para trocar';
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
});

$('#formFoto').addEventListener('submit', async e=>{
  e.preventDefault();
  if(!fotoBase64){ toast('Adicione uma foto antes de enviar'); return; }
  const fotos = (await storeGet('fotos', true)) || [];
  fotos.unshift({
    id: uid(),
    nome: $('#fotoNome').value.trim(),
    perfil: $('#fotoPerfil').dataset.value,
    curso: $('#fotoCurso').value.trim(),
    titulo: $('#fotoTitulo').value.trim(),
    descricao: $('#fotoDescricao').value.trim(),
    categoria: $('#fotoCategoria').value,
    imagem: fotoBase64,
    aprovado: false,
    data: new Date().toISOString()
  });
  await storeSet('fotos', fotos, true);
  e.target.reset();
  fotoBase64 = null;
  $('#uploadPreview').classList.add('hidden');
  $('#uploadLabel').textContent = '📸 Clique aqui para enviar a foto';
  closeModal('modalFoto');
  toast('Foto enviada! Ela aparecerá após aprovação do comitê 🎉');
  renderFotosAdmin();
});

async function renderGaleria(){
  const fotos = (await storeGet('fotos', true)) || [];
  const aprovadas = fotos.filter(f=>f.aprovado);
  const grid = $('#galeriaGrid');
  if(!aprovadas.length){
    grid.innerHTML = `<div class="empty-state grid-full">Nenhuma foto compartilhada ainda. Seja o primeiro! 🚀</div>`;
    return;
  }
  grid.innerHTML = aprovadas.map(f=>`
    <div class="gcard">
      <img src="${f.imagem}" alt="${f.titulo}">
      <div class="gcard-body">
        <h4>${f.titulo}</h4>
        <p>${f.descricao}</p>
        <span class="badge">${f.categoria||''}</span>
        <div class="field-hint field-hint-small-top">${f.nome||'Anônimo'} · ${f.curso||''}</div>
      </div>
    </div>`).join('');
}

/* ---------------- oficinas ---------------- */
async function renderOficinas(){
  const oficinas = (await storeGet('oficinas', true)) || [];
  const list = $('#oficinasList');
  if(!oficinas.length){
    list.innerHTML = `<div class="empty-state">Nenhuma oficina disponível no momento. Volte em breve! 📋</div>`;
    return;
  }
  list.innerHTML = oficinas.map(o=>`
    <div class="oficina-card">
      <div class="oficina-info">
        <h4>${o.nome}</h4>
        <div class="oficina-meta">
          <span>👤 ${o.ministrante}</span>
          <span>📅 ${formatDate(o.data)}</span>
          <span>🕒 ${o.inicio}–${o.termino}</span>
          <span>${o.local}</span>
          <span>${(o.inscritos||[]).length} inscrito(s)</span>
        </div>
      </div>
      <button class="btn btn-ghost btn-sm" data-inscrever="${o.id}">Inscrever-se</button>
    </div>`).join('');
  list.querySelectorAll('[data-inscrever]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const of = oficinas.find(o=>o.id===btn.dataset.inscrever);
      $('#formInscricao').dataset.oficina = of.id;
      $('#inscricaoOficinaNome').textContent = `${of.nome} · ${formatDate(of.data)} · ${of.inicio}–${of.termino}`;
      openModal('modalInscricao');
    });
  });
}
function formatDate(iso){
  if(!iso) return '';
  const [y,m,d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

$('#formInscricao').addEventListener('submit', async e=>{
  e.preventDefault();
  const oficinas = (await storeGet('oficinas', true)) || [];
  const of = oficinas.find(o=>o.id===$('#formInscricao').dataset.oficina);
  if(!of){ toast('Oficina não encontrada'); return; }
  of.inscritos = of.inscritos || [];
  of.inscritos.push({
    nome: $('#inscNome').value.trim(),
    cargo: $('#inscCargo').value.trim(),
    area: $('#inscArea').value.trim(),
    email: $('#inscEmail').value.trim(),
    data: new Date().toISOString()
  });
  await storeSet('oficinas', oficinas, true);
  e.target.reset();
  closeModal('modalInscricao');
  toast('Inscrição confirmada! ✅');
  renderOficinas();
  renderOficinasAdmin();
});

/* ---------------- admin ---------------- */
let adminGateOpen = true;
$('#adminEnter').addEventListener('click', ()=>{
  if($('#adminPass').value === 'salto2026'){
    adminGateOpen = false;
    $('#adminGate').classList.add('hidden');
    $('#adminPanel').classList.remove('hidden');
    renderFotosAdmin(); renderOficinasAdmin(); renderIdeiasAdmin(); renderStats();
  } else {
    toast('Senha incorreta');
  }
});

$$('.admin-tab').forEach(t=>{
  t.addEventListener('click', ()=>{
    $$('.admin-tab').forEach(x=>x.classList.remove('active'));
    $$('.admin-panel').forEach(x=>x.classList.remove('active'));
    t.classList.add('active');
    $('#apanel-'+t.dataset.atab).classList.add('active');
  });
});

async function renderFotosAdmin(){
  const fotos = (await storeGet('fotos', true)) || [];
  const pendentes = fotos.filter(f=>!f.aprovado);
  const aprovadas = fotos.filter(f=>f.aprovado);
  $('#fotosPendentesList').innerHTML = pendentes.length ? pendentes.map(f=>`
    <div class="admin-row">
      <div class="admin-media">
        <img src="${f.imagem}" class="admin-thumb">
        <div><b>${f.titulo}</b><div class="meta">${f.nome||'Anônimo'} · ${f.curso} · <span class="badge pending">pendente</span></div></div>
      </div>
      <div class="admin-actions">
        <button class="btn btn-ghost btn-sm" data-approve="${f.id}">Aprovar</button>
        <button class="btn btn-danger btn-sm" data-reject="${f.id}">Recusar</button>
      </div>
    </div>`).join('') : `<p class="field-hint">Nenhuma foto aguardando aprovação.</p>`;

  $('#fotosAprovadasList').innerHTML = aprovadas.length ? aprovadas.map(f=>`
    <div class="admin-row">
      <div class="admin-media">
        <img src="${f.imagem}" class="admin-thumb">
        <div><b>${f.titulo}</b><div class="meta">${f.nome||'Anônimo'} · <span class="badge">aprovada</span></div></div>
      </div>
      <button class="btn btn-danger btn-sm" data-remove="${f.id}">Remover</button>
    </div>`).join('') : `<p class="field-hint">Nenhuma foto aprovada ainda.</p>`;

  $('#statFotosPendentes').textContent = pendentes.length;

  $('#fotosPendentesList').querySelectorAll('[data-approve]').forEach(b=>b.addEventListener('click', async ()=>{
    const arr = (await storeGet('fotos', true)) || [];
    const f = arr.find(x=>x.id===b.dataset.approve); if(f) f.aprovado = true;
    await storeSet('fotos', arr, true);
    renderFotosAdmin(); renderGaleria();
  }));
  $('#fotosPendentesList').querySelectorAll('[data-reject]').forEach(b=>b.addEventListener('click', async ()=>{
    let arr = (await storeGet('fotos', true)) || [];
    arr = arr.filter(x=>x.id!==b.dataset.reject);
    await storeSet('fotos', arr, true);
    renderFotosAdmin();
  }));
  $('#fotosAprovadasList').querySelectorAll('[data-remove]').forEach(b=>b.addEventListener('click', async ()=>{
    let arr = (await storeGet('fotos', true)) || [];
    arr = arr.filter(x=>x.id!==b.dataset.remove);
    await storeSet('fotos', arr, true);
    renderFotosAdmin(); renderGaleria();
  }));
}

$('#formNovaOficina').addEventListener('submit', async e=>{
  e.preventDefault();
  const oficinas = (await storeGet('oficinas', true)) || [];
  oficinas.unshift({
    id: uid(),
    nome: $('#ofNome').value.trim(),
    ministrante: $('#ofMinistrante').value.trim(),
    data: $('#ofData').value,
    inicio: $('#ofInicio').value,
    termino: $('#ofTermino').value,
    local: $('#ofLocal').value,
    inscritos: []
  });
  await storeSet('oficinas', oficinas, true);
  e.target.reset();
  toast('Oficina cadastrada ✅');
  renderOficinasAdmin(); renderOficinas(); renderStats();
});

async function renderOficinasAdmin(){
  const oficinas = (await storeGet('oficinas', true)) || [];
  $('#statOficinas').textContent = oficinas.length;
  $('#oficinasAdminList').innerHTML = oficinas.length ? oficinas.map(o=>`
    <div class="admin-row">
      <div><b>${o.nome}</b><div class="meta">${o.ministrante} · ${formatDate(o.data)} · ${o.inicio}–${o.termino} · ${o.local} · ${(o.inscritos||[]).length} inscrito(s)</div></div>
      <button class="btn btn-danger btn-sm" data-delofic="${o.id}">Excluir</button>
    </div>`).join('') : `<p class="field-hint">Nenhuma oficina cadastrada.</p>`;
  $('#oficinasAdminList').querySelectorAll('[data-delofic]').forEach(b=>b.addEventListener('click', async ()=>{
    let arr = (await storeGet('oficinas', true)) || [];
    arr = arr.filter(x=>x.id!==b.dataset.delofic);
    await storeSet('oficinas', arr, true);
    renderOficinasAdmin(); renderOficinas(); renderStats();
  }));
}

async function renderIdeiasAdmin(){
  const ideias = (await storeGet('ideias', true)) || [];
  $('#statIdeiasAdmin').textContent = ideias.length;
  $('#ideiasAdminList').innerHTML = ideias.length ? ideias.map(i=>`
    <div class="admin-row">
      <div><b>${i.categoria}</b><div class="meta">${i.nome} · ${i.perfil} · ${new Date(i.data).toLocaleDateString('pt-BR')}</div><p class="admin-idea-text">${i.texto}</p></div>
      <button class="btn btn-danger btn-sm" data-delideia="${i.id}">Excluir</button>
    </div>`).join('') : `<p class="field-hint">Nenhuma ideia recebida ainda.</p>`;
  $('#ideiasAdminList').querySelectorAll('[data-delideia]').forEach(b=>b.addEventListener('click', async ()=>{
    let arr = (await storeGet('ideias', true)) || [];
    arr = arr.filter(x=>x.id!==b.dataset.delideia);
    await storeSet('ideias', arr, true);
    renderIdeiasAdmin(); renderStats();
  }));
}

async function renderStats(){
  const ideias = (await storeGet('ideias', true)) || [];
  $('#statIdeias').textContent = ideias.length;
}

/* ---------------- init ---------------- */
renderGaleria();
renderOficinas();
renderStats();

})();
