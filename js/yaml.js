/* ============================================================
   Leitor de YAML em JavaScript puro (sem dependências)
   Suporta: texto, números, booleanos, listas e listas de objetos.
   Baseado em pilha de indentação (mais confiável para nosso uso).
   ============================================================ */

function lerYaml(texto) {
  const brutas = texto.replace(/\r\n/g, "\n").split("\n");

  // ---------- 1. Pré-processamento ----------
  // Remove comentários e linhas vazias; resolve blocos de texto (>- , >, |-)
  const linhas = [];
  for (let i = 0; i < brutas.length; i++) {
    const l = brutas[i];

    if (/^\s*#/.test(l)) continue;          // comentário inteiro
    if (/^\s*$/.test(l)) continue;          // linha vazia

    const indent = l.match(/^(\s*)/)[1].length;

    // Chave com bloco de texto multilinha
    const mBloco = l.match(/^\s*([\w]+)\s*:\s*([>|])([-+]?)\s*$/);
    if (mBloco) {
      const chave = mBloco[1];
      const juntar = mBloco[2] === ">" ? " " : "\n";
      const partes = [];
      let j = i + 1;
      while (j < brutas.length) {
        const prox = brutas[j];
        if (prox.trim() === "") { j++; continue; }
        const indProx = prox.match(/^(\s*)/)[1].length;
        if (indProx > indent) { partes.push(prox.trim()); j++; }
        else break;
      }
      const valor = partes.join(juntar).replace(/\s+/g, " ").trim();
      linhas.push({ indent, chave, valor, tipo: "kv" });
      i = j - 1;
      continue;
    }

    // Item de lista ou chave simples
    linhas.push({ indent, texto: l, tipo: "cru" });
  }

  // ---------- 2. Conversão de valores ----------
  const valorDe = (v) => {
    v = v.trim();
    if (v === "" || v === "~" || v === "null") return null;
    if (v === "true") return true;
    if (v === "false") return false;
    if (/^-?\d+$/.test(v)) return parseInt(v, 10);
    if (/^-?\d*\.\d+$/.test(v)) return parseFloat(v);
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      return v.slice(1, -1);
    }
    return v;
  };

  // Converte uma linha "cru" em {chave, valor} ou {item}
  const parseLinha = (l) => {
    const t = l.texto.trim();
    const mItem = t.match(/^-\s*(.*)$/);
    if (mItem) return { tipo: "item", resto: mItem[1].trim() };
    const mKV = t.match(/^([\w]+)\s*:\s*(.*)$/);
    if (mKV) return { tipo: "kv", chave: mKV[1], valor: mKV[2].trim() };
    return { tipo: "ignorar" };
  };

  // ---------- 3. Parser recursivo ----------
  let pos = 0;

  function parseBloco(indentPai) {
    const obj = {};

    while (pos < linhas.length) {
      const l = linhas[pos];
      if (l.indent < indentPai) break;

      // Já resolvido como bloco de texto
      if (l.tipo === "kv") {
        obj[l.chave] = l.valor;
        pos++;
        continue;
      }

      const p = parseLinha(l);
      if (p.tipo === "item") break;        // lista pertence ao pai
      if (p.tipo === "ignorar") { pos++; continue; }

      const chave = p.chave;
      const resto = p.valor;

      // Lista? A próxima linha (mais indentada) começa com "-"
      const prox = linhas[pos + 1];
      const proxItem =
        prox && prox.tipo === "cru" && prox.indent > l.indent &&
        /^\s*-/.test(prox.texto);

      if (resto === "" && proxItem) {
        pos++;
        obj[chave] = parseLista(prox.indent);
        continue;
      }

      if (resto === "") {
        // Objeto aninhado
        pos++;
        const proxKV = linhas[pos];
        if (proxKV && proxKV.indent > l.indent) {
          obj[chave] = parseBloco(proxKV.indent);
        } else {
          obj[chave] = null;
        }
        continue;
      }

      obj[chave] = valorDe(resto);
      pos++;
    }

    return obj;
  }

  function parseLista(indentLista) {
    const arr = [];

    while (pos < linhas.length) {
      const l = linhas[pos];
      if (l.tipo !== "cru") break;
      if (l.indent < indentLista) break;
      if (!/^\s*-/.test(l.texto)) break;

      const p = parseLinha(l);
      if (!p || p.tipo !== "item") break;

      const resto = p.resto;
      pos++;

      if (resto === "") {
        // Objeto que começa na próxima linha
        const prox = linhas[pos];
        if (prox && prox.indent > l.indent) {
          arr.push(parseBloco(prox.indent));
        } else {
          arr.push(null);
        }
        continue;
      }

      // "- chave: valor" → item de objeto
      const mKV = resto.match(/^([\w]+)\s*:\s*(.*)$/);
      if (mKV) {
        const item = {};
        item[mKV[1]] = valorDe(mKV[2]);

        // Campos seguintes deste mesmo objeto
        while (pos < linhas.length) {
          const s = linhas[pos];
          if (s.tipo !== "cru") break;
          if (s.indent <= l.indent) break;
          if (/^\s*-/.test(s.texto) && s.indent <= l.indent + 2) break;

          const sp = parseLinha(s);
          if (sp.tipo !== "kv") break;

          // Sub-lista dentro do objeto? (ex.: itens:)
          const depois = linhas[pos + 1];
          const temSubLista =
            sp.valor === "" && depois && depois.tipo === "cru" &&
            depois.indent > s.indent && /^\s*-/.test(depois.texto);

          pos++;
          if (temSubLista) {
            item[sp.chave] = parseLista(depois.indent);
          } else if (sp.valor === "") {
            const p2 = linhas[pos];
            if (p2 && p2.indent > s.indent) {
              item[sp.chave] = parseBloco(p2.indent);
            } else {
              item[sp.chave] = null;
            }
          } else {
            item[sp.chave] = valorDe(sp.valor);
          }
        }
        arr.push(item);
        continue;
      }

      // Item simples
      arr.push(valorDe(resto));
    }

    return arr;
  }

  return parseBloco(0);
}
