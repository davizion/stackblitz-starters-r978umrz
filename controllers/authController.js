const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const repo = require('../dados/usuariosRepositorio');

const RODADAS_BCRYPT = 10;

function gerarToken(usuario) {
  return jwt.sign(
    { id: usuario.id, email: usuario.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRA_EM || '1h' }
  );
}

async function registrar(req, res) {
  const { nome, email, senha } = req.body ?? {};

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Informe nome, e-mail e senha' });
  }

  if (senha.length < 6) {
    return res.status(400).json({ erro: 'A senha deve ter pelo menos 6 caracteres' });
  }

  const emailLimpo = email.trim().toLowerCase();

  if (repo.buscarPorEmail(emailLimpo)) {
    return res.status(409).json({ erro: 'Este e-mail já está cadastrado' });
  }

  // O bcrypt gera o hash (com "sal" embutido). A senha em si nunca é salva.
  const senhaHash = await bcrypt.hash(senha, RODADAS_BCRYPT);
  const usuario = repo.criar(nome.trim(), emailLimpo, senhaHash);

  res.status(201).json(usuario);
}

async function login(req, res) {
  const { email, senha } = req.body ?? {};

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Informe e-mail e senha' });
  }

  const usuario = repo.buscarPorEmail(email.trim().toLowerCase());

  // Mesma mensagem para e-mail inexistente e senha errada,
  // para não revelar quais e-mails estão cadastrados.
  const senhaCorreta = usuario && await bcrypt.compare(senha, usuario.senha_hash);

  if (!senhaCorreta) {
    return res.status(401).json({ erro: 'E-mail ou senha inválidos' });
  }

  const token = gerarToken(usuario);

  res.json({
    token,
    usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email }
  });
}

function perfil(req, res) {
  const usuario = repo.buscarPorId(req.usuario.id);

  if (!usuario) {
    return res.status(404).json({ erro: 'Usuário não encontrado' });
  }

  res.json(usuario);
}

module.exports = { registrar, login, perfil };