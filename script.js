// ===== Controle de telas =====
function mudarTela(id) {
  document.querySelectorAll("section").forEach(sec => sec.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  // quando voltar pro menu, recomeça a música do menu
  if (id === "menu") {
    sceneMusic.pause();
    sceneMusic.currentTime = 0;
    currentMusic = null;
    bgMusic.play().catch(() => {});
  }
}

// ===== Música =====
const bgMusic = document.getElementById("bgMusic"); 
const sceneMusic = document.getElementById("sceneMusic");

let currentMusic = null;

// Tenta "destravar" o áudio no primeiro clique do usuário
document.body.addEventListener("click", () => {
  if (bgMusic.paused) bgMusic.play().catch(() => {});
  if (sceneMusic.paused) sceneMusic.play().catch(() => {});
  sceneMusic.pause();
}, { once: true });

// ===== Helper para normalizar caminhos (se necessário adiciona 'music/') =====
function fixPath(path) {
  if (!path) return path;
  if (path.startsWith('music/') || path.startsWith('/') || path.startsWith('./') || /^https?:\/\//.test(path)) return path;
  return 'music/' + path;
}

// ===== Falas com imagens, músicas e sons =====
const falas = [
  { 
    textos: ["O barco está prestes a atracar no porto de Neverwinter, a chamada Joia do Norte", "A cidade já passou por guerras e tragédias, mas agora vive dias de reconstrução sob o comando do Lorde Protetor.",
      "O barco atraca.. e", "Você desce entre marinheiros, comerciantes e viajantes que correm pelas docas.", "No bolso, sente o peso da carta recebida ainda em sua terra natal.",
    ],
    imagens: ["imagens/Porto-neverwinter.png", "imagens/Porto-neverwinter.png"],
    musica: "Medieval rua porto.mp3"
  },
  { 
    textos: ["Um pedido de ajuda urgente, que não podia esperar."],
    som: "flipcard.mp3",
      imagens: ["imagens/Carta-durel.jpeg", "imagens/Carta-durel.jpeg"],
  },
  { 
    texto: "Você desperta em uma pequena cabana...",
    imagem: "imagens/fundo3.png",
    musica: "music/cabana.mp3"
  },
  { 
    texto: "Boa sorte, aventureiro!", 
    imagem: "imagens/fundo5.png",
    musica: "music/vitoria.mp3"
  }
];

let indice = 0;
let subIndex = 0;
let typing = false;
let typingInterval = null;
let charIndex = 0;

const dialogBox = document.getElementById("dialogBox");
const fundo = document.getElementById("dialogoFundo");

// escreve com efeito "máquina de escrever"
function escreverTexto(texto) {
  if (typingInterval) clearInterval(typingInterval);
  typing = true;
  dialogBox.innerText = "";
  charIndex = 0;

  typingInterval = setInterval(() => {
    if (charIndex < texto.length) {
      dialogBox.innerText += texto.charAt(charIndex);
      charIndex++;
    } else {
      clearInterval(typingInterval);
      typing = false;
    }
  }, 40);
}

// ---
// ===== Evento de clique no diálogo =====
dialogBox.addEventListener("click", () => {
  // === NOVAS LINHAS ===
  // 1. Se o texto está sendo escrito, apenas o completa e retorna
  if (typing) {
    if (typingInterval) clearInterval(typingInterval);
    const fala = falas[indice];
    const textos = Array.isArray(fala.textos) ? fala.textos : (fala.texto ? [fala.texto] : []);
    dialogBox.innerText = textos[subIndex] || "";
    typing = false;
    return;
  }

  // 2. Se não está digitando, avança para o próximo texto
  const falaAtual = falas[indice];
  const textosAtuais = Array.isArray(falaAtual.textos) ? falaAtual.textos : (falaAtual.texto ? [falaAtual.texto] : []);

  if (subIndex < textosAtuais.length - 1) {
    subIndex++;
  } else {
    subIndex = 0;
    indice++;
  }

  // 3. Verifica se o jogo deve terminar
  if (indice >= falas.length) {
    mudarTela("jogo");
    return;
  }
  
  // === FIM DAS NOVAS LINHAS ===

  // Pega o conteúdo da próxima fala
  const proximaFala = falas[indice];
  const textos = Array.isArray(proximaFala.textos) ? proximaFala.textos : (proximaFala.texto ? [proximaFala.texto] : []);
  const imagens = Array.isArray(proximaFala.imagens) ? proximaFala.imagens : (proximaFala.imagem ? [proximaFala.imagem] : []);
  const soms = Array.isArray(proximaFala.soms) ? proximaFala.soms : (proximaFala.som ? [proximaFala.som] : []);

  const textoAtual = textos[subIndex] || "";

  // escreve o novo texto
  escreverTexto(textoAtual);

  // Troca a imagem apenas se houver uma nova E se ela for diferente da que já está na tela
  const imagemAtualSrc = fundo.src;
  const novaImagem = imagens[subIndex];

  if (novaImagem && !imagemAtualSrc.endsWith(novaImagem)) {
    fundo.style.opacity = 0;
    setTimeout(() => {
      fundo.src = novaImagem;
      fundo.style.opacity = 1;
    }, 200);
  }

  // troca música de fundo SÓ quando for a primeira linha da fala (subIndex === 0)
  if (subIndex === 0 && proximaFala.musica) {
    const caminho = fixPath(proximaFala.musica);
    if (caminho !== currentMusic) {
      currentMusic = caminho;
      sceneMusic.src = caminho;
      sceneMusic.load();
      sceneMusic.volume = 0.4;
      sceneMusic.play().catch(err => console.log("Erro ao tocar cena:", err));
    }
  }

  // toca efeito sonoro correspondente a esse subIndex, se existir
  if (soms[subIndex]) {
    sceneMusic.volume = 0.2;
    const sfx = new Audio(fixPath(soms[subIndex]));
    sfx.volume = 0.8; 
    sfx.play().catch(err => console.log("Erro ao tocar sfx:", err));
    setTimeout(() => {
      sceneMusic.volume = 0.4;
    }, 1500);
  }
});

// ===== Escolha do personagem leva ao diálogo =====
function selecionar(p) {
  localStorage.setItem("personagem", p);
  mudarTela("dialogo");
  indice = 0;
  subIndex = 0;
  escreverTexto("Clique para começar...");

  // para música do menu
  bgMusic.pause();
  bgMusic.currentTime = 0;

  // opcional: já pré-carrega/toca a música do primeiro bloco (se existir)
  if (falas[0] && falas[0].musica) {
    const caminho = fixPath(falas[0].musica);
    currentMusic = caminho;
    sceneMusic.src = caminho;
    sceneMusic.load();
    sceneMusic.volume = 0.4;
    sceneMusic.play().catch(err => console.log("Erro ao tocar cena (pré):", err));
  }
}