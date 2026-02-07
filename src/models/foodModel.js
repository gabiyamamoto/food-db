import prisma from '../utils/prismaClient.js';

// Como buscar dados no banco demora e é assíncrono, a gente precisa usar async e await para garantir
// que o código espere o banco responder antes de devolver o resultado. Caso contrário, a função
// retornaria uma Promise em vez da lista de comidas, e a resposta para o cliente não teria os dados corretos.

// Filters recebe os parâmetros de filtro. Se nada for enviado, vira objeto vazio {}.
// E consequentemente, nao entre em nenhum if e where = {}, que retorna todas as comidas.
// Isso garante que a função execute sem erro e aplique apenas os filtros informados.

export const findAll = async (filters = {}) => {
    const { name, category, available } = filters;
    const where = {};

    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (category) where.category = { contains: category, mode: 'insensitive' };
    if (available !== undefined) where.available = available;

    return await prisma.food.findMany({
        where,
        orderBy: { createdAt: 'desc' }, //Descrescente: Mais recentes ficam no topo
    });
};

//busca por id
export const findById = async (id) => {
    return await prisma.food.findUnique({
        where: { id: parseInt(id) },
    });
};

// Recebe um parâmetro chamado data, que é um objeto com as informações da comida.
// 
export const create = async (data) => {
    return await prisma.food.create({ // Chama o Prisma para criar um novo registro na tabela food
        data: { // Aqui começa o objeto que será enviado ao banco.
            name: data.name, // O campo name desse novo registro na tabela food vai receber o valor que está em data.name
            description: data.description,
            price: Number(data.price),
            category: data.category,
            available: data.available ?? true, // ?? é nullish coalescing, que só considera null e undefined como “ausência de valor”.
        }, // Não pode fazer data.available || true porque quando data.available = false, false é considerado false, então o JavaScript
        // pensa: “Não posso usar esse valor” e escolhe o segundo, colocando o valor true sendo que vc enviou false.
    });
};

export const remove = async (id) => {
    return await prisma.food.delete({
        where: { id: parseInt(id) },
    });
};

export const update = async (id, data) => {
    return await prisma.food.update({
        where: { id: parseInt(id) },
        data: {
            ...(data.name && { name: data.name }), //... é spread operator, que diz "Espalhe as propriedades desse objeto aqui dentro do
            // objeto data"
            ...(data.description && { description: data.description }), // o && funciona assim: se o primeiro valor “não presta”, for falsy, ele devolve ele mesmo. Mas se o primeiro “presta”, for truthy, ele deixa o segundo passar.
            ...(data.price !== undefined && { price: data.price }),
            ...(data.category && { category: data.category }),
            ...(data.available !== undefined && { available: data.available })
        },
    });
};

// Se data.name = 'Pizza'
// Então data.name && { name: data.name } vira { name: 'Pizza' }
// O spread vai espalhar a propriedade name: 'Pizza' dentro do objeto data do Prisma ...{ name: 'Pizza' }
// Que equivale a escrever data: { name: 'Pizza'}

// Isso permite que só os campos que o usuário enviou entrem no data do Prisma.
// Os campos que não foram enviados simplesmente não aparecam no objeto final.