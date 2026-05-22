window.addEventListener('load', () => {
    const button = document.getElementById("btn");
    if (button) {
        button.addEventListener("click", async () => {
            let tipoRequerimento = document.querySelector(".tipo-requerimento").value;
            let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            let dadosPagina = {};
            switch(tipoRequerimento){
                case "vazio":
                    alert("Por favor selecione uma opção válida");
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
                case "maior-30-anos":
                    alert("Maior de 30 anos");
                    break;
            }
        });
    }
});