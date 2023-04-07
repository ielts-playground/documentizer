export default function <T>(name: string, defaultValue: T) {
    try {
        return require(`./${name}.json`) as T;
    } catch {
        console.log(`cannot mock with ${name}`);
        return defaultValue;
    }
}
