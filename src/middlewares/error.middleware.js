const errorMiddleware = (err, req, res, _next) => {
    let error = { ...err };
    error.message = err.message;

    // Mongoose bad objectId
    if (err.name === "CastError") {
        error = new Error("Resource not found");
        error.status = 404;
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        error = new Error("Duplicated field value entered");
        error.status = 400;
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map(value => value.message);
        error = new Error(message.join(", "));
        error.status = 400;
    }

    const statusCode = error.status || error.statusCode || 500;
    const errorMessage = error.message || "Internal Server Error";

    console.error(error, err)

    res.status(statusCode).json({
        success: false,
        error: errorMessage
    });
};

export default errorMiddleware;