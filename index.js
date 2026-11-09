require('dotenv').config();
const express = require('express');
const path = require('path');
const produtosRoutes = require('./routes/produtosRoutes');
const authRoutes = require('./routes/authRoutes');
const autenticar = require('./middlewares/autenticar');
const repo = require('./dados/produtosRepositorio');
const usuariosRepo = require('./dados/usuariosRepositorio');

if (!process.env.JWT_SECRET) {
  console.log('Defina JWT_SECRET no arquivo .env antes de iniciar o servidor.');
  process.exit(1);
}

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRoutes);
app.use('/produtos', autenticar, produtosRoutes);

Promise.all([repo.iniciar(), usuariosRepo.iniciar()])
  .then(() => {
    app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
  })
  .catch(erro => console.log('Erro ao abrir o banco de dados:', erro));