import * as FoodsModel from '../models/foodModel.js'; // Cria um objeto para importar todas as funções que estão no model

const validCategories = ['Lanches', 'Pizzas', 'Saladas', 'Bebidas', 'Sobremesas'];

export const getAll = async (req, res) => {
    try { // O try e catch funcionam como: “tente executar tudo que está dentro do try, se algo der errado, pule pro catch"

        const filters = {};

        if (req.query.name) filters.name = req.query.name; // Express monta req.query={ name: "Pizza" }
        // if (Boolean("Pizza")) → true
        // Entra no if
        // filters.name = "Pizza"
        // o filters vai pro model como um objeto

        if (req.query.category) filters.category = req.query.category
        if (req.query.available !== undefined) {
            filters.available = req.query.available === 'true'; // A requisição chega no controller: /foods?available=true
        } // filters.available = req.query.available === 'true';
        // filters = { available: true }

        const foods = await FoodsModel.findAll(filters); // 👈 O controller chama a função findAll que ta no model
        if (!foods || foods.length === 0) {
            return res.status(404).json({ // Sem return, o código continuaria e tentaria mandar outra resposta, resultando em erro.
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
        const { id } = req.params; // id da URL. Ex: id = "5" (string)

        if (isNaN(id)) {
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
        if (!req.body || Object.keys(req.body).length === 0) { // Se req.body for um falsy (undefined, null, false),
        //  o ! vai fazer a negação lógica e tranformar o falsy em um truthy, logo !req.body = true
        // Se !req.body for true, ele mostra essa mensagem de erro.

        // Porém somente isso não vai funcionar caso a req.body for um objeto vazio, pq {} é considerado truthy, logo !req.body = false
        // e não entraria nesse if. Mas ele precisa entrar para que no banco não fique undefined.
        // A solução é usar o Object.keys(req.body).length === 0

        // O Object.keys retorna um array com as chaves do OBJETO de req.body
        // Ex: Object.keys({ name: "Pizza", price: 30 }) → ["name", "price"]
        // Agora, se o usuário mandar {}, a array não vai ter nada e o length vai ser 0.
        // Object.keys({}).length === 0 → true

        // Conclusão: Se o usuário enviar dados inválidos ou enviar nada, qualquer um dos dois já invalida a requisição.

            return res.status(400).json({
                error: 'Corpo da requisição vazio. Envie os dados do exemplo!',
            });
        }

        const { name, description, price, category, available } = req.body;
        // Esses ifs seguem a mesma lógica de cima 👆
        // A diferença é que não precisa usar o Object.keys porque aqui se o usuário enviar vazio, ou seja a string for "", ele barra automaticamente.
        if (!name) return res.status(400).json({ error: 'O nome (name) é obrigatório!' });
        if (!description) return res.status(400).json({ error: 'A descrição (description) é obrigatório!' });
        // Verificação para caso o usuário não envie nada em price
        // Não pode usar !price porque se não ele barraria o 0, mas 0 é um preço válido.
        if (price === undefined) return res.status(400).json({ error: 'O preço (price) é obrigatório!' });
        if (!category) return res.status(400).json({ error: 'A categoria (category) é obrigatória!' });

        if (!validCategories.includes(category)) {
            return res.status(400).json({ error: 'Categoria inválida.' });
        }

        // Aqui ele meio que completa a verifição anterior do price porque a gente não pôde usar !price.
        if (isNaN(price) || price <= 0) {
            return res.status(400).json({ error: 'Preço tem que ser um número positivo.' });
        }

        const data = await FoodsModel.create({
            name,
            description,
            price: parseFloat(price),
            category,
            available,
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
        const { price, category } = req.body;

        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

        if (price !== undefined && (isNaN(price) || price <= 0)) {
            return res.status(400).json({ error: 'Preço tem que ser um número positivo.' });
        }

        if (category !== undefined && !validCategories.includes(category)) {
            return res.status(400).json({ error: 'Categoria inválida.' });
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                error: 'Corpo da requisição vazio. Envie os dados do exemplo!',
            });
        }

        const exists = await FoodsModel.findById(id);
        if (!exists) {
            return res.status(404).json({ error: 'Registro não encontrado para atualizar.' });
        }

        const data = await FoodsModel.update(id, req.body);

        res.json({
            message: `O registro "${data.name}" foi atualizado com sucesso!`,
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

        const exists = await FoodsModel.findById(id); // exists vai ser um objeto, caso o model encontre o registro no banco
        // mas caso o model não ache um dado com o id correspondente, exists vai ser null.
        // e null é falsy
        // !null === true
        // entra no if
        // retorna 404 Not Found 👇
        if (!exists) {
            return res.status(404).json({ error: 'Registro não encontrado para deletar.' });
        }

        await FoodsModel.remove(id);

        res.json({
            message: `O registro "${exists.name}" foi deletado com sucesso!`, // exists é uma variável local do controller
            // ela recebe uma cópia do objeto retornado pelo banco
            // isso fica na memória da aplicação, não no banco.
            // Quando o model apaga o registro do banco, a variável exists continua intacta. Poi isso ainda é possível usar exists.name
            deletado: exists, // E deletado: exists,
        });

    } catch (error) {
        console.error('Erro ao deletar:', error);
        res.status(500).json({ error: 'Erro ao deletar registro' });
    }
};