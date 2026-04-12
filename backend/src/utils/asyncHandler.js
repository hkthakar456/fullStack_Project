// Utility function to handle asynchronous request handlers in Express.js

//======= asyncHandler Function using Promise Chaining =======//

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch((err) => {
                console.error("❌ ERROR:", err.message);

                res.status(err.statusCode || 500).json({
                    success: false,
                    message: err.message || "Internal Server Error"
                });
            });
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