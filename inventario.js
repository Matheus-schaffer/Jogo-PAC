function usarItem(nomeItem) {
    if (nomeItem === "Poção de Cura") {
        const stats = estadoJogo[personagemID];
        
        if (vidaAtual >= stats.vidaMax) {
            fazerNarradorFalarInterativo("narradorCombateDisplay", "textoBalaoCombate", "balaoFalaCombate", "Sua vida já está cheia!");
            return;
        }

        // 1. Aumenta a vida logicamente
        vidaAtual = Math.min(vidaAtual + 50, stats.vidaMax);
        
        // 2. Atualiza o HUD principal (o que fica no canto da tela de exploração)
        atualizarHUD(); 

        // --- CORREÇÃO AQUI: Atualiza os elementos específicos da TELA DE COMBATE ---
        if (document.getElementById("hpAtualNum")) {
            document.getElementById("hpAtualNum").innerText = vidaAtual;
        }
        if (document.getElementById("hpHeroiBar")) {
            const porcentagem = (vidaAtual / stats.vidaMax) * 100;
            document.getElementById("hpHeroiBar").style.width = porcentagem + "%";
        }
        // -------------------------------------------------------------------------
        
        // Remove o item do array
        if (typeof inventario !== 'undefined') {
            const index = inventario.indexOf("Poção de Cura");
            if (index > -1) inventario.splice(index, 1);
            if (typeof atualizarGradeInventario === 'function') atualizarGradeInventario();
        }

        // Lógica do Tutorial
        if (combateStatus.faseTutorial === 3) {
            combateStatus.faseTutorial = 4;
            mudarTela('combate');
            setTimeout(() => {
                fazerNarradorFalarInterativo(
                    "narradorCombateDisplay", 
                    "textoBalaoCombate", 
                    "balaoFalaCombate", 
                    "Vida restaurada! O momento é agora: Use seu ESPECIAL para acabar com isso!"
                );
            }, 500);
        }
    }
}

    


function atualizarGradeInventario() {
    const grid = document.getElementById("inventarioGrid");
    if (!grid) return;

    grid.innerHTML = ""; // Limpa o inventario antes de redesenhar

    inventario.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "item-slot"; 
        
       
        const imgNome = item === "Poção de Cura" ? "poc-cura.png" : "item.png";
        
        div.innerHTML = `
            <img src="imagens/${imgNome}" alt="${item}" title="${item}" style="width: 40px; height: 40px;">
            <p style="font-size: 10px; color: white;">${item}</p>
        `;

        div.onclick = () => usarItem(item);
        grid.appendChild(div);
    });
}