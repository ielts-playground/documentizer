import { KeyValue } from '@types';
import { Converter } from 'showdown';

const converter = new Converter();
converter.setOption('simpleLineBreaks', false);

export function safeHtml(html: string) {
    return html
        .replaceAll(/\s+style=\".+?\"/g, '')
        .replaceAll(/<span>\s*<\/span>/g, '')
        .replaceAll(/<p>\s*<\/p>/g, '')
        .replaceAll(/<img\s*.+?>/g, '<strong>[[image]]</strong>') // mark as an image
        .replaceAll(/<strong>(\s|&nbsp;)+<\/strong>/g, ' ')
        .replaceAll(/<em>(\s|&nbsp;)+<\/em>/g, ' ')
        .replaceAll(
            /<strong>(\s|&nbsp;)+(.+?)<\/strong>/g,
            ' <strong>$2</strong>'
        )
        .replaceAll(
            /<strong>(.+?)(\s|&nbsp;)+<\/strong>/g,
            '<strong>$1</strong> '
        )
        .replaceAll(/<em>(\s|&nbsp;)+(.+?)<\/em>/g, ' <em>$2</em>')
        .replaceAll(/<em>(.+?)(\s|&nbsp;)+<\/em>/g, '<em>$1</em> ')
        .replaceAll(
            /<strong>(\s|&nbsp;)+<em>(.+?)<\/em><\/strong>/g,
            ' <strong><em>$2</em></strong>'
        )
        .replaceAll(
            /<strong><em>(.+?)<\/em>(\s|&nbsp;)+<\/strong>/g,
            '<strong><em>$1</em></strong> '
        )
        .replaceAll(
            /<em>(\s|&nbsp;)+<strong><em>(.+?)<\/em><\/strong><\/em>/g,
            ' <em><strong><em>$2</em></strong></em>'
        )
        .replaceAll(
            /<em><strong><em>(.+?)<\/em><\/strong>(\s|&nbsp;)+<\/em>/g,
            '<em><strong><em>$1</em></strong></em> '
        )
        .replaceAll(/(&nbsp;)+/g, ' ')
        .replaceAll(/[^\S\n]/g, ' ')
        .replaceAll(
            /<p class=\"ql-align-center\">\s*(<strong><em>.+?<\/em><\/strong>)?\s*<\/p>/g,
            '<p>$1 [[title]]</p>'
        ) // mark as a title
        .replaceAll(
            /<p class=\"ql-align-center\">\s*(<strong>.+?<\/strong>)?\s*<\/p>/g,
            '<p>$1 [[title]]</p>'
        ) // mark as a title
        .replaceAll(/<p>\s*\[\[title\]\]/g, '<br>')
        .replaceAll(
            /<p><strong><em>(questions\s+\d+\D+\d+)<\/em><\/strong>\s\[\[title\]\]<\/p>/gi,
            '<p><strong><em>$1</em></strong></p>'
        )
        .replaceAll(
            /<p><strong>(questions\s+\d+\D+\d+)<\/strong>\s\[\[title\]\]<\/p>/gi,
            '<p><strong>$1</strong></p>'
        )
        .concat('<br>')
        .replaceAll(/(<br>)+/g, '<br>');
}

export function safeMarkdown(markdown: string) {
    return markdown
        .replaceAll(/\\\./g, '.')
        .replaceAll(/·/g, '.')
        .replaceAll(/…+/g, '...')
        .replaceAll(/\*{2}(\d+)\*{0,2}\s*\.\.+\*{0,2}/g, '**[[$1]]**') // mark as a box
        .replaceAll(/(\*+[A-Z]+?\*+)\s+/g, '$1 ')
        .replaceAll(/(\*+\d+?\*+)\s+/g, '$1 ')
        .replaceAll(/\.\.+/g, '.')
        .replaceAll(/(<br>)/g, '\n')
        .replaceAll(/(\\n\\n)+/g, '\n\n');
}

export function markdownToHtml(markdown: string) {
    return converter.makeHtml(safeMarkdown(markdown));
}

export function htmlToMarkdown(html: string) {
    return converter.makeMarkdown(safeHtml(html));
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
