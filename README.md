# Portfolio PERN - Ricardo Vidal

## Descrição
Aplicação web full-stack desenvolvida com stack PERN (PostgreSQL, Express.js, React.js, Node.js) para gestão de portfolio profissional, incluindo projetos, clientes, serviços e sistema administrativo.

## Desenvolvedor
**Ricardo Vidal**  
Estudante de Tecnologias e Design Multimédia  
Instituto Politécnico de Viseu - Escola Superior de Tecnologia e Gestão de Viseu

## Tecnologias Utilizadas

### Backend
- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT (autenticação)
- Bcrypt (hash de passwords)
- Nodemailer (envio de emails)

### Frontend
- React.js (com Vite)
- Bootstrap 5
- Axios (cliente HTTP)
- React Router (navegação)
- SweetAlert2 (alertas)

## Funcionalidades
- Sistema de autenticação JWT
- Gestão de clientes e tipos de cliente
- Gestão de projetos e estados
- Gestão de serviços e tipos de serviço
- Sistema de tarefas
- Gestão de faturas e pagamentos
- Upload e gestão de documentos
- Formulário de contacto
- Dashboard administrativo

## Estrutura do Projeto
PORTFOLIO/
├── backend/          # API REST com Node.js e Express
├── frontend/         # Interface React com Vite
├── .gitignore       # Ficheiros a ignorar no Git
└── README.md        # Este ficheiro

## Configuração Local

### Pré-requisitos
- Node.js (versão 16 ou superior)
- PostgreSQL
- npm ou yarn

### Configuração do Backend
1. Navegar para a pasta backend
2. Instalar dependências: `npm install`
3. Configurar ficheiro `.env` com as variáveis de base de dados
4. Executar: `npm run dev`

### Configuração do Frontend
1. Navegar para a pasta frontend
2. Instalar dependências: `npm install`
3. Configurar ficheiro `.env` com URL da API
4. Executar: `npm run dev`

## Deploy
- Backend e Base de Dados: Render
- Frontend: Vercel

## Licença
Projeto académico desenvolvido no âmbito do curso de Tecnologias e Design Multimédia.

## Contacto
Para questões sobre este projeto, contactar: ricardojmv95@gmail.com