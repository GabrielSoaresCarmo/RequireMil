window.addEventListener("DOMContentLoaded", () => {
    // 1. Pede os dados do documento diretamente para o popup
    chrome.runtime.sendMessage({ action: "requisitarDadosImpressao" }, (response) => {
        
        if (response && response.html) {
            // 2. Injeta o HTML completo na página
            document.getElementById("conteudo").innerHTML = response.html;
            
            // 3. Dá um respiro pequeno para o motor renderizar o CSS e abre o print
            setTimeout(() => {
                window.print();
                
                // 4. Fecha a aba quando terminar ou cancelar
                window.addEventListener("afterprint", () => {
                    window.close();
                });
            }, 300);
        } else {
            document.getElementById("conteudo").innerHTML = "<h3>⚠️ Erro ao recuperar os dados da extensão.</h3>";
        }
    });
});