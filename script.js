/* ===========================================================
   GeneGênio Lab 🧬 | Script principal
   JavaScript puro, sem frameworks.

   Organização:
   1. Utilidades e armazenamento local
   2. Dados das missões
   3. Base de respostas simuladas do GeneGênio
   4. Ponto de integração com o agente real
   5. Navegação entre telas
   6. Hélice de DNA
   7. Chat
   8. Diário de Bordo
   9. Missões
   10. Inicialização
   =========================================================== */

"use strict";

/* ---------- 1. Utilidades e armazenamento local ---------- */

const $ = (seletor, raiz = document) => raiz.querySelector(seletor);
const $$ = (seletor, raiz = document) => Array.from(raiz.querySelectorAll(seletor));

/** true quando a pessoa pediu ao sistema operacional para reduzir animações */
const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

/** Escapa texto digitado pelo estudante antes de inserir em HTML */
function escapar(texto) {
  return String(texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Remove acentos e pontuação para facilitar a busca por palavras-chave */
function normalizar(texto) {
  return " " + texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim() + " ";
}

/**
 * Armazenamento no navegador (localStorage).
 * Sempre protegido por try/catch: em modo anônimo ou com o armazenamento
 * bloqueado, o site continua funcionando, apenas sem salvar.
 */
const armazenamento = {
  ler(chave, padrao) {
    try {
      const valor = localStorage.getItem(chave);
      return valor ? JSON.parse(valor) : padrao;
    } catch {
      return padrao;
    }
  },
  gravar(chave, valor) {
    try {
      localStorage.setItem(chave, JSON.stringify(valor));
      return true;
    } catch {
      return false;
    }
  }
};

const CHAVE_DIARIO = "genegenio-lab:diario";
const CHAVE_MISSOES = "genegenio-lab:missoes";

/* ---------- 2. Dados das missões ---------- */

const MISSOES = [
  {
    id: "m1",
    titulo: "Por que irmãos podem ser diferentes?",
    objetivo: "Compreender que cada filho recebe uma combinação única dos genes do pai e da mãe.",
    pergunta: "Se irmãos têm o mesmo pai e a mesma mãe, por que não são idênticos?",
    pista: "Pense no que acontece com os cromossomos quando se formam os óvulos e os espermatozoides."
  },
  {
    id: "m2",
    titulo: "O que é DNA?",
    objetivo: "Identificar o DNA como a molécula que guarda as informações hereditárias e localizá-lo na célula.",
    pergunta: "Onde fica o DNA e como uma molécula tão pequena consegue guardar tanta informação?",
    pista: "Compare o DNA a um texto escrito com apenas quatro letras: A, T, C e G."
  },
  {
    id: "m3",
    titulo: "Como as características são herdadas?",
    objetivo: "Entender o que são alelos dominantes e recessivos e relacionar genótipo e fenótipo.",
    pergunta: "Como uma característica pode desaparecer em uma geração e reaparecer nos netos?",
    pista: "Monte um quadro de Punnett cruzando dois pais Aa e observe os resultados possíveis."
  },
  {
    id: "m4",
    titulo: "Diversidade humana e genética",
    objetivo: "Analisar, com base na ciência, por que a genética não sustenta a divisão da humanidade em raças biológicas e reconhecer a diversidade como riqueza da nossa espécie.",
    pergunta: "Se todos os seres humanos compartilham cerca de 99,9% do DNA, de onde vem tanta diversidade? E por que usar a ciência para hierarquizar pessoas é um erro?",
    pista: "Pesquise o que foi o racismo científico e compare a variação genética dentro de um grupo com a variação entre grupos."
  }
];

/* ---------- 3. Base de respostas simuladas ----------
   Cada tema tem palavras-chave (sem acento) e uma ou mais respostas.
   O estilo é socrático: explica o essencial e devolve uma pergunta,
   para que o estudante continue pensando.
   ---------------------------------------------------------- */

const MENSAGEM_INICIAL = "Olá! Sou GeneGênio 🧬.\nO que você gostaria de investigar hoje?";

const TEMAS = [
  {
    chaves: ["oi", "ola", "bom dia", "boa tarde", "boa noite", "e ai", "eai", "hey"],
    respostas: [
      "Olá, explorador(a)! Pronto(a) para investigar? Você pode escolher uma das missões ou me contar uma curiosidade sobre hereditariedade que sempre te intrigou.",
      "Oi! Que bom ter você na equipe de investigação. Por onde quer começar: DNA, herança das características ou diversidade humana?"
    ]
  },
  {
    chaves: ["quem e voce", "voce e", "robo", "ia", "inteligencia artificial", "voce e humano"],
    respostas: [
      "Sou um agente educacional, um programa de inteligência artificial criado para investigar genética com você. Não sou uma pessoa e posso errar, por isso vale sempre conferir com seu professor ou sua professora.\n\nMeu jeito de ajudar é fazendo perguntas. Qual investigação vamos começar?"
    ]
  },
  {
    chaves: ["genetica", "hereditariedade"],
    respostas: [
      "Genética é a área da Biologia que estuda a hereditariedade, ou seja, como as características passam de pais para filhos, e também por que cada ser vivo é único.\n\nPara começar nossa investigação: que característica sua você acha que herdou da sua família? E qual você acha que não depende só dos genes?"
    ]
  },
  {
    chaves: ["dna", "adn", "dupla helice", "nucleotideo", "nucleotideos"],
    respostas: [
      "O DNA é uma molécula que fica no núcleo das células e guarda as instruções para o funcionamento e as características do organismo. Ele tem forma de dupla hélice, como uma escada torcida. 🧬\n\nAgora uma pergunta para você: se quase todas as suas células têm o mesmo DNA, por que uma célula da pele é tão diferente de um neurônio?"
    ]
  },
  {
    chaves: ["gene", "genes"],
    respostas: [
      "Um gene é um trecho do DNA com a informação para produzir uma molécula, geralmente uma proteína, que participa de alguma característica. O ser humano tem cerca de 20 mil genes.\n\nQue características suas você acha que são influenciadas por genes? E será que alguma depende também do ambiente?"
    ]
  },
  {
    chaves: ["cromossomo", "cromossomos", "46", "23 pares"],
    respostas: [
      "Cromossomos são estruturas formadas por DNA bem enrolado em proteínas. As células do corpo humano têm 46 cromossomos, organizados em 23 pares: em cada par, um veio do pai e o outro da mãe.\n\nHipótese para investigar: quantos cromossomos você acha que existem em um óvulo ou em um espermatozoide? Por quê?"
    ]
  },
  {
    chaves: ["irmao", "irmaos", "irma", "irmas", "gemeos", "gemeo", "gemea", "gemeas"],
    respostas: [
      "Ótima pergunta de investigação! Cada óvulo e cada espermatozoide recebe só metade dos cromossomos, e essa metade é escolhida de um jeito diferente a cada vez. Por isso, cada filho recebe uma combinação única de genes.\n\nE os gêmeos idênticos? O que você acha que acontece de diferente na formação deles?"
    ]
  },
  {
    chaves: ["herdar", "herdada", "herdadas", "herdado", "herdados", "heranca", "herdamos", "herda", "herdei", "caracteristicas", "alelo", "alelos"],
    respostas: [
      "As características são herdadas por meio dos genes. Para cada gene recebemos duas versões, chamadas alelos: uma do pai e outra da mãe. A combinação desses alelos, junto com o ambiente, resulta no que podemos observar.\n\nPense em uma característica que aparece em várias gerações da sua família. Como você explicaria isso usando a ideia de alelos?"
    ]
  },
  {
    chaves: ["dominante", "dominantes", "recessivo", "recessivos", "recessiva", "punnett", "pular", "geracao"],
    respostas: [
      "Um alelo dominante se manifesta mesmo quando aparece uma única vez (Aa). O recessivo só aparece quando os dois alelos são recessivos (aa). É por isso que uma característica pode sumir em uma geração e reaparecer depois.\n\nDesafio: se o pai e a mãe são Aa, é possível que tenham um filho aa? Faça o quadro de Punnett no seu Diário de Bordo e me conte o resultado!"
    ]
  },
  {
    chaves: ["mendel", "ervilha", "ervilhas"],
    respostas: [
      "Gregor Mendel foi um monge que, no século XIX, cruzou ervilhas e percebeu padrões na transmissão de características, como a cor das sementes. Ele fez isso muito antes de alguém saber que o DNA existia!\n\nPor que você acha que as ervilhas foram uma boa escolha para esses experimentos?"
    ]
  },
  {
    chaves: ["mutacao", "mutacoes", "mutante", "mutantes"],
    respostas: [
      "Mutações são alterações na sequência do DNA. Muitas não causam efeito algum, algumas podem ser prejudiciais e outras podem trazer vantagens. Elas são uma das fontes da variedade entre os seres vivos.\n\nSe as mutações acontecem ao acaso, como você acha que elas se relacionam com a evolução das espécies?"
    ]
  },
  {
    chaves: ["diversidade", "raca", "racas", "racismo", "racista", "etnia", "99", "eugenia", "superior", "inferior"],
    respostas: [
      "Essa é uma investigação muito importante. Todos os seres humanos compartilham cerca de 99,9% do DNA, e existe mais variação genética dentro de um mesmo grupo do que entre grupos diferentes. Por isso, a ciência mostra que não existem raças biológicas humanas. Raça é uma categoria social e histórica, que ainda produz desigualdades e racismo na sociedade.\n\nNo passado, ideias falsas chamadas de racismo científico usaram a ciência para tentar justificar hierarquias entre pessoas. Por que você acha que é importante conhecer essa história?"
    ]
  },
  {
    chaves: ["pele", "melanina", "cor da pele"],
    respostas: [
      "A cor da pele depende principalmente da quantidade de melanina, que é influenciada por vários genes ao mesmo tempo e também pela exposição ao sol. Ao longo da história, populações humanas se adaptaram a diferentes intensidades de radiação solar. Essa diversidade é uma riqueza da nossa espécie e não indica que um grupo seja superior a outro.\n\nQue outras características humanas você acha que também dependem de muitos genes?"
    ]
  },
  {
    chaves: ["olho", "olhos", "iris"],
    respostas: [
      "A cor dos olhos é influenciada por vários genes, principalmente pela quantidade de melanina na íris. Por isso, a herança dessa característica é mais complexa do que o modelo simples de dominante e recessivo.\n\nObserve a cor dos olhos das pessoas da sua família: que padrões você encontra? Registre no Diário de Bordo!"
    ]
  },
  {
    chaves: ["genotipo", "fenotipo", "ambiente"],
    respostas: [
      "Genótipo é o conjunto de alelos de um indivíduo. Fenótipo é o que se observa: altura, cor do cabelo, tipo sanguíneo. O fenótipo resulta do genótipo em interação com o ambiente.\n\nPara pensar: gêmeos idênticos têm o mesmo genótipo. Eles terão sempre exatamente o mesmo fenótipo?"
    ]
  },
  {
    chaves: ["obrigado", "obrigada", "valeu", "vlw", "brigado"],
    respostas: [
      "Eu que agradeço pela investigação! Não esqueça de registrar suas descobertas no Diário de Bordo. 📓"
    ]
  }
];

const RESPOSTA_PADRAO =
  "Hmm, nesta versão de testes eu ainda não sei investigar esse assunto. Tente perguntar sobre DNA, genes, cromossomos, herança, irmãos, mutações ou diversidade humana.\n\nQual desses caminhos você quer explorar?";

/**
 * Escolhe a resposta simulada: pontua cada tema pelas palavras-chave
 * encontradas (palavras mais longas valem mais, por serem mais específicas).
 */
function responderSimulado(mensagem) {
  const alvo = normalizar(mensagem);
  let melhor = null;
  let melhorPontos = 0;

  for (const tema of TEMAS) {
    let pontos = 0;
    for (const chave of tema.chaves) {
      if (alvo.includes(" " + chave + " ")) pontos += chave.length;
    }
    if (pontos > melhorPontos) {
      melhor = tema;
      melhorPontos = pontos;
    }
  }

  if (!melhor) return RESPOSTA_PADRAO;
  const lista = melhor.respostas;
  return lista[Math.floor(Math.random() * lista.length)];
}

/* ---------- 4. Ponto de integração com o agente real ----------
   Cole abaixo o endereço do seu Worker da Cloudflare
   (ex.: "https://genegenio.seu-usuario.workers.dev").

   - Com o endereço preenchido: o GeneGênio responde com IA de verdade.
   - Com o endereço vazio: o site usa as respostas simuladas.

   Não há chave de API aqui: ela fica guardada na Cloudflare.
   ---------------------------------------------------------- */
const URL_AGENTE = "";

const agenteConectado = URL_AGENTE.trim() !== "";

async function obterResposta(mensagem, historico) {
  if (!agenteConectado) return responderSimulado(mensagem);

  // Desiste se o servidor demorar mais de 30 segundos
  const controle = new AbortController();
  const limite = setTimeout(() => controle.abort(), 30000);

  try {
    const resposta = await fetch(URL_AGENTE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // O histórico já inclui a mensagem atual do estudante
      body: JSON.stringify({ historico: historico.slice(-20) }),
      signal: controle.signal
    });
    const dados = await resposta.json();
    if (!resposta.ok || !dados.texto) throw new Error(dados.erro || "Resposta vazia");
    return dados.texto;
  } finally {
    clearTimeout(limite);
  }
}

/* ---------- 5. Navegação entre telas ---------- */

const TELAS = {
  inicio: "Início",
  conversar: "Conversar com GeneGênio",
  diario: "Diário de Bordo",
  missoes: "Missões",
  sobre: "Sobre o Projeto"
};

function mostrarTela(id, moverFoco = true) {
  if (!TELAS[id]) id = "inicio";

  $$(".tela").forEach((tela) => {
    const ativa = tela.id === id;
    tela.hidden = !ativa;
    tela.classList.toggle("tela--ativa", ativa);
  });

  // Marca o item atual do menu (lido pelos leitores de tela)
  $$("[data-link]").forEach((link) => {
    if (link.dataset.link === id) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  document.title = id === "inicio"
    ? "GeneGênio Lab 🧬 | Investigando os mistérios da hereditariedade"
    : `${TELAS[id]} | GeneGênio Lab 🧬`;

  fecharMenu();

  if (moverFoco) {
    window.scrollTo({ top: 0, behavior: reduzirMovimento ? "auto" : "smooth" });
    const titulo = $(`#${id} [tabindex="-1"]`);
    if (titulo) titulo.focus({ preventScroll: true });
  }

  if (id === "conversar" && !modoIframe) iniciarChat();
}

function fecharMenu() {
  const botao = $(".menu-botao");
  botao.setAttribute("aria-expanded", "false");
  $("#menu").classList.remove("menu--aberto");
}

function configurarNavegacao() {
  window.addEventListener("hashchange", () => mostrarTela(location.hash.slice(1)));

  const botao = $(".menu-botao");
  botao.addEventListener("click", () => {
    const aberto = botao.getAttribute("aria-expanded") === "true";
    botao.setAttribute("aria-expanded", String(!aberto));
    $("#menu").classList.toggle("menu--aberto", !aberto);
  });

  // Esc fecha o menu no celular
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") fecharMenu();
  });

  // Botões "Perguntar ao GeneGênio" e "Investigar com o GeneGênio"
  document.addEventListener("click", (e) => {
    const alvo = e.target.closest("[data-perguntar]");
    if (alvo) perguntarAoGeneGenio(alvo.dataset.perguntar);
  });
}

/** Leva o estudante ao chat e envia uma pergunta automaticamente */
function perguntarAoGeneGenio(pergunta) {
  // Com o agente do Dify, o site não consegue escrever dentro do chat
  // (o iframe pertence a outro domínio). Então a pergunta é copiada
  // e o estudante só precisa colar.
  if (modoIframe) {
    const aviso = $("#chat-aviso");
    const mostrar = (texto) => { aviso.textContent = texto; aviso.hidden = false; };
    if (navigator.clipboard) {
      navigator.clipboard.writeText(pergunta)
        .then(() => mostrar(`Pergunta copiada! Cole no chat (Ctrl + V ou toque e segure): "${pergunta}"`))
        .catch(() => mostrar(`Pergunte ao GeneGênio: "${pergunta}"`));
    } else {
      mostrar(`Pergunte ao GeneGênio: "${pergunta}"`);
    }
    location.hash = "#conversar";
    return;
  }
  perguntaPendente = pergunta;
  if (location.hash === "#conversar") iniciarChat();
  else location.hash = "#conversar";
}

/* ---------- 6. Hélice de DNA ---------- */

function montarHelice() {
  const helice = $("#helice");
  if (!helice) return;
  const total = 18;
  let html = "";
  for (let i = 0; i < total; i++) {
    const destaque = i % 5 === 2 ? " par--destaque" : "";
    html += `<div class="par${destaque}" style="--i:${i}"><span class="base base--a"></span><span class="base base--b"></span></div>`;
  }
  helice.innerHTML = html;
}

/* ---------- 7. Chat ----------
   Se a página tiver o iframe do Dify, o chat próprio fica desligado.
   Para voltar ao chat próprio, basta restaurar o HTML anterior.
   ---------------------------------------------------------- */
const modoIframe = Boolean($("#agente-iframe"));

const chatLog = $("#chat-log");
const chatForm = $("#chat-form");
const chatEntrada = $("#chat-entrada");
const chatEnviar = $("#chat-enviar");
const chatAnuncio = $("#chat-anuncio");

let historico = [];          // [{ papel: "estudante" | "genegenio", texto }]
let ocupado = false;         // impede envios enquanto o GeneGênio responde
let boasVindas = null;       // promessa da mensagem inicial
let perguntaPendente = null; // pergunta vinda de outra tela

function rolarParaFim() {
  chatLog.scrollTop = chatLog.scrollHeight;
}

function anunciar(texto) {
  chatAnuncio.textContent = "";
  setTimeout(() => { chatAnuncio.textContent = texto; }, 60);
}

function travarEnvio(travar) {
  ocupado = travar;
  chatEnviar.disabled = travar;
  $("#chat").setAttribute("aria-busy", String(travar));
}

/** Cria um balão de mensagem e devolve o elemento onde vai o texto */
function criarBalao(papel) {
  const msg = document.createElement("div");
  msg.className = `msg msg--${papel}`;

  if (papel === "genegenio") {
    msg.innerHTML = '<svg class="msg__avatar" aria-hidden="true"><use href="#avatar"/></svg>';
  }

  const balao = document.createElement("div");
  balao.className = "msg__balao";

  // Identifica quem fala para leitores de tela
  const quem = document.createElement("span");
  quem.className = "sr-only";
  quem.textContent = papel === "genegenio" ? "GeneGênio: " : "Você: ";

  const texto = document.createElement("span");
  balao.append(quem, texto);
  msg.append(balao);
  chatLog.append(msg);
  rolarParaFim();
  return { msg, texto };
}

function adicionarMensagemEstudante(texto) {
  const { texto: alvo } = criarBalao("estudante");
  alvo.textContent = texto;
}

/** Mostra os três pontinhos enquanto o GeneGênio "pensa" */
function mostrarPensando() {
  const msg = document.createElement("div");
  msg.className = "msg msg--genegenio";
  msg.setAttribute("aria-hidden", "true");
  msg.innerHTML =
    '<svg class="msg__avatar"><use href="#avatar"/></svg>' +
    '<div class="msg__balao"><span class="pensando"><span></span><span></span><span></span></span></div>';
  chatLog.append(msg);
  rolarParaFim();
  return msg;
}

/** Efeito de digitação: revela a resposta aos poucos */
function digitarMensagem(texto) {
  return new Promise((resolver) => {
    const { msg, texto: alvo } = criarBalao("genegenio");
    anunciar(`GeneGênio diz: ${texto}`);

    if (reduzirMovimento) {
      alvo.textContent = texto;
      rolarParaFim();
      resolver();
      return;
    }

    // Array.from separa corretamente emojis (que ocupam 2 posições na string)
    const caracteres = Array.from(texto);
    const passo = Math.max(1, Math.ceil(caracteres.length / 170)); // respostas longas digitam mais rápido
    let i = 0;
    msg.classList.add("msg--digitando");

    const avancar = () => {
      i = Math.min(caracteres.length, i + passo);
      alvo.textContent = caracteres.slice(0, i).join("");
      rolarParaFim();
      if (i < caracteres.length) {
        setTimeout(avancar, 18);
      } else {
        msg.classList.remove("msg--digitando");
        resolver();
      }
    };
    avancar();
  });
}

/** Mostra a mensagem inicial na primeira visita ao chat */
function iniciarChat() {
  if (!boasVindas) {
    travarEnvio(true);
    boasVindas = digitarMensagem(MENSAGEM_INICIAL).then(() => travarEnvio(false));
  }
  boasVindas.then(() => {
    if (perguntaPendente && !ocupado) {
      const pergunta = perguntaPendente;
      perguntaPendente = null;
      enviarMensagem(pergunta);
    }
  });
}

async function enviarMensagem(texto) {
  texto = texto.trim();
  if (!texto || ocupado) return;

  travarEnvio(true);
  adicionarMensagemEstudante(texto);
  historico.push({ papel: "estudante", texto });

  const pensando = mostrarPensando();
  let resposta;
  try {
    // Espera mínima para a conversa soar natural
    [resposta] = await Promise.all([
      obterResposta(texto, historico),
      esperar(reduzirMovimento ? 150 : 650 + Math.random() * 450)
    ]);
  } catch {
    resposta = "Não consegui responder agora. Verifique sua conexão e envie a pergunta de novo em alguns instantes.";
  }
  pensando.remove();

  await digitarMensagem(resposta);
  historico.push({ papel: "genegenio", texto: resposta });
  travarEnvio(false);
}

function ajustarAlturaEntrada() {
  chatEntrada.style.height = "auto";
  chatEntrada.style.height = `${Math.min(chatEntrada.scrollHeight, 160)}px`;
}

function configurarChat() {
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (ocupado) return;
    const texto = chatEntrada.value;
    chatEntrada.value = "";
    ajustarAlturaEntrada();
    enviarMensagem(texto);
  });

  // Enter envia; Shift + Enter quebra a linha
  chatEntrada.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      chatForm.requestSubmit();
    }
  });
  chatEntrada.addEventListener("input", ajustarAlturaEntrada);

  $$("[data-sugestao]").forEach((botao) => {
    botao.addEventListener("click", () => enviarMensagem(botao.textContent));
  });

  $("#chat-limpar").addEventListener("click", () => {
    if (ocupado) return;
    chatLog.innerHTML = "";
    historico = [];
    boasVindas = null;
    iniciarChat();
    chatEntrada.focus();
  });
}

