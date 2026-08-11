const responseFunction = (res, statusCode, message, data, ok) => {
    res.status(statusCode).json({
        message,
        data,
        ok
    })
}

module.exports = responseFunction;