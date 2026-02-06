import prisma from '../utils/prismaClient.js';

// Mostra todas as comidas
export const findAll = async (filters = {}) => {
    const { name, category, available } = filters;
    const where = {};

    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (category) where.category = { contains: category, mode: 'insensitive' };
    if (available) where.available = available === 'true' };

    return await prisma.food.findMany({
        where,
        orderBy: { createdAt: 'desc' }, //Mais recentes ficam no topo
    });
};

//busca por id
export const findById = async (id) => {
    return await prisma.food.findUnique({
        where: { id: parseInt(id) },
    });
};

//cria novo
export const create = async (data) => {
    return await prisma.food.create({
        data: {
            name: data.name,
            description: data.description,
            price: data.price,
            category: data.category,
            available: data.available ?? true,
        },
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
            ...(data.name && { name: data.name }),
            ...(data.description && { description: data.description }),
            ...(data.price && { price: data.price }),
            ...(data.category && { category: data.category }),
            ...(data.available !== undefined && { available: data.available })
        },
    });
};
