import {useState} from 'react';
import {db} from '~/utils/db.server';

import {redirect} from '@remix-run/node';
import {useLoaderData} from '@remix-run/react';
import {getUser} from '~/utils/session.server';

export const loader = async ({params, request}) => {
    const project = await db.project.findUnique({
        where: {
            id: params.projectId,
        },
        include: {
            user: true,
        },
    });
    const loggedInUser = await getUser(request);

    // console.log(loggedInUser);
    const data = {params, project, user: loggedInUser};
    if (!project) return redirect('/notfound');
    return data;
};

export const action = async ({request}) => {
    const form = await request.formData();
    const id = form.get('id');
    const userId = form.get('userId');
    const user = await getUser(request);

    if (user.id === userId)
        await db.project.delete({
            where: {id: id},
        });
    return redirect('/projects');
};

export default function Project() {
    const [isModalOpen, openModal] = useState(false);
    const {params, project, user} = useLoaderData();
    const {
        id: d,
        name: na,
        userId: by,
        description: ds,
        createdAt: at,
        updatedAt: up,
        user: U,
    } = project;
    return (
        <>
            <h1 className='text-3xl'>{na}</h1>
            <p>{ds}</p>
            <p>
                <em>
                    by {U.username}, {at}
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
            {user.id === by && (
                <button
                    className='btn bg-peach '
                    onClick={() => openModal(true)}
                >
                    Delete
                </button>
            )}
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
                                <input type='hidden' name='userId' value={by} />
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
