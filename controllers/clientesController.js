const clientesService = require('../services/clientesService');
const clientesView = require('../views/clientesView');

async function getClientes(req, res) {
    try {
        const clientes = await clientesService.getClientes();
        res.status(200).json(clientesView.formatClientes(clientes));
    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        res.status(400).json({ error: 'Erro ao buscar clientes' });
    }
}

async function getClienteById(req, res) {
    const { id } = req.params;
    try {
        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const cliente = await clientesService.getClienteById(id);
        if (!cliente) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }

        res.status(200).json(clientesView.formatCliente(cliente));
    } catch (error) {
        console.error('Erro ao buscar cliente:', error);
        res.status(400).json({ error: 'Erro ao buscar cliente' });
    }
}

async function addCliente(req, res) {
    const { nome, sobrenome, email, idade } = req.body;

    if (!nome || !sobrenome || !email || !idade) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    try {
        const id = await clientesService.addCliente({
            nome,
            sobrenome,
            email,
            idade,
        });
        res.status(200).json({ message: 'Cliente cadastrado com sucesso!', id });
    } catch (error) {
        console.error('Erro ao cadastrar cliente:', error);
        res.status(400).json({ error: 'Erro ao cadastrar cliente' });
    }
}

async function updateCliente(req, res) {
    const { id } = req.params;
    const { nome, sobrenome, email, idade } = req.body;

    if (!nome || !sobrenome || !email || !idade) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    try {
        const affectedRows = await clientesService.updateCliente(id, {
            nome,
            sobrenome,
            email,
            idade,
        });

        if (affectedRows === 0) {
            return res.status(400).json({ error: 'Cliente não encontrado' });
        }

        res.status(200).json({ message: 'Cliente atualizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        res.status(400).json({ error: 'Erro ao atualizar cliente' });
    }
}

async function deleteCliente(req, res) {
    const { id } = req.params;
    try {
        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const affectedRows = await clientesService.deleteCliente(id);
        if (affectedRows === 0) {
            return res.status(400).json({ error: 'Cliente não encontrado' });
        }

        res.status(200).json({ message: 'Cliente excluído com sucesso!' });
    } catch (error) {
        console.error('Erro ao excluir cliente:', error);
        res.status(400).json({ error: 'Erro ao excluir cliente' });
    }
}

module.exports = {
    getClientes,
    getClienteById,
    addCliente,
    updateCliente,
    deleteCliente,
};
