import Image from '@components/Image';
import Upload from '@components/UploadImage';
import React, { useState } from 'react';

export default function () {
    const [image, setImage] = useState<string>(undefined);
    const [editing, setEditing] = useState<boolean>(false);

    const cancel = () => {
        setEditing(false);
    };

    const finish = (newImage: string) => {
        setImage(newImage);
        setEditing(false);
    };

    return (
        <>
            <Image
                onChange={(_) => {
                    setEditing(true);
                }}
                value={image}
            />
            {editing && <Upload onCancel={cancel} onFinish={finish} />}
        </>
    );
}
