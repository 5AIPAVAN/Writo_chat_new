// const UserModel = require("../models/UserModel");
// const bcryptjs = require('bcryptjs');

// async function registerStudent(request, response) {
//     try {
//         const { name, email, password, profile_pic, student_course } = request.body;

//         const checkEmail = await UserModel.findOne({ email });

//         if (checkEmail) {
//             return response.status(400).json({
//                 message: "Student already exists",
//                 error: true,
//             });
//         }

//         // Hash password
//         const salt = await bcryptjs.genSalt(10);
//         const hashpassword = await bcryptjs.hash(password, salt);

//         const payload = {
//             name,
//             email,
//             profile_pic,
//             password: hashpassword,
//             student_course,
//             student: true,
//             mentor: false,
//             mymentors: []
//         };

//         const student = new UserModel(payload);
//         const studentSave = await student.save();

//         // Fetch mentors
//         const subjects = ["MATHS", "PHYSICS", "CHEMISTRY"];
//         let assignedMentors = [];

//         for (let subject of subjects) {
//             // Find mentors sorted by the number of students they have
//             const mentors = await UserModel.aggregate([
//                 { $match: { mentor: true, mentor_subject: subject } },
//                 { $addFields: { numStudents: { $size: "$mystudents" } } },
//                 { $sort: { numStudents: 1 } }
//             ]).exec();

//             // Select mentor with the fewest students
//             const mentorToAssign = mentors[0];

//             if (mentorToAssign) {
//                 // Ensure mentorToAssign is a Mongoose document
//                 const mentor = await UserModel.findById(mentorToAssign._id);

//                 if (!mentor) {
//                     return response.status(404).json({
//                         message: "Mentor not found",
//                         error: true
//                     });
//                 }

//                 // Add student to mentor's mystudents
//                 mentor.mystudents.push({
//                     _id: studentSave._id,
//                     name: studentSave.name,
//                     profile_pic: studentSave.profile_pic
//                 });
//                 await mentor.save();

//                 // Update student's mymentors
//                 assignedMentors.push({
//                     _id: mentor._id,
//                     name: mentor.name,
//                     profile_pic: mentor.profile_pic
//                 });
//             }
//         }

//         // Update student's mymentors
//         student.mymentors = assignedMentors;
//         await student.save();

//         return response.status(201).json({
//             message: "Student created successfully",
//             data: student,
//             success: true
//         });

//     } catch (error) {
//         return response.status(500).json({
//             message: error.message || error,
//             error: true
//         });
//     }
// }

// module.exports = registerStudent;





// registerStudent.js
// registerStudent.js
// const UserModel = require("../models/UserModel");
// const bcryptjs = require('bcryptjs');
// const { io } = require('../socket/index.js');  // Import the io instance

// const BROADCAST_CHANNEL_IDS = {
//     JEE: '669d47f2f4913b792cc11ef0',
//     NEET: '669fae90c5fda49c52117d6b',
//     CLASS_11: '669faf3c6b1f5158c2cf2698',
//     CLASS_12: '993d47f2f4913b792cc11ef3'
// };

// async function registerStudent(request, response) {
//     try {
//         const { name, email, password, profile_pic, student_course } = request.body;
//         console.log('Received registration request:', request.body);

//         const checkEmail = await UserModel.findOne({ email });

//         if (checkEmail) {
//             return response.status(400).json({
//                 message: "Student already exists",
//                 error: true,
//             });
//         }

//         // Hash password
//         const salt = await bcryptjs.genSalt(10);
//         const hashpassword = await bcryptjs.hash(password, salt);
//         console.log('Password hashed successfully');

//         const payload = {
//             name,
//             email,
//             profile_pic,
//             password: hashpassword,
//             student_course,
//             student: true,
//             mentor: false,
//             mymentors: []
//         };

//         const student = new UserModel(payload);
//         const studentSave = await student.save();
//         console.log('Student saved successfully:', studentSave);

//         // Fetch mentors
//         const subjects = ["MATHS", "PHYSICS", "CHEMISTRY"];
//         let assignedMentors = [];

//         for (let subject of subjects) {
//             // Find mentors sorted by the number of students they have
//             const mentors = await UserModel.aggregate([
//                 { $match: { mentor: true, mentor_subject: subject } },
//                 { $addFields: { numStudents: { $size: "$mystudents" } } },
//                 { $sort: { numStudents: 1 } }
//             ]).exec();
//             console.log(`Mentors found for subject ${subject}:`, mentors);

//             // Select mentor with the fewest students
//             const mentorToAssign = mentors[0];

//             if (mentorToAssign) {
//                 // Ensure mentorToAssign is a Mongoose document
//                 const mentor = await UserModel.findById(mentorToAssign._id);

//                 if (!mentor) {
//                     return response.status(404).json({
//                         message: "Mentor not found",
//                         error: true
//                     });
//                 }

