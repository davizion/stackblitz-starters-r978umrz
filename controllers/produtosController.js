
const produtos = require('../dados/produtos');

let proximoId = Math.max(0, ...produtos.map(p => p.id)) + 1;

// Listar todos os produtos
function listar(req, res) {
  res.json(produtos);
}

// Buscar um produto pelo ID
function buscarPorId(req, res) {
  const id = Number(req.params.id);
  const produto = produtos.find(p => p.id === id);

  if (!Number.isInteger(id) || id <= 0 || !produto) {
    return res.status(404).json({
      erro: 'Produto não encontrado'
    });
  }

  res.json(produto);
}

// Criar um novo produto
function criar(req, res) {
  const { nome, preco } = req.body;

  if (
    typeof nome !== 'string' ||
    nome.trim() === '' ||
    typeof preco !== 'number' ||
    !Number.isFinite(preco) ||
    preco < 0
  ) {
    return res.status(400).json({
      erro: 'Nome válido e preço numérico não negativo são obrigatórios'
    });
  }

  const novoProduto = {
    id: proximoId++,
    nome: nome.trim(),
    preco
  };

  produtos.push(novoProduto);

  res.status(201).json(novoProduto);
}

// Atualizar um produto
function atualizar(req, res) {
  const id = Number(req.params.id);
  const produto = produtos.find(p => p.id === id);

  if (!Number.isInteger(id) || id <= 0 || !produto) {
    return res.status(404).json({
      erro: 'Produto não encontrado'
    });
  }

  const { nome, preco } = req.body;

  if (nome === undefined && preco === undefined) {
    return res.status(400).json({
      erro: 'Informe o nome ou o preço para atualizar'
    });
  }

  if (
    nome !== undefined &&
    (typeof nome !== 'string' || nome.trim() === '')
  ) {
    return res.status(400).json({
      erro: 'O nome deve ser um texto válido'
    });
  }

  if (
    preco !== undefined &&
    (typeof preco !== 'number' ||
      !Number.isFinite(preco) ||
      preco < 0)
  ) {
    return res.status(400).json({
      erro: 'O preço deve ser um número não negativo'
    });
  }

  if (nome !== undefined) {
    produto.nome = nome.trim();
  }

  if (preco !== undefined) {
    produto.preco = preco;
  }

  res.json(produto);
}

// Excluir um produto
function remover(req, res) {
  const id = Number(req.params.id);
  const indice = produtos.findIndex(p => p.id === id);

  if (!Number.isInteger(id) || id <= 0 || indice === -1) {
    return res.status(404).json({
      erro: 'Produto não encontrado'
    });
  }

  produtos.splice(indice, 1);

  res.status(204).send();
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  remover
};
