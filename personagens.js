// =================================================================
// ===== LÓGICA DO HUD, PERSONAGEM, DANO E INVENTÁRIO (NOVAS) =====
// =================================================================

const estadoJogo = {
    orc: { nome: "Orc Guerreiro", vidaMax: 150, manaMax: 50, moedas: 100, descricao: "Um brutamontes leal." },
    elfo: { nome: "Elfo Arqueiro", vidaMax: 100, manaMax: 100, moedas: 120, descricao: "Ágil e preciso." },
    clerigo: { nome: "Clérigo", vidaMax: 120, manaMax: 150, moedas: 80, descricao: "Um servo dos deuses." },
    ladrao: { nome: "Ladrão", vidaMax: 90, manaMax: 80, moedas: 200, descricao: "Especialista em infiltração." },
    mago: { nome: "Mago", vidaMax: 70, manaMax: 250, moedas: 150, descricao: "Estudioso das artes arcanas." },
    Bardo: { nome: "Bardo", vidaMax: 80, manaMax: 200, moedas: 180, descricao: "Suas canções inspiram aliados." }
};

let personagemID = "orc";
let vidaAtual = 0;
let manaAtual = 0;
let moedas = 0;

function iniciarHUD(p) {
    personagemID = p;
    const stats = estadoJogo[p] || estadoJogo.orc;
    
    vidaAtual = stats.vidaMax;
    manaAtual = stats.manaMax;
    moedas = stats.moedas;

    if (document.getElementById("nomePersonagem")) {
        document.getElementById("nomePersonagem").innerText = stats.nome;
    }
    if (personagemDisplay) {
        const imagemArquivo = p === "Bardo" ? "bardo" : p;
        personagemDisplay.style.backgroundImage = `url('imagens/${imagemArquivo}.png')`;
    }

    atualizarHUD();
}

function atualizarHUD() {
    const stats = estadoJogo[personagemID];
    if (stats) {
        if (document.getElementById("vidaBar")) {
            document.getElementById("vidaBar").style.width = `${(vidaAtual / stats.vidaMax) * 100}%`;
        }
        if (document.getElementById("moedas")) {
            document.getElementById("moedas").innerText = moedas;
        }
    }
}

function tomarDano(valor) {
    if (vidaAtual === 0) return; 

    vidaAtual = Math.max(0, vidaAtual - valor);
    atualizarHUD();
    
    const dialogoSec = document.getElementById("dialogo");
    if (dialogoSec) {
        dialogoSec.classList.add("damage-flash");
        setTimeout(() => {
            dialogoSec.classList.remove("damage-flash");
            if (vidaAtual === 0) {
                carregarCena("game_over"); 
            }
        }, 500);
    }
}

function selecionar(p) {
  cancelarFalasInterativas();
  localStorage.setItem("personagem", p);
  bgMusic.pause();
  bgMusic.currentTime = 0;
  iniciarHUD(p); 
  carregarCena("introducao"); 
}

function usarPocaoNoCombate() {
    const stats = estadoJogo[personagemID];
    if (vidaAtual < stats.vidaMax) {
        vidaAtual = Math.min(vidaAtual + 50, stats.vidaMax);
        atualizarHUD();
        alert("Você usou a Poção! Vida restaurada.");
        
        // Se estivermos no tutorial, isso libera a próxima fase
        if (combateStatus.faseTutorial === 2) {
            combateStatus.faseTutorial = 3;
            document.getElementById("battleMessage").innerText = "Incrível! Agora use o seu ESPECIAL para acabar com a luta!";
            mudarTela("combate"); // Volta para a tela de combate
        }
    }
}