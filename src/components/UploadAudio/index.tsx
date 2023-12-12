import React, { useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';

type UploadProps = {
    audio?: File;
    onCancel: () => void;
    onFinish: (file: File) => void;
};

export default function (props: UploadProps) {
    const [file, setFile] = useState<File>(undefined);
    const inputRef = useRef<HTMLInputElement>(document.createElement('input'));

    useEffect(() => {
        inputRef.current.type = 'file';
        inputRef.current.accept = 'audio/*';
        inputRef.current.onchange = (e: any) => {
            setFile(e.target?.files?.[0]);
        };
        setFile(props.audio);
    }, [props.audio]);

    const cancel = () => {
        props.onCancel();
    };

    const finish = () => {
        props.onFinish(file);
    };

    const audioUrl = () => {
        if (file) {
            return URL.createObjectURL(file);
        }
    };

    return (
        <div className={styles.all}>
            <input ref={inputRef} hidden />
            <audio controls src={audioUrl()} />
            <div className={styles.box}>
                <button onClick={() => cancel()}>Cancel</button>
                <button
                    className={styles.change}
                    onClick={() => inputRef.current.click()}
                >
                    Change
                </button>
                <button className={styles.submit} onClick={() => finish()}>
                    Save
                </button>
            </div>
        </div>
    );
}
