// Carregar variáveis de ambiente PRIMEIRO
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const defineAssociations = require('./models/associations');

const app = express();

// Middlewares básicos
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Definir associações entre modelos
defineAssociations();

// Importar rotas
const authRoutes = require('./routes/authRoutes');
const clientesRoutes = require('./routes/clientesRoutes');
const projetosRoutes = require('./routes/projetosRoutes');
const tiposClientesRoutes = require('./routes/tiposClientesRoutes');
const tiposServicosRoutes = require('./routes/tiposServicosRoutes');
const servicosRoutes = require('./routes/servicosRoutes');
const projetosServicosRoutes = require('./routes/projetosServicosRoutes');
const tarefasRoutes = require('./routes/tarefasRoutes');
const faturasRoutes = require('./routes/faturasRoutes');
const pagamentosRoutes = require('./routes/pagamentosRoutes');
const documentosRoutes = require('./routes/documentosRoutes');
const utilizadoresRoutes = require('./routes/utilizadoresRoutes');
const estadosProjetoRoutes = require('./routes/estadosProjetoRoutes');
const contactRoutes = require('./routes/contactRoutes');
const initRoutes = require('./routes/initRoutes');
const emergencySetup = require('./routes/emergencySetup');

// NOVA ROTA: Rota base para /api
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'Portfolio API - Backend do Ricardo Vidal',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        endpoints: {
            health: '/api/health',
            auth: '/api/auth',
            clientes: '/api/clientes',
            projetos: '/api/projetos',
            'tipos-clientes': '/api/tipos-clientes',
            'tipos-servicos': '/api/tipos-servicos',
            servicos: '/api/servicos',
            'projetos-servicos': '/api/projetos-servicos',
            tarefas: '/api/tarefas',
            faturas: '/api/faturas',
            pagamentos: '/api/pagamentos',
            documentos: '/api/documentos',
            utilizadores: '/api/utilizadores',
            'estados-projeto': '/api/estados-projeto',
            contact: '/api/contact',
        },
        author: 'Ricardo Vidal',
        institution: 'Instituto Politécnico de Viseu - ESTGV',
        course: 'Tecnologias e Design Multimédia'
    });
});

// Usar as rotas diretamente no app
app.use('/api/auth', authRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/projetos', projetosRoutes);
app.use('/api/tipos-clientes', tiposClientesRoutes);
app.use('/api/tipos-servicos', tiposServicosRoutes);
app.use('/api/servicos', servicosRoutes);
app.use('/api/projetos-servicos', projetosServicosRoutes);
app.use('/api/tarefas', tarefasRoutes);
app.use('/api/faturas', faturasRoutes);
app.use('/api/pagamentos', pagamentosRoutes);
app.use('/api/documentos', documentosRoutes);
app.use('/api/utilizadores', utilizadoresRoutes);
app.use('/api/estados-projeto', estadosProjetoRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/init', initRoutes);
app.use('/api/emergency', emergencySetup);

// Rota de teste
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'API está funcional',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        database: {
            host: process.env.DB_HOST || 'localhost',
            name: process.env.DB_NAME || 'portfolio'
        }
    });
});

// Middleware de erro global
app.use((error, req, res, next) => {
    console.error('Erro não tratado:', error);
    res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Rota não encontrada',
        path: req.originalUrl
    });
});

const PORT = process.env.PORT || 3000;

// Função para iniciar o servidor
async function startServer() {
    try {
        // Testar conexão à base de dados
        console.log('A testar a conexão à base de dados...');
        await sequelize.authenticate();
        console.log('Conexão à base de dados estabelecida com sucesso!');

        // Sincronizar com a base de dados (NÃO força a recriação em produção)
        console.log('A sincronizar modelos com a base de dados...');
        await sequelize.sync({
            force: false, // NUNCA usar true em produção!
            alter: process.env.NODE_ENV === 'development' // Apenas em desenvolvimento
        });
        console.log('Modelos sincronizados com sucesso!');

        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`Servidor a correr na porta ${PORT}`);
            console.log(`API disponível em: http://localhost:${PORT}/api`);
            console.log(`Health check: http://localhost:${PORT}/api/health`);
            console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
        });

    } catch (error) {
        console.error('Erro ao iniciar servidor:', error);

        if (error.name === 'SequelizeConnectionError') {
            console.error(' Verifica se:');
            console.error('   - PostgreSQL está a correr');
            console.error('   - Base de dados "portfolio" existe');
            console.error('   - Credenciais no .env estão corretas');
        }

        process.exit(1);
    }
}

// Tratar encerramento gracioso
process.on('SIGINT', async () => {
    console.log('\n Encerrando servidor...');
    await sequelize.close();
    console.log(' Conexão à base de dados fechada.');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n Encerrando servidor...');
    await sequelize.close();
    console.log(' Conexão à base de dados fechada.');
    process.exit(0);
});

// Iniciar o servidor
startServer();

module.exports = app;