module.exports = class NetworkError extends Error {
    constructor(errorObject) {
        super(errorObject.message);
        this.name = "NetworkError";
        this.status = errorObject.response.status;
    }

    toString() {
        return JSON.stringify({
            message: this.message,
            name: this.name,
            status: this.status
        })
    }
}