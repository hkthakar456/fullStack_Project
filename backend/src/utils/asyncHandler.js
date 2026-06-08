// Utility function to handle asynchronous request handlers in Express.js

//======= asyncHandler Function using Promise Chaining =======//

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        try {
            await requestHandler(req, res, next); // Await the execution of the request handler
        } catch (error) {
            next(error);// Pass any errors to the next middleware (error handling middleware)
        } 
    };
};



//======= asyncHandler Function using Try-Catch =======//

// const asyncHandler = (requestHandler) => {
//     return async (req, res, next) => {
//         try {
//             await requestHandler(req, res, next);
//         } catch (error) {
//             if (typeof next === "function") {
//                 next(error);
//             } else {
//                 console.error("❌ NEXT IS UNDEFINED:", error.message);
//                 res.status(500).json({
//                     success: false,
//                     message: error.message
//                 });
//             }
//         }
//     };
// };


export {asyncHandler};