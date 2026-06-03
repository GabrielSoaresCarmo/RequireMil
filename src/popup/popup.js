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
            atualizarTipoRequerimento(event.target.value);
            if(event.target.value != "arrimo"){
                tipoCertidao[0].type = "radio";
                tipoCertidao[1].closest("label").classList.remove("hidden");
                //tipoCertidao[2].classList.remove("hidden");
            }
            else{
                tipoCertidao[0].type = "checkbox";
                tipoCertidao[0].checked = true;
                tipoCertidao[1].closest("label").classList.add("hidden");
            }
        });
        
        dependente.addEventListener("change", (event) => {
            document.querySelectorAll(".tipo-dependente").forEach(el => el.classList.add("hidden"));
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
            const opcao = tipoRequerimento.value;
            const valoresMarcados = document.querySelectorAll(`input[name="documentos[]"]:not([disabled]):checked, [name="tipo-certidao-alistado"]:not([disabled]):checked, [name="carteira-trabalho"]:not([disabled]):checked, [name="tipo-dependente"]:not([disabled]):checked, [name="tipo-certidao-mae"]:not([disabled]):checked, [name="tipo-documento-retificacao"]:not([disabled]):checked`);
            //const array = Array.from(valoresMarcados).filter(input => !input.disabled && input.offsetParent !== null).map(input => input.value);
            /*const array = Array.from(valoresMarcados).map(input => input.value.split("-").map((palavra, index) => {
                const conectivos = ["da ", "de ", "do "];
                const sinal = ["cao", "dao", "mae"]
                if(palavra.includes("cao") || palavra.includes("dao") || palavra.includes("mae")){
                    palavra = palavra.replace("a", "ã");

                }
                if(conectivos.includes(palavra.toLowerCase())){
                    return palavra.toLowerCase();
                }
                palavra = palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase();
                if(index == 0){
                    palavra = "cópia " + conectivos[0] + palavra;
                }
                return palavra;
            }).join(" "));*/
            const arrayDocs = Array.from(valoresMarcados).map(doc => dicionarioDocs[doc.value]);
            
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
            atualizarTipoRequerimento("vazio");
            tipoRequerimento.value = "vazio";
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
                const tipoDependente = document.querySelector(`.tipo-dependente[name="docs-${dependente.value}"]`);
                if(tipoDependente){
                    tipoDependente.classList.remove("hidden");
                    tipoDependente.querySelectorAll("input").forEach(el => el.disabled = false);
                }
            }
        }
    }
});