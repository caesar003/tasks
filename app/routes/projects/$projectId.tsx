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

    const data = {params, project, loggedInUser: loggedInUser};
    if (!project) return redirect('/notfound');
    return data;
};

export const action = async ({request}) => {
    const form = await request.formData();
    const reqType = form.get('requestType');

    const projectId = form.get('projectId');
    const userId = form.get('userId');

    const user = await getUser(request);

    switch (reqType) {
        case 'deleteProject':
            // console.log('deleting the project');
            break;

        case 'createTask':
            const name = form.get('taskName');
            const status = 'Not Started';
            const due = form.get('due');
            const obj = {
                name,
                status,
                due: new Date(due),
                userId,
                projectId,
            };

            const res = await db.task.create({
                data: obj,
            });
            return res;
            break;

        default:
            return {};
            break;
    }
    // if (user.id === userId)
    //     await db.project.delete({
    //         where: {id: id},
    //     });
    return {};
    // return redirect('/projects');
};

export default function Project() {
    const [isModalOpen, openModal] = useState(false);
    const [isTaskFormShown, showForm] = useState(false);
    // const showForm = (p) => {
    //     console.log(p);
    // };
    const {params, project, loggedInUser} = useLoaderData();
    const {
        id: projectId,
        name,
        userId,
        description,
        createdAt,
        updatedAt,
        user: projectUser,
    } = project;
    return (
        <div className='md:grid md:grid-cols-2 md:gap-4'>
            <div className='p-2'>
                <h1 className='text-3xl'>{name}</h1>
                <p className='my-1'>{description}</p>
                <p className='my-1'>
                    <em>
                        by {projectUser.username}, {createdAt}
                    </em>
                </p>
                {isTaskFormShown && (
                    <form method='post'>
                        <div className='my-3 '>
                            <div className='mx-auto w-3/4'>
                                <label className='' htmlFor='taskName'>
                                    What to do?
                                </label>
                                <br />
                                <input
                                    name='taskName'
                                    type='text'
                                    id='taskName'
                                    className='border w-full mt-1 mb-2 rounded'
                                />
                            </div>
                            <div className='mx-auto w-3/4'>
                                <label htmlFor='due' className=''>
                                    When?
                                </label>
                                <br />
                                <input
                                    type='datetime-local'
                                    id='due'
                                    name='due'
                                    className='border w-full mt-1 mb-2 rounded'
                                />
                            </div>
                            <div className='text-right pr-14'>
                                <input
                                    type='hidden'
                                    name='requestType'
                                    value='createTask'
                                />
                                <input
                                    type='hidden'
                                    name='projectId'
                                    value={projectId}
                                />
                                <input
                                    type='hidden'
                                    name='userId'
                                    value={userId}
                                />

                                <button
                                    type='submit'
                                    className='rounded bg-peach p-2'
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
            <div className='p-2'>
                <header>
                    <div className='flex justify-between mr-6 mb-1'>
                        <h2 className='text-2xl'>Tasks</h2>

                        <button
                            onClick={() => showForm(true)}
                            type='button'
                            className='rounded bg-gray-300 px-2'
                        >
                            Add New Task
                        </button>
                    </div>
                    <hr />
                </header>
                <ol className='list-decimal pl-6'>
                    <li>task one</li>
                    <li>task two</li>
                    <li>
                        <del>task three</del>
                    </li>
                </ol>
                {loggedInUser.id === projectUser.id && (
                    <button
                        className='btn bg-peach '
                        onClick={() => openModal(true)}
                    >
                        Delete post
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
                                        removed along with all of the tasks.{' '}
                                        <br />
                                        <span className='text-red-400'>
                                            This is permanent!
                                        </span>
                                    </p>
                                </div>
                                <div className='modal-footer'>
                                    <input
                                        type='hidden'
                                        name='requestType'
                                        value='deleteProject'
                                    />
                                    <input
                                        type='hidden'
                                        name='projectId'
                                        value={projectId}
                                    />
                                    <input
                                        type='hidden'
                                        name='userId'
                                        value={projectUser.id}
                                    />
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
            </div>
        </div>
    );
}
