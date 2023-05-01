import { retrieveUnevaluatedExams, ping } from '@apis';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import styles from './styles.module.scss';
import Auth from '@components/Auth';

type Page = {
    page: number;
    size: number;
    total: number;
    examIds: {
        examId: number;
    }[];
};

export default function () {
    const router = useRouter();
    const [pageContent, setPageContent] = useState<Page>(undefined);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(20);
    const [authorized, setAuthorized] = useState<boolean>(false);

    useEffect(() => {
        if (authorized) {
            retrieveUnevaluatedExams(currentPage - 1, itemsPerPage)
                .then((page) => {
                    setPageContent(page);
                })
                .catch(() => {});
        }
    }, [currentPage, authorized]);

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleNextPage = () => {
        const lastPage = Math.ceil(pageContent?.total / itemsPerPage);
        const newCurrentPage = Math.min(currentPage + 1, lastPage);
        retrieveUnevaluatedExams(newCurrentPage - 1, itemsPerPage)
            .then((page) => {
                setPageContent(page);
                setCurrentPage(newCurrentPage);
            })
            .catch(() => {});
    };

    const reviewWritigExam = (examId: number) => {
        router.push(`/review/writing/${examId}`);
    };

    const renderItems = () => {
        const visibleItems = pageContent?.examIds || [];
        return visibleItems.map((item) => (
            <h3
                className={styles.option}
                onClick={() => reviewWritigExam(item.examId)}
                key={item.examId}
            >
                {item.examId}
            </h3>
        ));
    };

    const renderPagination = () => {
        const lastPage = Math.ceil(pageContent?.total / itemsPerPage);
        return (
            <div>
                <button disabled={currentPage === 1} onClick={handlePrevPage}>
                    Previous
                </button>
                <span>
                    Page {currentPage} of {lastPage}
                </span>
                <button
                    disabled={currentPage === lastPage}
                    onClick={handleNextPage}
                >
                    Next
                </button>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <Auth onSuccess={() => setAuthorized(true)} />
            <span className={styles.header}>
                <h2>LIST OF EXAMS</h2>
                <h2
                    className={styles.home}
                    onClick={() => {
                        router.push('/redirect');
                    }}
                >
                    HOME
                </h2>
            </span>

            <span className={styles.list}>
                <span>{renderItems()}</span>
            </span>

            <span className={styles.footer}>{renderPagination()}</span>
        </div>
    );
}
