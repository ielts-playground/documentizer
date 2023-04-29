import { Auth } from '@components';
import { useRouter } from 'next/router';
import React from 'react';

export default function () {
    const router = useRouter();

    return (
        <div>
            <Auth successUrl={'/redirect'} />
        </div>
    );
}
