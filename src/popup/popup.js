window.addEventListener('load', () => {
    const button = document.getElementById("btn");
    if (button) {
        const tipoRequerimento = document.querySelector("#tipo-requerimento");
        const fieldsetPai = document.querySelector("#copias-docs");
        const tipoDependente = document.querySelector("#dependente");
        const tipoNome = document.querySelector("#nome");
        const tipoCertidao = document.querySelectorAll(".certidao-alistado");
        
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
        
        tipoDependente.addEventListener("change", (event) => {
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
        })

        button.addEventListener("click", async (event) => {
            event.preventDefault();
            let opcao = tipoRequerimento.value;

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
                    alert(document.querySelector("#texto-nome-retificado").value.toUpperCase());
                    break;
            }
            atualizarTipoRequerimento("vazio");
            tipoRequerimento.value = "vazio";
        });

        function atualizarTipoRequerimento(valor){
            if(valor != "vazio"){
                fieldsetPai.classList.remove("hidden");
                fieldsetPai.disabled = false;
            }
            else{
                fieldsetPai.classList.add("hidden");
                fieldsetPai.disabled = true;
            }

            fieldsetPai.querySelectorAll("fieldset").forEach(el => el.classList.add("hidden"));
            fieldsetPai.querySelectorAll("fieldset").forEach(el => el.disabled = true);
            const tipoFieldset = fieldsetPai.querySelector(`#tipo-${valor}`);
            if(tipoFieldset){
                tipoFieldset.classList.remove("hidden");
                tipoFieldset.disabled = false;
            }
        }
    }
});