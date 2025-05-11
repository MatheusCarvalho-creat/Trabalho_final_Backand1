const produtosService = require('../services/produtosService');

// 📌 Buscar todos os produtos
async function getProdutos(req, res) {
    try {
        const produtos = await produtosService.getProdutos(); // Chama o serviço para buscar os produtos
        if (produtos && produtos.length > 0) {
            res.status(200).json(produtos); // Retorna a lista de produtos com status 200
        } else {
            res.status(400).json({ message: 'Nenhum produto encontrado' }); // Retorna erro 400 se não houver produtos
        }
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).json({ message: 'Erro ao buscar produtos' });
    }
}

// 📌 Buscar um produto por ID
async function getProdutoById(req, res) {
    const { id } = req.params;
    try {
        const produto = await produtosService.getProdutoById(id); // Chama o serviço para buscar o produto por ID
        if (produto) {
            res.status(200).json(produto); // Produto encontrado, retorna com status 200
        } else {
            res.status(400).json({ message: 'Produto não encontrado' }); // Produto não encontrado, retorna erro 400
        }
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        res.status(500).json({ message: 'Erro ao buscar produto' });
    }
}

// 📌 Adicionar um novo produto
async function addProduto(req, res) {
    const { nome, descricao, preco, quantidade } = req.body;
    if (!nome || !descricao || !preco || !quantidade) {
    // Validação simples para verificar se todos os campos foram fornecidos
        return res
            .status(400)
            .json({ message: 'Todos os campos são obrigatórios' });
    }

    try {
        const novoProdutoId = await produtosService.addProduto({
            nome,
            descricao,
            preco,
            quantidade,
        }); // Chama o serviço para adicionar um novo produto
        res
            .status(201)
            .json({ message: 'Produto criado com sucesso', id: novoProdutoId }); // Retorna o ID do produto criado
    } catch (error) {
        console.error('Erro ao cadastrar produto:', error);
        res.status(500).json({ message: 'Erro ao cadastrar produto' });
    }
}

// 📌 Atualizar um produto
async function updateProduto(req, res) {
    const { id } = req.params;
    const { nome, descricao, preco, quantidade } = req.body;
    if (!nome || !descricao || !preco || !quantidade) {
    // Validação simples para verificar se todos os campos foram fornecidos
        return res
            .status(400)
            .json({ message: 'Todos os campos são obrigatórios' });
    }

    try {
        const updatedRows = await produtosService.updateProduto(id, {
            nome,
            descricao,
            preco,
            quantidade,
        }); // Chama o serviço para atualizar o produto
        if (updatedRows > 0) {
            res.status(200).json({ message: 'Produto atualizado com sucesso' }); // Produto atualizado com sucesso
        } else {
            res.status(400).json({ message: 'Produto não encontrado' }); // Produto não encontrado
        }
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        res.status(500).json({ message: 'Erro ao atualizar produto' });
    }
}

// 📌 Deletar um produto
async function deleteProduto(req, res) {
    const { id } = req.params;
    try {
        const deletedRows = await produtosService.deleteProduto(id); // Chama o serviço para deletar o produto
        if (deletedRows > 0) {
            res.status(200).json({ message: 'Produto deletado com sucesso' }); // Produto deletado com sucesso
        } else {
            res.status(400).json({ message: 'Produto não encontrado' }); // Produto não encontrado
        }
    } catch (error) {
        console.error('Erro ao deletar produto:', error);
        res.status(500).json({ message: 'Erro ao deletar produto' });
    }
}

module.exports = {
    getProdutos,
    getProdutoById,
    addProduto,
    updateProduto,
    deleteProduto,
};
