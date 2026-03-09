const errorMiddleware = (err, req, res, next) => {
    try {
        let error = {...err};
        error.message = err.message;

        //Mongoose bad objectId
        if(err.name === "CastError") {
            error = new Error("Resource not found");
            error.status = 404;
        }

        //Mongoose duplicate key
        if(err.code === 11000) {
            error = new Error("Duplicated field value entered");
            error.status = 400;
        }

        //Mongoose validation error
        if(err.name === "ValidationError") {
            const message = Object.values(err.errors).map(value => value.message);
            error = new Error(message.join(", "));
            error.status = 400;
        }

        res.status(error.statusCode || 500).json({ success: false, error: error.message || "Internal Server Error"})

    } catch (error) {
        next(error)
    }
}

export default errorMiddleware