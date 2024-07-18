// const UserModel = require("../models/UserModel");

// async function getMentorInSearch(request, response) {
//     try {
//         const { studentId } = request.body;

//         // Find the student by ID and populate the mymentors field with additional subject information
//         const student = await UserModel.findById(studentId).populate({
//             path: 'mymentors',
//             select: 'name profile_pic _id mentor_subject'
//         });

//         if (!student || !student.student) {
//             return response.status(404).json({
//                 message: "Student not found",
//                 error: true,
//             });
//         }

//         return response.status(200).json({
//             message: "Mentor details retrieved successfully",
//             mentors: student.mymentors,
//             success: true
//         });

//     } catch (error) {
//         return response.status(500).json({
//             message: error.message || error,
//             error: true
//         });
//     }
// }

// module.exports = getMentorInSearch;



const UserModel = require("../models/UserModel");

async function getMentorInSearch(request, response) {
    try {
        const { userId, userType, search } = request.body;

        console.log(`Request received with userId: ${userId}, userType: ${userType}, search: ${search}`);

        const query = new RegExp(search, "i");

        if (userType === "student") {
            const student = await UserModel.findById(userId).populate({
                path: 'mymentors',
                match: { 
                    $or: [{ name: query }, { email: query }] 
                },
                select: 'name profile_pic _id mentor_subject'
            });

            if (!student) {
                console.log("Student not found");
                return response.status(404).json({
                    message: "Student not found",
                    error: true,
                });
            }

            if (!student.student) {
                console.log("User is not a student");
                return response.status(404).json({
                    message: "User is not a student",
                    error: true,
                });
            }

            console.log("Mentors retrieved for student:", student.mymentors);

            return response.status(200).json({
                message: "Mentor details retrieved successfully",
                users: student.mymentors,
                success: true
            });
        } else if (userType === "mentor") {
            const mentor = await UserModel.findById(userId).populate({
                path: 'mystudents',
                match: { 
                    $or: [{ name: query }, { email: query }] 
                },
                select: 'name profile_pic _id student_course'
            });

            if (!mentor) {
                console.log("Mentor not found");
                return response.status(404).json({
                    message: "Mentor not found",
                    error: true,
                });
            }

            if (!mentor.mentor) {
                console.log("User is not a mentor");
                return response.status(404).json({
                    message: "User is not a mentor",
                    error: true,
                });
            }

            console.log("Students retrieved for mentor:", mentor.mystudents);

            return response.status(200).json({
                message: "Student details retrieved successfully",
                users: mentor.mystudents,
                success: true
            });
        } else {
            console.log("Invalid user type");
            return response.status(400).json({
                message: "Invalid user type",
                error: true,
            });
        }
    } catch (error) {
        console.error("Error occurred:", error);
        return response.status(500).json({
            message: error.message || error,
            error: true
        });
    }
}

module.exports = getMentorInSearch;