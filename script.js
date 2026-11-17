let indiceAtual = 0;
    const slides = document.querySelectorAll('.slide');
    const bolinhas = document.querySelectorAll('.bolinha');
    let temporizador; // Variável para guardar o relógio

    function atualizarSlider() {
        for (let i = 0; i < slides.length; i++) { //lê tudo e tira a classe ativo das bolinhas e das imagens
            slides[i].classList.remove('ativo'); 
            bolinhas[i].classList.remove('ativo'); 
        }
        slides[indiceAtual].classList.add('ativo'); //coloca o ativo na bolinha e na imagem atual
        bolinhas[indiceAtual].classList.add('ativo');
    }

    function mudarSlide(direcao) {
        indiceAtual = indiceAtual + direcao; //seta direita: direcao=1. seta esquerda: direcao=-1
        
        if (indiceAtual >= slides.length) {
            indiceAtual = 0; //se o indice for maior que o total, volta à primeira
        } else if (indiceAtual < 0) {
            indiceAtual = slides.length - 1; //se andarmos para a esquerda, ele vai para a ultima
        }
        
        atualizarSlider(); 
        resetarTemporizador(); // Recomeça os 20seg do autoslide
    }

    function irParaSlide(indice) { //quando se clica na bolinha
        indiceAtual = indice;
        atualizarCarrossel(); 
        resetarTemporizador(); 
    }

    // avança para a proxima imagem (usado no autoslide de 20seg)
    function proximoSlideAutomatico() {
        indiceAtual++;
        if (indiceAtual >= slides.length) {
            indiceAtual = 0;
        }
        atualizarCarrossel();
    }

    // Inicia o relógio de 20 segundos
    function iniciarTemporizador() {
        temporizador = setInterval(proximoSlideAutomatico, 20000);
    }

    // Para o relógio antigo e começa um novo
    function resetarTemporizador() {
        clearInterval(temporizador);
        iniciarTemporizador();
    }

    // Arranca assim que a página é aberta
    iniciarTemporizador();

    // Efeito de scroll na barra de navegação (Para ela seguir com a página)
    window.addEventListener('scroll', function() {
        const menu = document.getElementById('menu-navegacao');
        const alturaCabecalho = window.innerHeight * 0.05;  
        //quando desces 5% da tela, o cabecalho começa a seguir
        if (window.scrollY > alturaCabecalho) {
            menu.classList.add('fixo');
        } else {
            menu.classList.remove('fixo');
        }
    });

    // ----------------------------------- TEMPO -----------------------------------

    // Atualiza o elemento com a data e a hora atuais
    function atualizarDataHora() {
        const elemento = document.getElementById("DataHora");

        // Se a página não tiver o elemento, sai sem dar erro
        if (!elemento) return;

        const agora = new Date();

        const data = agora.toLocaleDateString("pt-PT", {
            day: "numeric",
            month: "short",  
            year: "numeric"
        });

        // Hora
        const hora = agora.toLocaleTimeString("pt-PT", {
            hour: "2-digit",
            minute: "2-digit"
        });

        // Data numa linha e hora na outra
        elemento.innerHTML = data + "<br>" + hora;
    }

    // Mostra logo ao carregar e depois repete a cada 1seg
    atualizarDataHora();
    setInterval(atualizarDataHora, 1000);

    // ----------------------------------- SOM -----------------------------------
    const botaoSom = document.getElementById("btnSom");
    const somAnimal = document.getElementById("somAnimal");

    // Só liga o botão se a página tiver o botão e o áudio (evita erros nas outras páginas)
    if (botaoSom && somAnimal) {
    botaoSom.addEventListener("click", function () {
        somAnimal.currentTime = 0;   // volta ao início, para poder clicar várias vezes seguidas
        somAnimal.play();            // reproduz o som
    });
}

// QUIZ

const perguntasQuiz = [
    {
        pergunta: "Qual é a velocidade máxima aproximada de um Urso Pardo?",
        opcoes: ["20 km/h", "35 km/h", "50 km/h", "70 km/h"],
        respostaCorreta: 2 // 50 km/h
    },
    {
        pergunta: "A dieta de um Urso Pardo é maioritariamente baseada em:",
        opcoes: ["Carne", "Matéria vegetal", "Insetos", "Peixe"],
        respostaCorreta: 1 // Matéria vegetal
    },
    {
        pergunta: "Qual é a principal base da alimentação do Lince Ibérico na natureza?",
        opcoes: ["Ratos e pequenos roedores", "Coelho-bravo", "Aves de pequeno porte", "Peixes de rio"],
        respostaCorreta: 1 // Coelho-bravo
    },
    {
        pergunta: "Quantos ossos (vértebras cervicais) tem o longo pescoço de uma girafa?",
        opcoes: ["7 vértebras (igual aos humanos)", "12 vértebras", "25 vértebras", "Mais de 40 vértebras"],
        respostaCorreta: 0 // 7 vértebras
    },
    {
        pergunta: "Por que motivo os flamingos têm a plumagem cor-de-rosa?",
        opcoes: ["É uma característica genética", "Devido ao sol forte nos seus habitats", "Para camuflagem ao pôr do sol", "Devido aos pigmentos da sua alimentação"],
        respostaCorreta: 3 // Devido à sua alimentação (crustáceos e algas)
    }
];

