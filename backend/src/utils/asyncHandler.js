// Utility function to handle asynchronous request handlers in Express.js

//======= asyncHandler Function using Promise Chaining =======//

const asyncHandler = (requestHandler) => async (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).
    catch((error) => next(error));                                      // Pass the error to the next middleware (error handling middleware)
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