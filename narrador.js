// js/sistemas/narrador.js

// VARIÁVEIS DE CONTROLE (Exclusivas do Narrador)
let narradorInterval = null;
let narradorMenuInterval = null;
let narradorSelecaoInterval = null;
let typingInterativoInterval = null;
let typingInterval = null;
let typing = false;
let charIndex = 0;

function finalizarTextoImediato(textoCompleto) {
    if (typingInterval) clearInterval(typingInterval);
    dialogBox.innerText = textoCompleto;
    pararNarradorDialogo();
    typing = false;
}

// FUNÇÕES DE ANIMAÇÃO DE FALA
function escreverTexto(texto) {
    if (typingInterval) clearInterval(typingInterval);
    if (narradorInterval) clearInterval(narradorInterval);
    
    typing = true;
    dialogBox.innerText = "";
    charIndex = 0;

    const narrador = document.getElementById("narradorDisplay");
    if (narrador) {
        narrador.style.opacity = "1";
        let frame = 1;
        narradorInterval = setInterval(() => {
            frame = (frame % 3) + 1; 
            narrador.style.backgroundImage = `url('imagens/narrador-sprite${frame}.png')`;
        }, 300); 
    }

    typingInterval = setInterval(() => {
        if (charIndex < texto.length) {
            dialogBox.innerText += texto.charAt(charIndex);
            charIndex++;
        } else {
            pararNarradorDialogo();
        }
    }, 45); 
}

function pararNarradorDialogo() {
    clearInterval(typingInterval);
    clearInterval(narradorInterval);
    typing = false;
    const narrador = document.getElementById("narradorDisplay");
    if (narrador) {
        narrador.style.backgroundImage = `url('imagens/narrador-sprite1.png')`;
    }
}

function cancelarFalasInterativas() {
    clearInterval(typingInterativoInterval);
    clearInterval(narradorMenuInterval);
    clearInterval(narradorSelecaoInterval);
    const balaoMenu = document.getElementById("balaoFalaMenu");
    if(balaoMenu) balaoMenu.style.opacity = "0";
    const balaoSelecao = document.getElementById("balaoFalaSelecao");
    if(balaoSelecao) balaoSelecao.style.opacity = "0";
}

function fazerNarradorFalarInterativo(displayId, textId, bubbleId, texto, intervalVar, speed = 40) {
    const display = document.getElementById(displayId);
    const textTarget = document.getElementById(textId);
    const bubble = document.getElementById(bubbleId);
    if (!display || !textTarget || !bubble) return;

    if (typingInterativoInterval) clearInterval(typingInterativoInterval);
    if (intervalVar) clearInterval(intervalVar);

    display.style.opacity = "1";
    bubble.style.opacity = "1";
    textTarget.innerText = "";
    let localCharIndex = 0;

    let frame = 1;
    intervalVar = setInterval(() => {
        frame = (frame % 3) + 1;
        display.style.backgroundImage = `url('imagens/narrador-sprite${frame}.png')`;
    }, 300);

    typingInterativoInterval = setInterval(() => {
        if (localCharIndex < texto.length) {
            textTarget.innerText += texto.charAt(localCharIndex);
            localCharIndex++;
        } else {
            clearInterval(typingInterativoInterval);
            clearInterval(intervalVar);
            display.style.backgroundImage = `url('imagens/narrador-sprite1.png')`; 
        }
    }, speed);
    return intervalVar;
}

// GATILHOS ESPECÍFICOS
function falarNoMenu() {
    const texto = "Bem-vindo ao meu jogo.";
    narradorMenuInterval = fazerNarradorFalarInterativo("narradorMenuDisplay", "textoBalaoMenu", "balaoFalaMenu", texto, narradorMenuInterval);
}

function falarNaSelecao() {
    const texto = "Escolha seu destino.";
    narradorSelecaoInterval = fazerNarradorFalarInterativo("narradorSelecaoDisplay", "textoBalaoSelecao", "balaoFalaSelecao", texto, narradorSelecaoInterval);
}

function falarDescricaoPersonagem(pID) {
    const personagem = estadoJogo[pID];
    if (!personagem) return;
    const texto = `${personagem.nome}. ${personagem.descricao}`;
    narradorSelecaoInterval = fazerNarradorFalarInterativo("narradorSelecaoDisplay", "textoBalaoSelecao", "balaoFalaSelecao", texto, narradorSelecaoInterval, 30); 
}