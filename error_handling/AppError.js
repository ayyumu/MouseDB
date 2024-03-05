class AppError extends Error {
    constructor(message, condition) {
        super();
        this.message = message;
        this.condition = condition;
    }
}

module.exports = AppError;