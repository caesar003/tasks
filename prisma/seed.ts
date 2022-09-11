import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
    await Promise.all(
        getPosts().map((post) => {
            return prisma.project.create({data: post});
        }),
    );
}

seed();

function getPosts() {
    return [
        {
            name: 'Post 1',
            createdBy: 'Jessica',
            description: 'This is the description of the post',
        },
        {
            name: 'post 2',
            createdBy: 'jason',
            description: 'This is the description of the post',
        },
        {
            name: 'post 3',
            createdBy: 'charles',
            description: 'This is the description of the post',
        },
        {
            name: 'post 4',
            createdBy: 'Ann',
            description: 'This is the description of the post',
        },
    ];
}
