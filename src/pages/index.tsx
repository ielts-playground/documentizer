import { Auth } from '@components';
import React from 'react';

export default function () {
    return (
        <div>
            <Auth successUrl={'/home'} />
        </div>
    );
}
