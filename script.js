let usuario = null;

let medicoes = [];


// MOSTRAR CADASTRO

function mostrarCadastro() {

    document.getElementById("telaLogin").classList.add("escondido");

    document.getElementById("telaCadastro").classList.remove("escondido");

}


// MOSTRAR LOGIN

function mostrarLogin() {

    document.getElementById("telaCadastro").classList.add("escondido");

    document.getElementById("telaLogin").classList.remove("escondido");

}


// CADASTRAR

function cadastrar() {

    let nome = document.getElementById("cadastroNome").value;

    let email = document.getElementById("cadastroEmail").value;

    let senha = document.getElementById("cadastroSenha").value;

    let idade = document.getElementById("cadastroIdade").value;


    if (nome === "" || email === "" || senha === "" || idade === "") {

        alert("Preencha todos os campos.");

        return;

    }


    usuario = {

        nome: nome,
        email: email,
        senha: senha,
        idade: idade

    };


    alert("Cadastro realizado com sucesso!");

    document.getElementById("loginNome").value = nome;

    document.getElementById("loginEmail").value = email;

    document.getElementById("loginSenha").value = senha;


    mostrarLogin();

}


// ENTRAR

function entrar() {

    let nome = document.getElementById("loginNome").value;

    let email = document.getElementById("loginEmail").value;

    let senha = document.getElementById("loginSenha").value;


    if (nome === "" || email === "" || senha === "") {

        alert("Preencha todos os campos.");

        return;

    }


    if (usuario === null) {

        usuario = {

            nome: nome,
            email: email,
            senha: senha

        };

    }


    document.getElementById("telaLogin").classList.add("escondido");

    document.getElementById("telaCadastro").classList.add("escondido");

    document.getElementById("sistema").classList.remove("escondido");


    document.getElementById("nomeUsuario").textContent = usuario.nome;


    atualizarDashboard();

}


// SAIR

function sair() {

    document.getElementById("sistema").classList.add("escondido");

    document.getElementById("telaLogin").classList.remove("escondido");

}


// MOSTRAR PÁGINA

function mostrarPagina(pagina) {

    let paginas = document.querySelectorAll(".pagina");


    paginas.forEach(function(item) {

        item.classList.add("escondido");

    });


    document.getElementById(pagina).classList.remove("escondido");


    if (pagina === "historico") {

        atualizarHistorico();

    }


    if (pagina === "alertas") {

        atualizarAlertas();

    }

}


// REGISTRAR MEDIÇÃO

function registrarMedicao() {

    let sistolica = Number(
        document.getElementById("sistolica").value
    );


    let diastolica = Number(
        document.getElementById("diastolica").value
    );


    let batimentos = Number(
        document.getElementById("batimentos").value
    );


    if (
        sistolica <= 0 ||
        diastolica <= 0 ||
        batimentos <= 0
    ) {

        alert("Digite valores válidos.");

        return;

    }


    let data = new Date();

    let dataFormatada =
        data.toLocaleDateString("pt-BR") +
        " " +
        data.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit"
        });


    let status = verificarStatus(
        sistolica,
        diastolica,
        batimentos
    );


    let novaMedicao = {

        data: dataFormatada,

        sistolica: sistolica,

        diastolica: diastolica,

        batimentos: batimentos,

        status: status

    };


    medicoes.push(novaMedicao);


    document.getElementById("sistolica").value = "";

    document.getElementById("diastolica").value = "";

    document.getElementById("batimentos").value = "";


    document.getElementById("mensagemRegistro").innerHTML =
        `<div class="alerta normal">
            Medição registrada com sucesso!
        </div>`;


    atualizarDashboard();

    atualizarAlertas();

}


// VERIFICAR STATUS

function verificarStatus(sistolica, diastolica, batimentos) {

    if (
        sistolica >= 180 ||
        diastolica >= 120
    ) {

        return "Atenção";

    }


    if (
        sistolica >= 140 ||
        diastolica >= 90
    ) {

        return "Atenção";

    }


    if (
        batimentos > 100 ||
        batimentos < 50
    ) {

        return "Atenção";

    }


    return "Dentro do exemplo";

}


// ATUALIZAR DASHBOARD

function atualizarDashboard() {

    document.getElementById("quantidadeMedicoes").textContent =
        medicoes.length;


    if (medicoes.length === 0) {

        document.getElementById("pressaoAtual").textContent =
            "-- / -- mmHg";

        document.getElementById("batimentosAtual").textContent =
            "-- BPM";

        return;

    }


    let ultima =
        medicoes[medicoes.length - 1];


    document.getElementById("pressaoAtual").textContent =
        ultima.sistolica +
        " / " +
        ultima.diastolica +
        " mmHg";


    document.getElementById("batimentosAtual").textContent =
        ultima.batimentos +
        " BPM";


    mostrarAlertaDashboard(ultima);

}


// ALERTA DO DASHBOARD

function mostrarAlertaDashboard(medicao) {

    let alerta =
        document.getElementById("alertaDashboard");


    if (medicao.status === "Atenção") {

        alerta.className =
            "alerta atencao";

        alerta.textContent =
            "⚠️ Atenção: o valor registrado merece acompanhamento profissional.";

    } else {

        alerta.className =
            "alerta normal";

        alerta.textContent =
            "❤️ Sua medição foi registrada. Continue acompanhando sua saúde.";

    }

}


// ATUALIZAR HISTÓRICO

function atualizarHistorico() {

    let tabela =
        document.getElementById("tabelaHistorico");


    tabela.innerHTML = "";


    if (medicoes.length === 0) {

        tabela.innerHTML = `
            <tr>
                <td colspan="4">
                    Nenhuma medição registrada.
                </td>
            </tr>
        `;

        return;

    }


    for (let i = medicoes.length - 1; i >= 0; i--) {

        let medicao = medicoes[i];


        let classe =
            medicao.status === "Atenção"
                ? "alerta atencao"
                : "alerta normal";


        tabela.innerHTML += `

            <tr>

                <td>
                    ${medicao.data}
                </td>

                <td>
                    ${medicao.sistolica} /
                    ${medicao.diastolica} mmHg
                </td>

                <td>
                    ${medicao.batimentos} BPM
                </td>

                <td>
                    <span class="${classe}">
                        ${medicao.status}
                    </span>
                </td>

            </tr>

        `;

    }

}


// ATUALIZAR ALERTAS

function atualizarAlertas() {

    let lista =
        document.getElementById("listaAlertas");


    lista.innerHTML = "";


    if (medicoes.length === 0) {

        lista.innerHTML = `
            <div class="alerta informacao">
                ℹ️ Registre uma medição para verificar possíveis alertas.
            </div>
        `;

        return;

    }


    let ultima =
        medicoes[medicoes.length - 1];


    if (ultima.status === "Atenção") {

        lista.innerHTML = `

            <div class="alerta atencao">

                ⚠️ A última medição apresentou valores que
                merecem atenção.

                <br><br>

                Pressão:
                ${ultima.sistolica}/${ultima.diastolica} mmHg

                <br>

                Frequência cardíaca:
                ${ultima.batimentos} BPM

                <br><br>

                Considere conversar com um profissional
                de saúde para avaliação adequada.

            </div>

        `;

    } else {

        lista.innerHTML = `

            <div class="alerta normal">

                ❤️ Nenhum alerta identificado na última medição
                registrada pelo sistema.

                <br><br>

                Pressão:
                ${ultima.sistolica}/${ultima.diastolica} mmHg

                <br>

                Frequência cardíaca:
                ${ultima.batimentos} BPM

            </div>

        `;

    }

}