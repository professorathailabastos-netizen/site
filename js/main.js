/* ============================================================
   Associação Anésia Cauaçu — interações do site
   ============================================================

   ⚙️ CONFIGURAÇÃO — troque os valores abaixo pelos dados reais.
   O número do WhatsApp deve ter só dígitos, com 55 + DDD na frente.
   Exemplo: "5573987654321"
*/
const WHATSAPP_NUMERO = "5573998205303";

document.addEventListener("DOMContentLoaded", () => {
  anoAtual();
  menuMobile();
  animarContadores();
  revelarAoRolar();
  ativarLinkDoMenu();
  configurarFaq();

  // Formulários (só existem na página correspondente)
  if (document.getElementById("inscricaoForm")) iniciarInscricao();
  if (document.getElementById("multiplicadorForm")) iniciarMultiplicador();
  if (document.getElementById("pixKey")) iniciarDoacoes();
});

/* ---------- Ano no rodapé ---------- */
function anoAtual() {
  const el = document.getElementById("ano");
  if (el) el.textContent = new Date().getFullYear();
}

/* ---------- Menu no celular ---------- */
function menuMobile() {
  const btn = document.getElementById("menuBtn");
  const nav = document.getElementById("nav");
  if (!btn || !nav) return;

  btn.addEventListener("click", () => {
    const aberto = nav.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", String(aberto));
    btn.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
    });
  });

  // Fecha o menu ao clicar fora
  document.addEventListener("click", (e) => {
    if (!nav.classList.contains("is-open")) return;
    if (nav.contains(e.target) || btn.contains(e.target)) return;
    nav.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
  });
}

/* ---------- Destaca o link da página atual ---------- */
function ativarLinkDoMenu() {
  const pagina = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav a").forEach((a) => {
    const destino = a.getAttribute("href") || "";
    if (!destino || destino.startsWith("http") || destino.startsWith("#")) return;
    const arquivo = destino.split("#")[0];
    if (arquivo && arquivo === pagina) a.classList.add("is-active");
  });
}

/* ---------- Contadores animados ---------- */
function animarContadores() {
  const alvos = document.querySelectorAll("[data-count]");
  if (!alvos.length) return;

  const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const animar = (el) => {
    const alvo = Number(el.dataset.count) || 0;
    const sufixo = el.dataset.suffix || "";
    const semSeparador = el.dataset.plain === "true";

    const formatar = (n) =>
      (semSeparador ? String(n) : n.toLocaleString("pt-BR")) + sufixo;

    if (reduzir) {
      el.textContent = formatar(alvo);
      return;
    }

    const duracao = 1500;
    const inicio = performance.now();
    const passo = (agora) => {
      const p = Math.min((agora - inicio) / duracao, 1);
      const suave = 1 - Math.pow(1 - p, 3);
      el.textContent = formatar(Math.round(alvo * suave));
      if (p < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  };

  if (!("IntersectionObserver" in window)) {
    alvos.forEach(animar);
    return;
  }

  const obs = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (e.isIntersecting) {
        animar(e.target);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });

  alvos.forEach((el) => obs.observe(el));
}

/* ---------- Aparecer ao rolar ---------- */
function revelarAoRolar() {
  if (!("IntersectionObserver" in window)) return;

  const alvos = document.querySelectorAll(
    ".card, .stat, .step, .quote, .gallery__item, .timeline__item, .contact-card, .form-card, .donate-card, .faq__item, .section__head"
  );
  if (!alvos.length) return;

  alvos.forEach((el) => el.classList.add("reveal"));

  const obs = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible");
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

  alvos.forEach((el) => obs.observe(el));
}

/* ---------- Perguntas frequentes ---------- */
function configurarFaq() {
  document.querySelectorAll(".faq__question").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq__item");
      const resposta = item.querySelector(".faq__answer");
      const aberto = item.classList.contains("is-open");

      // Fecha os outros (comportamento de acordeão)
      item.closest(".faq")?.querySelectorAll(".faq__item.is-open").forEach((outro) => {
        if (outro === item) return;
        outro.classList.remove("is-open");
        outro.querySelector(".faq__question").setAttribute("aria-expanded", "false");
        outro.querySelector(".faq__answer").style.maxHeight = null;
      });

      if (aberto) {
        item.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
        resposta.style.maxHeight = null;
      } else {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
        resposta.style.maxHeight = resposta.scrollHeight + "px";
      }
    });
  });
}

/* ---------- Utilitários de validação ---------- */
const emailValido = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const soDigitos = (v) => v.replace(/\D/g, "");

function limparErros(form) {
  form.querySelectorAll(".error").forEach((e) => (e.textContent = ""));
  form.querySelectorAll(".invalid").forEach((e) => e.classList.remove("invalid"));
}

