import process from 'process';

export function Private({ children }) {
    const p = process.env['PRIVATE'];

    if (typeof p !== 'undefined' && p.toLowerCase() === 'true') {
        return <>{ children }</>;
    }
}
