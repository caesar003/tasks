import { db } from '~/utils/db.server';

import { json, redirect } from '@remix-run/node';

const validateName = (str: string) => {
    if (typeof str !== 'string' || str.length === 0)
        return "Project name can't be empty!";
};

const validateDesc = (str: string) =>
    typeof str !== 'string' || str.length === 0
        ? "Project description can't be empty"
        : null;

const badRequest = (data) => json(data, {status: 400});
export const action = async ({request}) => {
    const form = await request.formData();
    const name = form.get('projectname');
    const description = form.get('projectdescription');
    const createdBy = 'Charlie';

    const project = {name, description, createdBy};
    const fieldErrors = {
        name: validateName(name),
        description: validateDesc(description),
    };
    if (Object.values(fieldErrors).some(Boolean)) {
        console.log('this is wrong');
        return badRequest({fieldErrors, project});
    }
    const post = await db.project.create({data: project});
    return redirect('/projects');
};
function NewProject() {
    return (
        <form method='POST'>
            <div className='form-group'>
                <label htmlFor='projectname'>Name</label> <br />
                <input
                    type='text'
                    id='projectname'
                    name='projectname'
                    className='border p-2 w-full'
                    placeholder='Enter your unique project name'
                />
            </div>
            <div className='form-group'>
                <label htmlFor='projectdescription'>Description</label>
                <br />
                <textarea
                    id='projectdescription'
                    name='projectdescription'
                    className='border p-2 w-full'
                    placeholder='This project is all about ....'
                />
            </div>
            <button
                type='submit'
                className='bg-limeGreen text-black shadow-white p-1 px-3 rounded'
            >
                Save
            </button>
        </form>
    );
}

export default NewProject;
