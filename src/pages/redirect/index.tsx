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

    const createUser = () => {
        router.push('/register');
    };

    const reviewWriting = () => {
        router.push('/review');
    };

    return (
        <div className={styles.all}>
            <div className={styles.box}>
                <p>
                    <b>WHICH ACTION DO YOU WANT TO IMPLEMENT?</b>
                </p>
                <button name="reading" onClick={(e) => handleButtonClick(e)}>
                    SUBMIT READING
                </button>
                <button name="listening" onClick={(e) => handleButtonClick(e)}>
                    SUBMIT LISTENING
                </button>
                <button name="writing" onClick={(e) => handleButtonClick(e)}>
                    SUBMIT WRITING
                </button>
                <button onClick={(e) => createUser()}>
                    Create user's account
                </button>
                <button onClick={(e) => reviewWriting()}>
                    Review writing's exams
                </button>
            </div>
        </div>
    );
}
