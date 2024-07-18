// const UserModel = require('../models/UserModel')

// async function searchUser(request,response){
//     try {
//         const { search } = request.body

//         const query = new RegExp(search,"i","g")

//         const user = await UserModel.find({
//             "$or" : [
//                 { name : query },
//                 { email : query }
//             ]
//         }).select("-password")

//         return response.json({
//             message : 'your mentors',
//             data : user,
//             success : true
//         })
//     } catch (error) {
//         return response.status(500).json({
//             message : error.message || error,
//             error : true
//         })
//     }
// }

// module.exports = searchUser



const UserModel = require('../models/UserModel');

async function searchUser(request, response) {
    try {
        const { search, studentId } = request.body;

        const query = new RegExp(search, "i");

        // Find the student by ID and populate the mymentors field
        const student = await UserModel.findById(studentId).populate('mymentors', 'name email profile_pic');

        if (!student || !student.student) {
            return response.status(404).json({
                message: "Student not found",
                error: true,
            });
        }

        // Filter mentors based on search query
        const mentors = student.mymentors.filter(mentor =>
            query.test(mentor.name) || query.test(mentor.email)
        );

        return response.json({
            message: 'Your mentors',
            data: mentors,
            success: true
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true
        });
    }
}

module.exports = searchUser;
