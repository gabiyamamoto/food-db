import * as FoodsModel from '../models/foodModel.js';

const validCategories = ['Lanches', 'Pizzas', 'Saladas', 'Bebidas', 'Sobremesas'];

export const getAll = async (req, res) => {
    try {
        //filtros
        const filters = {};

        if (req.query.name) filters.name = req.query.name;
        if (req.query.category) filters.category = req.query.category;
        if (req.query.available) filters.available = req.query.available;

        const foods = await FoodsModel.findAll(filters);

        if (!foods || foods.length === 0) {
            return res.status(404).json({
                message: 'Não há comidas cadastradas com os filtros aplicados',
            });
        }

        res.status(200).json({
            total: foods.length,
            message: 'Lista de comidas disponíveis',
            filters,
            foods
        });

    } catch (error) {
        console.error('Erro ao buscar:', error);
        res.status(500).json({ error: 'Erro ao buscar comidas' });
    }
};

export const getById = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id) || id < 0) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const data = await FoodsModel.findById(id);
        if (!data) {
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }
        res.json({ data });

    } catch (error) {
        console.error('Erro ao buscar:', error);
        res.status(500).json({ error: 'Erro ao buscar registro' });
    }
};

export const create = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                error: 'Corpo da requisição vazio. Envie os dados do exemplo!',
            });
        }

        const { name, description, price, category } = req.body;

        if (!name) return res.status(400).json({ error: 'O nome (nome) é obrigatório!' });
        if (!description) return res.status(400).json({ error: 'O ano (ano) é obrigatório!' });
        if (!price) return res.status(400).json({ error: 'O preço (preco) é obrigatório!' });
        if (!category) return res.status(400).json({ error: 'A categoria (categoria) é obrigatória!' });

        const data = await model.create({
            name,
            description,
            price: parseFloat(price),
            preco,
        });

        res.status(201).json({
            message: 'Registro cadastrado com sucesso!',
            data,
        });
    } catch (error) {
        console.error('Erro ao criar:', error);
        res.status(500).json({ error: 'Erro interno no servidor ao salvar o registro.' });
    }
};

export const update = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                error: 'Corpo da requisição vazio. Envie os dados do exemplo!',
            });
        }

        if (isNaN(id) || id < 0) return res.status(400).json({ error: 'ID inválido.' });

        const exists = await model.findById(id);
        if (!exists) {
            return res.status(404).json({ error: 'Registro não encontrado para atualizar.' });
        }

        const data = await model.update(id, req.body);
        res.json({
            message: `O registro "${data.nome}" foi atualizado com sucesso!`,
            data,
        });
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        res.status(500).json({ error: 'Erro ao atualizar registro' });
    }
};

export const remove = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

        const exists = await model.findById(id);
        if (!exists) {
            return res.status(404).json({ error: 'Registro não encontrado para deletar.' });
        }

        await model.remove(id);
        res.json({
            message: `O registro "${exists.nome}" foi deletado com sucesso!`,
            deletado: exists,
        });
    } catch (error) {
        console.error('Erro ao deletar:', error);
        res.status(500).json({ error: 'Erro ao deletar registro' });
    }
};
