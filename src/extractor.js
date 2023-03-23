/**
 * Extracts the information from a markdown-format text.
 * @param {string} markdown the markdown-format text.
 * @returns a list of extracted components.
 */
async function extract(markdown = '') {
    // TODO: Implement the extraction flow here.
    return [
        {
            type: 'text',
            content: markdown,
        },
    ];
}

export { extract };