/* ---------- 8. Diário de Bordo ---------- */

const CAMPOS_DIARIO = [
  { nome: "aprendi", rotulo: "O que aprendi" },
  { nome: "hipoteses", rotulo: "Hipóteses formuladas" },
  { nome: "descobertas", rotulo: "Descobertas realizadas" },
  { nome: "duvidas", rotulo: "Dúvidas que surgiram" }
];

function formatarData(iso) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
  });
}

function nomeDaMissao(id) {
  const missao = MISSOES.find((m) => m.id === id);
  return missao ? missao.titulo : "Investigação livre";
}

function renderizarDiario() {
  const registros = armazenamento.ler(CHAVE_DIARIO, []);
  const lista = $("#diario-lista");
  $("#diario-vazio").hidden = registros.length > 0;
  $("#diario-baixar").hidden = registros.length === 0;

  // Mais recentes primeiro
  lista.innerHTML = registros.slice().reverse().map((r) => {
    const campos = CAMPOS_DIARIO
      .filter((c) => r[c.nome])
      .map((c) => `<dt>${c.rotulo}</dt><dd>${escapar(r[c.nome])}</dd>`)
      .join("");
    return `
      <li class="registro">
        <div class="registro__topo">
          <div>
            <p class="registro__data">${formatarData(r.data)}</p>
            <p class="registro__missao">${escapar(nomeDaMissao(r.missao))}</p>
          </div>
          <button type="button" class="botao-icone" data-apagar="${r.id}" aria-label="Apagar registro de ${formatarData(r.data)}">
            <svg aria-hidden="true"><use href="#i-lixeira"/></svg>
          </button>
        </div>
        <dl>${campos}</dl>
      </li>`;
  }).join("");
}

