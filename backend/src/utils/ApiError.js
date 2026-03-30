//======= configure the custom error class for handling API errors =======//

class ApiError extends Error {
    constructor(
        statusCode, 
        message= "Something went wrong", 
        errors = [],
        stack = "",
    ) {
        super(message); // Call the parent class (Error) constructor with the message
        this.statusCode = statusCode; // Set the status code
        this.date = null; // Set the date of the error occurrence
        this.message = message; // Set the error message
        this.success = false; // Set the success flag to false
        this.errors = errors; // Set the errors array (if provided)

        if (stack) {
            this.stack = stack; // Set the stack trace if provided
        } else {
            Error.captureStackTrace(this, this.constructor); // Capture the stack trace for debugging purposes
        }
    }
}

export {ApiError};