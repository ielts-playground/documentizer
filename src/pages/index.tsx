import { ping } from '@apis';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

export default function () {
    const router = useRouter();

    useEffect(() => {
        ping()
            .then(() => {
                router.push('/redirect');
            })
            .catch((_) => {
                router.push('/log-in');
            });
    }, []);

    return <div>Loading...</div>;
}