function mostrarStatus(elemento, texto, erro = false) {
  elemento.textContent = texto;
  elemento.classList.toggle("status--erro", erro);
  clearTimeout(elemento._temporizador);
  elemento._temporizador = setTimeout(() => { elemento.textContent = ""; }, 4000);
}

/** Gera um arquivo .txt com todo o diário, útil para entregar ao professor */
function baixarDiario() {
  const registros = armazenamento.ler(CHAVE_DIARIO, []);
  const linhas = [
    "DIÁRIO DE BORDO | GeneGênio Lab",
    `Gerado em ${formatarData(new Date().toISOString())}`,
    ""
  ];
  registros.forEach((r) => {
    linhas.push("----------------------------------------");
    linhas.push(`Registro de ${formatarData(r.data)}`);
    linhas.push(`Missão: ${nomeDaMissao(r.missao)}`);
    CAMPOS_DIARIO.forEach((c) => { if (r[c.nome]) linhas.push(`${c.rotulo}: ${r[c.nome]}`); });
    linhas.push("");
  });

  const arquivo = new Blob([linhas.join("\n")], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(arquivo);
  link.download = "diario-de-bordo-genegenio.txt";
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

function configurarDiario() {
  const form = $("#diario-form");
  const status = $("#diario-status");

  // Opções de missão no seletor
  $("#d-missao").insertAdjacentHTML(
    "beforeend",
    MISSOES.map((m, i) => `<option value="${m.id}">Missão ${i + 1}: ${m.titulo}</option>`).join("")
  );

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const registro = { id: String(Date.now()), data: new Date().toISOString(), missao: form.missao.value };
    CAMPOS_DIARIO.forEach((c) => { registro[c.nome] = form[c.nome].value.trim(); });

    if (!CAMPOS_DIARIO.some((c) => registro[c.nome])) {
      mostrarStatus(status, "Escreva em pelo menos um campo antes de salvar.", true);
      form.aprendi.focus();
      return;
    }

    const registros = armazenamento.ler(CHAVE_DIARIO, []);
    registros.push(registro);
    if (!armazenamento.gravar(CHAVE_DIARIO, registros)) {
      mostrarStatus(status, "Este navegador não permite salvar. Copie suas anotações antes de sair.", true);
      return;
    }

    CAMPOS_DIARIO.forEach((c) => { form[c.nome].value = ""; });
    renderizarDiario();
    mostrarStatus(status, "Registro salvo no diário.");
  });

  // Apagar registro (com confirmação)
  $("#diario-lista").addEventListener("click", (e) => {
    const botao = e.target.closest("[data-apagar]");
    if (!botao || !confirm("Apagar este registro do diário?")) return;
    const restantes = armazenamento.ler(CHAVE_DIARIO, []).filter((r) => r.id !== botao.dataset.apagar);
    armazenamento.gravar(CHAVE_DIARIO, restantes);
    renderizarDiario();
    mostrarStatus(status, "Registro apagado.");
  });

  $("#diario-baixar").addEventListener("click", baixarDiario);
  renderizarDiario();
}

