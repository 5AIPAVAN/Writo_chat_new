const UserModel = require("../models/UserModel")
const bcryptjs = require('bcryptjs')

async function registerMentor(request,response){
    try {
        const { name, email , password, profile_pic, mentor_subject  } = request.body

        const checkEmail = await UserModel.findOne({ email }) //{ name,email}  // null

        if(checkEmail){
            return response.status(400).json({
                message : "Already Mentor exits",
                error : true,
            })
        }

        //password into hashpassword
        const salt = await bcryptjs.genSalt(10)
        const hashpassword = await bcryptjs.hash(password,salt)

        const payload = {
            name,
            email,
            profile_pic,
            password : hashpassword,
            mentor_subject  : mentor_subject ,
            mentor : true,
            mystudents : []
        }

        const user = new UserModel(payload)
        const userSave = await user.save()

        return response.status(201).json({
            message : "Mentor created successfully",
            data : userSave,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

module.exports = registerMentor