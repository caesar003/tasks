import { db } from '~/utils/db.server';

import { useLoaderData } from '@remix-run/react';

export const loader = async ({params}) => {
    const project = await db.project.findUnique({
        where: {id: params.projectId},
    });
    const data = {params, project};
    return data;
};

export default function Project({}) {
    const {params, project} = useLoaderData();
    const {
        name: na,
        createdBy: by,
        description: ds,
        createdAt: at,
        updatedAt: up,
    } = project;
    return (
        <>
            <h1 className='text-3xl'>{na}</h1>
            <p>{ds}</p>
            <p>
                by {by}, {at}
            </p>
            <h2 className='text-2xl'>Tasks</h2>
            <ol className='list-decimal pl-6'>
                <li>task one</li>
                <li>task two</li>
                <li>
                    <del>task three</del>
                </li>
            </ol>
        </>
    );
}
