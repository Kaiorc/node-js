// Função que recebe um array e extrai os valores de cada chave dos objetos para outro array
function extraiLinks(arrayDeLinks) {
    // A cada iteração extrai o valor de uma chave do objeto (que nesse caso
    // é o link que queremos) e armazena em outro array 
    // Usamos o .join(), para que se torne apenas um array com os links
    return arrayDeLinks.map((objetoLink) => Object.values(objetoLink).join())
}

// Função que recebe um array de Links construído na função "extraiLinks".
// Usamos o .map para iterar o array e retornar um array de códigos HTTP
// das respostas dos links   
async function checaStatus(listaURLs) {
    // Usamos o Promise.all(), que é capaz de receber uma lista de promises,
    // resolvê-las e retornar uma lista de promises resolvidas
    const arrayDeStatus = await Promise.all(
        listaURLs.map(async (url) => {
            try {
                const response = await fetch(url)
                // Retorna o status da resposta HTTP
                return response.status
            } catch (erro) {
                return manejaErros(erro)
            }
        })
    )
    return arrayDeStatus
}

//
function manejaErros (erro) {
    // console.log(chalk.red("Algo deu errado"), erro)

    if (erro.cause.code === 'ENOTFOUND') {
        return "Link não encontrado"
    } else {
        return "Ocorreu algum erro"
    }
}

export default async function listaValidada(listaDeLinks) {
    const links = extraiLinks(listaDeLinks)
    const status = await checaStatus(links)

    console.log(status)

    return listaDeLinks.map((objeto, indice) => ({
        ...objeto,
        status: status[indice]
    }))

    // return status
    // return extraiLinks(listaDeLinks)
    // return "entrou na função"
}

// Exemplo de fetch da documentação
// const res = await fetch('https://nodejs.org/api/documentation.json');
// if (res.ok) {
//   const data = await res.json();
//   console.log(data);
// }

// Link que não existe, usado para testar o retorno de erro no fetch
// [gatinho salsicha](http://gatinhosalsicha.com.br/)