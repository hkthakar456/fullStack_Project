// Utility function to handle asynchronous request handlers in Express.js

//======= asyncHandler Function using Promise Chaining =======//

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {   
        console.log("⚙️ asyncHandler called");                                         // Return a new function that takes the request, response, and next middleware as arguments
        Promise.resolve(requestHandler(req, res, next)).                    // Execute the request handler and wrap it in a Promise to handle both synchronous and asynchronous functions
        catch((error) => next(error));                                      // If the request handler throws an error, it will be caught and passed to the next middleware (error handler)
    }
}



//======= asyncHandler Function using Try-Catch =======//

// const asyncHandler = (requestHandler) => async (req, res, next) => {
//     try {
//         await requestHandler(req, res, next);
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,                                          // respond immediately with the error message and status code (default to 500 if not provided)
//             message: error.message || "Internal Server Error", 
//         });       
//     }
// }


export {asyncHandler};