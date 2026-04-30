// =================================================================
// ===== LÓGICA DE COMBATE EVOLUÍDA (FASES DO TUTORIAL) =====
// =================================================================

let combateStatus = {
    hpInimigo: 50,
    hpInimigoMax: 50,
    respostaCerta: 0,
    faseTutorial: 1 // 1: Desvio, 2: Dano/Cura, 3: Especial
};


let tipoAtaqueAtual = 'ataque';

// 1. ANIMAÇÃO E PAUSA DO NARRADOR
function iniciarTutorialLadrao() {
    const ladrao = document.createElement("div");
    ladrao.id = "animacaoLadrao";
    ladrao.style.cssText = "position:absolute; right:-200px; bottom:250px; width:150px; height:150px; background:url('imagens/ladrao.png') no-repeat; background-size:contain; transition: all 1s ease-out; z-index:5;";
    document.getElementById("dialogo").appendChild(ladrao);

    setTimeout(() => { ladrao.style.right = "40%"; }, 100);

    setTimeout(() => {
        ladrao.style.transition = "none";
        document.getElementById("dialogo").style.filter = "grayscale(1) contrast(1.2)";
        
        
        escreverTexto("PAUSA PARA O TUTORIAL DE COMBATE! O inimigo está prestes a te atacar... Vamos ver se você consegue desviar?");
        
        
        setTimeout(() => {
            document.getElementById("dialogo").style.filter = "none";
            ladrao.remove();
            prepararCombate();
        }, 4000);
    }, 1200);
}


let inventario = [];
// 2. TELA DE COMBATE
function prepararCombate() {
    mudarTela("combate");
    const stats = estadoJogo[personagemID];

    if (!inventario.includes("Poção de Cura")) {
        inventario.push("Poção de Cura");

        }

    // Reset de Interface
    document.getElementById("menuCombatePrincipal").style.display = "flex";
    document.getElementById("painelMatematico").style.display = "none";
    
    // Herói
    document.getElementById("combateNomeHeroi").innerText = stats.nome;
    document.getElementById("hpAtualNum").innerText = vidaAtual;
    document.getElementById("hpMaxNum").innerText = stats.vidaMax;
    document.getElementById("hpHeroiBar").style.width = (vidaAtual / stats.vidaMax * 100) + "%";
    document.getElementById("heroiSpriteCombate").style.backgroundImage = `url('imagens/${personagemID}.png')`;
    
    // Inimigo
    combateStatus.hpInimigo = combateStatus.hpInimigoMax; 
    document.getElementById("hpInimigoBar").style.width = "100%";
    document.getElementById("inimigoSprite").style.backgroundImage = "url('imagens/ladrao.png')";
    
    // Início da Fase 1
    combateStatus.faseTutorial = 1;
    document.getElementById("battleMessage").innerText = "O Ladrão ataca! Responda para DESVIAR!";
}

// 3. GERAÇÃO DE PERGUNTAS POR FASE
function proximaPergunta() {
    let n1, n2;
    
    switch(combateStatus.faseTutorial) {
        case 1: // DESVIO: Fácil
            n1 = 2; n2 = 3;
            document.getElementById("perguntaTexto").innerText = `DESVIO: Quanto é ${n1} + ${n2}?`;
            break;
        case 2: // SEU ATAQUE: Médio
            n1 = Math.floor(Math.random() * 10) + 5;
            n2 = Math.floor(Math.random() * 10) + 5;
            document.getElementById("perguntaTexto").innerText = `ATAQUE: Quanto é ${n1} + ${n2}?`;
            break;
        case 3: // ESPECIAL INIMIGO: Difícil (Feito para errar ou ser difícil)
            n1 = Math.floor(Math.random() * 50) + 30;
            n2 = Math.floor(Math.random() * 50) + 30;
            document.getElementById("perguntaTexto").innerText = `DEFESA CRÍTICA: Quanto é ${n1} + ${n2}?`;
            break;
        case 4: // SEU ESPECIAL: Finalização
            n1 = 100; n2 = 50;
            document.getElementById("perguntaTexto").innerText = `GOLPE FINAL: Quanto é ${n1} + ${n2}?`;
            break;
    }
    
    combateStatus.respostaCerta = n1 + n2;
    const input = document.getElementById("respostaInput");
    input.value = "";
    input.focus();
}

