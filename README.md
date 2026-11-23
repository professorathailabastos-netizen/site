# Associação Anésia Cauaçu — site institucional

Site do Cursinho Pré-Vestibular Comunitário Anésia Cauaçu (Jequié, Bahia).
HTML, CSS e JavaScript puros + painel de edição (Decap CMS).

**Domínio:** anesiacauacu.com.br

---

## Como editar o site

Acesse **anesiacauacu.com.br/admin** e faça login. Você verá dois menus:

- **Página inicial** — todos os textos da home, fotos, números, cursos, depoimentos
- **Configurações do site** — WhatsApp, PIX e redes sociais

Alterou? Clique em **Publish**. O site atualiza em cerca de 30 segundos.

### O que dá para editar pelo painel
- Todos os textos da página inicial
- Foto principal e imagens
- Números (56 cidades, 1500 inscrições etc.)
- Cartões de cursos (adicionar ou remover)
- Depoimentos
- Quem pode se inscrever e documentos
- WhatsApp, chave PIX, redes sociais

### O que NÃO dá para editar pelo painel
- Cores, fontes, tamanhos e posição das seções → pedir ao Packia
- Página de doações e de multiplicadores (por enquanto)

---

## Como abrir o site no seu computador

Dê dois cliques em `index.html`. Sem o servidor, o painel não roda,
mas o site abre normalmente.

Para testar completo (inclusive o painel), peça ao Packia para iniciar o
servidor local.

---

## Estrutura de arquivos

```
index.html            Página inicial
doacoes.html          Doações (PIX, valores, transparência)
multiplicadores.html  Cadastro "Seja multiplicador"
404.html              Página de erro

admin/
  index.html          Painel de edição
  config.yml          Campos do painel (o que aparece para editar)

conteudo/
  home.yml            Textos da página inicial
  config.yml          WhatsApp, PIX, redes sociais

css/styles.css        Visual (cores, fontes, layout)
js/main.js            Menu, formulários, FAQ, doações
js/conteudo.js        Lê os arquivos de conteudo/ e preenche a página
js/pix.js             Gerador de PIX copia e cola

assets/uploads/       Fotos do Instagram e imagens do site
netlify.toml          Configuração da hospedagem
```

---

## Dados já configurados

| Item | Valor |
|---|---|
| WhatsApp | 73 99820-5303 (`5573998205303`) |
| PIX | CNPJ 48.013.739/0001-64 |
| Nome no PIX | ASSOCIACAO ANESIA CAUACU / JEQUIE |
| Instagram | @anesiacauacubahia |

---

## Identidade visual

Marrom, amarelo e branco. Variáveis no topo de `css/styles.css`:

- `--brown-900` `#2b1a10` — marrom escuro (topo, rodapé)
- `--brown-700` `#4e2f1d` — marrom médio
- `--gold-500` `#e8a720` — amarelo principal
- `--gold-400` `#f2b93c` — amarelo claro
- `--paper` `#fffdf9` — branco quente

Fontes: Fraunces (títulos) e Inter (texto).

---

## Publicação (Netlify)

1. Subir o projeto para o GitHub
2. Conectar o repositório no Netlify
3. Ativar **Identity** e **Git Gateway** (para o painel funcionar)
4. Convidar o e-mail da associação como usuário
5. Apontar o DNS do domínio no Registro.br para o Netlify

---

## Pendências de conteúdo

- Confirmar se os números (56 cidades, 1500 inscrições/ano) estão atuais
- Lista de cidades em `multiplicadores.html` é ilustrativa
- Verificar se o auxílio de R$ 200 (CPOP/MEC) ainda vale em 2026
- Logo em alta resolução e fotos das aulas

## Fontes da pesquisa

- Jequié News (27/06/2025) — seleção CPOP/MEC
- Câmara de Jequié (29/04/2025) — Moção de Aplausos, histórico
- Jequié News (11/03/2022) — primeira turma presencial
- Instagram @anesiacauacubahia
