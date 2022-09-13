import { useState } from 'react';
import { db } from '~/utils/db.server';
import { signin, createUserSession} from '~/utils/session.server';
// import { signin } from '~/utils/session.server';

import { json, redirect } from '@remix-run/node';
import { useActionData } from '@remix-run/react';

const validateForm = (fields) => {
    const {loginType: Ty, username: u, password: p, password2: ss} = fields;
    let username = '';
    let password = '';
    let password2 = '';
    const obj = {username: '', password: '', password2: ''};
    if (u.length === 0) username = 'This field is required!';
    if (u.trim().indexOf(' ') !== -1)
        username = 'Username can not contain any space!';
    if (p.length === 0) password = 'This field is required!';
    if (p.trim().length < 6)
        password = 'Password must be at least six characters';
    if (!ss || ss !== p) password2 = 'Passwords do not match!';
    obj.username = username;
    obj.password = password;
    Ty === 'signin' ? delete obj.password2 : (obj.password2 = password2);
    return obj;
};

const badRequest = (data) => json(data, {status: 400});

export const action = async ({request}) => {
    const form = await request.formData();
    const loginType = form.get('loginType');
    const username = form.get('username');
    const password = form.get('password');
    const password2 = form.get('password2');

    const fields = {
        loginType,
        username,
        password,
        password2,
    };
    // Checks data validity
    const fieldErrors = validateForm(fields);
    if (Object.values(fieldErrors).some(Boolean))
        return badRequest({fieldErrors, fields});
    // Signs him in or Signs him up
    switch (loginType) {
        case 'signin': {
            // find user
            const user = await signin({username, password});
            if (!user)
                return badRequest({
                    fields,
                    fieldErrors: {username: 'Invalid credentials'},
                });
            else console.log(user);    
            return createUserSession(user.id, '/projects');
        }
        case 'signup': {
            // ! TODO
        }
        
    }



    // console.log(fields);
    return {fields, fieldErrors};
};

export default function Signin() {
    const actionData = useActionData();
    const isSigningIn = () => {
        if (!actionData) return true;
        if (actionData.fields.loginType === 'signin') return true;
        return false;
    };
    const [isSignInSelected, selectSignin] = useState(isSigningIn);
    return (
        <form method='post'>
            <div className='mx-auto w-100 md:w-9/12 lg:w-1/3'>
                <fieldset className='flex justify-center space-x-4 border bg-yellow-100 rounded p-4 py-3 mb-2'>
                    <legend className='text-2xl'>Login or Register</legend>
                    <label>
                        <input
                            type='radio'
                            name='loginType'
                            value='signin'
                            onChange={() => selectSignin(true)}
                            defaultChecked={isSignInSelected}
                        />
                        Sign in
                    </label>
                    <label>
                        <input
                            type='radio'
                            name='loginType'
                            value='signup'
                            onChange={() => selectSignin(false)}
                            defaultChecked={!isSignInSelected}
                        />
                        Sign up
                    </label>
                </fieldset>
                <div className='flex justify-between pl-6 my-2'>
                    <label htmlFor='username'>Username: </label>
                    <input
                        type='text'
                        name='username'
                        id='username'
                        className='border  outline-black rounded'
                        defaultValue={
                            actionData?.fields?.username &&
                            actionData?.fields?.username
                        }
                    />
                </div>
                <div className='pl-6 text-red-600 text-sm'>
                    {actionData?.fieldErrors?.username &&
                        actionData?.fieldErrors?.username}
                </div>
                <div className='flex justify-between pl-6 my-2'>
                    <label htmlFor='password'>Password: </label>
                    <input
                        type='password'
                        name='password'
                        id='password'
                        className='border rounded'
                        defaultValue={
                            actionData?.fields?.password &&
                            actionData?.fields?.password
                        }
                    />
                </div>
                <div className='pl-6 text-red-600 text-sm'>
                    {actionData?.fieldErrors?.password &&
                        actionData?.fieldErrors?.password}
                </div>
                {!isSignInSelected && (
                    <>
                        <div className='flex justify-between pl-6 my-2'>
                            <label htmlFor='password2'>Verify password</label>
                            <input
                                type='password'
                                name='password2'
                                id='password2'
                                className='border rounded'
                                defaultValue={
                                    actionData?.fields.password2 &&
                                    actionData?.fields.password2
                                }
                            ></input>
                        </div>
                        <div className='pl-6 text-red-600 text-sm'>
                            {actionData?.fieldErrors?.password2 &&
                                actionData?.fieldErrors?.password2}
                        </div>
                    </>
                )}
                <div className='text-center'>
                    <button
                        type='submit'
                        className='bg-electricBlue rounded-full w-1/2 md:w-1/4 text-2xl text-white p-3'
                    >
                        Submit
                    </button>
                </div>
            </div>
        </form>
    );
}
