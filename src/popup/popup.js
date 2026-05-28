window.addEventListener('load', () => {
    const button = document.getElementById("btn");
    if (button) {
        const tipoRequerimento = document.querySelector("#tipo-requerimento");
        const fieldsetDocs = document.querySelector("#copias-docs");
        const dependenteArea = document.querySelector("#dependente");
        
        tipoRequerimento.addEventListener("change", (event) => {
            if(tipoRequerimento.value != "vazio"){
                fieldsetDocs.classList.remove("hidden");
                fieldsetDocs.disabled = false;
            }
            else{
                fieldsetDocs.classList.add("hidden");
                fieldsetDocs.disabled = true;
            }

            fieldsetDocs.querySelectorAll("fieldset").forEach(el => el.classList.add("hidden"));
            const tipoFieldset = document.querySelector(`[name="tipo-${event.target.value}"]`);
            if(tipoFieldset){
                tipoFieldset.classList.remove("hidden");
                tipoFieldset.querySelectorAll("input").forEach(el => el.disabled = false);
            }

        });
        
        dependenteArea.addEventListener("change", (event) => {
            document.querySelectorAll(".tipo-dependente").forEach(el => el.classList.add("hidden"));
            const tipoDependente = document.querySelector(`.tipo-dependente[name="docs-${event.target.value}"]`);
            if(tipoDependente){
                tipoDependente.classList.remove("hidden");
                tipoDependente.querySelectorAll("input").forEach(el => el.disabled = false);
            }
        });

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
                case "isenção-txmt":
                    alert("Isenção de Taxas e Multas");
                    break;
                case "isenção-servico":
                    alert("Isenção do Serviço Militar");
                    break;
                case "maior-30":
                    alert("Maior de 30 anos");
                    break;
            }

        });

    }
});