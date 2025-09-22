export class AppError extends Error {
    constructor(
        message: string,
        public status = 500,
        public code: string = "APP_ERROR"
    ) {
        super(message);
    }
}