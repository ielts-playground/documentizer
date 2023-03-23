import { $ } from 'execa';

/**
 * Converts a `docx` file to its markdown format.
 * @param {string} path the file path.
 * @returns the content of its markdown format; `null` if fails.
 */
async function convert(path = '') {
    const { stdout, stderr } = await $`pandoc -f docx -t markdown ${path}`;
    if (stderr) return null;
    return stdout;
}

export { convert };
