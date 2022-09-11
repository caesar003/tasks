import { db } from '~/utils/db.server';

import { Link, useActionData, useLoaderData } from '@remix-run/react';

export const loader = async () => {
    const data = {
        projects: await db.project.findMany(),
    };

    return data;
};

export default function Projects() {
    const {projects} = useLoaderData();
    return (
        <div>
            <header>
                <div className='flex justify-between'>
                    <h1 className='text-2xl font-bold'>
                        Project Others Working on
                    </h1>
                    <Link
                        to={'/projects/new'}
                        className='bg-peach p-1 px-3 rounded text-white shadowBlack text-1xl font-normal'
                    >
                        Create One
                    </Link>
                </div>
            </header>

            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                {projects.map((p) => (
                    <div key={p.id} className='p-3'>
                        <Link to={`/projects/${p.id}`}>
                            <h3>{p.name}</h3>
                        </Link>
                        <p>
                            {`Created by ${p.createdBy}, ${new Date(
                                p.createdAt,
                            ).toLocaleString()}`}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
