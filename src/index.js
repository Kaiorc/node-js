import fs from 'fs'
import chalk from 'chalk'

// Função que vai extrair os links do texto (utilizando expressões
// regulares) e salvá-los
function extraiLinks(texto){
        // Variável que vai guardar a expressão regular
        const regex = /\[([^[\]]*?)\]\((https?:\/\/[^\s?#.].[^\s]*)\)/gm
        // Utilizando método de manipulação de string para, usando a regular expression
        // para encontrar os trechos no texto. 
        // ".matchAll()" retorna um iterável. 
        // Nesse caso, teremos de utilizar o spread operator (...) no objeto que o método retorna,
        // para que ele seja expandido para dentro de um array. 
        // Que fica da seguinte forma:
        // [
        //         [
        //           '[FileList](https://developer.mozilla.org/pt-BR/docs/Web/API/FileList)',
        //           'FileList',
        //           'https://developer.mozilla.org/pt-BR/docs/Web/API/FileList',
        //           index: 149,
        //           input: 'A interface File provê informações sobre arquivos e permite ao JavaScript  a acessar seu conteúdo.\n' +
        //             '\n' +
        //             'São geralmente recuperados a partir de um objeto [FileList](https://developer.mozilla.org/pt-BR/docs/Web/API/FileList) que é retornado como resultado da seleção, pelo usuário, de arquivos através do elemento [<input>](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/Input), a partir do objeto [DataTransfer](https://developer.mozilla.org/pt-BR/docs/Web/API/DataTransfer) utilizado em operações de arrastar e soltar, ou a partir da API `mozGetAsFile()` em um [HTMLCanvasElement](https://developer.mozilla.org/pt-BR/docs/Web/API/HTMLCanvasElement). Em Gecko, códigos com privilégiios podem criar objetos File representando qualquer arquivo local sem a intereção do usuário (veja [Implementation notes](https://developer.mozilla.org/pt-BR/docs/Web/API/File#implementation_notes) para mais informações.).\n' +
        //             '\n' +
        //             '[Teste de retorno 400](https://httpstat.us/404).\n' +
        //             '[gatinho salsicha](http://gatinhosalsicha.com.br/)',
        //           groups: undefined
        //         ],
        //         [
        //           '[<input>](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/Input)',
        //           '<input>',
        //           'https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/Input',
        //           index: 308,
        //           input: 'A interface File provê informações sobre arquivos e permite ao JavaScript  a acessar seu conteúdo.\n' +
        //             '\n' +
        //             'São geralmente recuperados a partir de um objeto [FileList](https://developer.mozilla.org/pt-BR/docs/Web/API/FileList) que é retornado como resultado da seleção, pelo usuário, de arquivos através do elemento [<input>](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/Input), a partir do objeto [DataTransfer](https://developer.mozilla.org/pt-BR/docs/Web/API/DataTransfer) utilizado em operações de arrastar e soltar, ou a partir da API `mozGetAsFile()` em um [HTMLCanvasElement](https://developer.mozilla.org/pt-BR/docs/Web/API/HTMLCanvasElement). Em Gecko, códigos com privilégiios podem criar objetos File representando qualquer arquivo local sem a intereção do usuário (veja [Implementation notes](https://developer.mozilla.org/pt-BR/docs/Web/API/File#implementation_notes) para mais informações.).\n' +
        //             '\n' +
        //             '[Teste de retorno 400](https://httpstat.us/404).\n' +
        //             '[gatinho salsicha](http://gatinhosalsicha.com.br/)',
        //           groups: undefined
        //         ],
        //         ...
        // ]
        const capturas = [...texto.matchAll(regex)]
        // Agora, utilizando ".map()", o array será organizado de maneira que um índice será o nome de uma
        // propriedade de um objeto que está sendo criado
        // Para utilizar um índice de um array como propriedade de um objeto, devemos englobar entre 
        // colchetes, como em "[captura[1]]"
        // Nesse caso teremos um array de objetos:
        // [
        //      {
        //        FileList: https://developer.mozilla.org/pt-BR/docs/Web/API/FileList
        //      }, 
        //      {
        //        '<input': https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/Input
        //      },
        //      ...
        // ]
        const resultados = capturas.map(captura => ({[captura[1]]: captura[2]}))

         // Verifica se o array está vazio antes de retornar
        return resultados.length !== 0 ? resultados : "Não há links no arquivo"
}

function trataErro(error){
        console.log(error)
        throw new Error(chalk.red(error.code, "não há arquivo no diretório"))
}

// Versão (assíncrona) da função "pegaArquivo" utilizando async / await.
// Utilizando try/catch para tratar o erro na função assíncrona
async function pegaArquivo(caminhoDoArquivo) {
        // Dentro do bloco "try" deve ficar o comportamento esperado
        // em caso de sucesso
        try {
                const encoding = "utf-8"
                // Variável que salva o retorno do processamento do fs.promises.
                // O await sinalizando que o JS deve esperar pelo processamento
                const texto = await fs.promises.readFile(caminhoDoArquivo,encoding)

                // console.log(chalk.green(texto))
                // console.log(extraiLinks(texto))
                // Tirando a responsabilidade de exibir o texto, da função
                return extraiLinks(texto)

        } catch (error) {
                trataErro(error)
        }
}

// Versão (assíncrona) da função "pegaArquivo" utilizando
// promises e then()
// function pegaArquivo(caminhoDoArquivo) {
//         const encoding = "utf-8"

//         // 
//         fs.promises
//                 .readFile(caminhoDoArquivo, encoding)
//                 .then((texto) => console.log(chalk.green(texto)))
//                 .catch(trataErro)
// }

// Versão (síncrona) da função "pegaArquivo" (sem utilizar promises)
// function pegaArquivo(caminhoDoArquivo) {
//     const encoding = "utf-8"
    
//     // Método que recebe o caminho do arquivo que deverá ser lido,
//     // o encoding de caracteres utilizado arquivo e a função callback
//     // que será executada com o resultado da ".readFile", ela recebe dois parâmetros,
//     // um erro e um retorno, que nesse programa será um texto
//     // O "_" funciona para desconsiderar o parâmetro que não está sendo o utilizado
//     fs.readFile(caminhoDoArquivo, encoding, (erro, texto) => {
//         if(erro){
//                 trataErro(erro)
//         } 
//         console.log(chalk.green(texto))
//     })
// }

export default pegaArquivo
//pegaArquivo('./arquivos/texto.md')
// pegaArquivo('./arquivos/')
// setInterval(() => pegaArquivo('./arquivos/'), 5000);

// Expressão regular que seleciona os trechos entre colchetes (incluindo os colchetes)
// \[[^[\]]*?\]

// Expressão regular que seleciona os links entres parênteses (incluindo os parênteses)
// \(https?:\/\/[^\s?#.].[^\s]*\)

// Expressão regular que, utilizando grupos, seleciona os trechos entre colchetes e os links entre parênteses
// (removendo os colchetes e os parênteses)
// \[([^[\]]*?)\]\((https?:\/\/[^\s?#.].[^\s]*)\)