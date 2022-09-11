/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./app/**/*.{js,ts,jsx,tsx}'],
    theme: {
        screens: {
            sm: '480px',
            md: '768px',
            lg: '976px',
            xl: '1440px',
        },
        extend: {
            colors: {
                aliceBlue: '#F0F8FF',
                aquamarine: '#7FFFD4',
                royalBlue: '#00539CFF',
                electricBlue: '#4831D4',
                peach: '#eea47fff',
                limeGreen: '#ccf381',
            },
        },
    },
    plugins: [],
};
