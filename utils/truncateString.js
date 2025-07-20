export default function truncateString(str, maxLength = 30) {
    if (typeof str !== 'string') return ''
    return str.length > maxLength
        ? str.slice(0, maxLength - 3) + '...'
        : str
}