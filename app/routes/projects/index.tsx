import { Link, useLoaderData } from '@remix-run/react';

export const loader = () => {
    const data = [
        {
            id: 1,
            title: 'Post 1',
            postedAt: 'Sep 2 2021',
            author: 'Jason',
        },
        {
            id: 2,
            title: 'Post 2',
            postedAt: 'Sep 6, 2021',
            author: 'Bonnie',
        },
        {
            id: 3,
            title: 'Post 3',
            postedAt: 'Sep 6, 2021',
            author: 'Bonnie',
        },
        {
            id: 4,
            title: 'Post 3',
            postedAt: 'Sep 6, 2021',
            author: 'Jessica',
        },
    ];

    return data;
};
export default function Projects() {
    const data = useLoaderData();
    return (
        <div>
            <h1 className='text-3xl font-bold'>Project Others Working on</h1>
            {
                // TODO: add project form here
            }
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                {data.map((p) => (
                    <div key={p.id} className='p-3'>
                        <Link to={`/projects/${p.id}`}>
                            <h3>{p.title}</h3>
                        </Link>
                        <p>
                            Created by {p.author}, {p.postedAt}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
