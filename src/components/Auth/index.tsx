import { ping } from '@apis';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import styles from './styles.module.scss';

type Props = {
    successUrl?: string;
    fallbackUrl?: string;
};

export default function (props: Props) {
    const router = useRouter();
    const [authorizing, setAuthorizing] = useState<boolean>(true);

    useEffect(() => {
        const currentPath = encodeURIComponent(window.location.pathname);
        ping()
            .then(() => {
                if (props.successUrl) {
                    router.push(props.successUrl);
                }
                setAuthorizing(false);
            })
            .catch(() => {
                router.push(
                    `${props.fallbackUrl ?? '/log-in'}?redirect=${currentPath}`
                );
            });
    });

    return <>{authorizing && <div className={styles.container} />}</>;
}
