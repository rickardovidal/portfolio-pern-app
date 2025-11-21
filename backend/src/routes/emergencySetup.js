// src/routes/emergencySetup.js
const express = require('express');
const router = express.Router();
const Utilizador = require('../models/Utilizador');

// Endpoint de emergência para criar admin
router.post('/create-admin', async (req, res) => {
    try {
        console.log('🚨 CRIAÇÃO DE EMERGÊNCIA DO ADMIN');
        
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

        // Verificar se já existe
        const existingAdmin = await Utilizador.findOne({
            where: { username: adminUsername }
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
            username: adminUsername,
            email: adminEmail,
            password: adminPassword // Será automaticamente hasheada pelo modelo
        });
        
        console.log('✅ Admin criado com sucesso!');
        
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

// Endpoint para verificar se admin existe
router.get('/check-admin', async (req, res) => {
    try {
        const adminUsername = process.env.ADMIN_USERNAME || 'admin';
        
        const admin = await Utilizador.findOne({
            where: { username: adminUsername }
        });
        
        res.json({
            success: true,
            adminExists: admin !== null,
            admin: admin ? {
                id: admin.idUtilizador,
                username: admin.username,
                email: admin.email,
                createdAt: admin.createdAt
            } : null
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao verificar admin',
            error: error.message
        });
    }
});

module.exports = router;
