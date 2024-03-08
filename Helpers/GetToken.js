module.exports = (headers) => {
    if (!headers.authorization) {
        throw new Error("Unauthorized: token required");
    }
    return headers.authorization.split(" ")[1];
};