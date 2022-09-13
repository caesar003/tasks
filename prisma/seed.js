const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

async function seed() {
    const me = await prisma.user.create({
        data: {
            username: 'me',
            passwordHash:
                '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u',
        },
    });
    await Promise.all(
        getPosts().map((post) => {
            const data = {userId: me.id, ...post};
            return prisma.project.create({data});
        }),
    );
}

seed();

function getPosts() {
    return [
        {
            name: 'Post 1 Title',
            description:
                'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.',
        },
        {
            name: 'Post 2 Title',
            description:
                'Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus,',
        },
        {
            name: 'Post 3 Title',
            description:
                'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat',
        },
        {
            name: 'Post 4 Title',
            description:
                'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
        },
    ];
}
