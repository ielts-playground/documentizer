import { KeyValue } from '@types';
import { Converter } from 'showdown';

const converter = new Converter();
converter.setOption('simpleLineBreaks', false);

export function markdownToHtml(markdown: string) {
    return converter.makeHtml(markdown);
}

export function htmlToMarkdown(html: string) {
    const safeHtml = html
        .replaceAll(/<strong>\s+(.+)<\/strong>/g, ' <strong>$1</strong>')
        .replaceAll(/<strong>(.+)\s+<\/strong>/g, '<strong>$1</strong> ')
        .replaceAll(/<em>\s+(.+)<\/em>/g, ' <em>$1</em>')
        .replaceAll(/<em>(.+)\s+<\/em>/g, '<em>$1</em> ')
        .concat('<br>');
    return converter.makeMarkdown(safeHtml);
}

export function markdownToKeyValue(markdown: string) {
    const lines = markdown.split(/\n+/g);
    const keyPattern = /^\*+([^\*]+)\*+/g;
    const keyValue: KeyValue = {};
    for (const line of lines) {
        const match = keyPattern.exec(line);
        if (match && match[1]) {
            const key = match[1];
            const value = line
                .replace(keyPattern, '')
                .replaceAll(/\*+/g, '')
                .trim();
            keyValue[key] = value;
        }
    }
    return keyValue;
}

export function keyValueToMarkdown(keyValue: KeyValue = {}) {
    let markdown = '';
    Object.keys(keyValue).forEach((key) => {
        markdown += `**${key}** ${keyValue[key]}\n\n`;
    });
    return markdown;
}
