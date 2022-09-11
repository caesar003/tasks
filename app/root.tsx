import { Link, Links, LiveReload, Meta, Outlet } from '@remix-run/react';

import styles from './styles/app.css';

import type {MetaFunction} from '@remix-run/node';
export const meta: MetaFunction = () => ({
    charset: 'utf-8',
    title: 'New Remix App',
    viewport: 'width=device-width,initial-scale=1',
});

export function links() {
    return [{rel: 'stylesheet', href: styles}];
}
export default function App() {
    return (
        <Document>
            <Layout>
                <Outlet />
            </Layout>
        </Document>
    );
}
function Document({children, title}) {
    return (
        <html lang='en'>
            <head>
                <Meta />
                <Links />
                <title>{title || 'Tasks'}</title>
            </head>
            <body>
                {children}
                <LiveReload />
            </body>
        </html>
    );
}

function Layout({children}) {
    return (
        <>
            <nav className='relative container mx-auto p-6'>
                <div className='flex items-center justify-between'>
                    <div className='pt-2'>
                        <Link to='/'>
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                                strokeWidth={1.5}
                                stroke='currentColor'
                                className='w-6 h-6'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    d='M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z'
                                />
                            </svg>
                        </Link>
                    </div>
                    <div className='hidden md:flex space-x-6'>
                        <Link to='./projects'>Projects</Link>
                        <Link to='./signin'>Sign In</Link>
                    </div>

                    <Link
                        to='./register'
                        className='hidden md:block p-3 px-6 pt-2 text-white bg-royalBlue rounded-full baseline hover:bg-electricBlue'
                    >
                        Try it
                    </Link>
                </div>
            </nav>
            <div className='container mx-auto p-6'>{children}</div>
        </>
    );
}
