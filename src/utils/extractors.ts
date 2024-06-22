import { AnyComponent } from '@types';

const patterns = {
    box: /\*\*\[\[(\d+)?\]\]\*\*/g,
    title: /\*\*(.+)?\*\*\s*\[\[title\]\]\n*/g,
    image: /\*\*\[\[image\]\]\*\*\n*/g,
    selectAnswer:
        /\*\*(\d+|\d+[\s\D]+\d+)\*\*\s*(.+)?(\n+\*+[A-Z]\*+\s*.+)+\n*/g,
    questionNumber: /(\d+)/g,
    questionRange: /(\d+)[\s\D]+(\d+)/g,
    answerToSelect: /\*+([A-Z])\*+\s*(.+)?\n*/g,
    writeAnswer: /\*\*(\d+)\*\*\s*(.+)?\n*/g,
    range: /\*{2,3}questions\s*(\d+)[\s\D]+(\d+)((\s*and\s*\d+[\s\D]+\d+)*)[^A-Za-z]*\*{2,3}\n+/gi,
    sideRange: /\s*(\d+)[\s\D]+(\d+)(\s*.*)/gi,
    options:
        /\*+(true|yes)\*+\s+\**(.+?)\**\n+\*+(false|no)\*+\s+\**(.+?)\**\n+\*+(not given)\*+\s+\**(.+?)\**\n+/gi,
};

const types = {
    text: 'text',
    box: 'box',
    title: 'title',
    image: 'image',
    selectAnswer: 'question-options',
    writeAnswer: 'question-box',
    range: 'question-range',
    list: 'list',
    multipleAnswer: 'multiple-answer',
};

const defaultComponent = {
    sort: 0,
    type: '',
    key: '',
    value: '',
    options: {},
} as {
    sort: number;
    type: string;
    key: string;
    value: any;
    options: {
        [key: string]: string;
    };
    size: any;
};

async function processSimpleFields(
    pieces = [defaultComponent],
    pattern = /.*/g,
    type = ''
) {
    const processes = [];
    pieces.forEach((component) => {
        const piece = component.value || '';
        if (!!component.type) {
            processes.push(
                (async () => {
                    return [
                        {
                            ...component,
                        },
                    ];
                })()
            );
        } else {
            processes.push(
                (async () => {
                    const matches = [];
                    for (const match of piece.matchAll(pattern)) {
                        matches.push({
                            text: match[0],
                            value: match[1],
                        });
                    }
                    const processed = [];
                    let text = piece;
                    let position = component.sort;
                    for (const match of matches) {
                        const index = text.indexOf(match.text);
                        processed.push({
                            value: text.substring(0, index),
                            sort: position,
                        });
                        processed.push({
                            type,
                            value: match.value,
                            sort: position + index,
                        });
                        const offset = index + match.text.length;
                        text = text.substring(offset);
                        position += offset;
                    }
                    processed.push({
                        value: text,
                        sort: position,
                    });
                    return processed;
                })()
            );
        }
    });
    return (await Promise.all(processes)).flat();
}

async function processTitles(pieces = [defaultComponent]) {
    return processSimpleFields(pieces, patterns.title, types.title);
}

async function processImages(pieces = [defaultComponent]) {
    return processSimpleFields(pieces, patterns.image, types.image);
}

async function processBoxes(pieces = [defaultComponent]) {
    return processSimpleFields(pieces, patterns.box, types.box);
}

async function processSeletableAnswers(question = '') {
    const answers = {};
    for (const match of question.matchAll(patterns.answerToSelect)) {
        const key = match[1];
        const value = match[2];
        answers[key] = value;
    }
    return answers;
}

