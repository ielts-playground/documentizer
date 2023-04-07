import { authenticate } from '@apis';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

export default function () {
    const router = useRouter();

    useEffect(() => {
        authenticate('tuanm', '123').then((ok) => {
            if (ok) {
                router.push('/new/reading');
            }
        });
    }, []);

    return <div>Hello World!</div>;
}
