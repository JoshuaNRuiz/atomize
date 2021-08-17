class Cookies {
    static get(key) {
        if (document.cookie) {
            const cookies = document.cookie.split('; ');
            const cookie = cookies.find(row => row.startsWith(`${key}=`));
            return cookie ? cookie.split('=')[1] : undefined;
        }
        return undefined;
    }

    static set(key, value) {
        document.cookie = `${key}=${value}`;
    }

    static isSet(key) {
        const value = this.get(key);
        return (value && value !== '');
    }
}

export default Cookies;