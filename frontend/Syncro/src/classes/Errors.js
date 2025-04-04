export class InvalidTokenError extends Error {
    constructor() {
        super("The token is invalid, expired or not present");
    }
}