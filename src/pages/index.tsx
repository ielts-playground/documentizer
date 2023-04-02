import Upload from '@components/Upload';
import React from 'react';

export default function () {
    const cancel = () => {
        console.log('cancelled');
    };

    const finish = (data: string) => {
        console.log(data);
    };

    return <Upload onCancel={cancel} onFinish={finish} />;
}
