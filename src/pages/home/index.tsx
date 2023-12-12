import { useRouter } from 'next/router';
import styles from './styles.module.scss';
import Auth from '@components/Auth';
import { clearToken } from '@apis';
import { useState } from 'react';
import { User } from '@apis/types';

export default function () {
    const [user, setUser] = useState<User>(null);
    const router = useRouter();

    const createTest = () => {
        router.push('/new');
    };

    const reviewExam = () => {
        router.push('/review');
    };

    const logOut = () => {
        clearToken();
        router.push('/');
    };

    return (
        <div className={styles.all}>
            {!user && <Auth onSuccess={setUser} />}
            {user && (
                <div className={styles.box}>
                    <h1>Hi {user.firstName}!</h1>
                    <button onClick={createTest}>Create a new test</button>
                    <button onClick={reviewExam}>Start reviewing exams</button>
                    <button className={styles.gray} onClick={logOut}>
                        Log out
                    </button>
                </div>
            )}
        </div>
    );
}
