const express = require('express');
const produtosRoutes = require('./routes/produtosRoutes');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Bem-vindo à minha loja!');
});

app.use('/produtos', produtosRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});