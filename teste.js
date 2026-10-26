
const BASE = 'http://localhost:3000';

async function pedir(metodo, caminho, dados) {
  const opcoes = {
    method: metodo,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (dados !== undefined) {
    opcoes.body = JSON.stringify(dados);
  }

  const resposta = await fetch(BASE + caminho, opcoes);
  const texto = await resposta.text();

  let corpo = null;

  if (texto) {
    try {
      corpo = JSON.parse(texto);
    } catch {
      corpo = texto;
    }
  }

  console.log(
    `\n${metodo} ${caminho} → status ${resposta.status}`
  );

  console.log(corpo ?? '(sem conteúdo)');

  return {
    status: resposta.status,
    corpo
  };
}

async function testarTudo() {
  try {
    await pedir('GET', '/produtos');

    await pedir('GET', '/produtos/1');

    const resultado = await pedir('POST', '/produtos', {
      nome: 'Boné',
      preco: 39.9
    });

    if (resultado.status !== 201) {
      throw new Error('Falha ao criar produto');
    }

    const id = resultado.corpo.id;

    await pedir('PUT', `/produtos/${id}`, {
      preco: 59.9
    });

    await pedir('DELETE', `/produtos/${id}`);

    await pedir('GET', `/produtos/${id}`);

    await pedir('POST', '/produtos', {
      nome: 'Meia'
    });
  } catch (erro) {
    console.error('Motivo do erro:', erro.message);
  }
}

testarTudo();
