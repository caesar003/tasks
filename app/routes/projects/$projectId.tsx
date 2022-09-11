export default function Project() {
    return (
        <>
            <h1 className='text-3xl'>individual project goes here</h1>
            <h2 className='text-2xl'>With tasks listed below</h2>
            <ol className='list-decimal pl-6'>
                <li>task one</li>
                <li>task two</li>
                <li>
                    <del>task three</del>
                </li>
            </ol>
        </>
    );
}
