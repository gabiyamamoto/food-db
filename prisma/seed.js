import 'dotenv/config';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Iniciando seed...');

    await prisma.food.createMany({
        data: [
            {
                name: 'Hambúrguer Artesanal',
                description: 'Blend de carne 180g, cheddar e bacon',
                price: 38.9,
                category: 'Lanches'
            },
            {
                name: 'Pizza Calabresa',
                description: 'Molho de tomate, mussarela e cebola',
                price: 55.0,
                category: 'Pizzas'
            },
            {
                name: 'Salada Caesar',
                description: 'Alface romana, croutons e molho especial',
                price: 32.5,
                category: 'Saladas'
            },
            {
                name: 'Suco de Laranja',
                description: 'Natural 500ml',
                price: 12.0,
                category: 'Bebidas'
            },
            {
                name: 'Petit Gâteau',
                description: 'Com sorvete de baunilha',
                price: 25.0,
                category: 'Sobremesas',
                available: false
            },
            {
                name: 'X-Salada Especial',
                description: 'Hambúrguer 160g, queijo prato, alface, tomate e maionese da casa',
                price: 34.5,
                category: 'Lanches'
            },
            {
                name: 'Hot Dog Gourmet',
                description: 'Salsicha artesanal, purê de batata, vinagrete e batata palha',
                price: 22.0,
                category: 'Lanches'
            },
            {
                name: 'Pizza Portuguesa',
                description: 'Presunto, ovos, cebola, ervilha e cobertura de mussarela',
                price: 58.0,
                category: 'Pizzas'
            },
            {
                name: 'Pizza Quatro Queijos',
                description: 'Mussarela, catupiry, provolone e parmesão',
                price: 64.0,
                category: 'Pizzas'
            },
            {
                name: 'Salada Tropical',
                description: 'Mix de folhas, lascas de manga, kani-kama e molho cítrico',
                price: 29.9,
                category: 'Saladas'
            },
            {
                name: 'Bowl de Quinoa',
                description: 'Quinoa, grão de bico, tomate cereja e pepino',
                price: 36.0,
                category: 'Saladas'
            },
            {
                name: 'Refrigerante Lata',
                description: 'Coca-Cola ou Guaraná 350ml',
                price: 7.5,
                category: 'Bebidas'
            },
            {
                name: 'Chá Gelado com Limão',
                description: 'Chá preto batido com gelo e limão siciliano',
                price: 10.0,
                category: 'Bebidas'
            },
            {
                name: 'Brownie com Doce de Leite',
                description: 'Brownie aquecido recheado com doce de leite artesanal',
                price: 18.0,
                category: 'Sobremesas'
            },
            {
                name: 'Pudim de Leite Moça',
                description: 'Fatia individual com calda de caramelo',
                price: 14.0,
                category: 'Sobremesas'
            }
        ],
    });

    console.log('✅ Seed concluído!');
}

main()
    .catch((e) => {
        console.error('❌ Erro no seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