function verificarResposta() {
    const input = document.getElementById("respostaInput");
    const respostaUser = parseInt(input.value);
    const acertou = (respostaUser === combateStatus.respostaCerta);
    const pID = personagemID.toLowerCase(); // Garante que pegamos 'orc' em minúsculo
    
    document.getElementById("painelMatematico").style.display = "none";
    document.getElementById("menuCombatePrincipal").style.display = "flex";

    if (combateStatus.faseTutorial === 1) { // FASE DE DESVIO
        if (acertou) {
            fazerNarradorFalarInterativo("narradorCombateDisplay", "textoBalaoCombate", "balaoFalaCombate", "Incrível! Você desviou do golpe sem sofrer nenhum arranhão!");
            combateStatus.faseTutorial = 2;
            document.getElementById("battleMessage").innerText = "Agora é sua vez! ATAQUE!";
        } else {
            tomarDano(15);
            fazerNarradorFalarInterativo("narradorCombateDisplay", "textoBalaoCombate", "balaoFalaCombate", "Você foi lento e o Ladrão te atingiu! Tente atacar agora!");
            combateStatus.faseTutorial = 2;
        }
    } 
    else if (combateStatus.faseTutorial === 2) { // FASE DE ATAQUE DO JOGADOR
        if (acertou) {
            // --- AQUI ENTRA SUA ANIMAÇÃO NORMAL ---
            rodarAnimacaoSprite(pID, "ataque", 4, 185); 
            
            causarDanoInimigo(25);
            fazerNarradorFalarInterativo("narradorCombateDisplay", "textoBalaoCombate", "balaoFalaCombate", "Belo golpe! A vida dele baixou. Mas olhe, ele está preparando algo perigoso!");
        } else {
            fazerNarradorFalarInterativo("narradorCombateDisplay", "textoBalaoCombate", "balaoFalaCombate", "Você errou o ataque! O Ladrão ri da sua cara!");
        }
        combateStatus.faseTutorial = 3; 
    }
    else if (combateStatus.faseTutorial === 3) { // FASE ESPECIAL DO LADRÃO
        if (acertou) {
            tomarDano(40);
            fazerNarradorFalarInterativo("narradorCombateDisplay", "textoBalaoCombate", "balaoFalaCombate", "Você tentou se defender, mas a adaga dele estava envenenada! Use a Poção!");
        } else {
            tomarDano(70);
            fazerNarradorFalarInterativo("narradorCombateDisplay", "textoBalaoCombate", "balaoFalaCombate", "GOLPE DIRETO! Rápido, abra a mochila!");
        }
        document.getElementById("battleMessage").innerText = "Use a POÇÃO na mochila!";
    }
    else if (combateStatus.faseTutorial === 4) { // FASE FINAL: ESPECIAL
        if (acertou) {
            // --- AQUI ENTRA SUA ANIMAÇÃO DE ESPECIAL ---
            // Supondo que seu especial tenha 6 frames
            rodarAnimacaoSprite(pID, "especial", 6, 185); 

            causarDanoInimigo(50);
            fazerNarradorFalarInterativo("narradorCombateDisplay", "textoBalaoCombate", "balaoFalaCombate", "PODER TOTAL! O Ladrão não teve chance!");
            setTimeout(finalizarCombate, 2500);
        } else {
            fazerNarradorFalarInterativo("narradorCombateDisplay", "textoBalaoCombate", "balaoFalaCombate", "Não desista agora! Tente o Especial de novo!");
        }
    }
}

function finalizarCombate() {
    fazerNarradorFalarInterativo("narradorCombateDisplay", "textoBalaoCombate", "balaoFalaCombate", "Vitória! O Ladrão fugiu aterrorizado!");
    setTimeout(() => {
        carregarCena("porto10");
    }, 3000);
}

// Função para abrir o painel de perguntas
function abrirSubMenu(tipo) {
    tipoAtaqueAtual = tipo;
    document.getElementById("menuCombatePrincipal").style.display = "none";
    document.getElementById("painelMatematico").style.display = "flex";
    proximaPergunta();
}

// Função para aplicar dano ao herói
function tomarDano(quantidade) {
    vidaAtual -= quantidade;
    if (vidaAtual < 0) vidaAtual = 0;
    
    // Atualiza a barra de vida na tela
    const stats = estadoJogo[personagemID];
    document.getElementById("hpAtualNum").innerText = vidaAtual;
    document.getElementById("hpHeroiBar").style.width = (vidaAtual / stats.vidaMax * 100) + "%";

    if (vidaAtual <= 0) {
        alert("Você foi derrotado!");
        location.reload(); // Reinicia o jogo
    }
}

// Função para o botão Fugir
function fugir() {
    alert("Você tentou fugir, mas o tutorial te obriga a lutar!");
}

function causarDanoInimigo(quantidade) {
    combateStatus.hpInimigo = Math.max(0, combateStatus.hpInimigo - quantidade);
    let porcentagem = (combateStatus.hpInimigo / combateStatus.hpInimigoMax) * 100;
    document.getElementById("hpInimigoBar").style.width = porcentagem + "%";
}

// Função para rodar a animação de frames
function rodarAnimacaoSprite(personagem, acao, totalFrames, tempoEntreFrames) {
    const heroiElemento = document.getElementById("heroiSpriteCombate");
    let frameAtual = 1;

    const intervalo = setInterval(() => {
        heroiElemento.style.backgroundImage = `url('imagens/${personagem}_${acao}${frameAtual}.png')`;
        frameAtual++;

        if (frameAtual > totalFrames) {
            clearInterval(intervalo);
            heroiElemento.style.backgroundImage = `url('imagens/${personagem}.png')`;
            
            // NOVIDADE: Faz o inimigo piscar no final da animação de ataque
            const inimigo = document.getElementById("inimigoSprite");
            if(inimigo) {
                inimigo.style.filter = "brightness(3)";
                setTimeout(() => inimigo.style.filter = "none", 150);
            }
        }
    }, tempoEntreFrames);
}