let indicePerguntaAtual = 0;
let pontuacao = 0;
const valorPorPergunta = 4;

// Nova array para guardar as escolhas enquanto o utilizador anda para trás e para a frente
let respostasUtilizador = []; 

const elementoPergunta = document.getElementById("texto-pergunta");
const containerOpcoes = document.getElementById("opcoes-container");
const contador = document.getElementById("contador-perguntas");
const btnAnterior = document.getElementById("btn-anterior");
const btnProximo = document.getElementById("btn-proximo");
const btnSubmeter = document.getElementById("btn-submeter");

function carregarPergunta() {
    const dadosPergunta = perguntasQuiz[indicePerguntaAtual];
    
    elementoPergunta.innerText = dadosPergunta.pergunta;
    contador.innerText = `Pergunta ${indicePerguntaAtual + 1} de ${perguntasQuiz.length}`;
    
    containerOpcoes.innerHTML = "";
    btnProximo.style.display = "none";
    btnSubmeter.style.display = "none";

    // Mostra ou esconde o botão Anterior
    btnAnterior.style.display = (indicePerguntaAtual === 0) ? "none" : "inline-block";
    
    for (let i = 0; i < dadosPergunta.opcoes.length; i++) {
        const botao = document.createElement("button");
        botao.innerText = dadosPergunta.opcoes[i];
        botao.classList.add("opcao-btn");
        
        // Se o utilizador já tinha respondido a esta pergunta, volta a pintar o botão selecionado
        if (respostasUtilizador[indicePerguntaAtual] === i) {
            botao.classList.add("selecionada");
            
            // Reativa o botão Próximo ou Submeter
            if (indicePerguntaAtual < perguntasQuiz.length - 1) {
                btnProximo.style.display = "inline-block";
            } else {
                btnSubmeter.style.display = "inline-block";
            }
        }
        
        botao.onclick = () => selecionarResposta(botao, i);
        containerOpcoes.appendChild(botao);
    }
}

// Substitui a antiga verificarResposta
function selecionarResposta(botaoClicado, indiceClicado) {
    const todosBotoes = containerOpcoes.children;
    
    // Tira a classe 'selecionada' de todas as opções
    for (let i = 0; i < todosBotoes.length; i++) {
        todosBotoes[i].classList.remove("selecionada");
    }
    
    // Pinta apenas a opção clicada
    botaoClicado.classList.add("selecionada");
    
    // Guarda a resposta na memória
    respostasUtilizador[indicePerguntaAtual] = indiceClicado;
    
    // Mostra o botão para avançar
    if (indicePerguntaAtual < perguntasQuiz.length - 1) {
        btnProximo.style.display = "inline-block";
    } else {
        btnSubmeter.style.display = "inline-block";
    }
}

function avancarPergunta(direcaoquiz) {
    indicePerguntaAtual = indicePerguntaAtual + direcaoquiz;
    carregarPergunta();
}

function mostrarResultados() {
    contador.style.display = "none";
    document.querySelector(".quiz-controlos").style.display = "none"; // Esconde os botões
    
    pontuacao = 0;
    let htmlResumo = '<div class="resumo-quiz">';

    // Avalia todas as respostas de uma só vez
    for (let i = 0; i < perguntasQuiz.length; i++) {
        const respostaDada = respostasUtilizador[i];
        const respostaCerta = perguntasQuiz[i].respostaCorreta;
        const acertou = (respostaDada === respostaCerta);
        
        if (acertou) {
            pontuacao += valorPorPergunta;
        }

        const textoDada = (respostaDada !== undefined) ? perguntasQuiz[i].opcoes[respostaDada] : "Não respondeu";
        const textoCerta = perguntasQuiz[i].opcoes[respostaCerta];
        const classeItem = acertou ? "certo" : "errado";

        htmlResumo += `
            <div class="resumo-item ${classeItem}">
                <strong>Pergunta ${i + 1}: ${perguntasQuiz[i].pergunta}</strong><br>
                A tua resposta: ${textoDada} ${acertou ? '✅' : '❌ (A correta era: ' + textoCerta + ')'}
            </div>
        `;
    }
    htmlResumo += '</div>';

    let mensagem;
    if (pontuacao >= 16) mensagem = "Biólogo Especialista!";
    else if (pontuacao >= 10) mensagem = "Explorador Atento!";
    else mensagem = "Ainda muito a aprender!";

    elementoPergunta.innerText = "Resultados do Quiz";
    
    // Removemos a grelha para os resultados ocuparem o ecrã todo
    containerOpcoes.style.display = "block";
    
    containerOpcoes.innerHTML = `
        <div style="text-align: center;">
            <p style="font-size: 150%;">Pontuação: <strong>${pontuacao} / ${perguntasQuiz.length * valorPorPergunta}</strong></p>
            <p style="color: #b75353; font-size: 120%; font-weight: bold;">${mensagem}</p>
        </div>
        ${htmlResumo}
    `;
}

carregarPergunta();