/* ---------- 9. Missões ---------- */

function renderizarMissoes() {
  const salvas = armazenamento.ler(CHAVE_MISSOES, {});

  $("#trilha").innerHTML = MISSOES.map((m, i) => `
    <li class="missao" data-missao="${m.id}">
      <span class="missao__no" aria-hidden="true">${i + 1}</span>
      <details class="missao__cartao painel">
        <summary>
          <span class="missao__rotulo">Missão ${i + 1}</span>
          <span class="missao__titulo">${m.titulo}</span>
          <span class="missao__selo" data-selo>Em aberto</span>
        </summary>
        <div class="missao__corpo">
          <dl class="missao__info">
            <div><dt>Objetivo</dt><dd>${m.objetivo}</dd></div>
            <div><dt>Pergunta investigativa</dt><dd class="missao__pergunta">${m.pergunta}</dd></div>
            <div><dt>Pista</dt><dd>${m.pista}</dd></div>
          </dl>
          <label for="notas-${m.id}">Minhas anotações</label>
          <textarea id="notas-${m.id}" rows="4" placeholder="Registre suas ideias, testes e conclusões..."></textarea>
          <div class="missao__acoes">
            <button type="button" class="botao botao--primario" data-salvar>Salvar anotações</button>
            <button type="button" class="botao botao--secundario" data-perguntar="${escapar(m.pergunta)}">Investigar com o GeneGênio</button>
            <label class="marcar"><input type="checkbox" data-concluir> Missão concluída</label>
          </div>
          <p class="status" role="status" data-status></p>
        </div>
      </details>
    </li>`).join("");

  // Restaura anotações e conclusões salvas
  MISSOES.forEach((m) => {
    const item = $(`[data-missao="${m.id}"]`);
    const dados = salvas[m.id] || {};
    $("textarea", item).value = dados.notas || "";
    $("[data-concluir]", item).checked = Boolean(dados.concluida);
    atualizarSelo(item, Boolean(dados.concluida));
  });

  atualizarProgresso();
}

