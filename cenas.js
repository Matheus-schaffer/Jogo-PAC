const cenas = {
  // CENA 1: Introdução com Narrador
  "introducao": {
    texto: "Bem-vindo a Neverwinter. Eu serei seu guia nesta jornada.",
    imagem: "imagens/Porto-neverwinter.png",
    musica: "Medieval rua porto.mp3",
    audio: "dublagem/introducao.mp3",
    proximaCena: "historia_cidade" // <-- Indica que o próximo clique vai para aqui
  },

  // CENA 2: Apenas Texto e Imagem (Sem botões)
  "historia_cidade": {
    texto: "Conhecida como A Joia do Norte, a cidade renasce hoje, reconstruída pedra por pedra sob o comando firme de seu Lorde. O barco finalmente se aproxima do porto.",
    imagem: "imagens/Porto-neverwinter.png",
    musica: "Medieval rua porto.mp3",
    proximaCena: "porto" // <-- Próximo clique vai para a escolha
  },

  "porto": {
    texto: "Você desce pela prancha junto a marinheiros, comerciantes e viajantes que se apressam pelas docas.",
    imagem: "imagens/Porto-neverwinter.png",
    musica: "Medieval rua porto.mp3",
    proximaCena: "porto1" // <-- Próximo clique vai para a escolha
  },

  "porto1": {
    texto: "No bolso, sente o peso da carta recebida ainda em sua terra natal — o motivo de sua viagem até aqui.",
    imagem: "imagens/Porto-neverwinter.png",
    musica: "Medieval rua porto.mp3",
    proximaCena: "porto2" // <-- Próximo clique vai para a escolha
  },

  "porto2": {
    texto: "Você guarda a carta e atravessa a pequena ponte que conecta as docas à entrada da cidade. Mas antes de dar mais alguns passos, algo chama sua atenção.",
    imagem: "imagens/Porto-neverwinter.png",
    musica: "Medieval rua porto.mp3",
    proximaCena: "porto3" // <-- Próximo clique vai para a escolha
  },

  "porto3": {
    texto: "Um homem encapuzado revira uma bolsa caída no chão. Assim que percebe você se aproximando, ele se endireita rapidamente, empunhando uma adaga improvisada.",
    imagem: "imagens/Porto-neverwinter.png",
    musica: "Medieval rua porto.mp3",
    proximaCena: "iniciarTutorialLadrao" // <-- Próximo clique vai para a escolha
  },


  // CENA 3: O Porto (Onde as escolhas aparecem)
  "porto10": {
    texto: "O barco atracou no porto de Neverwinter. Para onde você vai primeiro?",
    imagem: "imagens/Porto-neverwinter.png",
    musica: "Medieval rua porto.mp3",
    opcoes: [
      { texto: "Procurar Informação", destino: "rua_principal" },
      { texto: "Revisar a Carta Novamente", destino: "revisar_carta" }
    ]
  },

  "revisar_carta": { 
    texto: "Você relee o pedido.'",
    imagem: "imagens/Carta-durel.jpeg",
    musica: "Medieval rua porto.mp3", 
    som: "flipcard.mp3", 
    opcoes: [
      { texto: "Procurar Informação", destino: "rua_principal" },
    ]
  },
  "taverna": { 
    texto: "Você entra na taverna 'O Dragão Adormecido'. O cheiro de cerveja e suor paira no ar. O que você faz?",
    imagem: "imagens/fundo3.png", 
    musica: "cabana.mp3", 
    opcoes: [
      { texto: "Comprar uma Caneca (Buscar Fofoca)", destino: "taverna_fofoca" },
      { texto: "Sentar no Canto (Esperar)", destino: "taverna_espera" },
      { texto: "Sair da Taverna", destino: "porto" }
    ]
  },
  "taverna_fofoca": { 
    texto: "A garçonete comenta que as pessoas estão com medo de ir para o Leste da cidade devido a boatos de 'sombras'.",
    imagem: "imagens/fundo3.png",
    aoCarregar: () => { progresso.viuFofoca = true; }, // Novo: Registra progresso
    opcoes: [
      { texto: "Perguntar mais sobre as 'sombras'", destino: "taverna_fofoca_detalhe" },
      { texto: "Seguir para a Rua Principal", destino: "rua_principal" }
    ]
  },
  "taverna_fofoca_detalhe": { 
    texto: "Ela diz que é o tipo de problema que só um Aventureiro forte resolveria... Fim da demonstração de aventura. Você pode continuar construindo a história!",
    imagem: "imagens/fundo5.png",
    musica: "music/vitoria.mp3",
    opcoes: [
      { texto: "Voltar ao Porto (Recomeçar)", destino: "porto" }
    ]
  },
  "rua_principal": { 
    texto: "A Rua Principal é movimentada, mas a tensão é visível. Casas estão trancadas.",
    imagem: "imagens/fundo5.png", 
    opcoes: [
      { texto: "Voltar ao Porto", destino: "porto" },
      { texto: "Seguir adiante (Próximo Capítulo)", destino: "taverna_fofoca_detalhe" } 
    ]
  },
  "taverna_espera": {
    texto: "Você espera por um tempo. Ninguém fala nada interessante, mas você descansa um pouco.",
    imagem: "imagens/fundo3.png",
    opcoes: [
      { texto: "Voltar a Pensar", destino: "taverna" }
    ]
  },
  // NOVA CENA: GAME OVER
  "game_over": {
    texto: "Sua vida se esvaiu. O Orc Guerreiro/Herói cai em Neverwinter, e a carta nunca é entregue. FIM DE JOGO.",
    imagem: "imagens/gameover.png", // Imagem de Game Over
    musica: "derrota.mp3", // Música de derrota (se tiver)
    opcoes: [
        { texto: "Recomeçar do Início", destino: "porto" }
    ]
  }
};

let cenaAtualId = "porto"; 