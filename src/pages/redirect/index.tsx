import { useRouter } from 'next/router';
import styles from './styles.module.scss';
import Auth from '@components/Auth';

export default function () {
    const router = useRouter();

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

    return (
        <div className={styles.all}>
            <Auth />
            <div className={styles.box}>
                <p>
                    <b>WHICH SKILL DO YOU WANT TO SUBMIT?</b>
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
                <button onClick={(e) => createUser()}>
                    Create user's account
                </button>
            </div>
        </div>
    );
}
