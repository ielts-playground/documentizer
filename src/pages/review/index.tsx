import { retrieveWritingAnswers, retrieveWritingTest } from '@apis';
import { retrieveUnevaluatedExams, ping } from '@apis';
import Part from '@components/Part';
import { AnyComponent, KeyValue } from '@types';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import styles from './styles.module.scss';
import Text from '@components/Text';
import Box from '@components/Box';
import List from '@components/List';
import MarkdownView from 'react-showdown';

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
    const [components, setComponents] = useState<AnyComponent[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(20);

    useEffect(() => {
        const redirect = encodeURIComponent(window.location.pathname);
        ping().catch(() => {
            router.push(`/log-in?redirect=${redirect}`);
        });
    }, []);

    // useEffect(() => {
    //     setCurrentPage(1);
    // }, [itemsPerPage]);

    useEffect(() => {
        retrieveUnevaluatedExams(currentPage, itemsPerPage).then((page) => {
            setPageContent(page);
        });
    }, [currentPage]);

    const calculateRange = () => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = Math.min(start + itemsPerPage, pageContent?.total) || start;
        return { start, end };
    };

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleNextPage = () => {
        const lastPage = Math.ceil(pageContent?.total / itemsPerPage);
        setCurrentPage((prevPage) => Math.min(prevPage + 1, lastPage));
    };

    const reviewWritigExam = (examId: number) => {
        router.push(`/review/writing/${examId}`);
    };

    const renderItems = () => {
        const { start, end } = calculateRange();
        const visibleItems = pageContent?.examIds.slice(start, end) || [];
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
