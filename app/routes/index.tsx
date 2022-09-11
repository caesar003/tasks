import { Outlet } from '@remix-run/react';

export default function Index() {
    return (
        <div>
            <h1>Projects People Working On</h1>
            <h1>
                This will basically be sign in form if the user is not signing
                in
            </h1>
            <Outlet />
        </div>
    );
}
