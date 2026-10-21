const express = require('express');
const app = express();
app.use(express.json());

const produtos = [
  { id: 1, nome: 'Camiseta', preco: 49.9 },
  { id: 2, nome: 'Calça', preco: 129.9 },
  { id: 3, nome: 'Tênis', preco: 299.9 },
];

app.get('/', (req, res) => {
  res.send('Bem vindo a minha loja!');
});

app.post('/produtos', (req, res) => {
  const { nome, preco } = req.body;

  if (!nome || !preco) {
    return res.status(400).json({ erro: 'nome e preco sao obrigatorios' });
  }

  const novoproduto = {
    id: produtos.length + 1,
    nome,
    preco,
  };

  produtos.push(novoproduto);
  res.status(201).json(novoproduto);
});

app.get('/produtos', (req, res) => {
  res.json(produtos);
});

app.get('/produtos/:id', (req, res) => {
  const id = Number(req.params.id);
  const produto = produtos.find((p) => p.id === id);

  if (!produto) {
    return res.status(404).json({ erro: 'Produto nâo encontrado' });
  }

  res.json(produtos);
});

app.listen(3000, () => console.log('servidor rodando na porta 3000'));
