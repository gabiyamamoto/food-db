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
