import {Outlet} from '@remix-run/react';
import {getUser} from '~/utils/session.server';
import {useLoaderData} from '@remix-run/react';
import {redirect} from '@remix-run/node';

export const loader = async ({request}) => {
    const user = await getUser(request);
    if (!user) return redirect('/auth/signin');
    return null;
};
export default function Index() {
    return (
        <div>
            <Outlet />
        </div>
    );
}
