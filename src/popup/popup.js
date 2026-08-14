const valorTaxaMinima = 6.69;
const todosArtigos = {
    "47": valorTaxaMinima * 5,
    "52": valorTaxaMinima * 5,
    "60": valorTaxaMinima * 15,
    "75": valorTaxaMinima * 3,
    "103": valorTaxaMinima * 1,
    "2/24": valorTaxaMinima * 1,
    "107/2": valorTaxaMinima * 1,
    "176/1": valorTaxaMinima * 1,
    "176/2": valorTaxaMinima * 1,
    "176/3": valorTaxaMinima * 1,
    "177/1": valorTaxaMinima * 3,
    "177/3": valorTaxaMinima * 3,
    "177/4": valorTaxaMinima * 3,
    "178/1": valorTaxaMinima * 5,
    "178/2": valorTaxaMinima * 5,
    "179/2": valorTaxaMinima * 10,
}
const button = document.getElementById("btn") || "";
const tipoRequerimento = document.querySelector("#tipo-requerimento") || "";
const fieldsetPai = document.querySelector("#copias-docs") || "";
const dependente = document.querySelector("#dependente") || "";
const tipoNome = document.querySelector("#nome") || "";
const mudouNome = document.querySelectorAll(`input[name="mudou-nome[]"]`) || "";
const tipoCertidao = document.querySelectorAll(".certidao-alistado") || "";
const tipoCasa = document.querySelector("#tipo-casa") || "";
const ocupacao = document.querySelector("#input-ocupacao") || "";
const divCarteira = document.querySelector("#carteira") || "";
const labelSalario = document.querySelector("#salario") || "";
let valorSiglaDoc = "";
const dicionarioDocs = {
    "certidao-nascimento": "Cópia da certidão de nascimento",
    "certidao-casamento": "Cópia da certidão de casamento",
    get "documento-foto"(){
        valorSiglaDoc = document.querySelector(`input[name="tipo-documento-foto"]:checked`).value || "";
        return `Cópia do documento com foto (${valorSiglaDoc})`;
    },
    "comprovante-residencia": "Cópia do comprovante de residência",
    "carteira-trabalho": "Cópia da carteira de trabalho",
    "declaracao-autonomo": "Declaração de autônomo",
    "certidao-nascimento-mae": "Cópia da certidão de nascimento da mãe",
    "certidao-casamento-mae": "Cópia da certidão de casamento da mãe",
    "documento-foto-mae": `Cópia do documento com foto da mãe`,
    "certidao-nascimento-filho": "Cópia da certidão de nascimento do(a) filho(a)",
    "documento-foto-filho": `Cópia do documento com foto do(a) filho(a)`,
    "atestado-medico": "Cópia do atestado médico",
    "ficha-socioeconomica": "Ficha socioeconômica para isenção de taxas e multas",
    "gru-art-225-rlsm": "Cópia da GRU do Art. 225 do RLSM",
    "certificado-dispensa-incorporacao": "Certificado de Dispensa de Incorporação",
    "certificado-reservista": "Certificado de Reservista",
    "atestado-desobrigacao": "Atestado de Desobrigação",
};
const listaArquivos = {
    "arrimo": ["../docs/requerimentos/arrimo/arrimo.txt", "../docs/requerimentos/arrimo/declaracao-arrimo.txt", "../docs/requerimentos/arrimo/declaracao-autonomo.txt"],
    "isencao-servico" : ["../docs/requerimentos/isencao-servico/isencao-servico.txt"],
    "isencao-txmt": ["../docs/requerimentos/isencao-txmt/isencao-txmt.txt", "../docs/requerimentos/isencao-txmt/ficha-socioeconomica.txt", "../docs/requerimentos/isencao-txmt/modelo-cidadao.txt"],
    "maior-30" : ["../docs/requerimentos/maior-30/maior-30.txt"],
    "retificacao-dados-cadastrais": ["../docs/requerimentos/retificacao/retificacao-dados-cadastrais.txt"],
};

