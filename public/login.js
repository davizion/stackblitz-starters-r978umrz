const formulario = document.getElementById('formulario');
const tituloForm = document.getElementById('titulo-form');
const campoNome = document.getElementById('nome');
const campoEmail = document.getElementById('email');
const campoSenha = document.getElementById('senha');
const botaoEnviar = document.getElementById('botao-enviar');
const botaoAlternar = document.getElementById('botao-alternar');
const mensagem = document.getElementById('mensagem');

let modoCadastro = false;

// Quem já está logado vai direto para a loja
if (localStorage.getItem('token')) {
  window.location.href = 'index.html';
}

function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = tipo;
}

function alternarModo() {
  modoCadastro = !modoCadastro;
  campoNome.hidden = !modoCadastro;
  campoNome.required = modoCadastro;
  campoSenha.autocomplete = modoCadastro ? 'new-password' : 'current-password';
  tituloForm.textContent = modoCadastro ? 'Criar conta' : 'Entrar';
  botaoEnviar.textContent = modoCadastro ? 'Cadastrar' : 'Entrar';
  botaoAlternar.textContent = modoCadastro ? 'Já tenho conta' : 'Criar conta';
  mostrarMensagem('', '');
}

async function enviar(caminho, dados) {
  const resposta = await fetch(`/auth/${caminho}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  });
  const corpo = await resposta.json();
  return { ok: resposta.ok, corpo };
}

async function entrar(email, senha) {
  const { ok, corpo } = await enviar('login', { email, senha });

  if (!ok) {
    mostrarMensagem(corpo.erro, 'erro');
    return;
  }

  localStorage.setItem('token', corpo.token);
  localStorage.setItem('usuario', JSON.stringify(corpo.usuario));
  window.location.href = 'index.html';
}

async function enviarFormulario(evento) {
  evento.preventDefault();

  const email = campoEmail.value.trim();
  const senha = campoSenha.value;

  try {
    if (modoCadastro) {
      const { ok, corpo } = await enviar('registrar', {
        nome: campoNome.value.trim(),
        email,
        senha
      });

      if (!ok) {
        mostrarMensagem(corpo.erro, 'erro');
        return;
      }
    }

    // Depois de cadastrar, já faz o login automaticamente
    await entrar(email, senha);
  } catch {
    mostrarMensagem('Erro de conexão com o servidor.', 'erro');
  }
}

formulario.addEventListener('submit', enviarFormulario);
botaoAlternar.addEventListener('click', alternarModo);