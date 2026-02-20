// Seleção de elementos
const formulario = document.querySelector("#formularioTransacao");
const descricao = document.querySelector("#descricao");
const valor = document.querySelector("#valor");
const tipo = document.querySelector("#tipo");
const data = document.querySelector("#data");
const mensagemErro = document.querySelector("#mensagemErro");
const listaTransacoes = document.querySelector("#listaTransacoes");
const elementoReceitas = document.querySelector("#totalReceitas");
const elementoDespesas = document.querySelector("#totalDespesas");
const elementoSaldo = document.querySelector("#saldo");

let transacoes = [];

// Formata número em moeda brasileira
function formatarMoeda(numero) {
    return numero.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// Salva no localStorage
function salvarTransacoes() {
    localStorage.setItem("transacoes", JSON.stringify(transacoes));
}

// Carrega do localStorage
function carregarTransacoes() {
    const dados = localStorage.getItem("transacoes");
    if (dados) {
        transacoes = JSON.parse(dados);
        renderizarTransacoes();
        atualizarResumo();
    }
}

// Adiciona uma nova transação
function adicionarTransacao(e) {
    e.preventDefault();

    const descricaoDigitada = descricao.value.trim();
    const valorDigitado = Number(valor.value.trim());
    const tipoSelecionado = tipo.value.trim();

    if (descricaoDigitada === "" || valorDigitado <= 0) {
        mensagemErro.textContent = "Preencha todos os campos corretamente!";
        mensagemErro.style.display = "block";
        setTimeout(() => mensagemErro.style.display = "none", 3000);
        return;
    }

    let dataFinal = "";
    const dataDigitada = data.value.trim();
    if (dataDigitada !== "") {
        const partes = dataDigitada.split("-");
        dataFinal = `${partes[2]}/${partes[1]}/${partes[0]}`;
    } else {
        dataFinal = "Sem data!";
    }

    const novaTransacao = {
        descricao: descricaoDigitada,
        valor: valorDigitado,
        tipo: tipoSelecionado,
        data: dataFinal
    };

    transacoes.push(novaTransacao);
    salvarTransacoes();
    renderizarTransacoes();
    atualizarResumo();

    // Limpa o formulário
    descricao.value = "";
    valor.value = "";
    tipo.value = "Receita";
    data.value = "";
}

// Renderiza as transações no histórico
function renderizarTransacoes() {
    listaTransacoes.innerHTML = "";

    transacoes.forEach((t, index) => {
        const liTransacao = document.createElement("li");
        liTransacao.classList.add(t.tipo === "Despesa" ? "liDespesa" : "liReceita");

        const textoDescricao = document.createElement("h3");
        textoDescricao.textContent = t.descricao;
        liTransacao.appendChild(textoDescricao);

        const spanValor = document.createElement("span");
        spanValor.textContent = formatarMoeda(t.valor);
        liTransacao.appendChild(spanValor);

        const spanData = document.createElement("span");
        spanData.textContent = t.data;
        liTransacao.appendChild(spanData);

        const botaoRemover = document.createElement("button");
        botaoRemover.textContent = "X";
        botaoRemover.addEventListener("click", () => {
            transacoes.splice(index, 1);
            salvarTransacoes();
            renderizarTransacoes();
            atualizarResumo();
        });
        liTransacao.appendChild(botaoRemover);

        listaTransacoes.appendChild(liTransacao);
    });
}

// Atualiza receitas, despesas e saldo
function atualizarResumo() {
    const resumo = transacoes.reduce((acumulador, t) => {
        if (t.tipo === "Receita") acumulador.receitas += t.valor;
        else acumulador.despesas += t.valor;
        return acumulador;
    }, { receitas: 0, despesas: 0 });

    const saldo = resumo.receitas - resumo.despesas;

    elementoReceitas.textContent = formatarMoeda(resumo.receitas);
    elementoDespesas.textContent = formatarMoeda(resumo.despesas);
    elementoSaldo.textContent = formatarMoeda(saldo);

    if (saldo < 0) {
        elementoSaldo.classList.add("saldoNegativo");
        elementoSaldo.classList.remove("saldoPositivo");
    } else {
        elementoSaldo.classList.add("saldoPositivo");
        elementoSaldo.classList.remove("saldoNegativo");
    }
}

// Event listener do formulário
formulario.addEventListener("submit", adicionarTransacao);

// Carrega transações ao iniciar
carregarTransacoes();
