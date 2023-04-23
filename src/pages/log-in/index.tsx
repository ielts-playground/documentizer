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
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            document.getElementById('error').hidden = true;
            document.getElementById('authenticated').hidden = false;
            const search = new URLSearchParams(window.location.search);
            if (search.get('redirect')) {
                const redirect =
                    decodeURIComponent(search.get('redirect')) || '/redirect';
                router.push(redirect);
            } else {
                router.push('/redirect');
            }
        }
    }, [isAuthenticated]);

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
        authenticate(user.username, user.password)
            .then((hasToken) => {
                setIsAuthenticated(hasToken);
                if (!hasToken) {
                    document.getElementById('error').hidden = false;
                }
            })
            .catch(() => {
                handelError();
            });

        setUser({ username: '', password: '' });
    }

    function handelError() {
        Array.from(document.getElementsByTagName('input')).forEach((input) => {
            input.value = '';
        });
        document.getElementById('error').hidden = false;
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
                <p>
                    <b>Please log in as administrator</b>
                </p>
                <input
                    className={styles.input}
                    type={'text'}
                    placeholder="Username"
                    onChange={(e) => handleChangeUserName(e)}
                />
                <input
                    className={styles.input}
                    type={'password'}
                    placeholder="password"
                    onChange={(e) => handleChangePassword(e)}
                />
                <p id="error" hidden>
                    Wrong admin's account, please try again
                </p>
                <p id="authenticated" hidden>
                    Waiting for a second
                </p>
                <button
                    className={styles.button}
                    onClick={(_) => handleSubmit(_)}
                >
                    Log in
                </button>
            </div>
        </div>
    );
}
