// variaveis do carrossel
const carrossel = document.querySelector('.carrossel-2');
const cards = document.querySelectorAll('.card');
const btnDireito = document.querySelector('.direita');
const btnEsquerda = document.querySelector('.esquerda');

let cardAtual = 0;

// carrossel
function atualizarCarrossel() {
    if (carrossel) {
        carrossel.style.transform = `translateX(-${cardAtual * 100}%)`;
    }
}

if (btnDireito) {
    btnDireito.addEventListener('click', () => {
        cardAtual = (cardAtual + 1) % cards.length;
        atualizarCarrossel();
    });
}

if (btnEsquerda) {
    btnEsquerda.addEventListener('click', () => {
        cardAtual = (cardAtual - 1 + cards.length) % cards.length;
        atualizarCarrossel();
    });
}

// variaveis do carrinho e do modal
let carrinho = [];

const contadorCarrinho = document.getElementById('cont-carrinho');
const totalValorFooter = document.getElementById('total-valor');
const modalTotalValor = document.getElementById('modal-total-valor');
const listaCarrinhoModal = document.getElementById('lista-carrinho');
const btnsAdicionar = document.querySelectorAll('.adc-carrinho');

// variaveis do modal e suas etapas
const modal = document.getElementById('modal-carrinho');
const etapaCarrinho = document.getElementById('etapa-carrinho');
const etapaPagamento = document.getElementById('etapa-pagamento');
const etapaPix = document.getElementById('etapa-pix');
const etapaCartao = document.getElementById('etapa-cartao');
const etapaSucesso = document.getElementById('etapa-sucesso');

// variaveis dos botões
const btnAbrirModal = document.getElementById('abrir-modal');
const btnIconeCarrinho = document.getElementById('cart-outline');
const btnFecharModal = document.getElementById('btn-fechar-modal');
const btnIrPagamento = document.getElementById('btn-ir-pagamento');
const btnVoltarCarrinho = document.getElementById('btn-voltar-carrinho');
const btnVoltarOpcoesPgto = document.getElementById('btn-voltar-opcoes-pgto');
const btnConfirmarPix = document.getElementById('btn-confirmar-pix');
const btnVoltarPix = document.getElementById('btn-voltar-pix');
const btnsOpcaoPgto = document.querySelectorAll('.btn-opcao-pgto');

const formCartao = document.getElementById('form-cartao');
const numeroSenha = document.getElementById('numero-senha');

// formatação de moeda
function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// atuliazar carrinho
function atualizarInterfaceCarrinho() {
    const totalItens = carrinho.reduce((acc, item) => acc + item.qtd, 0);
    const totalPreco = carrinho.reduce((acc, item) => acc + (item.preco * item.qtd), 0);

    if (contadorCarrinho) contadorCarrinho.textContent = totalItens;
    if (totalValorFooter) totalValorFooter.textContent = formatarMoeda(totalPreco);
    if (modalTotalValor) modalTotalValor.textContent = formatarMoeda(totalPreco);

    renderizarListaModal();
}

//  escrevendo as imagens
function renderizarListaModal() {
    if (!listaCarrinhoModal) return;
    listaCarrinhoModal.innerHTML = '';

    if (carrinho.length === 0) {
        listaCarrinhoModal.innerHTML = '<p style="text-align: center; color: #888;">Seu carrinho está vazio.</p>';
        return;
    }

    carrinho.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; padding-bottom: 0.5rem; border-bottom: 1px solid white;';
        itemDiv.innerHTML = `
            <div>
                <strong>${item.nome}</strong><br>
                <small>${formatarMoeda(item.preco)} x ${item.qtd}</small>
            </div>
            <div>
                <button onclick="alterarQtd(${index}, -1)" style="padding: 0.2rem 0.6rem; cursor: pointer; border-radius: 4px; border: 1px solid white;">-</button>
                <span style="margin: 0 0.5rem; font-weight: bold;">${item.qtd}</span>
                <button onclick="alterarQtd(${index}, 1)" style="padding: 0.2rem 0.6rem; cursor: pointer; border-radius: 4px; border: 1px solid white;">+</button>
            </div>
        `;
        listaCarrinhoModal.appendChild(itemDiv);
    });
}

