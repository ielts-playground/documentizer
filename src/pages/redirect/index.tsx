import { ping } from '@apis';
import { useRouter } from 'next/router';
import styles from './styles.module.scss';
import { useEffect } from 'react';

export default function () {
    const router = useRouter();

    useEffect(() => {
        const redirect = encodeURIComponent(window.location.pathname);
        ping().catch(() => {
            router.push(`/log-in?redirect=${redirect}`);
        });
    }, []);

    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        const skill = event.currentTarget.name;

        switch (skill) {
            case 'reading':
                router.push('new/reading');
                break;

            case 'listening':
                router.push('new/listening');
                break;

            case 'writing':
                router.push('new/writing');
                break;
        }
    };

    return (
        <div className={styles.all}>
            <div className={styles.box}>
                <p>
                    ,<b>WHICH SKILL DO YOU WANT TO SUBMIT?</b>
                </p>
                <button name="reading" onClick={(e) => handleButtonClick(e)}>
                    READING
                </button>
                <button name="listening" onClick={(e) => handleButtonClick(e)}>
                    LISTENING
                </button>
                <button name="writing" onClick={(e) => handleButtonClick(e)}>
                    WRITING
                </button>
            </div>
        </div>
    );
}