function marcarErro(form, campo, mensagem) {
  const span = form.querySelector(`[data-error-for="${campo}"]`);
  if (span) span.textContent = mensagem;
  const input = form.querySelector(`[name="${campo}"], #${campo}`);
  if (input && input.type !== "checkbox") input.classList.add("invalid");
}

function focarPrimeiroErro(form) {
  const primeiro = form.querySelector(".invalid");
  if (primeiro) primeiro.focus();
}

function mostrarSucesso(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.hidden = false;
  setTimeout(() => { el.hidden = true; }, 14000);
}

/* ---------- Formulário de pré-inscrição (alunos) ---------- */
function iniciarInscricao() {
  const form = document.getElementById("inscricaoForm");

  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    limparErros(form);

    const nome = form.nome.value.trim();
    const telefone = form.telefone.value.trim();
    const email = form.email.value.trim();
    const cidade = form.cidade.value.trim();
    const turma = form.turma.value;
    const lgpd = form.lgpd.checked;
    let ok = true;

    if (nome.length < 3) { marcarErro(form, "nome", "Digite seu nome completo."); ok = false; }
    if (soDigitos(telefone).length < 10) { marcarErro(form, "telefone", "Digite DDD e número."); ok = false; }
    if (email && !emailValido(email)) { marcarErro(form, "email", "E-mail inválido."); ok = false; }
    if (cidade.length < 2) { marcarErro(form, "cidade", "Informe sua cidade."); ok = false; }
    if (!turma) { marcarErro(form, "turma", "Escolha uma turma."); ok = false; }
    if (!lgpd) { marcarErro(form, "lgpd", "É necessário autorizar o contato."); ok = false; }

    if (!ok) { focarPrimeiroErro(form); return; }

    const texto =
      "*Pré-inscrição — Cursinho Anésia Cauaçu*%0A%0A" +
      `*Nome:* ${encodeURIComponent(nome)}%0A` +
      `*Cidade:* ${encodeURIComponent(cidade)}%0A` +
      `*WhatsApp:* ${encodeURIComponent(telefone)}%0A` +
      (email ? `*E-mail:* ${encodeURIComponent(email)}%0A` : "") +
      `*Turma:* ${encodeURIComponent(turma)}%0A` +
      (form.mensagem.value.trim()
        ? `*Sobre mim:* ${encodeURIComponent(form.mensagem.value.trim())}%0A`
        : "");

    mostrarSucesso("inscricaoSuccess");
    window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${texto}`, "_blank", "noopener");
    form.reset();
  });
}

/* ---------- Formulário de multiplicadores ---------- */
function iniciarMultiplicador() {
  const form = document.getElementById("multiplicadorForm");

  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    limparErros(form);

    const nome = form.nome.value.trim();
    const telefone = form.telefone.value.trim();
    const email = form.email.value.trim();
    const cidade = form.cidade.value.trim();
    const perfil = form.perfil.value;
    const atuacao = form.atuacao.value;
    const mensagem = form.mensagem.value.trim();
    const lgpd = form.lgpd.checked;
    let ok = true;

    if (nome.length < 3) { marcarErro(form, "nome", "Digite seu nome completo."); ok = false; }
    if (soDigitos(telefone).length < 10) { marcarErro(form, "telefone", "Digite DDD e número."); ok = false; }
    if (!emailValido(email)) { marcarErro(form, "email", "Digite um e-mail válido."); ok = false; }
    if (cidade.length < 2) { marcarErro(form, "cidade", "Informe sua cidade."); ok = false; }
    if (!perfil) { marcarErro(form, "perfil", "Selecione seu perfil."); ok = false; }
    if (!atuacao) { marcarErro(form, "atuacao", "Escolha como quer contribuir."); ok = false; }
    if (mensagem.length < 15) { marcarErro(form, "mensagem", "Conte um pouco mais (mínimo 15 caracteres)."); ok = false; }
    if (!lgpd) { marcarErro(form, "lgpd", "É necessário autorizar o contato."); ok = false; }

    if (!ok) { focarPrimeiroErro(form); return; }

    const texto =
      "*Cadastro de multiplicador(a) — Anésia Cauaçu*%0A%0A" +
      `*Nome:* ${encodeURIComponent(nome)}%0A` +
      `*Cidade:* ${encodeURIComponent(cidade)}%0A` +
      `*WhatsApp:* ${encodeURIComponent(telefone)}%0A` +
      `*E-mail:* ${encodeURIComponent(email)}%0A` +
      `*Perfil:* ${encodeURIComponent(perfil)}%0A` +
      `*Como quer contribuir:* ${encodeURIComponent(atuacao)}%0A%0A` +
      `*Sobre mim e minha cidade:*%0A${encodeURIComponent(mensagem)}%0A`;

    mostrarSucesso("multiplicadorSuccess");
    window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${texto}`, "_blank", "noopener");
    form.reset();
  });
}

