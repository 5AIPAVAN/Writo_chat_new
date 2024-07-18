const express = require('express')
const registerUser = require('../controller/registerUser')
const registerStudent = require('../controller/registerStudent')
const registerMentor = require('../controller/registerMentor')
const checkEmail = require('../controller/checkEmail')
const checkPassword = require('../controller/checkPassword')
const userDetails = require('../controller/userDetails')
const logout = require('../controller/logout')
const updateUserDetails = require('../controller/updateUserDetails')
const searchUser = require('../controller/searchUser')
const getMentorInSearch = require('../controller/getMentorsInSearch')

const router = express.Router()

//create student api
router.post('/student_register',registerStudent)
//create mentor api
router.post('/mentor_register',registerMentor)
// get mentor details of a student4
router.post('/search-user',getMentorInSearch);
//check user email
router.post('/email',checkEmail)
//check user password
router.post('/password',checkPassword)
//login user details
router.get('/user-details',userDetails)
//logout user
router.get('/logout',logout)
//update user details
router.post('/update-user',updateUserDetails)
//search user
router.post("/search-user",searchUser)


module.exports = router