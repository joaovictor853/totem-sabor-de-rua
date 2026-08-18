    const carrossel = document.querySelector('.carrossel-2');
    const cards = document.querySelectorAll('.card');
    const btnDireito = document.querySelector('.direita');
    const btnEsquerda = document.querySelector('.esquerda');

    let cardAtual = 0;

    function atualizarCarrossel() {
        carrossel.style.transform = `translateX(-${cardAtual * 100}%)`;
    }

    btnDireito.addEventListener('click', () => {
        cardAtual = (cardAtual + 1) % cards.length;
        atualizarCarrossel();
    });

    btnEsquerda.addEventListener('click', () => {
        cardAtual = (cardAtual - 1 + cards.length) % cards.length;
        atualizarCarrossel();
    });

    // logica do carrinho e modal

    let carrinho = [];

    const contadorCarrinho = document.getElementById('cont-carrinho');
    const totalValorFooter = document.getElementById('total-valor');
    const modalTotalValor = document.getElementById('modal-total-valor');
    const listaCarrinhoModal = document.getElementById('lista-carrinho');
    const btnsAdicionar = document.querySelectorAll('.adc-carrinho');
    

    const modal = document.getElementById('modal-carrinho');
    const btnAbrirModal = document.getElementById('abrir-modal');
    const btnIconeCarrinho = document.getElementById('cart-outline');
    const btnFecharModal = document.getElementById('btn-fechar-modal');

    const btnIrPagamento = document.getElementById('btn-ir-pagamento');
    const btnVoltarCarrinho = document.getElementById('btn-voltar-carrinho');
    const btnVoltarOpcoesPgto = document.getElementById('btn-voltar-opcoes-pgto');
    const formCartao = document.getElementById('form-cartao');
    const numeroSenha = document.getElementById('numero-senha');
    const btnsOpcaoPgto = document.querySelectorAll('.btn-opcao-pgto');

    const etapaCarrinho = document.getElementById('etapa-carrinho');
    const etapaPagamento = document.getElementById('etapa-pagamento');
    const etapaCartao = document.getElementById('etapa-cartao');
    const etapaSucesso = document.getElementById('etapa-sucesso');

    // Formatar valor para Real (R$)
function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Atualizar Interface do Carrinho (Badges e Totais)
function atualizarInterfaceCarrinho() {
    const totalItens = carrinho.reduce((acc, item) => acc + item.qtd, 0);
    const totalPreco = carrinho.reduce((acc, item) => acc + (item.preco * item.qtd), 0);

    if (contadorCarrinho) contadorCarrinho.textContent = totalItens;
    if (totalValorFooter) totalValorFooter.textContent = formatarMoeda(totalPreco);
    if (modalTotalValor) modalTotalValor.textContent = formatarMoeda(totalPreco);

    renderizarListaModal();
}

// Renderizar itens no Modal do Carrinho
function renderizarListaModal() {
    if (!listaCarrinhoModal) return;
    listaCarrinhoModal.innerHTML = '';

    if (carrinho.length === 0) {
        listaCarrinhoModal.innerHTML = '<p style="text-align: center; color: #888;">Seu carrinho está vazio.</p>';
        return;
    }

    carrinho.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; padding-bottom: 0.5rem; border-bottom: 1px solid #eee;';
        itemDiv.innerHTML = `
            <div>
                <strong>${item.nome}</strong><br>
                <small>${formatarMoeda(item.preco)} x ${item.qtd}</small>
            </div>
            <div>
                <button onclick="alterarQtd(${index}, -1)" style="padding: 0.2rem 0.6rem; cursor: pointer; border-radius: 4px; border: 1px solid #ccc;">-</button>
                <span style="margin: 0 0.5rem; font-weight: bold;">${item.qtd}</span>
                <button onclick="alterarQtd(${index}, 1)" style="padding: 0.2rem 0.6rem; cursor: pointer; border-radius: 4px; border: 1px solid #ccc;">+</button>
            </div>
        `;
        listaCarrinhoModal.appendChild(itemDiv);
    });
}

// Alterar quantidade no Modal
window.alterarQtd = function(index, mudanca) {
    carrinho[index].qtd += mudanca;
    if (carrinho[index].qtd <= 0) {
        carrinho.splice(index, 1);
    }
    atualizarInterfaceCarrinho();
};

// Capturar cliques nos botões "Adiciona no Carrinho"
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

// Controle de Telas do Modal
function mostrarEtapa(etapaParaMostrar) {
    [etapaCarrinho, etapaPagamento, etapaCartao, etapaSucesso].forEach(etapa => {
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
if (btnIconeCarrinho) btnIconeCarrinho.addEventListener('click', (e) => {
    e.preventDefault();
    abrirModal();
});
if (btnFecharModal) btnFecharModal.addEventListener('click', fecharModal);

// Navegação das Etapas
if (btnIrPagamento) {
    btnIrPagamento.addEventListener('click', () => {
        if (carrinho.length === 0) {
            alert('Adicione ao menos um item ao carrinho!');
            return;
        }
        mostrarEtapa(etapaPagamento);
    });
}

if (btnVoltarCarrinho) {
    btnVoltarCarrinho.addEventListener('click', () => mostrarEtapa(etapaCarrinho));
}

if (btnVoltarOpcoesPgto) {
    btnVoltarOpcoesPgto.addEventListener('click', () => mostrarEtapa(etapaPagamento));
}

btnsOpcaoPgto.forEach(btn => {
    btn.addEventListener('click', () => {
        const forma = btn.getAttribute('data-forma');
        if (forma === 'pix') {
            finalizarPedido();
        } else {
            mostrarEtapa(etapaCartao);
        }
    });
});


if (formCartao) {
    formCartao.addEventListener('submit', (e) => {
        e.preventDefault();
        finalizarPedido();
    });
}


function finalizarPedido() {
    const senhaSorteada = '#' + Math.floor(100 + Math.random() * 900);
    if (numeroSenha) numeroSenha.innerText = senhaSorteada;
    
    mostrarEtapa(etapaSucesso);
    
    carrinho = [];
    atualizarInterfaceCarrinho();
}
