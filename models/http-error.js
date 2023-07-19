class HttpError extends Error {
    constructor(message, errorCode, success) {
        super(message); //Adds a "message" property
        this.code = errorCode; // Adds a "code" property 
        this.success = success; 
    }
}

module.exports = HttpError;