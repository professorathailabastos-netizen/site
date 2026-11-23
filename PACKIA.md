# PACKIA.md — combinados do projeto

## Sobre o projeto
Site da **Associação de Vestibulandos da Bahia — Anésia Cauaçu**
(Cursinho Pré-Vestibular Comunitário Anésia Cauaçu), Jequié/BA.
Projeto social sem fins lucrativos, fundado em 2021.

Site feito em HTML, CSS e JavaScript puros (sem framework, sem build).

## Dados oficiais já configurados
- **WhatsApp:** 73 99820-5303 → `5573998205303`
- **Chave PIX:** CNPJ `48.013.739/0001-64`
- **Nome no PIX:** ASSOCIACAO ANESIA CAUACU / cidade JEQUIE (em `js/pix.js`)
- **Instagram:** @anesiacauacubahia

## Páginas
- `index.html` — home: sobre, impacto, cursos, galeria, inscrições, FAQ, contato
- `doacoes.html` — PIX (com gerador copia e cola), valores, parcerias, transparência
- `multiplicadores.html` — cadastro "Seja um multiplicador de oportunidades"

## Identidade visual
Marrom, amarelo e branco. Variáveis no topo de `css/styles.css`
(`--brown-900`, `--gold-500` etc). Fontes: Fraunces (títulos) e Inter (texto).

## DECISÃO TOMADA: hospedagem (Opção A)
**Netlify (grátis) + Decap CMS + domínio próprio `anesiacauacu.com.br`** (já comprado).
Escolhida porque: site já pronto, custo zero de mensalidade, rápido no celular,
e a usuária consegue editar textos e fotos sozinha pelo painel `/admin`.

Descartados: Wix e WordPress (exigiriam refazer o site do zero e têm mensalidade).

## FEITO (nesta conversa)
- Painel de edição criado: `admin/index.html` + `admin/config.yml` (testado, sem erros)
- **Três páginas ligadas ao painel**: home, doações e multiplicadores
  - `conteudo/home.yml`, `conteudo/doacoes.yml`, `conteudo/multiplicadores.yml`
  - `conteudo/config.yml` (WhatsApp, PIX, redes)
- `js/yaml.js` — leitor de YAML próprio (suporta listas de objetos e blocos `>-`)
- `js/conteudo.js` — lê o YAML da página certa e preenche tudo
- `netlify.toml`, `404.html` criados
- `GUIA-PUBLICAR.md` — guia passo a passo para publicar no ar
- Domínio `anesiacauacu.com.br` comprado pela usuária
- Usuária criou conta no GitHub (e-mail Gmail)

## PRÓXIMOS PASSOS (a usuária executa, seguindo GUIA-PUBLICAR.md)
1. Subir o projeto no GitHub (repositório público `anesia-cauacu`)
2. Conectar no Netlify (publish = ".", sem build)
3. Ativar **Identity** + **Git Gateway**
4. Convidar o e-mail Gmail como usuária do painel
5. Testar `/admin`
6. Trocar os DNS no Registro.br pelos do Netlify
7. Ativar HTTPS

## Pendências de conteúdo
- Números (56 cidades, 1500 inscrições/ano) vieram de notícias — confirmar se estão atuais.
- Lista de cidades em `multiplicadores.html` é ilustrativa — trocar pelas reais.
- Verificar se o auxílio de R$ 200 (CPOP/MEC) ainda vale em 2026.
- Pedir logo em alta resolução e fotos das aulas (a logo atual veio do Instagram, 150x150).

## Regras de trabalho
- Explicar em português simples, sem jargão (a usuária não é programadora).
- Nunca apagar arquivos nem alterar configurações do sistema sem pedir.
- Arquivos grandes: usar `edit_file` em trechos, nunca reescrever tudo.

## Notas técnicas do ambiente
- Python e Node **não estão instalados** e o winget não está disponível.
- Para testar localmente, use `.packia_servidor.ps1` (servidor em PowerShell na porta 8080):
  `powershell -ExecutionPolicy Bypass -File ".packia_servidor.ps1"`
- Não é possível ler o Instagram automaticamente (exige login); usar
  `r.jina.ai/https://www.instagram.com/PERFIL/embed/` para ver conteúdo público.