async function processAnswerSelectingQuestions(pieces = [defaultComponent]) {
    const processes = [];
    pieces.forEach((component) => {
        const piece = component.value || '';
        if (!!component.type) {
            processes.push(
                (async () => {
                    return [
                        {
                            ...component,
                        },
                    ];
                })()
            );
        } else {
            processes.push(
                (async () => {
                    const matches = [];
                    for (const match of piece.matchAll(patterns.selectAnswer)) {
                        if (match[1]) {
                            let from: number;
                            let to: number;
                            for (const numberMatch of (
                                match[1] as string
                            ).matchAll(patterns.questionNumber)) {
                                if (numberMatch[1]) {
                                    from = Number(numberMatch[1]);
                                }
                            }
                            for (const rangeMatch of (
                                match[1] as string
                            ).matchAll(patterns.questionRange)) {
                                if (rangeMatch[1]) {
                                    from = Number(rangeMatch[1]);
                                }
                                if (rangeMatch[2]) {
                                    to = Number(rangeMatch[2]);
                                }
                            }
                            matches.push({
                                text: match[0],
                                size: !!to ? to - from + 1 : undefined,
                                key: !to ? from : `${from}-${to}`,
                                value: match[2],
                            });
                        }
                    }
                    const processed = [];
                    let text = piece;
                    let position = component.sort;
                    for (const match of matches) {
                        const index = text.indexOf(match.text);
                        processed.push({
                            value: text.substring(0, index),
                            sort: position,
                        });
                        processed.push({
                            type: types.selectAnswer,
                            size: match.size,
                            key: match.key,
                            value: match.value,
                            options: await processSeletableAnswers(match.text),
                            sort: position + index,
                        });
                        const offset = index + match.text.length;
                        text = text.substring(offset);
                        position += offset;
                    }
                    processed.push({
                        value: text,
                        sort: position,
                    });
                    return processed;
                })()
            );
        }
    });
    return (await Promise.all(processes)).flat();
}

async function processAnswerWritingQuestions(pieces = [defaultComponent]) {
    const processes = [];
    pieces.forEach((component) => {
        const piece = component.value || '';
        if (!!component.type) {
            processes.push(
                (async () => {
                    return [
                        {
                            ...component,
                        },
                    ];
                })()
            );
        } else {
            processes.push(
                (async () => {
                    const matches = [];
                    for (const match of piece.matchAll(patterns.writeAnswer)) {
                        matches.push({
                            text: match[0],
                            key: match[1],
                            value: match[2],
                        });
                    }
                    const processed = [];
                    let text = piece;
                    let position = component.sort;
                    for (const match of matches) {
                        const index = text.indexOf(match.text);
                        processed.push({
                            value: text.substring(0, index),
                            sort: position,
                        });
                        processed.push({
                            type: types.writeAnswer,
                            key: match.key,
                            value: match.value,
                            sort: position + index,
                        });
                        const offset = index + match.text.length;
                        text = text.substring(offset);
                        position += offset;
                    }
                    processed.push({
                        value: text,
                        sort: position,
                    });
                    return processed;
                })()
            );
        }
    });
    return (await Promise.all(processes)).flat();
}

async function processQuestionRanges(pieces = [defaultComponent]) {
    const processes = [];
    pieces.forEach((component) => {
        const piece = component.value || '';
        if (!!component.type) {
            processes.push(
                (async () => {
                    return [
                        {
                            ...component,
                        },
                    ];
                })()
            );
        } else {
            processes.push(
                (async () => {
                    const matches = [];
                    for (const match of piece.matchAll(patterns.range)) {
                        const value = {
                            from: Number(match[1]),
                            to: Number(match[2]),
                            and: undefined,
                        };
                        if (!!match[3]) {
                            const side = [];
                            let sideText = match[3] as string;
                            while (!!sideText) {
                                for (const sideMatch of sideText.matchAll(
                                    patterns.sideRange
                                )) {
                                    if (sideMatch) {
                                        side.push({
                                            from: sideMatch[1],
                                            to: sideMatch[2],
                                        });
                                    }
                                    sideText = sideMatch
                                        ? sideMatch[3]
                                        : undefined;
                                }
                            }
                            let and = undefined;
                            for (let i = side.length - 1; i >= 0; i--) {
                                if (!and) {
                                    and = side[i];
                                } else {
                                    and = {
                                        ...side[i],
                                        and,
                                    };
                                }
                            }
                            value.and = and;
                        }
                        matches.push({
                            text: match[0],
                            value,
                        });
                    }
                    const processed = [];
                    let text = piece;
                    let position = component.sort;
                    for (const match of matches) {
                        const index = text.indexOf(match.text);
                        processed.push({
                            value: text.substring(0, index),
                            sort: position,
                        });
                        processed.push({
                            type: types.range,
                            value: match.value,
                            sort: position + index,
                        });
                        const offset = index + match.text.length;
                        text = text.substring(offset);
                        position += offset;
                    }
                    processed.push({
                        value: text,
                        sort: position,
                    });
                    return processed;
                })()
            );
        }
    });
    return (await Promise.all(processes)).flat();
}

