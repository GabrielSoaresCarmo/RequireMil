window.addEventListener('load', () => {
    const button = document.getElementById("btn");
    const tipoRequerimento = document.querySelector("#tipo-requerimento");
    const fieldsetPai = document.querySelector("#copias-docs");
    const dependente = document.querySelector("#dependente");
    const tipoNome = document.querySelector("#nome");
    const tipoCertidao = document.querySelectorAll(".certidao-alistado");
    const dicionarioDocs = {
        "certidao-nascimento" : "Cópia da certidão de nascimento",
        "certidao-casamento" : "Cópia da certidão de casamento",
        "documento-foto" : "Cópia do documento com foto",
        "comprovante-residencia" : "Cópia do comprovante de residência",
        "carteira-trabalho" : "Cópia da carteira de trabalho",
        "declaracao-autonomo" : "Declaração de autônomo",
        "certidao-nascimento-mae" : "Cópia da certidão de nascimento da mãe",
        "certidao-casamento-mae" : "Cópia da certidão de casamento da mãe",
        "documento-foto-mae" : "Cópia do documento com foto da mãe",
        "certidao-nascimento-filho" : "Cópia da certidão de nascimento do filho",
        "documento-foto-filho" : "Cópia do documento com foto do filho",
        "atestado-medico" : "Cópia do atestado médico",
        "ficha-socioeconomica" : "Ficha socioeconômica para isenção de taxas e multas",
        "gru-art-225-rlsm" : "Cópia da GRU do Art. 225 do RLSM",
        "certificado-dispensa-incorporacao" : "Certificado de Dispensa de Incorporação",
        "certificado-reservista" : "Certificado de Reservista",
        "atestado-desobrigacao" : "Atestado de Desobrigação",
    };

    if (button) {
        
        tipoRequerimento.addEventListener("change", (event) => {
            fieldsetPai.querySelectorAll("fieldset, div.tipo-dependente").forEach(el => el.classList.add("hidden"));
            fieldsetPai.querySelectorAll("fieldset").forEach(el => el.disabled = true);
            const tipoFieldset = fieldsetPai.querySelector(`#tipo-${event.target.value}`);
            if(event.target.value != "vazio"){
                fieldsetPai.classList.remove("hidden");
                fieldsetPai.disabled = false;
                fieldsetPai.querySelectorAll("input").forEach(input => {
                    if(input.closest("fieldset") === fieldsetPai){
                        input.disabled = false;
                    }
                });
                if(tipoFieldset){
                    tipoFieldset.classList.remove("hidden");
                    tipoFieldset.disabled = false;
                    tipoFieldset.querySelectorAll("input").forEach(el => el.disabled = false);
                }
            }
            else{
                document.querySelector("#form-docs").reset();
                fieldsetPai.classList.add("hidden");
                fieldsetPai.querySelectorAll("input").forEach(el => el.disabled = true);
            }

            if(event.target.value != "arrimo"){
                tipoCertidao[1].closest("label").classList.remove("hidden");
            }
            else{
                tipoCertidao[1].closest("label").classList.add("hidden");
            }
            //document.querySelector("#form-docs").reset();
        });
        
        tipoCertidao[1].addEventListener("change", () => {tipoCertidao[0].checked = false});
        tipoCertidao[0].addEventListener("change", () => {tipoCertidao[1].checked = false});

        dependente.addEventListener("change", (event) => {
            document.querySelectorAll(".tipo-dependente").forEach(el => el.classList.add("hidden"));
            document.querySelectorAll(".tipo-dependente input").forEach(el => el.checked = false);
            const tipoDependente = document.querySelector(`.tipo-dependente[name="docs-${event.target.value}"]`);
            if(tipoDependente){
                tipoDependente.classList.remove("hidden");
                tipoDependente.querySelectorAll("input").forEach(el => el.disabled = false);
            }
        });

        tipoNome.addEventListener("change", (event) => {
            document.querySelector(".nome-retificado").classList.remove("hidden");
            document.querySelector(".nome-retificado").disabled = false;
            const textoNome = document.querySelector("#texto-nome");
            textoNome.textContent = "?";
            if(event.target.value == 'mae'){
                textoNome.textContent = textoNome.textContent.replace("?", "da mãe");
            }
            else{
                textoNome.textContent = textoNome.textContent.replace("?", `do ${event.target.value}`);
            }
        });

        button.addEventListener("click", async (event) => {
            event.preventDefault();
            const form = document.querySelector("#form-docs");
            const opcao = tipoRequerimento.value;
            const valoresMarcados = document.querySelectorAll(`input[name="documentos[]"]:not([disabled]):checked, 
                                                               input[name="tipo-certidao-alistado"]:not([disabled]):checked, 
                                                               input[name="carteira-trabalho"]:not([disabled]):checked, 
                                                               input[name="tipo-certidao-mae"]:not([disabled]):checked, 
                                                               input[name="tipo-documento-retificacao"]:not([disabled]):checked`);
            const arrayDocs = Array.from(valoresMarcados).map(doc => dicionarioDocs[doc.value]);
            let comecoFrase = arrayDocs.slice(0, -1).join(", ");
            let ultimoItem = arrayDocs.at(-1)
            let listaDocs = `${comecoFrase} e ${ultimoItem}`;
            
            switch(opcao){
                case "vazio":
                    alert("Por favor, selecione uma opção válida");
                    break;
                case "arrimo":
                    alert("Arrimo de Família");
                    break;
                case "isenção-servico":
                    alert("Isenção do Serviço Militar");
                    break;
                case "isenção-txmt":
                    alert("Isenção de Taxas e Multas");
                    break;
                case "maior-30":
                    alert("Maior de 30 anos");
                    break;
                case "retificacao-dados-cadastrais":
                    alert("Retificação de dados cadastrais");
                    break;
            }
            alert(arrayDocs);
            //window.location.reload();
        async function lerArquivo(textoDocs){
            try {
                let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
                    // 2. Executa um script na página para pegar o texto
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    args: [textoDocs],
                    func: async (docs) => {
                        const data = new Date();
                        const dia = String(data.getDate()).padStart(2, "0");
                        const mes= [
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
                        const dataNascimento = document.querySelector(".data-table").rows[2].cells[1].innerText.split("/");

                        const estados = {
                            "AC" : "Acre",
                            "AL" : "Alagoas",
                            "AP" : "Amapá",
                            "AM" : "Amazonas",
                            "BA" : "Bahia",
                            "CE" : "Ceará",
                            "DF" : "Distrito Federal",
                            "ES" : "Espírito Santo",
                            "GO" : "Goiás",
                            "MA" : "Maranhão",
                            "MT" : "Mato Grosso",
                            "MS" : "Mato Grosso do Sul",
                            "MG" : "Minas Gerais",
                            "PA" : "Pará",
                            "PB" : "Paraíba",
                            "PR" : "Paraná",
                            "PE" : "Pernambuco",
                            "PI" : "Piauí",
                            "RJ" : "Rio de Janeiro",
                            "RN" : "Rio Grande do Norte",
                            "RS" : "Rio Grande do Sul",
                            "RO" : "Rondônia",
                            "RR" : "Roraima",
                            "SC" : "Santa Catarina",
                            "SP" : "São Paulo",
                            "SE" : "Sergipe",
                            "TO" : "Tocantins"
                        };
                        const localNascimento = document.querySelector(".data-table").rows[4].cells[1].innerText.split(" - ");

                        const dicionario = {
                            "DATAATUAL" : dataAtual,
                            "NOMECIDADAO" : document.querySelector(".data-table").rows[0].cells[1].innerText,
                            "CPFCIDADAO" : document.querySelector(".data-table").rows[10].cells[1].innerText,
                            "PAICIDADAO" : document.querySelector(".data-table").rows[3].cells[1].innerText,
                            "MAECIDADAO" : document.querySelector(".data-table").rows[1].cells[1].innerText,
                            "DIAN" : dataNascimento[0],
                            "MESN" : mes[dataNascimento[1]-1],
                            "ANON" : dataNascimento[2],
                            "CIDADEN" : localNascimento[0],
                            "ESTADON" : estados[localNascimento[1]],
                            "ENDERECO" : document.querySelector(".data-table").rows[12].cells[1].innerText,
                            "BAIRRO" : "Bairro " + document.querySelector(".data-table").rows[13].cells[1].innerText,
                            "MUNICIPIO" : document.querySelector(".data-table").rows[16].cells[1].innerText,
                            "CEP" : document.querySelector(".data-table").rows[15].cells[1].innerText,
                            "DOCUMENTOS" : docs,
                            "RACIDADAO" : document.querySelector(".header-bar").innerText.slice(0, 12)
                        };
                        return dicionario;
                    }
                    }, async (selection) => {
                    // 3. O resultado volta para cá
                        let texto;
                        if(selection && selection[0]){
                            //alert("O texto da página é: " + selection[0].result);
                            alert("O texto da página é: " + JSON.stringify(selection[0].result, null, 2));

                            const regex = new RegExp(Object.keys(selection[0].result).join("|"), "gi");
                            const arquivo = await fetch("../docs/REQUERIMENTOS/ARRIMO/arrimo.txt");
                            if(!arquivo.ok){
                                throw new Error("Arquivo não encontrado");
                            }
                            texto = await arquivo.text();
                            alert("Conteudo lido: " + texto);
                            texto = texto.replace(regex, (palavraCorrespondida) => {
                                return selection[0].result[palavraCorrespondida];
                            });
                            texto = texto.replace("DOCUMENTOS", listaDocs);
                            alert(texto);
                        }
                        /*const blob = new Blob([texto], { type: 'text/plain;charset=utf-8' });

                        //3. Cria um link temporário na memória do navegador
                        const link = document.createElement('a');

                        // 4. Converte o Blob numa URL que o navegador consegue descarregar
                        link.href = URL.createObjectURL(blob);

                        // 5. Define o nome do arquivo que será salvo no PC do utilizador
                        link.download = 'requerimento-modificado.txt';

                        // 6. Simula o clique no link para iniciar o download automaticamente
                        link.click();

                        // 7. Limpa a memória libertando a URL criada
                        URL.revokeObjectURL(link.href);*/

                        alert("Arquivo .txt alterado e descarregado com sucesso!");
                        alert(listaDocs);
                    }
                )
            } catch (error) {
                console.error("Erro ao carregar o arquivo do projeto. " + error);
            }
        }
        });

        function atualizarTipoRequerimento(valor){
            if(valor != "vazio"){
                fieldsetPai.classList.remove("hidden");
                fieldsetPai.disabled = false;
                fieldsetPai.querySelectorAll("input").forEach(input => {
                    if(input.closest("fieldset") === fieldsetPai){
                        input.disabled = false;
                    }
                });
            }
            else{
                fieldsetPai.classList.add("hidden");
                fieldsetPai.querySelectorAll("input").forEach(el => el.disabled = true);
            }

            fieldsetPai.querySelectorAll("fieldset").forEach(el => el.classList.add("hidden"));
            fieldsetPai.querySelectorAll("fieldset").forEach(el => el.disabled = true);
            const tipoFieldset = fieldsetPai.querySelector(`#tipo-${valor}`);
            if(tipoFieldset){
                tipoFieldset.classList.remove("hidden");
                tipoFieldset.disabled = false;
                tipoFieldset.querySelectorAll("input").forEach(el => el.disabled = false);
            }
        }
    }
});