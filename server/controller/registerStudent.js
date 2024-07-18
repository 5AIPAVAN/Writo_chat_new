const UserModel = require("../models/UserModel");
const bcryptjs = require('bcryptjs');

async function registerStudent(request, response) {
    try {
        const { name, email, password, profile_pic, student_course } = request.body;

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

        return response.status(201).json({
            message: "Student created successfully",
            data: student,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true
        });
    }
}

module.exports = registerStudent;
