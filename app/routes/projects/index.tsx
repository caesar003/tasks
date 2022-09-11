import { db } from '~/utils/db.server';

import { Link, useLoaderData } from '@remix-run/react';

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
            <h1 className='text-3xl font-bold'>Project Others Working on</h1>
            {
                // TODO: add project form here
            }
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                {projects.map((p) => (
                    <div key={p.id} className='p-3'>
                        <Link to={`/projects/${p.id}`}>
                            <h3>{p.name}</h3>
                        </Link>
                        <p>
                            Created by {p.createdBy}, {p.createdAt}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
