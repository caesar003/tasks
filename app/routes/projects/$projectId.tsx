import { useState } from 'react';
import { db } from '~/utils/db.server';

import { redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

export const loader = async ({params}) => {
    const project = await db.project.findUnique({
        where: {id: params.projectId},
    });

    const data = {params, project};
    if (!project) return redirect('/notfound');
    return data;
};

export const action = async ({request}) => {
    const form = await request.formData();
    const id = form.get('id');
    await db.project.delete({
        where: {id: id},
    });
    // console.log(id);
    return redirect('/projects');
};

export default function Project() {
    const [isModalOpen, openModal] = useState(false);
    const {params, project} = useLoaderData();
    const {
        id: d,
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
                <em>
                    by {by}, {at}
                </em>
            </p>
            <h2 className='text-2xl'>Tasks</h2>
            <ol className='list-decimal pl-6'>
                <li>task one</li>
                <li>task two</li>
                <li>
                    <del>task three</del>
                </li>
            </ol>
            <button onClick={() => openModal(true)}>Delete</button>
            {isModalOpen && (
                <form method='post'>
                    <div className='modal-background'>
                        <div className='modal-dialog'>
                            <div className='modal-header'>
                                <h1> Delete? </h1>
                                <button
                                    onClick={() => openModal(false)}
                                    type='button'
                                    className='close-btn'
                                >
                                    x
                                </button>
                            </div>
                            <div className='modal-body'>
                                <p>
                                    Proceed with care. the project will be
                                    removed along with all of the tasks
                                </p>
                            </div>
                            <div className='modal-footer'>
                                <input type='hidden' name='id' value={d} />
                                <button
                                    onClick={() => openModal(false)}
                                    className='btn btn-cancel'
                                    type='button'
                                >
                                    Cancel
                                </button>
                                <button
                                    className='btn btn-delete'
                                    type='submit'
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            )}
        </>
    );
}
