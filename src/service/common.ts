export function unixtime2dateformat(unixtime: number) {
    const now = new Date(Number(unixtime) * 1000);
    return now.getFullYear()
        + '-' + String(now.getMonth() + 1)
        + '-' + now.getDate()
        + ' ' + now.getHours()
        + ':' + String(now.getMinutes()).padStart(2, '0')
        + ':' + String(now.getSeconds()).padStart(2, '0');
}