//                 // Add student to mentor's mystudents
//                 mentor.mystudents.push({
//                     _id: studentSave._id,
//                     name: studentSave.name,
//                     profile_pic: studentSave.profile_pic
//                 });
//                 await mentor.save();
//                 console.log(`Student added to mentor ${mentor.name}'s list`);

//                 // Update student's mymentors
//                 assignedMentors.push({
//                     _id: mentor._id,
//                     name: mentor.name,
//                     profile_pic: mentor.profile_pic
//                 });
//             }
//         }

//         // Update student's mymentors
//         student.mymentors = assignedMentors;
//         await student.save();
//         console.log('Assigned mentors saved to student:', student);

//         // Emit welcome message to the appropriate broadcast channel
//         const channelId = BROADCAST_CHANNEL_IDS[student_course];
//         console.log('for new student channel id is', channelId);
//         if (channelId) {
//             io.to(channelId).emit('new message', {
//                 text: "Hello everyone",
//                 sender: studentSave._id,
//                 receiver: channelId,
//                 msgByUserId: studentSave._id,
//                 profile_pic: studentSave.profile_pic
//             });
//             console.log('Welcome message emitted to channel:', channelId);
//         }

//         return response.status(201).json({
//             message: "Student created successfully",
//             data: student,
//             success: true
//         });

//     } catch (error) {
//         console.error('Error in registration:', error);
//         return response.status(500).json({
//             message: error.message || error,
//             error: true
//         });
//     }
// }

// module.exports = registerStudent;



const UserModel = require("../models/UserModel");
const bcryptjs = require('bcryptjs');
const { io } = require('../socket/index.js');  // Import the io instance

const BROADCAST_CHANNEL_IDS = {
    JEE: '669d47f2f4913b792cc11ef0',
    NEET: '669fae90c5fda49c52117d6b',
    CLASS_11: '669faf3c6b1f5158c2cf2698',
    CLASS_12: '993d47f2f4913b792cc11ef3'
};

async function registerStudent(request, response) {
    try {
        const { name, email, password, profile_pic, student_course } = request.body;
        console.log('Received registration request:', request.body);

        const checkEmail = await UserModel.findOne({ email });

        if (checkEmail) {
            return response.status(400).json({
                message: "Student already exists",
                error: true,
            });
        }

        // Hash password
        const salt = await bcryptjs.genSalt(10);
        const hashpassword = await bcryptjs.hash(password, salt);
        console.log('Password hashed successfully');

        const payload = {
            name,
            email,
            profile_pic,
            password: hashpassword,
            student_course,
            student: true,
            mentor: false,
            mymentors: []
        };

        const student = new UserModel(payload);
        const studentSave = await student.save();
        console.log('Student saved successfully:', studentSave);

        // Fetch mentors
        const subjects = ["MATHS", "PHYSICS", "CHEMISTRY"];
        let assignedMentors = [];

        for (let subject of subjects) {
            // Find mentors sorted by the number of students they have
            const mentors = await UserModel.aggregate([
                { $match: { mentor: true, mentor_subject: subject } },
                { $addFields: { numStudents: { $size: "$mystudents" } } },
                { $sort: { numStudents: 1 } }
            ]).exec();
            console.log(`Mentors found for subject ${subject}:`, mentors);

            // Select mentor with the fewest students
            const mentorToAssign = mentors[0];

            if (mentorToAssign) {
                // Ensure mentorToAssign is a Mongoose document
                const mentor = await UserModel.findById(mentorToAssign._id);

                if (!mentor) {
                    return response.status(404).json({
                        message: "Mentor not found",
                        error: true
                    });
                }

                // Add student to mentor's mystudents
                mentor.mystudents.push({
                    _id: studentSave._id,
                    name: studentSave.name,
                    profile_pic: studentSave.profile_pic
                });
                await mentor.save();
                console.log(`Student added to mentor ${mentor.name}'s list`);

                // Update student's mymentors
                assignedMentors.push({
                    _id: mentor._id,
                    name: mentor.name,
                    profile_pic: mentor.profile_pic
                });
            }
        }

        // Update student's mymentors
        student.mymentors = assignedMentors;
        await student.save();
        console.log('Assigned mentors saved to student:', student);

        // Emit welcome message to the appropriate broadcast channel
        const channelId = BROADCAST_CHANNEL_IDS[student_course];
        console.log('for new student channel id is', channelId);
        if (channelId) {
            io.to(channelId).emit('new message', {
                text: "Hello everyone",
                sender: studentSave._id,
                receiver: channelId,
                msgByUserId: studentSave._id,
                profile_pic: studentSave.profile_pic
            });
            console.log('Welcome message emitted to channel:', channelId);
        }

        return response.status(201).json({
            message: "Student created successfully",
            data: student,
            success: true,
            channelId: channelId // Include channel ID in the response
        });

    } catch (error) {
        console.error('Error in registration:', error);
        return response.status(500).json({
            message: error.message || error,
            error: true
        });
    }
}

module.exports = registerStudent;

