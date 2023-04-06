import React, { useEffect, useState } from 'react';

type UploadProps = {
    audio?: File;
    onCancel: () => void;
    onFinish: (file: File) => void;
};

export default function (props: UploadProps) {
    const [file, setFile] = useState<File>(undefined);

    useEffect(() => {
        setFile(props.audio);
    }, [props.audio]);

    const cancel = () => {
        props.onCancel();
    };

    const finish = () => {
        props.onFinish(file);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const audioUrl = () => {
        if (file) {
            return URL.createObjectURL(file);
        }
    };

    return (
        <>
            <div>Choose your audio file</div>
            <input
                type={'file'}
                accept={'audio/*'}
                onChange={(e) => handleFileChange(e)}
            />
            Test Audio: <audio controls src={audioUrl()} />
            <button onClick={() => cancel()}>Cancel</button>
            <button onClick={() => finish()}>Save</button>
        </>
    );
}
