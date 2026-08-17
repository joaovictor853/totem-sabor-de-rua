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