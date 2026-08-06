const valorTaxaMinima = 6.69;
const todosArtigos = {
    "47": valorTaxaMinima * 5,
    "52": valorTaxaMinima * 5,
    "60": valorTaxaMinima * 15,
    "75": valorTaxaMinima * 3,
    "103": valorTaxaMinima * 1,
    "225": valorTaxaMinima * 0,
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
const button = document.getElementById("btn");
const tipoRequerimento = document.querySelector("#tipo-requerimento");
const fieldsetPai = document.querySelector("#copias-docs");
const dependente = document.querySelector("#dependente");
const tipoNome = document.querySelector("#nome");
const mudouNome = document.querySelectorAll(`input[name="mudou-nome[]"]`);
const tipoCertidao = document.querySelectorAll(".certidao-alistado");
const tipoCasa = document.querySelector("#tipo-casa");
const ocupacao = document.querySelector("#input-ocupacao");
const dicionarioDocs = {
    "certidao-nascimento": "Cópia da certidão de nascimento",
    "certidao-casamento": "Cópia da certidão de casamento",
    "documento-foto": "Cópia do documento com foto",
    "comprovante-residencia": "Cópia do comprovante de residência",
    "carteira-trabalho": "Cópia da carteira de trabalho",
    "declaracao-autonomo": "Declaração de autônomo",
    "certidao-nascimento-mae": "Cópia da certidão de nascimento da mãe",
    "certidao-casamento-mae": "Cópia da certidão de casamento da mãe",
    "documento-foto-mae": "Cópia do documento com foto da mãe",
    "certidao-nascimento-filho": "Cópia da certidão de nascimento do filho",
    "documento-foto-filho": "Cópia do documento com foto do filho",
    "atestado-medico": "Cópia do atestado médico",
    "ficha-socioeconomica": "Ficha socioeconômica para isenção de taxas e multas",
    "gru-art-225-rlsm": "Cópia da GRU do Art. 225 do RLSM",
    "certificado-dispensa-incorporacao": "Certificado de Dispensa de Incorporação",
    "certificado-reservista": "Certificado de Reservista",
    "atestado-desobrigacao": "Atestado de Desobrigação",
};
const listaArquivos = {
    "arrimo": ["../docs/REQUERIMENTOS/ARRIMO/arrimo.txt", "../docs/REQUERIMENTOS/ARRIMO/declaracao-arrimo.txt", "../docs/REQUERIMENTOS/ARRIMO/declaracao-autonomo.txt"],
    "isencao-txmt": ["../docs/REQUERIMENTOS/ARRIMO/isencao-txmt.txt", "../docs/REQUERIMENTOS/ARRIMO/ficha-socioeconomica.txt", "../docs/REQUERIMENTOS/ARRIMO/modelo-cidadao.txt"],
    "retificacao-dados-cadastrais": ["../docs/REQUERIMENTOS/ARRIMO/retificacao-dados-cadastrais.txt"],
};

tipoRequerimento.addEventListener("change", async (event) => {
    fieldsetPai.querySelectorAll("fieldset, div.tipo-dependente").forEach(el => el.classList.add("hidden"));
    fieldsetPai.querySelectorAll("fieldset").forEach(el => el.disabled = true);
    const tipoFieldset = fieldsetPai.querySelector(`#tipo-${event.target.value}`);
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
                if(document.querySelector(".data-table").rows[11].cells[0].innerText == "Ocupação"){
                    return document.querySelector(".data-table").rows[11].cells[1].innerText;
                }
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

tipoCertidao[1].addEventListener("change", () => { tipoCertidao[0].checked = false });
tipoCertidao[0].addEventListener("change", () => { tipoCertidao[1].checked = false });

dependente.addEventListener("change", (event) => {
    document.querySelectorAll(".tipo-dependente").forEach(el => el.classList.add("hidden"));
    document.querySelectorAll(".tipo-dependente input").forEach(el => el.checked = false);
    const tipoDependente = document.querySelector(`.tipo-dependente[name="docs-${event.target.value}"]`);
    if (tipoDependente) {
        tipoDependente.classList.remove("hidden");
        tipoDependente.querySelectorAll("input").forEach(el => el.disabled = false);
    }
});

tipoCasa.addEventListener("change", (event) => {
    const labelValorAluguel = document.querySelector(".label-valor-aluguel");
    const inputValorAluguel = document.querySelector(".input-valor-aluguel");
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
    const mudouNome = document.querySelectorAll(`input[name="mudou-nome[]"]`);
    mudouNome.forEach(tipo => {
        const labelNomeNovo = document.querySelector(`label[name="label-nome-${tipo.value}"]`);
        if(labelNomeNovo){
            labelNomeNovo.classList.toggle("hidden", !tipo.checked);
            labelNomeNovo.disabled = !tipo.checked;
        }
    });
});

button.addEventListener("click", async (event) => {
    event.preventDefault();
    const form = document.querySelector("#form-docs");
    const opcao = tipoRequerimento.value;
    let comecoFrase = "";
    let ultimoItem = "";
    let listaDocs = "";

    //lista de documentos copiados anexos ao requerimento
    const valoresMarcados = document.querySelectorAll(`input[name="documentos[]"]:not([disabled]):checked, 
                                                       input[name="tipo-certidao-alistado"]:not([disabled]):checked, 
                                                       input[name="carteira-trabalho"]:not([disabled]):checked, 
                                                       input[name="tipo-certidao-mae"]:not([disabled]):checked`);
    const arrayDocs = Array.from(valoresMarcados).map(doc => dicionarioDocs[doc.value]);
    let tipoArrimo = "";
    alert(arrayDocs.indexOf("Ficha socioeconômica para isenção de taxas e multas"));
  
    //conteudo do requerimento de isençao de taxa e multa
    const numeroDependentes = document.querySelector("#input-numero-dependentes").value;
    const salario = document.querySelector("#input-salario").value;
    const radioTipoCasa = document.querySelector(".radio-tipo-casa:checked")?.value;
    const inputValorAluguel = document.querySelector(".input-valor-aluguel").value;
    let casa;
    if (radioTipoCasa == "alugada") {
        casa = `Casa: ()Própria (X)Alugada - Aluguel: R$ ${inputValorAluguel}`;
    }
    else {
        casa = "Casa: (X)Própria ()Alugada";
    }
    const artigos = document.querySelectorAll(`input[name="artigos[]"]:checked`);
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
    let valorExtenso = "";
    valorExtenso = extenso(valorTotal.replace(".", ","), { mode: "currency" });
    alert("o valor total e: " + valorTotal);

    //conteudo do requerimento de retificacao de dados cadastrais
    const tipoCertidaoRetificacao = document.querySelector(`input[name="tipo-certidao-retificacao"]:checked`);

    const tipoDocumentoRetificacao = tipoCertidaoRetificacao ? dicionarioDocs[tipoCertidaoRetificacao.value] : "";
    const novoNome = document.querySelectorAll(`input[name="texto-nome-retificado[]"]`);
    const listaNovoNome = Array.from(novoNome).map(nome => nome.value.trim()).filter(valor => valor !== "");

    const quemMudouNome = document.querySelectorAll(`input[name="mudou-nome[]"]:checked`);
    const listaQuemMudouNome = Array.from(quemMudouNome).map(quemMudou => quemMudou.value);
    const paresQuemMudou = listaQuemMudouNome.map((valor, indice) => [valor, listaNovoNome[indice]]);
    /*console.dir(listaNovoNome);
    alert(listaQuemMudouNome);
    alert(paresQuemMudou);
    alert(tipoDocumentoRetificacao);*/
  
    switch (opcao) {
        case "vazio":
            alert("Por favor, selecione uma opção válida");
            break;
        case "arrimo":
            alert("Arrimo de Família");
            break;
        case "isencao-servico":
            alert("Isenção do Serviço Militar");
            break;
        case "isencao-txmt":
            alert("Isenção de Taxas e Multas");
            const itemRemovido = arrayDocs.splice(arrayDocs.indexOf("Ficha socioeconômica para isenção de taxas e multas"), 1);
            arrayDocs.splice(0, 0, itemRemovido);
            comecoFrase = arrayDocs.slice(0, -1).join(", ");
            ultimoItem = arrayDocs.at(-1)
            listaDocs = `${comecoFrase} e ${ultimoItem}`;
            break;
        case "maior-30":
            alert("Maior de 30 anos");
            break;
        case "retificacao-dados-cadastrais":
            alert("Retificação de dados cadastrais");
            break;
        default:
            comecoFrase = arrayDocs.slice(0, -1).join(", ");
            ultimoItem = arrayDocs.at(-1)
            listaDocs = `${comecoFrase} e ${ultimoItem}`;
            break;
    }

    alert("array dos docs: " + arrayDocs);
    lerArquivo(opcao, listaDocs, tipoArrimo, numeroDependentes, ocupacao.value, salario, casa, listaArtigos, valorTotal, valorExtenso, tipoDocumentoRetificacao, paresQuemMudou);
    //window.location.reload();
    async function lerArquivo(opcao, listaDocs, tipoArrimo, numeroDependentes, ocupacao, salario, casa, listaArtigos, valorTotal, valorExtenso, tipoDocumentoRetificacao, paresQuemMudou) {
        try {
            let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                args: [opcao, listaDocs, tipoArrimo, numeroDependentes, ocupacao, salario, casa, listaArtigos, valorTotal, valorExtenso, tipoDocumentoRetificacao, paresQuemMudou],
                func: async (opcao, listaDocs, tipoArrimo, numeroDependentes, ocupacao, salario, casa, listaArtigos, valorTotal, valorExtenso, tipoDocumentoRetificacao, paresQuemMudou) => {
                    const nomeSermilAlistado = document.querySelector(".data-table").rows[0].cells[1].innerText;
                    const nomeSermilMae = document.querySelector(".data-table").rows[1].cells[1].innerText;
                    const nomeSermilPai = document.querySelector(".data-table").rows[3].cells[1].innerText;

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
                    const localNascimento = document.querySelector(".data-table")?.rows[4]?.cells[1]?.innerText?.split(" - ");

                    conectivos = ["da", "de", "do", "e"];
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
                            let cpf = document.querySelector(".data-table").rows[10].cells[1].innerText;
                            cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
                            cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
                            cpf = cpf.replace(/(\d{3})(\d{1,2})/, "$1-$2");
                            return "CPF: " + cpf;
                        },
                        get "PAICIDADAO"(){
                            let novoNome = "";
                            if(opcao == "retificacao-dados-cadastrais"){
                                paresQuemMudou.forEach(([chave, valor]) => {
                                    if(chave == "pai"){
                                        novoNome = capitalizar(valor);
                                    }
                                });
                                return novoNome;
                            }
                            else{
                                return capitalizar(nomeSermilPai);
                            }
                        },
                        get "MAECIDADAO"(){
                            let novoNome = "";
                            if(opcao == "retificacao-dados-cadastrais"){
                                paresQuemMudou.forEach(([chave, valor]) => {
                                    if(chave == "mae"){
                                        novoNome = capitalizar(valor);
                                    }
                                });
                                return novoNome;
                            }
                            else{
                                return capitalizar(nomeSermilMae);
                            }
                        },
                        "DIAN": dataNascimento[0],
                        "MESN": mes[dataNascimento[1] - 1],
                        "ANON": dataNascimento[2],
                        "CIDADEN": localNascimento[0] = localNascimento[0].charAt(0).toUpperCase() + localNascimento[0].slice(1).toLowerCase(),
                        "ESTADON": estados[localNascimento[1]],
                        "ENDERECO": capitalizar(document.querySelector(".data-table").rows[12].cells[1].innerText),
                        "BAIRRO": capitalizar(document.querySelector(".data-table").rows[13].cells[1].innerText),
                        "MUNICIPIO": document.querySelector(".data-table").rows[16].cells[1].innerText,
                        get "CEP"() {
                            let cep = document.querySelector(".data-table").rows[15].cells[1].innerText;
                            cep = cep.replace(/(\d{2})(\d)/, "$1.$2");
                            cep = cep.replace(/(\d{3})(\d{1,2})/, "$1-$2");
                            return "CEP: " + cep;
                        },
                        "LISTADOCUMENTOS": listaDocs,
                        "RACIDADAO": "RA " + document.querySelector(".header-bar").innerText.slice(0, 12),
                        get "NOMEARRIMO"(){
                            if(tipoArrimo == "mae"){
                                return `${this["MAECIDADAO"]}`;
                            }
                            else{
                                return `nome generico`;
                            }
                        },
                        "TIPOARRIMO" : tipoArrimo,
                        "NOMETRABALHO": "",
                        "CIDADEALISTAMENTO": document.querySelector(".jsm-vinculo").innerText,
                        "DATAALISTAMENTO": document.querySelector(".alistamento-tipo").innerText,
                        "ESCOLARIDADE": "escolaridade: " + document.querySelector(".data-table").rows[8].cells[1].innerText,
                        "ESTADOCIVIL": "estado civil: " + document.querySelector(".data-table").rows[7].cells[1].innerText,
                        "NDEPENDENTES": "Nº de dependentes: " + numeroDependentes,
                        "OCUPACAO": "ocupação: " + ocupacao,
                        "SALARIO": "salário: R$ " + salario,
                        "CASA": casa,
                        "ARTIGOS": listaArtigos,
                        "VALORARTIGOS": valorTotal.replace(".", ","),
                        "VALOREXTENSO": valorExtenso,
                        "TIPODOCUMENTO": tipoDocumentoRetificacao,
                        get "TIPOPESSOA"(){
                            let textoQuemMudouNome = "";
                            paresQuemMudou.forEach(([chave, valor], indice) => {
                                if(chave == "alistado"){
                                    textoQuemMudouNome += "o próprio nome de " + capitalizar(nomeSermilAlistado) + " para " + valor;
                                }
                                else if(chave == "mae"){
                                    textoQuemMudouNome += "o nome da mae de " + capitalizar(nomeSermilMae) + " para " + valor;
                                }
                                else if(chave == "pai"){
                                    textoQuemMudouNome += "o nome do pai de " + capitalizar(nomeSermilPai) + " para " + valor;
                                }
                                
                                if(indice == (paresQuemMudou.length-2)){
                                    textoQuemMudouNome += " e "
                                }
                                else{
                                    textoQuemMudouNome += ", "
                                }
                            });
                            return textoQuemMudouNome;
                        },
                    };

                    function capitalizar(texto){
                        return texto.split(" ").map(palavra => {
                            if (conectivos.includes(palavra.toLowerCase())) {
                                return palavra.toLowerCase();
                            }
                            return palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase();
                        }).join(" ");
                    }

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