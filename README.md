# 🏎️ AutoPrime Veículos - Luxury & Performance Platform

Plataforma web moderna, responsiva e de alto padrão desenvolvida em **React 19**, **Vite**, **Node.js / Express** e **MySQL 8.0**, com identidade visual premium (*Preto Obsidian #0B0C10*, *Ouro Dourado #D4AF37* e *Branco Puro*).



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


## 🛠️ Tecnologias Utilizadas

* **Front-end:** React 19, Vite, Lucide Icons, Pure CSS Variables
* **Back-end:** Node.js, Express, Multer, Cors, Dotenv
* **Banco de Dados:** MySQL 8.0 (`mysql2/promise`)
* **Deploy Frontend:** Vercel / Netlify / Cloudflare Pages
* **Deploy Backend/Banco:** Railway / Render / Hostinger / AWS RDS

---

<div align="center">
  <br />
  <a href="https://lucasdoeni.github.io/AutoPrime-Veiculos/" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/▶%20EXECUTAR%20PROJETO-D4AF37?style=for-the-badge&logo=googlechrome&logoColor=0B0C10&labelColor=111318" alt="Executar AutoPrime" height="42" />
  </a>
  <br />
</div>

Desenvolvido para **AutoPrime Veículos**.
