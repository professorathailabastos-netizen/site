/* ============================================================
   Carrega os textos editáveis (conteudo/*.yml) nas páginas.
   Se o arquivo não carregar, o site mantém o texto do HTML.
   O leitor de YAML está em js/yaml.js
   ============================================================ */

/* Preenche listas (cursos, depoimentos, etc.) gerando os cartões */
function criarLista(idElemento, itens, montarConteudo, classeItem) {
  const alvo = document.getElementById(idElemento);
  if (!alvo || !Array.isArray(itens) || itens.length === 0) return;

  alvo.innerHTML = "";
  itens.forEach((item) => {
    const el = document.createElement(classeItem.tag || "div");
    if (classeItem.className) el.className = classeItem.className;
    if (classeItem.style) el.setAttribute("style", classeItem.style);
    el.innerHTML = montarConteudo(item);
    alvo.appendChild(el);
  });
}

/* Escapa texto para evitar quebra de layout */
function esc(txt) {
  if (txt === undefined || txt === null) return "";
  return String(txt)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* Monta as seções que têm listas repetidas */
function aplicarListas(dados) {
  // --- Cursos ---
  if (Array.isArray(dados.cursos)) {
    criarLista("listaCursos", dados.cursos, (c) => {
      const estilo = c.destaque
        ? 'style="border-color:var(--gold-500); box-shadow:0 0 0 3px var(--gold-100);"'
        : "";
      const itens = (c.itens || []).map((i) => `<li>${esc(i)}</li>`).join("");
      return (
        `<span class="icon-box" aria-hidden="true">${esc(c.icone || "📘")}</span>` +
        `<h3>${esc(c.titulo)}</h3>` +
        `<p class="muted">${esc(c.texto)}</p>` +
        (itens ? `<ul class="check-list" style="font-size:.92rem;">${itens}</ul>` : "")
      );
    }, { tag: "article", className: "card" });
  }

  // --- Depoimentos ---
  if (Array.isArray(dados.depoimentos)) {
    criarLista("listaDepoimentos", dados.depoimentos, (d) =>
      `<blockquote>${esc(d.frase)}</blockquote>` +
      `<figcaption><strong>${esc(d.nome)}</strong><span>${esc(d.descricao)}</span></figcaption>`,
      { tag: "figure", className: "quote" }
    );
  }

  // --- Lista de conquistas (impacto) ---
  if (Array.isArray(dados.impacto_lista) && dados.impacto_lista.length) {
    const alvo = document.getElementById("listaImpacto");
    if (alvo) alvo.innerHTML = dados.impacto_lista.map((i) => `<li>${esc(i)}</li>`).join("");
  }

  // --- Quem pode se inscrever ---
  if (Array.isArray(dados.inscricao_quem_pode) && dados.inscricao_quem_pode.length) {
    const alvo = document.getElementById("listaQuemPode");
    if (alvo) alvo.innerHTML = dados.inscricao_quem_pode.map((i) => `<li>${esc(i)}</li>`).join("");
  }

  // --- Formas de apoio (página de doações) ---
  if (Array.isArray(dados.formas_apoio) && dados.formas_apoio.length) {
    criarLista("listaFormasApoio", dados.formas_apoio, (f) =>
      `<span class="icon-box" aria-hidden="true">${esc(f.icone || "🤝")}</span>` +
      `<h3>${esc(f.titulo)}</h3>` +
      `<p class="muted">${esc(f.texto)}</p>`,
      { tag: "article", className: "card" }
    );
  }

  // --- Cartões de valores de doação ---
  if (Array.isArray(dados.valores_doacao) && dados.valores_doacao.length) {
    const alvo = document.querySelector(".donate-grid .grid-2");
    if (alvo) {
      alvo.innerHTML = dados.valores_doacao.map((v) => {
        const estilo = v.destaque
          ? ' style="border-color:var(--gold-500); box-shadow:0 0 0 3px var(--gold-100);"'
          : "";
        const itens = (v.itens || []).map((i) => `<li>${esc(i)}</li>`).join("");
        const apenasNumero = (v.valor || "").replace(/[^\d]/g, "");
        return (
          `<article class="donate-card"${estilo}>` +
          `<span class="donate-card__amount">${esc(v.valor)}</span>` +
          `<p class="donate-card__desc">${esc(v.descricao)}</p>` +
          (itens ? `<ul class="donate-card__list">${itens}</ul>` : "") +
          `<button class="btn ${v.destaque ? "btn--gold" : "btn--outline"} btn--sm" type="button" data-donate="${apenasNumero}">` +
          (apenasNumero ? `Escolher ${esc(v.valor)}` : "Escolher outro valor") +
          `</button></article>`
        );
      }).join("");
    }
  }

  // --- Lista de transparência ---
  if (Array.isArray(dados.transparencia_itens) && dados.transparencia_itens.length) {
    const alvo = document.querySelector(".section--dark .check-list");
    if (alvo && document.getElementById("transparencia")) {
      alvo.innerHTML = dados.transparencia_itens.map((i) => `<li>${esc(i)}</li>`).join("");
    }
  }

  // --- Perfis de multiplicadores ---
  if (Array.isArray(dados.perfis) && dados.perfis.length) {
    criarLista("listaPerfis", dados.perfis, (p) =>
      `<span class="icon-box" aria-hidden="true">${esc(p.icone || "🤝")}</span>` +
      `<h3>${esc(p.titulo)}</h3>` +
      `<p class="muted">${esc(p.texto)}</p>`,
      { tag: "article", className: "card" }
    );
  }

  // --- Passo a passo ---
  if (Array.isArray(dados.passos) && dados.passos.length) {
    const alvo = document.getElementById("listaPassos");
    if (alvo) {
      alvo.innerHTML = dados.passos
        .map((p) => `<div class="step"><h4>${esc(p.titulo)}</h4><p>${esc(p.texto)}</p></div>`)
        .join("");
    }
  }

  // --- Listas simples (oferecemos / esperamos / cidades) ---
  const listasSimples = [
    ["listaOferecemos", dados.oferecemos],
    ["listaEsperamos", dados.esperamos]
  ];
  listasSimples.forEach(([id, lista]) => {
    const alvo = document.getElementById(id);
    if (alvo && Array.isArray(lista) && lista.length) {
      alvo.innerHTML = lista.map((i) => `<li>${esc(i)}</li>`).join("");
    }
  });

  if (Array.isArray(dados.cidades) && dados.cidades.length) {
    const alvo = document.getElementById("listaCidades");
    if (alvo) {
      alvo.innerHTML = dados.cidades
        .map((c) => `<span class="city-chip">${esc(c)}</span>`)
        .join("");
    }
  }

  // --- Selos do topo ---
  if (Array.isArray(dados.hero_selos) && dados.hero_selos.length) {
    const alvo = document.querySelector(".hero__badges");
    if (alvo) alvo.innerHTML = dados.hero_selos.map((s) => `<li>✓ ${esc(s)}</li>`).join("");
  }

  // --- Faixa rolante ---
  if (Array.isArray(dados.faixa_itens) && dados.faixa_itens.length) {
    const alvo = document.querySelector(".ticker__track");
    if (alvo) {
      const bloco = dados.faixa_itens.map((f) => `<span>${esc(f)}</span><span>•</span>`).join("");
      alvo.innerHTML = bloco + bloco; // duplicado para o efeito de rolagem contínua
    }
  }
}

/* Preenche elementos pelo atributo data-campo */
function aplicarCampos(dados) {
  document.querySelectorAll("[data-campo]").forEach((el) => {
    const chave = el.dataset.campo;
    const valor = dados[chave];
    if (valor === undefined || valor === null || valor === "") return;

    if (el.tagName === "IMG") {
      el.src = valor;
    } else if (el.hasAttribute("data-sufixo")) {
      el.textContent = valor + (dados[el.dataset.sufixo] || "");
    } else {
      el.textContent = valor;
    }
  });
}

/* Preenche links de WhatsApp com o número configurado */
function aplicarWhatsApp(numero) {
  if (!numero) return;
  document.querySelectorAll('a[href*="wa.me/"]').forEach((a) => {
    const url = new URL(a.href);
    const texto = url.searchParams.get("text");
    a.href = `https://wa.me/${numero}` + (texto ? `?text=${texto}` : "");
  });
}

/* Descobre quais arquivos de conteúdo carregar, conforme a página */
function arquivosDaPagina() {
  const pagina = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  const base = [];

  if (pagina === "" || pagina === "index.html") base.push("conteudo/home.yml");
  if (pagina === "doacoes.html") base.push("conteudo/doacoes.yml");
  if (pagina === "multiplicadores.html") base.push("conteudo/multiplicadores.yml");

  return base;
}

/* Carrega um arquivo YAML da pasta conteudo */
async function carregarConteudo() {
  const arquivos = arquivosDaPagina();

  for (const arquivo of arquivos) {
    try {
      const resp = await fetch(arquivo, { cache: "no-cache" });
      if (!resp.ok) throw new Error("arquivo não encontrado");
      const dados = lerYaml(await resp.text());
      aplicarCampos(dados);
      aplicarListas(dados);

      // Números animados
      document.querySelectorAll("[data-campo-numero]").forEach((el) => {
        const chave = el.dataset.campoNumero;
        if (dados[chave] !== undefined) el.dataset.count = dados[chave];
      });
    } catch (e) {
      console.info("Conteúdo dinâmico indisponível (" + arquivo + "), usando o texto do HTML.");
    }
  }

  try {
    const resp = await fetch("conteudo/config.yml", { cache: "no-cache" });
    if (!resp.ok) return;
    const cfg = lerYaml(await resp.text());
    if (cfg.whatsapp_numero) {
      aplicarWhatsApp(cfg.whatsapp_numero);
      window.WHATSAPP_ATUAL = cfg.whatsapp_numero;
    }
    aplicarCampos(cfg);
  } catch (e) {
    /* silencioso */
  }
}

document.addEventListener("DOMContentLoaded", carregarConteudo);
