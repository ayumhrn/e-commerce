exports.successResponse = (message, data) => {
    return ({
        success: true,
        message: message,
        result: data
    })
}

exports.errorResponse = (message, err, code) => {
    return ({
        success: false,
        message: message,
        result: err,
        code: code
    })
}