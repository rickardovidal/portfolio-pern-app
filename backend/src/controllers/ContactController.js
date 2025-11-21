// src/controllers/ContactController.js  
const ContactMessages = require('../models/ContactMessages');
const { Resend } = require('resend');

const contactController = {

    // Listar todas as mensagens (para admin)
    listar: async (req, res) => {
        try {
            const { page = 1, limit = 10, status, search } = req.query;
            const offset = (page - 1) * limit;

            let whereClause = {};

            // Filtragem por status
            if (status && ['novo', 'lido', 'respondido', 'arquivado'].includes(status)) {
                whereClause.status = status;
            }

            // Pesquisa por nome, email ou assunto
            if (search) {
                const { Op } = require('sequelize');
                whereClause[Op.or] = [
                    { nome: { [Op.iLike]: `%${search}%` } },
                    { email: { [Op.iLike]: `%${search}%` } },
                    { assunto: { [Op.iLike]: `%${search}%` } }
                ];
            }

            const { count, rows } = await ContactMessages.findAndCountAll({
                where: whereClause,
                order: [['createdAt', 'DESC']],
                limit: parseInt(limit),
                offset: parseInt(offset),
                attributes: { exclude: ['ip_address'] } // Excluir dados sensíveis
            });

            res.json({
                success: true,
                data: {
                    messages: rows,
                    pagination: {
                        currentPage: parseInt(page),
                        totalPages: Math.ceil(count / limit),
                        totalMessages: count,
                        hasNextPage: offset + rows.length < count,
                        hasPrevPage: page > 1
                    }
                }
            });

        } catch (error) {
            console.error('Erro ao listar mensagens de contacto:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Obter mensagem por ID (para admin)
    obterPorId: async (req, res) => {
        try {
            const { id } = req.params;

            const message = await ContactMessages.findByPk(id);

            if (!message) {
                return res.status(404).json({
                    success: false,
                    message: 'Mensagem não encontrada'
                });
            }

            res.json({
                success: true,
                data: message
            });

        } catch (error) {
            console.error('Erro ao obter mensagem de contacto:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Criar nova mensagem de contacto 
    criar: async (req, res) => {
        try {
            const { nome, email, telefone, empresa, assunto, mensagem } = req.body;

            // Validação básica
            if (!nome || !email || !assunto || !mensagem) {
                return res.status(400).json({
                    success: false,
                    message: 'Campos obrigatórios: nome, email, assunto e mensagem'
                });
            }

            // Obter IP da requisição
            const ip_address = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];

            // Criar a mensagem na base de dados
            const newMessage = await ContactMessages.create({
                nome,
                email,
                telefone: telefone || null,
                empresa: empresa || null,
                assunto,
                mensagem,
                ip_address: ip_address?.split(',')[0] // Em caso de múltiplos IPs
            });

            // Tentar enviar email de notificação (não falhar se der erro)
            try {
                await contactController.enviarEmailNotificacao(newMessage);
                await contactController.enviarEmailConfirmacao(email, nome);
            } catch (emailError) {
                console.error('Erro ao enviar emails:', emailError);
                // Não falhar a criação da mensagem por causa do email
            }

            res.status(201).json({
                success: true,
                message: 'Mensagem enviada com sucesso! Entrarei em contacto brevemente.',
                data: {
                    id: newMessage.idContactMessage,
                    nome: newMessage.nome,
                    assunto: newMessage.assunto,
                    createdAt: newMessage.createdAt
                }
            });

        } catch (error) {
            console.error('Erro ao criar mensagem de contacto:', error);

            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({
                    success: false,
                    message: 'Dados inválidos',
                    errors: error.errors.map(err => err.message)
                });
            }

            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Atualizar status da mensagem (para admin)
    atualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!['novo', 'lido', 'respondido', 'arquivado'].includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Status inválido'
                });
            }

            const message = await ContactMessages.findByPk(id);
            if (!message) {
                return res.status(404).json({
                    success: false,
                    message: 'Mensagem não encontrada'
                });
            }

            await message.update({ status });

            res.json({
                success: true,
                message: 'Status actualizado com sucesso',
                data: message
            });

        } catch (error) {
            console.error('Erro ao actualizar mensagem:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Excluir mensagem (soft delete - apenas para admin)
    excluir: async (req, res) => {
        try {
            const { id } = req.params;

            const message = await ContactMessages.findByPk(id);
            if (!message) {
                return res.status(404).json({
                    success: false,
                    message: 'Mensagem não encontrada'
                });
            }

            await message.update({ status: 'arquivado' });

            res.json({
                success: true,
                message: 'Mensagem arquivada com sucesso'
            });

        } catch (error) {
            console.error('Erro ao arquivar mensagem:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Marcar como lida (para admin)
    marcarComoLida: async (req, res) => {
        try {
            const { id } = req.params;

            const message = await ContactMessages.findByPk(id);
            if (!message) {
                return res.status(404).json({
                    success: false,
                    message: 'Mensagem não encontrada'
                });
            }

            await message.update({ status: 'lido' });

            res.json({
                success: true,
                message: 'Mensagem marcada como lida',
                data: message
            });

        } catch (error) {
            console.error('Erro ao marcar como lida:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Função auxiliar para enviar email de notificação
    enviarEmailNotificacao: async (message) => {
        if (!process.env.RESEND_API_KEY) {
            console.warn('RESEND_API_KEY não definida');
            return;
        }

        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
            from: 'Portfolio <onboarding@resend.dev>',
            to: process.env.CONTACT_EMAIL || 'ricardojmv95@gmail.com',
            subject: `Nova mensagem de contacto: ${message.assunto}`,
            html: `
                <h2>Nova mensagem de contacto recebida</h2>
                <p><strong>Nome:</strong> ${message.nome}</p>
                <p><strong>Email:</strong> ${message.email}</p>
                ${message.telefone ? `<p><strong>Telefone:</strong> ${message.telefone}</p>` : ''}
                ${message.empresa ? `<p><strong>Empresa:</strong> ${message.empresa}</p>` : ''}
                <p><strong>Assunto:</strong> ${message.assunto}</p>
                <p><strong>Mensagem:</strong></p>
                <div style="border-left: 4px solid #0066cc; padding-left: 15px; margin: 15px 0;">
                    ${message.mensagem}
                </div>
                <p><small>Recebida em: ${new Date(message.createdAt).toLocaleString('pt-PT')}</small></p>
            `
        });
    },

    // Função auxiliar para enviar email de confirmação
    enviarEmailConfirmacao: async (email, nome) => {
        if (!process.env.RESEND_API_KEY) {
            return;
        }

        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
            from: 'Ricardo Vidal <onboarding@resend.dev>',
            to: email,
            subject: 'Mensagem recebida - Ricardo Vidal Portfolio',
            html: `
                <h2>Olá ${nome}!</h2>
                <p>Obrigado por entrar em contacto.</p>
                <p>Recebi a sua mensagem e entrarei em contacto brevemente.</p>
                <br>
                <p>Cumprimentos,</p>
                <p><strong>Ricardo Vidal</strong></p>
                <p>Designer Multimédia & Desenvolvedor</p>
            `
        });
    }
};

module.exports = contactController;