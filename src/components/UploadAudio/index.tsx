import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';

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
        <div className={styles.all}>
            <div className={styles.guide}>Choose your audio file:</div>
            <input
                className={styles.input}
                type={'file'}
                accept={'audio/*'}
                onChange={(e) => handleFileChange(e)}
            />
            <div className={styles.guide}> Test Audio: </div>
            <audio controls src={audioUrl()} />
            <div className={styles.box}>
                <button onClick={() => cancel()}>Cancel</button>
                <button className={styles.submit} onClick={() => finish()}>
                    Save
                </button>
            </div>
        </div>
    );
}
