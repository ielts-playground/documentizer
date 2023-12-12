import { ping } from '@apis';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import styles from './styles.module.scss';
import { User } from '@apis/types';

type Props = {
    successUrl?: string;
    fallbackUrl?: string;
    onSuccess?: (user?: User) => void;
};

export default function (props: Props) {
    const router = useRouter();
    const [authorizing, setAuthorizing] = useState<boolean>(true);

    useEffect(() => {
        const currentPath = encodeURIComponent(window.location.pathname);
        ping()
            .then((user) => {
                if (props.successUrl) {
                    router.push(props.successUrl);
                }
                setAuthorizing(false);
                if (props.onSuccess) {
                    props.onSuccess(user);
                }
            })
            .catch(() => {
                router.push(
                    `${props.fallbackUrl ?? '/log-in'}?redirect=${currentPath}`
                );
            });
    });

    return <>{authorizing && <div className={styles.container} />}</>;
}
