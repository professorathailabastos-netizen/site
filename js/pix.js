/* ============================================================
   Gerador de PIX "copia e cola" (padrão EMV do Banco Central)
   Sem dependências: calcula o CRC16 e monta o payload.
   ============================================================ */

const PIX_CONFIG = {
  chave: "48013739000164",              // CNPJ da associação (só números)
  nome: "ASSOCIACAO ANESIA CAUACU",     // máx. 25 caracteres, sem acentos
  cidade: "JEQUIE",                     // máx. 15 caracteres
  descricao: "DOACAO CURSINHO"
};

/* Calcula o CRC16/CCITT-FALSE exigido pelo padrão PIX */
function crc16(payload) {
  let crc = 0xFFFF;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
      crc &= 0xFFFF;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

/* Monta um campo no formato ID + tamanho + valor */
function campo(id, valor) {
  const tam = String(valor.length).padStart(2, "0");
  return `${id}${tam}${valor}`;
}

/* Remove acentos e caracteres inválidos */
function limpar(txt, max) {
  return txt
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9 ]/g, "")
    .toUpperCase()
    .slice(0, max)
    .trim();
}

/* Gera o código PIX copia e cola, com valor opcional */
function gerarPixCopiaCola(valor) {
  const cfg = PIX_CONFIG;

  // Merchant Account Information (ID 26)
  let conta =
    campo("00", "br.gov.bcb.pix") +
    campo("01", cfg.chave) +
    campo("02", limpar(cfg.descricao, 40));

  let payload =
    campo("00", "01") +                 // versão do payload
    campo("26", conta) +                // conta do recebedor
    campo("52", "0000") +               // categoria do estabelecimento
    campo("53", "986") +                // moeda: real
    (valor && valor > 0 ? campo("54", Number(valor).toFixed(2)) : "") +
    campo("58", "BR") +
    campo("59", limpar(cfg.nome, 25)) +
    campo("60", limpar(cfg.cidade, 15)) +
    campo("62", campo("05", "***")) +   // identificador da transação
    "6304";                             // cabeçalho do CRC

  return payload + crc16(payload);
}

/* Copia texto para a área de transferência com plano B */
async function copiarTexto(texto) {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    const campoTexto = document.createElement("textarea");
    campoTexto.value = texto;
    campoTexto.style.position = "fixed";
    campoTexto.style.left = "-9999px";
    document.body.appendChild(campoTexto);
    campoTexto.select();
    const ok = document.execCommand("copy");
    campoTexto.remove();
    return ok;
  }
}

/* Exibe um aviso curto na tela */
function avisar(mensagem) {
  let aviso = document.getElementById("avisoPix");
  if (!aviso) {
    aviso = document.createElement("div");
    aviso.id = "avisoPix";
    aviso.setAttribute("role", "status");
    aviso.style.cssText =
      "position:fixed;left:50%;bottom:1.5rem;transform:translateX(-50%);" +
      "background:#2b1a10;color:#fff;padding:.85rem 1.3rem;border-radius:999px;" +
      "font-family:Inter,sans-serif;font-size:.88rem;font-weight:600;z-index:999;" +
      "box-shadow:0 18px 36px -14px rgba(0,0,0,.6);max-width:90vw;text-align:center;";
    document.body.appendChild(aviso);
  }
  aviso.textContent = mensagem;
  aviso.style.opacity = "1";
  clearTimeout(aviso._timer);
  aviso._timer = setTimeout(() => {
    aviso.style.opacity = "0";
    aviso.style.transition = "opacity .3s ease";
  }, 3200);
}
