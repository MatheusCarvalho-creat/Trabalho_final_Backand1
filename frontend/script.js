const clientesLista = document.getElementById('clientes-lista');
const produtosLista = document.getElementById('produtos-lista');

document
    .getElementById('cliente-form')
    .addEventListener('submit', async (e) => {
        e.preventDefault();
        const nome = document.getElementById('nome').value;
        const sobrenome = document.getElementById('sobrenome').value;
        const email = document.getElementById('email').value;
        const idade = document.getElementById('idade').value;

        await fetch('http://localhost:3000/clientes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, sobrenome, email, idade }),
        });

        e.target.reset();
        Swal.fire('Sucesso!', 'Cliente cadastrado!', 'success');
        fetchClientes();
    });

document
    .getElementById('produto-form')
    .addEventListener('submit', async (e) => {
        e.preventDefault();
        const nome = document.getElementById('nome-produto').value;
        const descricao = document.getElementById('descricao-produto').value;
        const preco = document.getElementById('preco').value;
        const quantidade = document.getElementById('quantidade').value;

        await fetch('http://localhost:3000/produtos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, descricao, preco, quantidade }),
        });

        e.target.reset();
        Swal.fire('Sucesso!', 'Produto cadastrado!', 'success');
        fetchProdutos();
    });

async function fetchClientes() {
    const res = await fetch('http://localhost:3000/clientes');
    const clientes = await res.json();
    renderLista(clientes, clientesLista, 'cliente');
}

async function fetchProdutos() {
    const res = await fetch('http://localhost:3000/produtos');
    const produtos = await res.json();
    renderLista(produtos, produtosLista, 'produto');
}

function renderLista(itens, container, tipo) {
    container.innerHTML = '';
    if (itens.length === 0) {
        container.innerHTML = `<li><em>Nenhum ${tipo} encontrado.</em></li>`;
        return;
    }

    itens.forEach((item) => {
        const li = document.createElement('li');
        li.innerHTML = `
      <div>
        <strong>${item.nome}</strong>
        ${
    tipo === 'cliente' ?
        `<br>${item.sobrenome} - ${item.email} - ${item.idade} anos` :
        `<br>${item.descricao}<br>Preço: R$ ${item.preco} | Quantidade: ${item.quantidade}`
}
      </div>
      <div class="item-buttons">
        <button class="btn-edit" onclick="edit${capitalize(tipo)}(${
    item.id
})">✏️</button>
        <button class="btn-delete" onclick="delete${capitalize(tipo)}(${
    item.id
})">🗑️</button>
      </div>
    `;
        container.appendChild(li);
    });
}

async function editCliente(id) {
    const res = await fetch(`http://localhost:3000/clientes/${id}`);
    const cliente = await res.json();

    const { value: formValues } = await Swal.fire({
        title: 'Editar Cliente',
        html: `
      <input id="swal-nome" class="swal2-input" placeholder="Nome" value="${cliente.nome}">
      <input id="swal-sobrenome" class="swal2-input" placeholder="Sobrenome" value="${cliente.sobrenome}">
      <input id="swal-email" class="swal2-input" placeholder="Email" value="${cliente.email}">
      <input id="swal-idade" class="swal2-input" placeholder="Idade" type="number" value="${cliente.idade}">
    `,
        focusConfirm: false,
        preConfirm: () => {
            return {
                nome: document.getElementById('swal-nome').value,
                sobrenome: document.getElementById('swal-sobrenome').value,
                email: document.getElementById('swal-email').value,
                idade: document.getElementById('swal-idade').value,
            };
        },
    });

    if (!formValues) return;

    await fetch(`http://localhost:3000/clientes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues),
    });

    Swal.fire('Atualizado!', 'Cliente atualizado com sucesso.', 'success');
    fetchClientes();
}

async function editProduto(id) {
    const res = await fetch(`http://localhost:3000/produtos/${id}`);
    const produto = await res.json();

    const { value: formValues } = await Swal.fire({
        title: 'Editar Produto',
        html: `
      <input id="swal-nome" class="swal2-input" placeholder="Nome" value="${
    produto.nome
}">
      <input id="swal-descricao" class="swal2-input" placeholder="Descrição" value="${
    produto.descricao || ''
}">
      <input id="swal-preco" class="swal2-input" placeholder="Preço" type="number" value="${
    produto.preco
}">
      <input id="swal-quantidade" class="swal2-input" placeholder="Quantidade" type="number" value="${
    produto.quantidade
}">
    `,
        focusConfirm: false,
        preConfirm: () => {
            return {
                nome: document.getElementById('swal-nome').value,
                descricao: document.getElementById('swal-descricao').value,
                preco: document.getElementById('swal-preco').value,
                quantidade: document.getElementById('swal-quantidade').value,
            };
        },
    });

    if (!formValues) return;

    await fetch(`http://localhost:3000/produtos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues),
    });

    Swal.fire('Atualizado!', 'Produto atualizado com sucesso.', 'success');
    fetchProdutos();
}

async function deleteCliente(id) {
    const confirm = await Swal.fire({
        title: 'Tem certeza?',
        text: 'Essa ação não poderá ser desfeita.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, deletar!',
        cancelButtonText: 'Cancelar',
    });

    if (confirm.isConfirmed) {
        await fetch(`http://localhost:3000/clientes/${id}`, { method: 'DELETE' });
        fetchClientes();
    }
}

async function deleteProduto(id) {
    const confirm = await Swal.fire({
        title: 'Tem certeza?',
        text: 'Essa ação não poderá ser desfeita.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, deletar!',
        cancelButtonText: 'Cancelar',
    });

    if (confirm.isConfirmed) {
        await fetch(`http://localhost:3000/produtos/${id}`, { method: 'DELETE' });
        fetchProdutos();
    }
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

document
    .getElementById('cliente-search')
    .addEventListener('input', async (e) => {
        const termo = e.target.value.toLowerCase();
        const res = await fetch('http://localhost:3000/clientes');
        const clientes = await res.json();
        const filtrados = clientes.filter(
            (c) =>
                c.nome.toLowerCase().includes(termo) ||
        c.email.toLowerCase().includes(termo),
        );
        renderLista(filtrados, clientesLista, 'cliente');
    });

document
    .getElementById('produto-search')
    .addEventListener('input', async (e) => {
        const termo = e.target.value.toLowerCase();
        const res = await fetch('http://localhost:3000/produtos');
        const produtos = await res.json();
        const filtrados = produtos.filter(
            (p) =>
                p.nome.toLowerCase().includes(termo) ||
        (p.descricao && p.descricao.toLowerCase().includes(termo)),
        );
        renderLista(filtrados, produtosLista, 'produto');
    });

fetchClientes();
fetchProdutos();