async function processOptions(pieces = [defaultComponent]) {
    let currentRange: {
        from: number;
        to: number;
    };
    let options: {
        [key: string]: string;
    };
    const processed = [];
    for (const piece of pieces) {
        if (piece.type === types.range) {
            currentRange = {
                from: Number(piece.value?.from),
                to: Number(piece.value?.to),
            };
            options = null;
        } else if (!piece.type && currentRange) {
            for (const match of (piece.value as string)?.matchAll(
                patterns.options
            )) {
                if (match[0]) {
                    // options = {
                    //     [match[1]]: match[2],
                    //     [match[3]]: match[4],
                    //     [match[5]]: match[6],
                    // };
                    options = {
                        A: match[1],
                        B: match[3],
                        C: match[5],
                    };
                }
            }
        } else if (
            piece.type === types.writeAnswer &&
            currentRange &&
            options
        ) {
            if (
                Number(piece.key) >= currentRange.from &&
                Number(piece.key) <= currentRange.to
            ) {
                piece.options = {
                    ...options,
                };
                piece.type = types.selectAnswer;
            }
        }
        processed.push(piece);
    }
    return Promise.resolve(processed);
}

async function clean(components = [defaultComponent]) {
    return components
        .filter(
            (c) =>
                (!!c.type && !(c.type === types.text && !c.value)) ||
                (!c.type && !!c.value)
        )
        .map((c) => {
            if (c.type === types.image) {
                return {
                    ...c,
                    key: String(c.sort),
                };
            }
            return c;
        });
}

async function sort(components = [defaultComponent], removeSort = true) {
    return components
        .sort((a, b) => (a.sort < b.sort ? -1 : 1))
        .map((c) => {
            if (removeSort) {
                delete c.sort;
            }
            return c;
        });
}

function convertToComponents(components = [defaultComponent]) {
    return components.flatMap((c) => {
        if (c.type === types.text || !c.type) {
            return {
                type: 'text',
                value: c.value,
            };
        }
        if (c.type === types.title) {
            return {
                type: 'title',
                value: c.value,
            };
        }
        if (c.type === types.box) {
            return {
                type: 'box',
                kei: c.value,
            };
        }
        if (c.type === types.selectAnswer) {
            return {
                type: 'question',
                size: c.size,
                kei: c.key,
                value: c.value,
                options: c.options,
            };
        }
        if (c.type === types.writeAnswer) {
            return {
                type: 'question',
                kei: c.key,
                value: c.value,
            };
        }
        if (c.type === types.range) {
            return {
                type: 'range',
                value: c.value,
            };
        }
        if (c.type === types.image) {
            return {
                type: 'image',
                kei: c.key,
            };
        }
    }) as AnyComponent[];
}

export async function extract(markdown = '') {
    const initial = {
        value: markdown
            .replaceAll(/(\n\n)+/g, '\n\n')
            .replaceAll(/(\n)*(<br>)*(\n)*$/g, '')
            .trim(),
        sort: 0,
    };
    return Promise.resolve([initial])
        .then(processTitles)
        .then(processImages)
        .then(processAnswerSelectingQuestions)
        .then(processBoxes)
        .then(processAnswerWritingQuestions)
        .then(processQuestionRanges)
        .then(processOptions)
        .then(clean)
        .then(sort)
        .then(convertToComponents);
}
