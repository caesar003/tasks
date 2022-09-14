import {useState} from 'react';
import {db} from '~/utils/db.server';

import {json, redirect} from '@remix-run/node';
import {useActionData, useLoaderData} from '@remix-run/react';
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

    const tasks = await db.task.findMany({
        where: {
            projectId: params.projectId,
        },
    });
    const loggedInUser = await getUser(request);

    const data = {params, project, loggedInUser: loggedInUser, tasks};
    if (!project) return redirect('/notfound');
    return data;
};
const validateNewTask = ({name, due}) => {
    const obj = {
        name: '',
        due: '',
    };
    if (!name || typeof name !== 'string') obj.name = 'This field is required!';
    if (!due || typeof due !== 'string') obj.name = 'This field is required';
    return obj;
};

const badRequest = (data) => json(data, {status: 400});

export const action = async ({request}) => {
    const form = await request.formData();
    const reqType = form.get('requestType');

    const projectId = form.get('projectId');
    const userId = form.get('userId');

    const user = await getUser(request);

    switch (reqType) {
        case 'deleteProject': {
            // ('deleting the project');
            if (user.id === userId)
                await db.project.delete({
                    where: {id: projectId},
                });
            return redirect('/projects');
        }

        case 'createTask': {
            const name = form.get('taskName');
            const status = 'Not Started';
            const due = form.get('due');

            const task = {
                name,
                status,
                due: new Date(due),
                userId,
                projectId,
            };
            const fieldErrors = validateNewTask({name, due});
            if (Object.values(fieldErrors).some(Boolean)) {
                return badRequest({fieldErrors, task});
            }
            await db.task.create({
                data: task,
            });
            return redirect(`/projects/${projectId}`);
        }

        default: {
            return {};
        }
    }
};

export default function Project() {
    const [isModalOpen, openModal] = useState(false);
    const [isTaskFormShown, showForm] = useState(false);

    const actionData = useActionData();
    const {params, project, loggedInUser, tasks} = useLoaderData();
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
                        by {projectUser.username},{' '}
                        {new Date(createdAt).toLocaleString()}
                    </em>
                </p>
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
                            <div className='text-red-600'>
                                {actionData?.fieldErrors?.name ||
                                    actionData?.fieldErrors?.name}
                            </div>
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
                            <div className='text-red-600'>
                                {actionData?.fieldErrors?.name ||
                                    actionData?.fieldErrors?.name}
                            </div>
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
                            <input type='hidden' name='userId' value={userId} />

                            <button
                                type='submit'
                                className='rounded bg-peach p-2'
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <div className='p-2'>
                <header>
                    <h2 className='text-2xl'>Tasks</h2>

                    <hr />
                </header>
                <div>
                    {tasks.map((task) => (
                        <div key={task.id} className='mb-3 border-b-[2px]'>
                            <div className='flex justify-between items-start'>
                                <div>
                                    <p>{task.name}</p>
                                </div>
                                <div className='flex'>
                                    <div className='mx-1 p-1 rounded bg-slate-400 border'>
                                        <select
                                            name=''
                                            id=''
                                            disabled={true}
                                            defaultValue='not started'
                                        >
                                            <option value='not started'>
                                                Not started
                                            </option>
                                            <option value='In progress'>
                                                in progress
                                            </option>
                                            <option value='done'>Done</option>
                                        </select>
                                    </div>
                                    <div className='mx-1 p-1 rounded bg-aquamarine border'>
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            viewBox='0 0 24 24'
                                            fill='currentColor'
                                            className='w-6 h-6'
                                        >
                                            <path d='M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z' />
                                            <path d='M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z' />
                                        </svg>
                                    </div>
                                    <div className='mx-1 bg-red-700 text-white p-1 rounded'>
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            viewBox='0 0 24 24'
                                            fill='currentColor'
                                            className='w-6 h-6'
                                        >
                                            <path
                                                fillRule='evenodd'
                                                d='M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z'
                                                clipRule='evenodd'
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className='mt-2'>
                                <p>
                                    Added:
                                    {new Date(task.createdAt).toLocaleString()}
                                </p>
                                <p>
                                    Due: {new Date(task.due).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

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
