// src/routes/emergencySetup.js
const express = require('express');
const router = express.Router();
const Utilizador = require('../models/Utilizador');

// Endpoint de emergência para criar admin
router.post('/create-admin', async (req, res) => {
    try {
        console.log('🚨 CRIAÇÃO DE EMERGÊNCIA DO ADMIN');
        
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
            password: 'odracirladiv' // Será automaticamente hasheada pelo modelo
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
        const admin = await Utilizador.findOne({
            where: { username: 'admin' }
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