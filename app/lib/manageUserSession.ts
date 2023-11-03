// Set a cookie
const setCookie = (name: string, value: string, days: number): void => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
};
// Get a cookie
const getCookie = (name: string): string => {
    const cookieName = `${name}=`;
    const decodedCookies = decodeURIComponent(document.cookie).split(';');
    for (let i = 0; i < decodedCookies.length; i++) {
        let cookie = decodedCookies[i].trim();
        if (cookie.indexOf(cookieName) === 0) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }
    return '';
};
// Delete a cookie
const deleteCookie = (name: string): void => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

export { setCookie, getCookie, deleteCookie }