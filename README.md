# 🏎️ AutoPrime Veículos - Luxury & Performance Platform

Plataforma web moderna, responsiva e de alto padrão desenvolvida em **React 19**, **Vite**, **Node.js / Express** e **MySQL 8.0**, com identidade visual premium (*Preto Obsidian #0B0C10*, *Ouro Dourado #D4AF37* e *Branco Puro*).

---

## 🏗️ Arquitetura do Sistema

```
[ FRONT-END (React 19 + Vite) ]          -> Porta 5173
       ↕ (API REST / JSON)
[ BACK-END (Node.js + Express + Multer) ] -> Porta 3001
       ↕ (Pool de Conexões TCP)
[ BANCO DE DADOS (MySQL 8.0) ]            -> Porta 3306 (autoprime_db)
```

---

## 🌟 Funcionalidades Principais

1. **Catálogo de Veículos & Filtros em Tempo Real:**
   - Filtros instantâneos por Categoria (SUV, Sedã, Esportivo, Picape), Marca, Faixa de Preço, Ano Mínimo e Busca Textual.
   - Ordenação dinâmica por preço, quilometragem, ano e relevância.
   - Visualização em cards de alto padrão com badges (*Blindado B33, Único Dono, Garantia*).

2. **Página Individual do Veículo (Showroom Digital):**
   - Galeria interativa com visualizador principal e miniaturas.
   - Ficha técnica completa de motorização, aceleração 0-100 km/h, torque, câmbio e consumo.
   - CTAs com mensagens contextualizadas direto no WhatsApp da concessionária.
   - Simulador de financiamento com parcelas e prazos customizáveis.

3. **📄 Gerador de Proposta Comercial / Ficha Técnica em PDF (VIP):**
   - Gera um dossiê executivo timbrado da concessionária com identificador único (ex: `AP-2023-BMW32`).
   - Personalização com nome do cliente em tempo real.
   - Diagramação calibrada para impressão oficial em folha A4 (`window.print()`).

4. **🤖 Consultor Virtual IA (Chatbot Inteligente):**
   - Assistente virtual com reconhecimento semântico em linguagem natural.
   - Entende comandos como *"Procuro um SUV blindado de até 800 mil para família"* e recomenda os veículos exatos do estoque em tempo real.

5. **🔒 Área do Lojista (Painel Administrativo Completo):**
   - Acesso seguro para gerenciamento do estoque.
   - Cadastro, edição e exclusão de veículos direto no banco **MySQL**.
   - **Upload Real de Fotos:** Upload de arquivos direto do computador ou smartphone, salvando no servidor e gerando URLs automáticas.
   - Alternância de destaques da página inicial.

6. **🗄️ Banco de Dados Relacional MySQL:**
   - Tabelas estruturadas: `vehicles`, `vehicle_images`, `vehicle_badges`, `vehicle_features`, `leads`, `users`.
   - Transações SQL para atomicidade de cadastro de veículos com fotos e opcionais.

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
* **Node.js** (v18 ou superior)
* **MySQL 8.0** ativo na máquina

### 1. Clonar o Repositório
```bash
git clone https://github.com/SEU_USUARIO/autoprime-veiculos.git
cd autoprime-veiculos
```

### 2. Instalar as Dependências
```bash
npm install
```

### 3. Configurar o Banco de Dados MySQL
1. Crie o arquivo `.env` na pasta `server/` baseado no `.env.example`:
```env
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_mysql
DB_NAME=autoprime_db
ADMIN_KEY=admin123
```

2. Execute o script de criação das tabelas e migração dos veículos iniciais:
```bash
# Executa o schema no MySQL
mysql -u root -p < server/schema.sql

# Popula os veículos de luxo iniciais
npm run seed
```

### 4. Executar o Projeto Completo (1 Comando)

Basta rodar no terminal:
```bash
npm run executar
```
*(Ou dar dois cliques no arquivo **`executar.bat`** no Windows).*

Esse comando inicia simultaneamente:
* 🟢 **API Backend com MySQL** na porta `http://localhost:3001`
* 🟢 **Front-End React** na porta `http://localhost:5173`
* 🌐 **Abre o seu navegador automaticamente** com o site da AutoPrime pronto!

> Também é possível rodar individualmente se preferir:
> * `npm run server` (apenas a API MySQL)
> * `npm run dev` (apenas o Front-End)

---

## 🛠️ Tecnologias Utilizadas

* **Front-end:** React 19, Vite, Lucide Icons, Pure CSS Variables
* **Back-end:** Node.js, Express, Multer, Cors, Dotenv
* **Banco de Dados:** MySQL 8.0 (`mysql2/promise`)
* **Deploy Frontend:** Vercel / Netlify / Cloudflare Pages
* **Deploy Backend/Banco:** Railway / Render / Hostinger / AWS RDS

---

Desenvolvido para **AutoPrime Veículos**.