/* ---------- Página de doações ---------- */
function iniciarDoacoes() {
  const pixKey = document.getElementById("pixKey");
  const btnCopiar = document.getElementById("copyPix");

  // Copiar chave PIX
  if (btnCopiar && pixKey) {
    btnCopiar.addEventListener("click", async () => {
      const chave = pixKey.textContent.trim();
      try {
        await navigator.clipboard.writeText(chave);
      } catch {
        const campo = document.createElement("textarea");
        campo.value = chave;
        document.body.appendChild(campo);
        campo.select();
        document.execCommand("copy");
        campo.remove();
      }
      const textoOriginal = btnCopiar.textContent;
      btnCopiar.textContent = "Copiado ✓";
      setTimeout(() => { btnCopiar.textContent = textoOriginal; }, 2200);
    });
  }

  // Simulador de doação
  const resumoValor = document.getElementById("resumoValor");
  const resumoFreq = document.getElementById("resumoFreq");
  const btnDoar = document.getElementById("btnDoar");
  const valorOutro = document.getElementById("valorOutro");

  let valorSelecionado = 30;
  let frequencia = "Única";

  const formatarReal = (n) =>
    n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });

  const atualizarResumo = () => {
    if (resumoValor) resumoValor.textContent = formatarReal(valorSelecionado || 0);
    if (resumoFreq) resumoFreq.textContent = frequencia === "Mensal" ? "Doação mensal" : "Doação única";

    if (btnDoar) {
      const texto =
        `Olá! Acabei de fazer (ou vou fazer) uma doação para o Cursinho Anésia Cauaçu.%0A%0A` +
        `*Valor:* ${encodeURIComponent(formatarReal(valorSelecionado || 0))}%0A` +
        `*Frequência:* ${encodeURIComponent(frequencia === "Mensal" ? "Mensal" : "Única")}%0A%0A` +
        `Segue o comprovante:`;
      btnDoar.href = `https://wa.me/${WHATSAPP_NUMERO}?text=${texto}`;
    }
  };

  document.querySelectorAll("[data-freq]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-freq]").forEach((b) => b.classList.remove("is-selected"));
      btn.classList.add("is-selected");
      frequencia = btn.dataset.freq;
      atualizarResumo();
    });
  });

  document.querySelectorAll("[data-amount]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-amount]").forEach((b) => b.classList.remove("is-selected"));
      btn.classList.add("is-selected");
      valorSelecionado = Number(btn.dataset.amount);
      if (valorOutro) valorOutro.value = "";
      atualizarResumo();
    });
  });

  if (valorOutro) {
    valorOutro.addEventListener("input", () => {
      valorSelecionado = Number(valorOutro.value) || 0;
      document.querySelectorAll("[data-amount]").forEach((b) => b.classList.remove("is-selected"));
      atualizarResumo();
    });
  }

  // Botões "Escolher R$ X" nos cartões de valores
  document.querySelectorAll("[data-donate]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const valor = btn.dataset.donate;
      const campoValor = document.getElementById("valorOutro");

      document.querySelectorAll("[data-amount]").forEach((b) => {
        b.classList.toggle("is-selected", valor !== "" && b.dataset.amount === valor);
      });

      if (valor === "") {
        valorSelecionado = 0;
        if (campoValor) { campoValor.value = ""; campoValor.focus(); }
      } else {
        valorSelecionado = Number(valor);
        if (campoValor) campoValor.value = "";
      }

      atualizarResumo();

      // Rola até o simulador
      document.querySelector(".donation-summary")?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });

  // Botão que gera o PIX copia e cola com o valor escolhido
  const btnPix = document.getElementById("btnPixCopiaCola");
  if (btnPix && typeof gerarPixCopiaCola === "function") {
    btnPix.addEventListener("click", async () => {
      if (!valorSelecionado || valorSelecionado < 1) {
        avisar("Escolha um valor para gerar o PIX.");
        if (valorOutro) valorOutro.focus();
        return;
      }

      const codigo = gerarPixCopiaCola(valorSelecionado);
      const copiou = await copiarTexto(codigo);

      avisar(
        copiou
          ? `PIX de ${formatarReal(valorSelecionado)} copiado! Cole no seu banco.`
          : "Não foi possível copiar automaticamente. Use o campo abaixo."
      );

      // Mostra o código em um campo, para copiar manualmente se precisar
      let caixa = document.getElementById("caixaCopiaPix");
      if (!caixa) {
        caixa = document.createElement("div");
        caixa.id = "caixaCopiaPix";
        caixa.className = "field";
        caixa.style.marginTop = "1rem";
        caixa.innerHTML =
          '<label for="codigoPix">Código PIX copia e cola</label>' +
          '<textarea id="codigoPix" rows="3" readonly></textarea>';
        btnPix.insertAdjacentElement("afterend", caixa);
      }
      document.getElementById("codigoPix").value = codigo;
    });
  }

  // Ao mudar o valor manualmente pelo "Escolher outro valor"
  atualizarResumo();
}
