async function carregarComponente(caminho, seletor, callback = () => {}) {
    const container = document.querySelector(seletor);
    if (!container) {
        console.error(`Container com seletor "${seletor}" não encontrado no DOM.`);
        return; 
    }

    try {
        const resposta = await fetch(caminho);
        if (!resposta.ok) {
            throw new Error(`Erro ${resposta.status}: Arquivo não encontrado em ${caminho}. (Verifique o Live Server!)`);
        }
        const html = await resposta.text();
        
        container.innerHTML = html;
        callback();
        
    } catch (erro) {
        console.error(`Falha Crítica ao carregar ${seletor}:`, erro);
    }
}

function inicializarHeader() {
    const header = document.querySelector(".Cabecalho");
    const subBarra = document.querySelector(".sub-barra");
    const botoesNav = document.querySelector(".BOTOES");
    
    if (!header || !subBarra || !botoesNav) {
        console.warn("Elementos de classe .Cabecalho, .sub-barra ou .BOTOES não encontrados para inicializar interações. Verifique o HTML do header.html.");
        return; 
    }
    
    header.addEventListener("click", function () {
        this.style.backgroundColor =
            this.style.backgroundColor === "black" ? "#B71C1C" : "black";
    });

    function mostrarSaudacao() {

        header.querySelectorAll('.saudacao-texto, .botao-edicao-isolado').forEach(el => el.remove());
        
        let nome = localStorage.getItem("nomeUsuario");

        if (nome) {
           
            const saudacao = document.createElement("p");
            saudacao.classList.add('saudacao-texto');
            saudacao.textContent = `Bem-vindo(a), ${nome}!`;
            saudacao.style.cssText = "color: white; font-weight: 700; text-align: center; margin: 6px 0 10px 0; font-size: 16px;"; // Mantém o estilo original do header p


            const botaoEditar = document.createElement("button");
            botaoEditar.classList.add('botao-edicao-isolado'); 
            botaoEditar.innerHTML = 'Editar nome';


            botaoEditar.style.cssText = `
                position: absolute;
                top: 18px; 
                right: 20px; 
                background: none; 
                border: none;
                cursor: pointer; 
                font-size: 16px; 
                padding: 0; 
                margin: 0;
                line-height: 1;
                opacity: 0.8; 
                z-index: 1000;
                transition: opacity 0.2s, transform 0.2s;
                color: white;
            `;
            

            botaoEditar.onmouseover = () => {
                botaoEditar.style.opacity = '1';
                botaoEditar.style.transform = 'scale(1.1)';
            };
            botaoEditar.onmouseout = () => {
                botaoEditar.style.opacity = '0.8';
                botaoEditar.style.transform = 'scale(1)';
            };
            

            botaoEditar.addEventListener('click', (e) => {
                e.stopPropagation();
                const novoNome = prompt("Digite seu novo nome:");
                if (novoNome && novoNome.trim() !== "") {
                    localStorage.setItem("nomeUsuario", novoNome.trim());
                    mostrarSaudacao();
                }
            });

            header.appendChild(saudacao);
            header.appendChild(botaoEditar);
        }
    }
    mostrarSaudacao();



    header.addEventListener("mouseenter", () => {
        header.style.transition = "0.3s";
        header.style.transform = "scale(1.001)";
        header.style.boxShadow = "0 0 10px rgba(255, 255, 255, 0.3)";
    });
    header.addEventListener("mouseleave", () => {
        header.style.transform = "scale(1)";
        header.style.boxShadow = "none";
    });

    const underline = document.createElement("div");
    underline.classList.add("header-underline");
    botoesNav.appendChild(underline); 

    const menuItens = document.querySelectorAll(".começo-itens a");

    menuItens.forEach(item => {
        item.addEventListener("mouseenter", () => {
            const rect = item.getBoundingClientRect();
            const botoesRect = botoesNav.getBoundingClientRect();

            underline.style.width = `${rect.width}px`;
            underline.style.left = `${rect.left - botoesRect.left + rect.width / 2}px`;

            underline.style.top = `${subBarra.offsetTop - 3}px`;
        });

        item.addEventListener("mouseleave", () => {
            underline.style.width = "0";
        });
    });
}


// ... (Código da função inicializarHeader) ...

// Ação principal de carregamento no DOMContentLoaded
document.addEventListener('DOMContentLoaded', async () => {
    // Carrega o Header e inicializa suas interações
    await carregarComponente('componentes/header.html', '#header-container', inicializarHeader);
    
    // Carrega o Footer e DEPOIS inicializa a lógica do botão Voltar ao Topo
    await carregarComponente('componentes/footer.html', '#footer-container', inicializarFooter);
});

// Implementação da função de inicialização do Footer
function inicializarFooter() {
    const btnTopo = document.getElementById("btnVoltarTopo");

    if (!btnTopo) {
        console.warn("Botão #btnVoltarTopo não encontrado. Verifique o HTML do footer.html.");
        return;
    }

    // 1. Lógica para mostrar/esconder o botão ao rolar
    window.onscroll = function() {
        // Usa documentElement.scrollTop para compatibilidade entre navegadores
        if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
            btnTopo.style.display = "block";
        } else {
            btnTopo.style.display = "none";
        }
    };
    
    // Força uma verificação imediata, caso a página já esteja carregada e rolada
    window.onscroll(); 

    // 2. Lógica para rolar para o topo ao clicar
    btnTopo.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' 
        });
    });
}