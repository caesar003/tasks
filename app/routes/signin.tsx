import { useState } from 'react';
import { db } from '~/utils/db.server';

import { redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

export const action = async ({request}) => {
    /**
     * Register
     *      checks data validity
     *      checks name availability
     *      creates user
     *      signs user in
     *      creates session
     */
    /**
     * Sign in
     *      checks data validity
     *      checks user existence and password authentication
     *      signs user in
     *      creates user session
     */
};
export default function Signin() {
    const [isSignInSelected, selectSignin] = useState(true);
    // const {fields} = useLoaderData();

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
                            defaultChecked={true}
                        />
                        Sign in
                    </label>
                    <label>
                        <input
                            type='radio'
                            name='loginType'
                            value='signup'
                            onChange={() => selectSignin(false)}
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
                    />
                </div>
                <div className='flex justify-between pl-6 my-2'>
                    <label htmlFor='password'>Password: </label>
                    <input
                        type='password'
                        name='password'
                        id='password'
                        className='border rounded'
                    />
                </div>
                {!isSignInSelected && (
                    <div className='flex justify-between pl-6 my-2'>
                        <label htmlFor='password2'>Verify password</label>
                        <input
                            type='password'
                            name='password2'
                            id='password2'
                            className='border rounded'
                        ></input>
                    </div>
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
