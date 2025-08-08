// associations.js - Definir as associações entre modelos de forma simples

// Importar todos os modelos
const Clientes = require('./Clientes');
const Projetos = require('./Projetos');
const Servicos = require('./Servicos');
const Projetos_Servicos = require('./Projetos_servicos');
const Tarefas = require('./Tarefas');
const Faturas = require('./Faturas');
const Pagamentos = require('./Pagamentos');
const Documentos = require('./Documentos');
const Estados_Projeto = require('./Estados_Projeto');
const Tipos_Clientes = require('./Tipos_Clientes');
const Tipos_Servicos = require('./tipos_servicos');

function defineAssociations() {
    
    // 1. TIPOS_CLIENTES ↔ CLIENTES (1:N) - ADICIONADO
    // Um tipo de cliente pode ter muitos clientes
    Tipos_Clientes.hasMany(Clientes, {
        foreignKey: 'idTipo_Cliente',
        as: 'clientes'
    });
    
    // Cada cliente tem um tipo
    Clientes.belongsTo(Tipos_Clientes, {
        foreignKey: 'idTipo_Cliente',
        as: 'tipo'
    });

    // 2. CLIENTE ↔ PROJETOS (1:N)
    // Um cliente pode ter muitos projetos
    Clientes.hasMany(Projetos, {
        foreignKey: 'idCliente',
        as: 'projetos'
    });
    
    // Cada projeto pertence a um cliente
    Projetos.belongsTo(Clientes, {
        foreignKey: 'idCliente',
        as: 'cliente'
    });

    // 3. ESTADOS_PROJETO ↔ PROJETOS (1:N)
    // Um estado pode estar em muitos projetos
    Estados_Projeto.hasMany(Projetos, {
        foreignKey: 'idEstado_Projeto',
        as: 'projetos'
    });
    
    // Cada projeto tem um estado
    Projetos.belongsTo(Estados_Projeto, {
        foreignKey: 'idEstado_Projeto',
        as: 'estado'
    });

    // 4. TIPOS_SERVICOS ↔ SERVICOS (1:N)
    // Um tipo de serviço pode ter muitos serviços
    Tipos_Servicos.hasMany(Servicos, {
        foreignKey: 'idTipo_Servico',
        as: 'servicos'
    });
    
    // Cada serviço tem um tipo
    Servicos.belongsTo(Tipos_Servicos, {
        foreignKey: 'idTipo_Servico',
        as: 'tipo'
    });

    // 5. PROJETOS ↔ SERVICOS (N:M através de PROJETOS_SERVICOS)
    // Um projeto pode ter muitos serviços
    Projetos.belongsToMany(Servicos, {
        through: Projetos_Servicos,
        foreignKey: 'idProjeto',
        otherKey: 'idServico',
        as: 'servicos'
    });
    
    // Um serviço pode estar em muitos projetos
    Servicos.belongsToMany(Projetos, {
        through: Projetos_Servicos,
        foreignKey: 'idServico',
        otherKey: 'idProjeto',
        as: 'projetos'
    });

    // 6. ASSOCIAÇÕES DIRETAS PARA PROJETOS_SERVICOS
    // Para poder fazer queries diretas na tabela de associação
    Projetos_Servicos.belongsTo(Projetos, {
        foreignKey: 'idProjeto',
        as: 'projeto'
    });
    
    Projetos_Servicos.belongsTo(Servicos, {
        foreignKey: 'idServico',
        as: 'servico'
    });

    // 7. PROJETOS ↔ TAREFAS (1:N)
    // Um projeto pode ter muitas tarefas
    Projetos.hasMany(Tarefas, {
        foreignKey: 'idProjeto',
        as: 'tarefas'
    });
    
    // Cada tarefa pertence a um projeto
    Tarefas.belongsTo(Projetos, {
        foreignKey: 'idProjeto',
        as: 'projeto'
    });

    // 8. PROJETOS ↔ FATURAS (1:N)
    // Um projeto pode ter muitas faturas
    Projetos.hasMany(Faturas, {
        foreignKey: 'idProjeto',
        as: 'faturas'
    });
    
    // Cada fatura pertence a um projeto
    Faturas.belongsTo(Projetos, {
        foreignKey: 'idProjeto',
        as: 'projeto'
    });

    // 9. FATURAS ↔ PAGAMENTOS (1:N)
    // Uma fatura pode ter muitos pagamentos
    Faturas.hasMany(Pagamentos, {
        foreignKey: 'idFatura',
        as: 'pagamentos'
    });
    
    // Cada pagamento pertence a uma fatura
    Pagamentos.belongsTo(Faturas, {
        foreignKey: 'idFatura',
        as: 'fatura'
    });

    // 10. PROJETOS ↔ DOCUMENTOS (1:N)
    // Um projeto pode ter muitos documentos
    Projetos.hasMany(Documentos, {
        foreignKey: 'idProjeto',
        as: 'documentos'
    });
    
    // Cada documento pertence a um projeto
    Documentos.belongsTo(Projetos, {
        foreignKey: 'idProjeto',
        as: 'projeto'
    });

    // 11. FATURAS ↔ DOCUMENTOS (1:N) - OPCIONAL
    // Uma fatura pode ter muitos documentos
    Faturas.hasMany(Documentos, {
        foreignKey: 'idFatura',
        as: 'documentos'
    });
    
    // Cada documento pode pertencer a uma fatura (opcional)
    Documentos.belongsTo(Faturas, {
        foreignKey: 'idFatura',
        as: 'fatura'
    });
}

// Exportar a função para ser chamada no ficheiro principal
module.exports = defineAssociations;