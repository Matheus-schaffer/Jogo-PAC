// =================================================================
// ===== MAIN.JS - O CÉREBRO DO JOGO
// =================================================================

// Referências do HTML
const dialogBox = document.getElementById("dialogBox");
const fundo = document.getElementById("dialogoFundo");
const opcoesCenaDiv = document.getElementById("opcoesCena");
const personagemDisplay = document.getElementById("personagemDisplay");

// Estado de Áudio
const bgMusic = document.getElementById("bgMusic"); 
const sceneMusic = document.getElementById("sceneMusic");
let currentMusic = null;
let audioDublagem = null;

// Gestão de Som (Primeiro Clique)
document.body.addEventListener("click", () => {
    if (bgMusic.paused) bgMusic.play().catch(() => {});
}, { once: true });

function fixPath(path) {
    if (!path) return path;
    if (path.startsWith('music/') || path.startsWith('/') || path.startsWith('./') || /^https?:\/\//.test(path)) return path;
    return 'music/' + path;
}

// Controle de Navegação entre Telas
function mudarTela(id) {
    cancelarFalasInterativas(); // Está no narrador.js
    document.querySelectorAll("section").forEach(sec => sec.classList.remove("active"));
    document.getElementById(id).classList.add("active");

    if (id === "menu" || id === "inicio") {
        sceneMusic.pause();
        sceneMusic.currentTime = 0;
        currentMusic = null;
        bgMusic.play().catch(() => {});
    }

    if (id === "inventario") {
        atualizarGradeInventario();
    }

    if (id === "menu") falarNoMenu(); // Está no narrador.js
    else if (id === "personagem") falarNaSelecao(); // Está no narrador.js
}

// Evento de Clique na Caixa de Diálogo para Pular Texto
dialogBox.addEventListener("click", () => {
    const cena = cenas[cenaAtualId];

    if (typing) { // 'typing' agora é acessado do narrador.js
        finalizarTextoImediato(cena.texto); // Vamos criar essa função no narrador
    } else {
        if (cena.proximaCena === "iniciarTutorialLadrao") {
            iniciarTutorialLadrao(); // Estará no combate.js
        } else if (cena.proximaCena) {
            carregarCena(cena.proximaCena);
        }
    }
});

// Lógica de Carregamento de Cenas
function carregarCena(idCena) {
    const cena = cenas[idCena];
    if (!cena) return;

    mudarTela("dialogo");
    cenaAtualId = idCena;
    opcoesCenaDiv.innerHTML = "";

    // Áudio e Dublagem
    if (audioDublagem) { audioDublagem.pause(); audioDublagem.currentTime = 0; }
    if (cena.audio) {
        audioDublagem = new Audio(fixPath(cena.audio));
        audioDublagem.play().catch(e => console.log("Erro ao tocar áudio:", e));
    }
    
    if (cena.aoCarregar) cena.aoCarregar();

    // Imagem de Fundo
    if (cena.imagem && fundo && !fundo.src.endsWith(cena.imagem)) {
        fundo.style.opacity = 0;
        setTimeout(() => { fundo.src = cena.imagem; fundo.style.opacity = 1; }, 500); 
    }

    // Música
    if (cena.musica) {
        const caminho = fixPath(cena.musica);
        if (caminho !== currentMusic) {
            currentMusic = caminho;
            sceneMusic.src = caminho;
            sceneMusic.load();
            sceneMusic.play().catch(() => {});
        }
    }
    
    // Inicia a fala do narrador
    escreverTexto(cena.texto); 

    // Criação dos botões de escolha
    if (cena.opcoes) {
        const delay = cena.texto.length * 30 + 500; 
        setTimeout(() => {
            cena.opcoes.forEach(opcao => {
                const button = document.createElement("button");
                button.innerText = opcao.texto;
                button.onclick = () => carregarCena(opcao.destino);
                opcoesCenaDiv.appendChild(button);
            });
        }, delay);
    }
}

dialogBox.addEventListener("click", () => {
    const cena = cenas[cenaAtualId];

    if (typing) {
        finalizarTextoImediato(cena.texto); 
    } else {
        // Se a próxima cena for o gatilho do tutorial, chama a animação
        if (cena.proximaCena === "iniciarTutorialLadrao") {
            iniciarTutorialLadrao(); 
        } else if (cena.proximaCena) {
            carregarCena(cena.proximaCena);
        }
    }
});