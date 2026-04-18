const btnAddBloco = document.querySelector('.btn-adicionaBloco');
const altdisplay = document.querySelector('.section-desativada');
const btnFechaCriaNotas = document.querySelector('.btn-fecha-cria-nota');
const btnSalvaNota = document.querySelector('.btn-salvar');
const gridNotas = document.querySelector('.corpo-do-site');
const feedback = document.querySelector('#modalFeedback');


/*ABRIR / FECHAR MENU*/
btnAddBloco.addEventListener('click', () => {
  altdisplay.classList.toggle('ativo');

  const estaAtivo = altdisplay.classList.contains('ativo');

  if (estaAtivo) {
    altdisplay.style.animation = 'none';
    altdisplay.offsetHeight;
    altdisplay.style.animation = 'menuSuave .5s ease';

    document.querySelectorAll('.nota').forEach((nota) => {
      nota.style.animation = 'none';
      nota.offsetHeight;
      nota.style.animation = 'menuSuave .5s ease';
    });
  } else {
    altdisplay.style.animation = 'none';

    document.querySelectorAll('.nota').forEach((nota) => {
      nota.style.animation = 'none';
    });
  }
});

btnFechaCriaNotas.addEventListener('click', () => {
  altdisplay.classList.remove('ativo');
});


/*CRIAR NOTA*/
function criaNota(tituloFun, notasFun, corFun) {
  gridNotas.innerHTML += `
    <div class="nota" style="--cor-nota:${corFun}">
      <h3>${tituloFun}</h3>

      <div class="texto-nota">
        <p>${notasFun}</p>
      </div>

      <div class="container-edita-exclui-nota">
        <button class="btn-edita-nota btn-utility">✏️</button>
        <button class="btn-exclui-nota btn-utility">❌</button>
      </div>
    </div>
  `;
  salvarNotas();
}


/* PEGAR INPUTS*/
function recebeValorInput() {
  const titulo = document.querySelector('.titulo').value.trim();
  const notas = document.querySelector('.notas').value.trim();
  const cor = document.querySelector('.cor-de-fundo').value || '#ffffff';

  if (!titulo || !notas) {
    feedback.textContent = 'Preencha todos os campos!';
    return;
  }

  criaNota(titulo, notas, cor);
  limpaInput();
  feedback.textContent = '';
}


/*LIMPAR INPUTS*/
function limpaInput() {
  document.querySelector('.titulo').value = '';
  document.querySelector('.notas').value = '';
  document.querySelector('.cor-de-fundo').value = '';
}


/*BOTÃO SALVAR*/
btnSalvaNota.addEventListener('click', () => {
  recebeValorInput();
});


/*EXCLUIR / EDITAR*/
document.addEventListener('click', (e) => {
  const el = e.target;
  
  /* EXCLUIR */
  if (el.classList.contains('btn-exclui-nota')) {
    el.closest('.nota').remove();
    salvarNotas();
  }
  
  /* EDITAR */
  if (el.classList.contains('btn-edita-nota')) {
    const nota = el.closest('.nota');
    
    const tituloAtual = nota.querySelector('h3').innerText;
    const textoAtual = nota.querySelector('p').innerText;
    
    const novoTitulo = prompt('Editar título:', tituloAtual);
    const novoTexto = prompt('Editar nota:', textoAtual);
    
    if (novoTitulo !== null && novoTexto !== null) {
      nota.querySelector('h3').innerText = novoTitulo;
      nota.querySelector('p').innerText = novoTexto;
      salvarNotas();
    }
  }
});


/*SALVAR LOCAL STORAGE*/
function salvarNotas() {
  const todasNotas = document.querySelectorAll('.nota');
  const listaNotas = [];

  todasNotas.forEach((nota) => {
    listaNotas.push({
      titulo: nota.querySelector('h3').innerText,
      texto: nota.querySelector('p').innerText,
      cor: getComputedStyle(nota).getPropertyValue('--cor-nota').trim()
    });
  });

  localStorage.setItem('ntsCriada', JSON.stringify(listaNotas));
}


/*CARREGAR LOCAL STORAGE*/
function carregaNotas() {
  const notasSalvas = localStorage.getItem('ntsCriada');

  if (!notasSalvas) return;

  const listaNotas = JSON.parse(notasSalvas);

  listaNotas.forEach((nota) => {
    criaNota(nota.titulo, nota.texto, nota.cor);
  });
}

/*INICIAR*/
carregaNotas();