function atualizarSelo(item, concluida) {
  item.classList.toggle("missao--concluida", concluida);
  $("[data-selo]", item).textContent = concluida ? "Concluída ⭐" : "Em aberto";
}

function atualizarProgresso() {
  const salvas = armazenamento.ler(CHAVE_MISSOES, {});
  const feitas = MISSOES.filter((m) => salvas[m.id] && salvas[m.id].concluida).length;
  const total = MISSOES.length;
  $("#progresso-texto").textContent = `${feitas} de ${total} missões concluídas`;
  $(".progresso__barra").setAttribute("aria-valuenow", String(feitas));
  $("#progresso-preenchimento").style.width = `${(feitas / total) * 100}%`;
}

function salvarMissao(id, alteracao) {
  const salvas = armazenamento.ler(CHAVE_MISSOES, {});
  salvas[id] = { ...(salvas[id] || {}), ...alteracao };
  return armazenamento.gravar(CHAVE_MISSOES, salvas);
}

function configurarMissoes() {
  renderizarMissoes();
  const trilha = $("#trilha");

  trilha.addEventListener("click", (e) => {
    const botao = e.target.closest("[data-salvar]");
    if (!botao) return;
    const item = botao.closest("[data-missao]");
    const ok = salvarMissao(item.dataset.missao, { notas: $("textarea", item).value.trim() });
    mostrarStatus(
      $("[data-status]", item),
      ok ? "Anotações salvas." : "Este navegador não permite salvar.",
      !ok
    );
  });

  trilha.addEventListener("change", (e) => {
    if (!e.target.matches("[data-concluir]")) return;
    const item = e.target.closest("[data-missao]");
    const concluida = e.target.checked;
    salvarMissao(item.dataset.missao, { concluida, notas: $("textarea", item).value.trim() });
    atualizarSelo(item, concluida);
    atualizarProgresso();
    mostrarStatus($("[data-status]", item), concluida ? "Missão concluída. Muito bem, explorador(a)!" : "Missão reaberta.");
  });
}

/* ---------- 10. Inicialização ---------- */

document.documentElement.classList.add("js");

// Ajusta os avisos da página conforme o modo (simulado ou IA real)
if (agenteConectado) {
  const status = $(".chat__status");
  status.lastChild.textContent = "Agente de IA conectado";
  $(".rodape p").textContent =
    "GeneGênio Lab é um ambiente educacional de pesquisa. O GeneGênio é uma inteligência artificial e pode errar: confira as informações com seu professor ou sua professora.";
}
montarHelice();
configurarNavegacao();
if (!modoIframe) configurarChat();
configurarDiario();
configurarMissoes();
mostrarTela(location.hash.slice(1) || "inicio", false);
