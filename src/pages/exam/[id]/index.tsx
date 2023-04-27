import { retrieveExamFinalResult } from '@apis';
import { useRouter } from 'next/router';
import React, { CSSProperties, useEffect, useState } from 'react';

export default function () {
    const router = useRouter();
    const [examId, setExamId] = useState<number>();
    const [result, setResult] = useState<{
        reading: number;
        listening: number;
        writing: number;
        examiner: string;
        examinee: {
            username: string;
            firstName: string;
            lastName: string;
            email: string;
            phoneNumber: string;
        };
    }>();

    useEffect(() => {
        const { id } = router.query || {};
        const examId = Number(id as string);
        if (!!examId) {
            setExamId(examId);
            retrieveExamFinalResult(examId)
                .then(setResult)
                .catch((err) => {
                    alert(err.message);
                    router.back();
                });
        }
    }, [router]);

    const save = () => {
        alert('Not implemented yet!');
    };

    const tableStyle = {
        border: 'solid 1px black',
    } as CSSProperties;

    return (
        <>
            <h1>Exam #{examId}</h1>
            {result && (
                <>
                    <h2>Examinee</h2>
                    <table style={tableStyle}>
                        <tr>
                            <th>Username</th>
                            <td>{result.examinee.username}</td>
                        </tr>
                        <tr>
                            <th>Full Name</th>
                            <td>{`${result.examinee?.firstName} ${result.examinee?.lastName}`}</td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td>{result.examinee?.email}</td>
                        </tr>
                        <tr>
                            <th>Phone Number</th>
                            <td>{result.examinee?.phoneNumber}</td>
                        </tr>
                    </table>
                    <h2>Result</h2>
                    <table style={tableStyle}>
                        <tr>
                            <th>Reading</th>
                            <td>{result.reading}</td>
                        </tr>
                        <tr>
                            <th>Listening</th>
                            <td>{result.listening}</td>
                        </tr>
                        <tr>
                            <th>Writing</th>
                            <td>{result.writing}</td>
                        </tr>
                        <tr>
                            <th>Examiner</th>
                            <td>{result.examiner}</td>
                        </tr>
                    </table>
                    <hr />
                    <button onClick={save}>Save</button>
                </>
            )}
        </>
    );
}