tipoRequerimento.addEventListener("change", async (event) => {
    fieldsetPai.querySelectorAll("fieldset, div.tipo-dependente").forEach(el => el.classList.add("hidden"));
    fieldsetPai.querySelectorAll("fieldset, input").forEach(el => el.disabled = true);
    const tipoFieldset = fieldsetPai.querySelector(`#tipo-${event.target.value}`) || "";
    if (event.target.value != "vazio") {
        fieldsetPai.classList.remove("hidden");
        fieldsetPai.disabled = false;
        fieldsetPai.querySelectorAll("input").forEach(input => {
            if (input.closest("fieldset") === fieldsetPai) {
                input.disabled = false;
            }
        });
        if (tipoFieldset) {
            tipoFieldset.classList.remove("hidden");
            tipoFieldset.disabled = false;
            tipoFieldset.querySelectorAll("input").forEach(el => el.disabled = false);
            if(tipoFieldset.id == "tipo-arrimo"){
                labelSalario.querySelector("input").disabled = false;
                divCarteira.insertAdjacentElement("beforeend", labelSalario);
                alert("TIPO ARRIMO: ");
            }
        }
    }
    else {
        document.querySelector("#form-docs").reset();
        fieldsetPai.classList.add("hidden");
        fieldsetPai.querySelectorAll("input").forEach(el => el.disabled = true);
    }

    if (event.target.value != "arrimo") {
        tipoCertidao[1].closest("label").classList.remove("hidden");
    }
    else {
        tipoCertidao[1].closest("label").classList.add("hidden");
    }
    try {
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            args: [],
            func: () => {
                const linhaTabela = document.querySelectorAll(".data-table tr") || "";
                //if(linhaTabela[11].cells[0].innerText == "Ocupação"){
                    return linhaTabela[10].cells[1].innerText == "Ocupação" && linhaTabela[11].cells[1].innerText ? linhaTabela[11].cells[1].innerText : "";
                //}
                //else{
                //    return "";
                //}
            }
        }, (selection) => {
            if (selection && selection[0]) {
                ocupacao.value = selection[0].result.split(" ").map(palavra => {
                    return palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase();
                }).join(" ");
            }
        });
    } catch (error) {
        alert("Erro ao carregar o arquivo do projeto. " + error);
    }
});

tipoCertidao[0].addEventListener("change", () => { tipoCertidao[1].checked = false });
tipoCertidao[1].addEventListener("change", () => { tipoCertidao[0].checked = false });

dependente.addEventListener("change", (event) => {
    document.querySelectorAll(".tipo-dependente").forEach(el => el.classList.add("hidden"));
    document.querySelectorAll(".tipo-dependente input").forEach(el => el.checked = false);
    const tipoDependente = document.querySelector(`.tipo-dependente[name="docs-${event.target.value}"]`) || "";
    if (tipoDependente) {
        tipoDependente.classList.remove("hidden");
        tipoDependente.querySelectorAll("input").forEach(el => el.disabled = false);
    }
});

tipoCasa.addEventListener("change", (event) => {
    const labelValorAluguel = document.querySelector(".label-valor-aluguel") || "";
    const inputValorAluguel = document.querySelector(".input-valor-aluguel") || "";
    if (event.target.value == "alugada") {
        labelValorAluguel.classList.remove("hidden");
        inputValorAluguel.disabled = false;
    }
    else if (event.target.value == "propria") {
        labelValorAluguel.classList.add("hidden");
        inputValorAluguel.disabled = true;
        inputValorAluguel.value = null;
    }
});

tipoNome.addEventListener("change", (event) => {
    const mudouNome = document.querySelectorAll(`input[name="mudou-nome[]"]`) || "";
    mudouNome.forEach(tipo => {
        const labelNomeNovo = document.querySelector(`label[name="label-nome-${tipo.value}"]`) || "";
        if(labelNomeNovo){
            labelNomeNovo.classList.toggle("hidden", !tipo.checked);
            labelNomeNovo.disabled = !tipo.checked;
        }
    });
});

