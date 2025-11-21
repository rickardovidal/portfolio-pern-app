// src/routes/initRoutes.js
const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');
const defineAssociations = require('../models/associations');

// Importar modelos
const Utilizador = require('../models/Utilizador');
const Tipos_Clientes = require('../models/Tipos_Clientes');
const Estados_Projeto = require('../models/Estados_Projeto');
const Tipos_Servicos = require('../models/tipos_servicos');

const initController = {
    // Verificar se a base de dados está inicializada
    checkDatabase: async (req, res) => {
        try {
            console.log('🔍 Verificando estado da base de dados...');

            const adminUsername = process.env.ADMIN_USERNAME || 'admin';
            
            // Verificar se existe utilizador admin
            const adminUser = await Utilizador.findOne({
                where: { username: adminUsername }
            });

            const userCount = await Utilizador.count();
            const clientTypeCount = await Tipos_Clientes.count();
            const projectStateCount = await Estados_Projeto.count();

            res.json({
                success: true,
                database: {
                    initialized: adminUser !== null,
                    adminExists: adminUser !== null,
                    userCount,
                    clientTypeCount,
                    projectStateCount
                },
                message: adminUser ? 'Base de dados inicializada' : 'Base de dados não inicializada'
            });

        } catch (error) {
            console.error('Erro ao verificar base de dados:', error);
            res.status(500).json({
                success: false,
                message: 'Erro ao verificar base de dados',
                error: error.message
            });
        }
    },

    // Inicializar dados essenciais
    initializeDatabase: async (req, res) => {
        try {
            console.log('🚀 Iniciando inicialização da base de dados...');

            // Obter credenciais das variáveis de ambiente
            const adminUsername = process.env.ADMIN_USERNAME;
            const adminEmail = process.env.ADMIN_EMAIL;
            const adminPassword = process.env.ADMIN_PASSWORD;

            // Validar se as variáveis de ambiente estão configuradas
            if (!adminUsername || !adminEmail || !adminPassword) {
                return res.status(500).json({
                    success: false,
                    message: 'Variáveis de ambiente ADMIN_USERNAME, ADMIN_EMAIL e ADMIN_PASSWORD devem estar configuradas'
                });
            }

            // Definir associações
            defineAssociations();

            // Sincronizar modelos (sem forçar recriação)
            await sequelize.sync({ alter: false });
            console.log('✅ Modelos sincronizados');

            // Verificar se já existe admin
            const existingAdmin = await Utilizador.findOne({
                where: { username: adminUsername }
            });

            if (existingAdmin) {
                return res.json({
                    success: true,
                    message: 'Base de dados já inicializada',
                    data: {
                        adminExists: true,
                        userCount: await Utilizador.count()
                    }
                });
            }

            // Criar utilizador admin
            const admin = await Utilizador.create({
                username: adminUsername,
                email: adminEmail,
                password: adminPassword
            });
            console.log('✅ Utilizador admin criado');

            // Criar tipos de cliente
            const tiposCliente = await Promise.all([
                Tipos_Clientes.findOrCreate({
                    where: { designacaoTipo_cliente: 'Particular' },
                    defaults: { designacaoTipo_cliente: 'Particular' }
                }),
                Tipos_Clientes.findOrCreate({
                    where: { designacaoTipo_cliente: 'Empresa' },
                    defaults: { designacaoTipo_cliente: 'Empresa' }
                })
            ]);
            console.log('✅ Tipos de cliente criados');

            // Criar estados de projeto
            const estadosProjeto = await Promise.all([
                Estados_Projeto.findOrCreate({
                    where: { designacaoEstado_Projeto: 'Iniciado' },
                    defaults: { designacaoEstado_Projeto: 'Iniciado' }
                }),
                Estados_Projeto.findOrCreate({
                    where: { designacaoEstado_Projeto: 'Pendente' },
                    defaults: { designacaoEstado_Projeto: 'Pendente' }
                }),
                Estados_Projeto.findOrCreate({
                    where: { designacaoEstado_Projeto: 'Em Andamento' },
                    defaults: { designacaoEstado_Projeto: 'Em Andamento' }
                }),
                Estados_Projeto.findOrCreate({
                    where: { designacaoEstado_Projeto: 'Concluído' },
                    defaults: { designacaoEstado_Projeto: 'Concluído' }
                }),
                Estados_Projeto.findOrCreate({
                    where: { designacaoEstado_Projeto: 'Desativado' },
                    defaults: { designacaoEstado_Projeto: 'Desativado' }
                })
            ]);
            console.log('✅ Estados de projeto criados');

            // Criar tipos de serviços
            const tiposServico = await Promise.all([
                Tipos_Servicos.findOrCreate({
                    where: { designacaoTipo_Servico: 'Design Gráfico' },
                    defaults: { designacaoTipo_Servico: 'Design Gráfico' }
                }),
                Tipos_Servicos.findOrCreate({
                    where: { designacaoTipo_Servico: 'Desenvolvimento Web' },
                    defaults: { designacaoTipo_Servico: 'Desenvolvimento Web' }
                }),
                Tipos_Servicos.findOrCreate({
                    where: { designacaoTipo_Servico: 'Motion Design' },
                    defaults: { designacaoTipo_Servico: 'Motion Design' }
                })
            ]);
            console.log('✅ Tipos de serviços criados');

            res.json({
                success: true,
                message: 'Base de dados inicializada com sucesso!',
                data: {
                    admin: {
                        id: admin.idUtilizador,
                        username: admin.username,
                        email: admin.email
                    },
                    counts: {
                        users: await Utilizador.count(),
                        clientTypes: await Tipos_Clientes.count(),
                        projectStates: await Estados_Projeto.count(),
                        serviceTypes: await Tipos_Servicos.count()
                    }
                }
            });

        } catch (error) {
            console.error('Erro durante inicialização:', error);
            res.status(500).json({
                success: false,
                message: 'Erro durante inicialização da base de dados',
                error: error.message
            });
        }
    },

    // Reset da password do admin (para emergências)
    resetAdminPassword: async (req, res) => {
        try {
            console.log('🔧 Resetting admin password...');

            const adminUsername = process.env.ADMIN_USERNAME;
            const adminPassword = process.env.ADMIN_PASSWORD;

            // Validar se as variáveis de ambiente estão configuradas
            if (!adminUsername || !adminPassword) {
                return res.status(500).json({
                    success: false,
                    message: 'Variáveis de ambiente ADMIN_USERNAME e ADMIN_PASSWORD devem estar configuradas'
                });
            }

            const admin = await Utilizador.findOne({
                where: { username: adminUsername }
            });

            if (!admin) {
                return res.status(404).json({
                    success: false,
                    message: 'Utilizador admin não encontrado'
                });
            }

            // Actualizar password
            await admin.update({
                password: adminPassword
            });

            res.json({
                success: true,
                message: 'Password do admin redefinida com sucesso'
            });

        } catch (error) {
            console.error('Erro ao redefinir password:', error);
            res.status(500).json({
                success: false,
                message: 'Erro ao redefinir password',
                error: error.message
            });
        }
    }
};

// Rotas
router.get('/check', initController.checkDatabase);
router.post('/setup', initController.initializeDatabase);
router.post('/reset-admin', initController.resetAdminPassword);

module.exports = router;