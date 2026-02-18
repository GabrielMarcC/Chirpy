export const verifyCode = (code) => {
    let message;
    let isValid = true;
    if (!Number.isInteger(code)) {
        isValid = false;
        throw new TypeError(`Invalid status code: ${JSON.stringify(code)}. Status code must be an integer.`);
    }
    if (code < 100 || code > 999) {
        isValid = false;
        throw new RangeError(`Invalid status code: ${JSON.stringify(code)}. Status code must be greater than 99 and less than 1000.`);
    }
    if (code < 200 || code >= 300) {
        message = '[NON-OK]';
        isValid = false;
    }
    return { message, code, isValid };
};
