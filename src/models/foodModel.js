import prisma from '../utils/prismaClient.js';

// Como buscar dados no banco demora e é assíncrono, a gente precisa usar async e await para garantir
// que o código espere o banco responder antes de devolver o resultado. Caso contrário, a função
// retornaria uma Promise em vez da lista de comidas, e a resposta para o cliente não teria os dados corretos.

export const findAll = async (filters = {}) => { // Aqui, o filters é uma variável que recebe exatamente o objeto que o controller mandou.
// Ou seja, filters === { name: "Pizza" }

    const { name, category, available } = filters; // É feita a desestruturação de objeto.
    // Isso é o equivalente a escrever:
    // const name = filters.name;
    // const category = filters.category;
    // const available = filters.available;
// Nesse caso:
// filters = {
// name = "Pizza",
// category  = undefined,
// available = undefined }

    const where = {};
// os ifs são os mesmos que o if tradicional, só que sem {} porque tem uma única instrução, ou seja, só tá numa estrutura diferente.
    if (name) where.name = { contains: name, mode: 'insensitive' }; // if (Boolean("Pizza")) → true
    // Então:
    // where = { name: { contains: "Pizza", mode: "insensitive" } }
    if (category) where.category = { contains: category, mode: 'insensitive' };
    if (available !== undefined) where.available = available;

    return await prisma.food.findMany({ // Prisma só recebe o objeto final de where
        where,
        orderBy: { createdAt: 'desc' }, //Descrescente: Mais recentes ficam no topo
    });
};

//busca por id
export const findById = async (id) => { // Como no controller ele só pega o id da URL, o id está como string
    return await prisma.food.findUnique({
        where: { id: parseInt(id) }, // Mas aqui ele faz a conversão final, transformando o id (string) para o id (number) usando o parseInt. Ex: "5" → 5. O Prisma compara com o ID da tabela e traz o dado que corresponde a esse id.
    });
};

// Recebe um parâmetro chamado data, que é um objeto com as informações da comida.
export const create = async (data) => {
    return await prisma.food.create({ // Chama o Prisma para criar um novo registro na tabela food
        data: { // Aqui começa o objeto que será enviado ao banco.
            name: data.name, // O campo name desse novo registro na tabela food vai receber o valor que está em data.name
            description: data.description,
            price: Number(data.price),
            category: data.category,
            available: data.available ?? true, // ?? é nullish coalescing, que só considera null e undefined como “ausência de valor”.
        }, // Não pode fazer data.available || true porque quando data.available = false, false é considerado falsy, então o JavaScript
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

// Isso permite que só os campos que o usuário enviou entrem no data que vai ser enviado ao banco.
// Porque se caso o && retornar um false, o spread ignora isso e nem entra no data.

// ❌ FALSY:
// false, 0, "", null, undefined, NaN

// ✅ TRUTHY:
// true, "Pizza", "0", 123, [], {}