// alterar as quantidades
window.alterarQtd = function(index, mudanca) {
    carrinho[index].qtd += mudanca;
    if (carrinho[index].qtd <= 0) {
        carrinho.splice(index, 1);
    }
    atualizarInterfaceCarrinho();
};

// adicionar ao carrinho
btnsAdicionar.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const cardProduto = e.target.closest('.card-produto');
        const nome = cardProduto.querySelector('strong').innerText;
        const precoTexto = cardProduto.querySelector('h2').innerText;
        const preco = parseFloat(precoTexto.replace('R$', '').replace(',', '.').trim());

        const itemExistente = carrinho.find(item => item.nome === nome);
        if (itemExistente) {
            itemExistente.qtd++;
        } else {
            carrinho.push({ nome, preco, qtd: 1 });
        }

        atualizarInterfaceCarrinho();
    });
});

// etapas de pagamento
function mostrarEtapa(etapaParaMostrar) {
    [etapaCarrinho, etapaPagamento, etapaCartao, etapaPix, etapaSucesso].forEach(etapa => {
        if (etapa) etapa.classList.add('oculto');
    });
    if (etapaParaMostrar) etapaParaMostrar.classList.remove('oculto');
}

function abrirModal() {
    if (modal) {
        modal.classList.remove('oculto');
        mostrarEtapa(etapaCarrinho);
    }
}

function fecharModal() {
    if (modal) modal.classList.add('oculto');
}

if (btnAbrirModal) btnAbrirModal.addEventListener('click', abrirModal);
if (btnIconeCarrinho) {
    btnIconeCarrinho.addEventListener('click', (e) => {
        e.preventDefault();
        abrirModal();
    });
}
if (btnFecharModal) btnFecharModal.addEventListener('click', fecharModal);

// pagamento
if (btnIrPagamento) {
    btnIrPagamento.addEventListener('click', () => {
        if (carrinho.length === 0) {
            alert('Adicione ao menos um item ao carrinho!');
            return;
        }
        mostrarEtapa(etapaPagamento);
    });
}

// botão voltar
if (btnVoltarCarrinho) btnVoltarCarrinho.addEventListener('click', () => mostrarEtapa(etapaCarrinho));
if (btnVoltarOpcoesPgto) btnVoltarOpcoesPgto.addEventListener('click', () => mostrarEtapa(etapaPagamento));
if (btnVoltarPix) btnVoltarPix.addEventListener('click', () => mostrarEtapa(etapaPagamento));

// forma de pagamento
btnsOpcaoPgto.forEach(btn => {
    btn.addEventListener('click', () => {
        const forma = btn.getAttribute('data-forma');
        if (forma === 'pix') {
            mostrarEtapa(etapaPix); // CORRIGIDO: Agora exibe a tela do QR Code!
        } else {
            mostrarEtapa(etapaCartao);
        }
    });
});

// confirma pagamento pix
if (btnConfirmarPix) {
    btnConfirmarPix.addEventListener('click', () => {
        finalizarPedido();
    });
}

// confima pagamento cartao
if (formCartao) {
    formCartao.addEventListener('submit', (e) => {
        e.preventDefault();
        finalizarPedido();
        formCartao.reset();
    });
}

// finaliza compra gerando senha
window.finalizarPedido = function() {
    const senhaSorteada = '#' + Math.floor(100 + Math.random() * 900);
    if (numeroSenha) numeroSenha.innerText = senhaSorteada;
    
    mostrarEtapa(etapaSucesso);
    
    carrinho = [];
    atualizarInterfaceCarrinho();
};
