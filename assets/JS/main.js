const campoBusca = document.querySelector('.input-busca');
const btnAddBloco = document.querySelector('.btn-adicionaBloco');
const altdisplay = document.querySelector('.section-desativada');
const btnFechaCriaNotas = altdisplay.querySelector('.btn-fecha-cria-nota');
const btnSalvaNota = document.querySelector('.btn-salvar');
const gridNotas = document.querySelector('.corpo-do-site');
const feedback = document.querySelector('#modalFeedback');

const btnBusca = document.querySelector('.btn-busca');
const containerBusca = document.querySelector('.container-busca');
const inputBusca = document.querySelector('.input-busca');
const btnFechaBusca = document.querySelector('.btn-fecha-busca');


const displayEditaNts = document.querySelector('.section-desativada-carrega-edita-nota');
const btnFechaEditaNotas = displayEditaNts.querySelector('.btn-fecha-cria-nota');
const btnSalvaEdicao = document.querySelector('.btn-salvar2');
const feedbackEdita = displayEditaNts.querySelector('#modalFeedback');

let notaEditando = null;



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

btnFechaEditaNotas.addEventListener('click', () => {
  displayEditaNts.classList.remove('section-carrega-edita-nota');
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
  const titulo = altdisplay.querySelector('.titulo').value.trim();
  const notas = altdisplay.querySelector('.notas').value.trim();
  const cor = altdisplay.querySelector('.cor-de-fundo').value || '#ffffff';

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
    notaEditando = el.closest('.nota');
    altdisplay.classList.toggle('ativo');
    displayEditaNts.classList.add('section-carrega-edita-nota');

    const tituloAtual = notaEditando.querySelector('h3').innerText;
    const textoAtual = notaEditando.querySelector('p').innerText;
    const corAtual = getComputedStyle(notaEditando).getPropertyValue('--cor-nota').trim();

    displayEditaNts.querySelector('.edita-titulo').value = tituloAtual;
    displayEditaNts.querySelector('.edita-notas').value = textoAtual;
    displayEditaNts.querySelector('.edita-cor-de-fundo').value = corAtual;


    displayEditaNts.style.animation = 'none';
    displayEditaNts.offsetHeight;
    displayEditaNts.style.animation = 'menuSuave 0.5s ease';

  }
});

// abrir busca
btnBusca.addEventListener('click', () => {
  containerBusca.classList.add('ativo');
  inputBusca.focus();
});


// fechar busca
btnFechaBusca.addEventListener('click', () => {
  containerBusca.classList.remove('ativo');
  inputBusca.value = '';
  filtrarNotas('');
});


// buscar digitando
inputBusca.addEventListener('input', () => {
  filtrarNotas(inputBusca.value);
});


// função filtro
function filtrarNotas(valor) {
  const busca = valor.toLowerCase();

  const notas = document.querySelectorAll('.nota');

  notas.forEach((nota) => {

    const titulo = nota.querySelector('h3').innerText.toLowerCase();

    const texto = nota.querySelector('p').innerText.toLowerCase();

    const encontrou = titulo.includes(busca) || texto.includes(busca);

    nota.style.display = encontrou ? 'flex' : 'none';
  });
}

/* SALVAR EDICAO*/
btnSalvaEdicao.addEventListener('click', () => {

  const novoTitulo =
    displayEditaNts.querySelector('.edita-titulo').value.trim();

  const novoTexto =
    displayEditaNts.querySelector('.edita-notas').value.trim();

  const novaCor =
    displayEditaNts.querySelector('.edita-cor-de-fundo').value || '#ffffff';

  if (!novoTitulo || !novoTexto) {
    feedbackEdita.textContent = 'Preencha todos os campos!';
    return;
  }

  notaEditando.querySelector('h3').textContent = novoTitulo;
  notaEditando.querySelector('p').textContent = novoTexto;

  notaEditando.style.setProperty('--cor-nota', novaCor);

  salvarNotas();

  feedbackEdita.textContent = '';

  displayEditaNts.classList.remove('section-carrega-edita-nota');

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