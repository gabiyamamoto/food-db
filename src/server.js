import express from 'express';
import 'dotenv/config';
import FoodsRoutes from './routes/foodRoute.js';

const app = express();
// "quando chegar uma requisição com JSON no corpo (body), saiba interpretar isso"
app.use(express.json());

// define a porta que vai rodar
const PORT = process.env.PORT || 3000;

// Cria uma rota GET para a URL / (raiz do site)
app.get('/', (req, res) => {
    res.send('🚀 API funcionando');
});

// “todas as rotas que estão em FoodsRoutes começam a partir de /”.
app.use('/', FoodsRoutes);

app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

// “Express, comece a escutar requisições nessa porta”.
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
