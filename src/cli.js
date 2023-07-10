import chalk from 'chalk'
import fs from 'fs'
import pegaArquivo from "./index.js"
import listaValidada from "./http-validacao.js"

// Utilizando o método process pra receber dados da linha de comando
// Retorna um array onde os elementos são os comandos do terminal, 
// ex.:
// [
//   'C:\\Program Files\\nodejs\\node.exe',
//   'C:\\Users\\B900316\\Desktop\\Node.js - criando sua primeira biblioteca Node.js\\src\\cli.js',
//   'arquivos/texto.md',
//   '--valida'
// ] 
const caminho = process.argv
//console.log(caminho)

// Função que imprime a lista de links
// Inicializamos o identificador como uma string vazia, para evitar que, caso não passemos
// o argumento, seja impresso com o valor undefined
async function imprimeListaDeLinks(valida, lista, identificador = '') {
    // Se não houver necessidade de validação da lista, continuará igual
    if(valida){
        console.log(chalk.yellow("Lista validada"), chalk.black.bgGreen(identificador), await listaValidada(lista))
    } else {
        console.log(chalk.yellow("Lista de links"), chalk.black.bgGreen(identificador), lista)
    }
}

// Responsável por mandar pra tela do terminal as informações recebidas,
// nesse caso, a lista de links
async function processaTexto(argumentos){
    const caminho = argumentos[2]
    // Será um boolean, que verificará se o 4º elemento será "--valida"
    const valida = argumentos[3] === "--valida"
    // console.log(valida)

    // Qualquer caminho incorreto recebido, gerará um erro
    try {
        fs.lstatSync(caminho)
    } catch (error) {
        // Erros são objetos, se a propriedade CODE do objeto erro for ENOENT
        // imprime a mensagem
        if(error.code === 'ENOENT') {
            console.error('Arquivo ou diretório não existe')
            // Para evitar que a stack completa de erro seja impressa
            return
        }
    }

    if(fs.lstatSync(caminho).isFile()){
        const resultado = await pegaArquivo(argumentos[2])
        // Como só recebe um arquivo, não é necessário passar um identificador
        imprimeListaDeLinks(valida, resultado)
    } else if (fs.lstatSync(caminho).isDirectory()){
        const arquivos = await fs.promises.readdir(caminho)

        arquivos.forEach(async (nomeDoArquivo) => {
            const listaDeLinks = await pegaArquivo(`${caminho}/${nomeDoArquivo}`)
            // Recebe o argumento identificador, pois como um diretório,
            // pode haver mais de um arquivo
            imprimeListaDeLinks(valida, listaDeLinks, nomeDoArquivo)
        })

        console.log(arquivos)
    }
}

processaTexto(caminho)

// console.log(caminho)
// console.log(caminho[1])
// console.log(caminho[2])
// pegaArquivo(caminho[2])