button.addEventListener("click", async (event) => {
    event.preventDefault();
    const form = document.querySelector("#form-docs") || "";
    const opcao = tipoRequerimento.value;
    let comecoFrase = "";
    let ultimoItem = "";
    let listaDocs = "";
    const salario = document.querySelector("#input-salario").value || "";
    let salarioExtenso = salario ? extenso(salario, { mode: "currency" }) : "";

    //lista de documentos copiados anexos ao requerimento
    const valoresMarcados = document.querySelectorAll(`
        input[name="documentos[]"]:not([disabled]):checked,
        input[name="carteira-trabalho"]:not([disabled]):checked,
        input[name="tipo-certidao-mae"]:not([disabled]):checked,
        input[name="tipo-certidao-alistado"]:not([disabled]):checked
    `) || "";
    const arrayDocs = Array.from(valoresMarcados).map(doc => dicionarioDocs[doc.value]);

    //cconteudo do requerimento de arrimo de familia
    const tipoArrimo = document.querySelector(`input[name="tipo-dependente"]:checked`) ? document.querySelector(`input[name="tipo-dependente"]:checked`).value : "";
    const nomeArrimo = document.querySelector(`#nome-${tipoArrimo}`) ? document.querySelector(`#nome-${tipoArrimo}`).value : "";
  
    //conteudo do requerimento de isençao de taxa e multa
    const numeroDependentes = document.querySelector("#input-numero-dependentes").value || "";
    const radioTipoCasa = document.querySelector(".radio-tipo-casa:checked")?.value || "";
    const inputValorAluguel = document.querySelector(".input-valor-aluguel").value || "";
    valorSiglaDoc = document.querySelector(`input[name="tipo-documento-foto"]:checked`).value || "";
    alert(valorSiglaDoc)
    let casa;
    if (radioTipoCasa == "alugada") {
        casa = `Casa: ()Própria (X)Alugada - Aluguel: R$ ${inputValorAluguel}`;
    }
    else {
        casa = "Casa: (X)Própria ()Alugada";
    }
    const artigos = document.querySelectorAll(`input[name="artigos[]"]:checked`) || "";
    const arrayArtigos = Array.from(artigos).map(art => art.value);
    let listaArtigos;
    if (arrayArtigos.length == 1) {
        listaArtigos = "Art. " + arrayArtigos.join(", ");
    }
    else {
        let comecoArtigo = arrayArtigos.slice(0, -1).join(", ");
        let ultimoArtigo = arrayArtigos.at(-1);
        listaArtigos = `Arts. ${comecoArtigo} e ${ultimoArtigo}`;
    }
    let valorTotal = 0;
    arrayArtigos.forEach(element => {
        valorTotal = valorTotal + todosArtigos[element];
    });
    valorTotal = valorTotal.toFixed(2);
    let valorExtensoArtigos = "";
    valorExtensoArtigos = extenso(valorTotal.replace(".", ","), { mode: "currency" });
    alert("o valor total e: " + valorTotal);

    //conteudo do requerimento de retificacao de dados cadastrais
    const tipoCertidaoRetificacao = document.querySelector(`input[name="tipo-certidao-retificacao"]:checked`) || "";
    const tipoDocumentoRetificacao = tipoCertidaoRetificacao ? dicionarioDocs[tipoCertidaoRetificacao.value] : "";
    const novoNome = document.querySelectorAll(`input[name="texto-nome-retificado[]"]`) || "";
    const listaNovoNome = Array.from(novoNome).map(nome => nome.value.trim()).filter(valor => valor !== "");

    const quemMudouNome = document.querySelectorAll(`input[name="mudou-nome[]"]:checked`) || "";
    const listaQuemMudouNome = Array.from(quemMudouNome).map(quemMudou => quemMudou.value);
    const paresQuemMudou = listaQuemMudouNome.map((element, index) => [element, listaNovoNome[index]]);
    /*console.dir(listaNovoNome);
    alert(listaQuemMudouNome);
    alert(paresQuemMudou);
    alert(tipoDocumentoRetificacao);*/
    
    function criarParagrafo(arrayFrases){
        const comprovanteResidencia = arrayFrases.splice(arrayFrases.indexOf(dicionarioDocs["comprovante-residencia"]), 1);
        arrayFrases.splice(arrayFrases.length, 0, comprovanteResidencia);
        comecoFrase = arrayFrases.slice(0, -1).join(", ");
        ultimoItem = arrayFrases.at(-1)
        listaDocs = `${comecoFrase} e ${ultimoItem}`;
    }

    switch (opcao) {
        case "vazio":
            alert("Por favor, selecione uma opção válida");
            break;
        case "arrimo":
            alert("Arrimo de Família");
            criarParagrafo(arrayDocs);
            break;
        case "isencao-servico":
            alert("Isenção do Serviço Militar");
            criarParagrafo(arrayDocs);
            break;
        case "isencao-txmt":
            alert("Isenção de Taxas e Multas");
            const fichaSocioeconomica = arrayDocs.splice(arrayDocs.indexOf(dicionarioDocs["ficha-socioeconomica"]), 1);
            const gru225 = arrayDocs.slice(arrayDocs.indexOf(dicionarioDocs["gru-art-225-rlsm"]));
            arrayDocs.splice(0, 0, fichaSocioeconomica);
            criarParagrafo(arrayDocs);
            break;
        case "maior-30":
            alert("Maior de 30 anos");
            criarParagrafo(arrayDocs);
            break;
        case "retificacao-dados-cadastrais":
            alert("Retificação de dados cadastrais");
            criarParagrafo(arrayDocs);
            break;
    }

    alert("array dos docs: " + arrayDocs);
    await lerArquivo(opcao, listaDocs, tipoArrimo, nomeArrimo, numeroDependentes, ocupacao.value, salario, salarioExtenso, casa, listaArtigos, valorTotal, valorExtensoArtigos, tipoDocumentoRetificacao, paresQuemMudou);
    //window.location.reload();
    async function lerArquivo(opcao, listaDocs, tipoArrimo, nomeArrimo, numeroDependentes, ocupacao, salario, salarioExtenso, casa, listaArtigos, valorTotal, valorExtensoArtigos, tipoDocumentoRetificacao, paresQuemMudou) {
    alert(`Estamos dentro da funcao "lerAquivo" agora`);
        try {
            let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                args: [opcao, listaDocs, tipoArrimo, nomeArrimo, numeroDependentes, ocupacao, salario, salarioExtenso, casa, listaArtigos, valorTotal, valorExtensoArtigos, tipoDocumentoRetificacao, paresQuemMudou],
                func: async (opcao, listaDocs, tipoArrimo, nomeArrimo, numeroDependentes, ocupacao, salario, salarioExtenso, casa, listaArtigos, valorTotal, valorExtensoArtigos, tipoDocumentoRetificacao, paresQuemMudou) => {
                    const linhaTabela = document.querySelectorAll(".data-table tr") || "";
                    const nomeSermilAlistado = linhaTabela[0].cells[1].innerText || "";
                    const nomeSermilMae = linhaTabela[1].cells[1].innerText || "";
                    const nomeSermilPai = linhaTabela[3].cells[1].innerText || "";

                    const data = new Date();
                    const dia = String(data.getDate()).padStart(2, "0");
                    const mes = [
                        "janeiro",
                        "fevereiro",
                        "março",
                        "abril",
                        "maio",
                        "junho",
                        "julho",
                        "agosto",
                        "setembro",
                        "outubro",
                        "novembro",
                        "dezembro"
                    ];
                    const ano = data.getFullYear();
                    const dataAtual = dia + " de " + mes[data.getMonth()] + " de " + ano;
                    const dataNascimento = document.querySelector(".data-table")?.rows[2]?.cells[1]?.innerText?.split("/") || ["01", "01", "2000"];

                    const estados = {
                        "AC": "Acre",
                        "AL": "Alagoas",
                        "AP": "Amapá",
                        "AM": "Amazonas",
                        "BA": "Bahia",
                        "CE": "Ceará",
                        "DF": "Distrito Federal",
                        "ES": "Espírito Santo",
                        "GO": "Goiás",
                        "MA": "Maranhão",
                        "MT": "Mato Grosso",
                        "MS": "Mato Grosso do Sul",
                        "MG": "Minas Gerais",
                        "PA": "Pará",
                        "PB": "Paraíba",
                        "PR": "Paraná",
                        "PE": "Pernambuco",
                        "PI": "Piauí",
                        "RJ": "Rio de Janeiro",
                        "RN": "Rio Grande do Norte",
                        "RS": "Rio Grande do Sul",
                        "RO": "Rondônia",
                        "RR": "Roraima",
                        "SC": "Santa Catarina",
                        "SP": "São Paulo",
                        "SE": "Sergipe",
                        "TO": "Tocantins"
                    };
                    const localNascimento = document.querySelector(".data-table")?.rows[4]?.cells[1]?.innerText?.split(" - ") || "";

                    const conectivos = ["da", "de", "do", "e"];
                    function capitalizar(texto){
                        return texto.split(" ").map(palavra => {
                            if (conectivos.includes(palavra.toLowerCase())) {
                                return palavra.toLowerCase();
                            }
                            return palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase();
                        }).join(" ");
                    }
                    
                    const dicionario = {
                        "DATAATUAL": dataAtual,
                        get "NOMECIDADAO"(){
                            let novoNome = "";
                            if(opcao == "retificacao-dados-cadastrais"){
                                paresQuemMudou.forEach(([chave, valor]) => {
                                    if(chave == "alistado"){
                                        novoNome = valor.toUpperCase();
                                    }
                                });
                                return novoNome;
                            }
                            else{
                                return nomeSermilAlistado;
                            }
                        },
                        get "CPFCIDADAO"() {
                            let cpf = linhaTabela[10].cells[1].innerText || "";
                            cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
                            cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
                            cpf = cpf.replace(/(\d{3})(\d{1,2})/, "$1-$2");
                            return "CPF: " + cpf;
                        },
                        get "PAICIDADAO"(){
                            let novoNome = nomeSermilPai;
                            if(opcao == "retificacao-dados-cadastrais"){
                                paresQuemMudou.forEach(([chave, valor]) => {
                                    if(chave == "pai"){
                                        novoNome = capitalizar(valor);
                                    }
                                });
                                return capitalizar(novoNome);
                            }
                            else{
                                return capitalizar(nomeSermilPai);
                            }
                        },
                        get "MAECIDADAO"(){
                            let novoNome = nomeSermilMae;
                            if(opcao == "retificacao-dados-cadastrais"){
                                paresQuemMudou.forEach(([chave, valor]) => {
                                    if(chave == "mae"){
                                        novoNome = capitalizar(valor);
                                    }
                                });
                                return capitalizar(novoNome);
                            }
                            else{
                                return capitalizar(nomeSermilMae);
                            }
                        },
                        "DIAN": dataNascimento[0],
                        "MESN": mes[dataNascimento[1] - 1],
                        "ANON": dataNascimento[2],
                        "CIDADEN": localNascimento[0] = localNascimento[0].charAt(0).toUpperCase() + localNascimento[0].slice(1).toLowerCase(),
                        /*10*/"ESTADON": estados[localNascimento[1]],
                        "ENDERECO": capitalizar(linhaTabela[12].cells[1].innerText || ""),
                        "BAIRRO": capitalizar(linhaTabela[13].cells[1].innerText || ""),
                        "MUNICIPIO": linhaTabela[16].cells[1].innerText || "",
                        get "CEP"() {
                            let cep = linhaTabela[15].cells[1].innerText || "";
                            cep = cep.replace(/(\d{2})(\d)/, "$1.$2");
                            cep = cep.replace(/(\d{3})(\d{1,2})/, "$1-$2");
                            return "CEP: " + cep;
                        },
                        "LISTADOCUMENTOS": listaDocs,
                        "RACIDADAO": "RA " + document.querySelector(".header-bar").innerText.slice(0, 12) || "",
                        get "NOMEARRIMO"(){
                            if(tipoArrimo == "mae"){
                                return `${this["MAECIDADAO"]}`;
                            }
                            else{
                                return `${nomeArrimo}`;
                            }
                        },
                        "TIPOARRIMO" : tipoArrimo == "filho" ? tipoArrimo + "(a)" : tipoArrimo,
                        "NOMETRABALHO": ocupacao,
                        /*20*/"SALEXTENSO": salarioExtenso,
                        "CIDADEALISTAMENTO": document.querySelector(".jsm-vinculo").innerText || "",
                        "DATAALISTAMENTO": document.querySelector(".alistamento-tipo").innerText || "",
                        "ESCOLARIDADE": "escolaridade: " + linhaTabela[8].cells[1].innerText || "",
                        "ESTADOCIVIL": "estado civil: " + linhaTabela[7].cells[1].innerText || "",
                        "NDEPENDENTES": "Nº de dependentes: " + numeroDependentes,
                        "OCUPACAO": "ocupação: " + ocupacao,
                        "SALARIO": salario,
                        "CASA": casa,
                        "ARTIGOS": listaArtigos,
                        /*30*/"VALORART": valorTotal.replace(".", ","),
                        "ARTEXTENSO": valorExtensoArtigos,
                        "TIPODOCUMENTO": tipoDocumentoRetificacao,
                        get "TIPOPESSOA"(){
                            let textoQuemMudouNome = "";
                            paresQuemMudou.forEach(([chave, valor], index) => {
                                if(chave == "alistado"){
                                    textoQuemMudouNome += "o seu nome de " + capitalizar(nomeSermilAlistado) + " para " + capitalizar(valor);
                                }
                                else if(chave == "mae"){
                                    textoQuemMudouNome += "o nome da mae de " + capitalizar(nomeSermilMae) + " para " + capitalizar(valor);
                                }
                                else if(chave == "pai"){
                                    textoQuemMudouNome += "o nome do pai de " + capitalizar(nomeSermilPai) + " para " + capitalizar(valor);
                                }
                                
                                if(index == (paresQuemMudou.length-2)){
                                    textoQuemMudouNome += " e "
                                }
                                else{
                                    textoQuemMudouNome += ", "
                                }
                            });
                            return textoQuemMudouNome;
                        },
                    };

                    return dicionario;
                }
            }, async (selection) => {
                // 3. O resultado volta para cá
                let texto = "";
                if (chrome.runtime.lastError) {
                    alert("Erro do chrome.scripting.executeScript: " + chrome.runtime.lastError.message);
                    return;
                }
                if (!selection || !selection[0] || selection[0].result === null || selection[0].result === undefined) {
                    let detalheErro = (selection && selection[0] && selection[0].error) ? JSON.stringify(selection[0].error) : "sem detalhe (provavelmente exceção dentro da função injetada, ex: querySelector retornando null)";
                    alert("Não foi possível obter os dados da página. Detalhe: " + detalheErro);
                    return;
                }
                if (selection && selection[0]) {
                    alert("O texto da página é: " + JSON.stringify(selection[0].result, null, 2));

                    const regex = new RegExp(Object.keys(selection[0].result).join("|"), "g");
                    const caminhos = listaArquivos[opcao];
                    let textosBrutos = [];

                    if (caminhos) {
                        //Transforma a lista de caminhos em uma lista de promessas de fetch
                        if(listaDocs.includes(dicionarioDocs["carteira-trabalho"])){
                            caminhos.splice(2,1);
                        }
                        alert("array:\n" + caminhos);
                        const requisicoes = caminhos.map(caminho => fetch(caminho).then(res => res.text()));
                        //Aguarda todos os arquivos serem baixados
                        textosBrutos = await Promise.all(requisicoes);
                    } else {
                        alert("Opção inválida ou não encontrada!");
                    }
                    let corpoDocumentoHTML = textosBrutos.map(texto => {
                        texto = texto.replace(regex, (match) => selection[0].result[match]);
                        return `<pre>${texto}</pre>`
                    }).join(`<div class="quebra-pagina"></div>`);
                    let textoCopiado = "";
                    const regexTextoCopiado = /1\.\s*([\s\S]*?CEP:\s*\d{2}\.?\d{3}-\d{3})/i;
                    const match = corpoDocumentoHTML.match(regexTextoCopiado);
                    if(match){
                        textoCopiado = match[1].trim();
                    }
                    corpoDocumentoHTML = corpoDocumentoHTML.replace(/TEXTOCOPIADO/g, textoCopiado);
                    alert("ACABA AQUI ANTES DE ABRIR OUTRA GUIA: \n");
                    chrome.tabs.create({
                        url: chrome.runtime.getURL("popup/imprimir.html"),
                        active: true
                    }, (tabCriada) => {
                        const mapearAba = (message, sender, sendResponse) => {
                            if (message.action === "requisitarDadosImpressao") {
                                //Entrega o HTML completo e pesado com segurança total
                                sendResponse({ html: corpoDocumentoHTML });
                                chrome.runtime.onMessage.removeListener(mapearAba); // Desliga o canal após o uso
                            }
                        };
                        chrome.runtime.onMessage.addListener(mapearAba);
                    });
                }
            });
        } catch (error) {
            console.error("Erro ao carregar o arquivo do projeto. " + error);
        }
    }
});