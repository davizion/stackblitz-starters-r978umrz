const fs = require('fs/promise');
const path = require('path');

const CAMINHO = path.join(__dirname, 'banco.json');

async function lerbanco() {
  const conteudo = await fs.readfile(CAMINHO, 'utf-8');
  return JSON.parse(conteudo);
}

async function salvarBanco(banco) {
  await fs.writefile(CAMINHO, JSON.stringify(banco, null, 2))
}

module.exports = { lerBanco, salvarBanco };