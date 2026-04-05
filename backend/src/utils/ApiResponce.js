//======== configure ApiResponse class to standardize API responses across the application =======//

class ApiResponse {
    constructor(
        statusCode, 
        message = "Success", 
        data = null, 
        errors = []
    ) // Constructor to initialize the ApiResponse object with status code, message, data, and errors 
    
    {
        this.statusCode = statusCode; // Set the status code of the response
        this.message = message; // Set the message of the response
        this.data = data; // Set the data of the response (if provided)
        this.errors = errors; // Set the errors array (if provided)
        this.success = statusCode < 400; // Assume success if status code is less than 400
    }
}

export { ApiResponse };