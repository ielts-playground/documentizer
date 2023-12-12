import { authenticate } from '@apis';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';

type User = {
    username: string;
    password: string;
};

export default function () {
    const [user, setUser] = useState<User>({ username: '', password: '' });
    const [authenticating, setAuthenticating] = useState<boolean>(false);
    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        if (authenticated) {
            const search = new URLSearchParams(window.location.search);
            if (search.get('redirect')) {
                const redirect =
                    decodeURIComponent(search.get('redirect')) || '/home';
                router.push(redirect);
            } else {
                router.push('/home');
            }
        } else {
            setUser({
                username: localStorage.getItem('username'),
                password: '',
            });
        }
    }, [authenticated]);

    const handleChangeUserName = (e: any) => {
        const change = e.target.value;
        setUser((prevState) => ({ ...prevState, username: change }));
        handleEnterKeyPress();
    };

    const handleChangePassword = (e: any) => {
        const change = e.target.value;
        setUser((prevState) => ({ ...prevState, password: change }));
        handleEnterKeyPress();
    };

    function handleSubmit(_) {
        if (user?.username && user?.password && !authenticating) {
            setAuthenticating(true);
            authenticate(user.username, user.password)
                .then((hasToken) => {
                    setAuthenticated(hasToken);
                    if (!hasToken) {
                        throw new Error();
                    } else {
                        localStorage.setItem('username', user.username);
                    }
                })
                .catch(() => {
                    alert('Username or password incorrect!');
                    setAuthenticating(false);
                });
        }
    }

    function handleEnterKeyPress() {
        const submitButton = document.getElementsByTagName('button')[0];
        function Enter(event: any) {
            if (event.keyCode === 13) {
                event.preventDefault();
                submitButton.click();
            }
        }

        const inputs = document.getElementsByTagName('input');
        Array.from(inputs).forEach((input) => {
            input.addEventListener('keydown', Enter);
        });
    }

    return (
        <div className={styles.all}>
            <div className={styles.box}>
                <input
                    className={styles.input}
                    type={'text'}
                    placeholder="username"
                    onChange={(e) => handleChangeUserName(e)}
                    defaultValue={user.username}
                />
                <input
                    className={styles.input}
                    type={'password'}
                    placeholder="password"
                    onChange={(e) => handleChangePassword(e)}
                />
                <button
                    className={
                        user?.username && user?.password && !authenticating
                            ? styles.button
                            : styles.disabledButton
                    }
                    onClick={handleSubmit}
                >
                    {authenticating ? 'Logging in...' : 'Log in'}
                </button>
            </div>
        </div>
    );
}
