// Carregar variáveis de ambiente PRIMEIRO
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const defineAssociations = require('./models/associations');
const Utilizador = require('./models/Utilizador');

const app = express();

// ✅ CORRIGIDO: Configuração CORS mais específica para produção
const corsOptions = {
    origin: [
        'http://localhost:5173', // Desenvolvimento local (Vite)
        'http://localhost:3000', // Desenvolvimento alternativo
        'https://portfolio-pern-app-ricardo.vercel.app', // ✅ URL do frontend no Vercel
        'https://vercel.app', // ✅ Domínio adicional do Vercel
        'https://*.vercel.app' // ✅ Subdomínios do Vercel
    ],
    credentials: true, // ✅ Importante para autenticação JWT
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// ✅ ADICIONADO: Middleware de CORS mais robusto
app.use(cors(corsOptions));

// ✅ ADICIONADO: Headers de CORS manuais para maior compatibilidade
app.use((req, res, next) => {
    const origin = req.headers.origin;
    
    // Lista de origens permitidas
    const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://portfolio-pern-app-ricardo.vercel.app'
    ];
    
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
        return;
    }
    
    next();
});

// Middlewares básicos
app.use(express.json({ limit: '10mb' })); // ✅ AUMENTADO limite para uploads
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ ADICIONADO: Middleware de debug para produção
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Body:', JSON.stringify(req.body, null, 2));
    }
    next();
});

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
        environment: process.env.NODE_ENV || 'development',
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

// ✅ CORRIGIDO: Rota de teste melhorada
app.get('/api/health', async (req, res) => {
    try {
        // Testar conexão à base de dados
        await sequelize.authenticate();
        
        res.json({
            success: true,
            message: 'API está funcional',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
            database: {
                status: 'conectada',
                host: process.env.DB_HOST || 'localhost',
                name: process.env.DB_NAME || 'portfolio'
            },
            version: '1.0.0'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro na base de dados',
            error: error.message
        });
    }
});

// ✅ ADICIONADO: Endpoint de teste específico para clientes
app.get('/api/test/clientes', async (req, res) => {
    try {
        const Clientes = require('./models/Clientes');
        const Tipos_Clientes = require('./models/Tipos_Clientes');
        
        const clientes = await Clientes.findAll({
            where: { ativo: true },
            include: [{
                model: Tipos_Clientes,
                as: "tipo"
            }]
        });
        
        res.json({
            success: true,
            message: 'Teste de clientes',
            count: clientes.length,
            data: clientes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Endpoint para criar utilizador admin
app.post('/api/emergency-create-admin', async (req, res) => {
    try {
        console.log('🚨 Criando utilizador admin...');
        
        // Verificar se já existe
        const existingAdmin = await Utilizador.findOne({
            where: { username: 'admin' }
        });
        
        if (existingAdmin) {
            return res.json({
                success: true,
                message: 'Admin já existe!',
                admin: {
                    id: existingAdmin.idUtilizador,
                    username: existingAdmin.username,
                    email: existingAdmin.email
                }
            });
        }
        
        // Criar admin
        const admin = await Utilizador.create({
            username: 'admin',
            email: 'admin@portfolio.com',
            password: 'odracirladiv'
        });
        
        console.log('✅ Admin criado:', admin.username);
        
        res.json({
            success: true,
            message: 'Admin criado com sucesso!',
            admin: {
                id: admin.idUtilizador,
                username: admin.username,
                email: admin.email
            }
        });
        
    } catch (error) {
        console.error('❌ Erro ao criar admin:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao criar admin',
            error: error.message
        });
    }
});

// Middleware de erro global
app.use((error, req, res, next) => {
    console.error('❌ Erro não tratado:', error);
    res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno'
    });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Rota não encontrada',
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        // ✅ ADICIONADO: Testar conexão à base de dados antes de iniciar
        console.log('🔌 Testando conexão à base de dados...');
        await sequelize.authenticate();
        console.log('✅ Conexão à base de dados estabelecida com sucesso!');
        
        // ✅ ADICIONADO: Sincronizar modelos (não forçar em produção)
        if (process.env.NODE_ENV !== 'production') {
            console.log('🔄 Sincronizando modelos...');
            await sequelize.sync({ alter: true });
            console.log('✅ Modelos sincronizados!');
        }
        
        app.listen(PORT, () => {
            console.log(`🚀 Servidor a correr na porta ${PORT}`);
            console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
            console.log(`📡 API disponível em: http://localhost:${PORT}/api`);
            console.log(`💾 Base de dados: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}`);
        });
        
    } catch (error) {
        console.error('❌ Erro ao iniciar servidor:', error);
        process.exit(1);
    }
}

startServer();