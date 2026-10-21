fetch('http://localhost:3000/produtos',{
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nome: 'Boné', preco: 39.9 })
})
.then(resposta => resposta.json())
.then(dados => console.log('Resposta so servidor:', dados));