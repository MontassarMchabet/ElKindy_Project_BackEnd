const express = require('express')
const router = express.Router()
const AuthController = require('../Controllers/AuthController')
const decodeToken = require('../Helpers/DecodeToken')
const VerifyRefreshToken = require('../Helpers/RefreshTokenEndpoint')
const { authMiddleware } = require('../Middleware/Authorization');


//registering
router.post('/register', AuthController.registerClient)
router.post('/registerClient', AuthController.registerClient)
router.post('/registerAdmin', AuthController.registerAdmin)
router.post('/registerProf', AuthController.registerProf)

//login
router.post('/loginEmail', AuthController.loginWithEmail)
router.post('/loginUsername', AuthController.loginWithUsername)

//delete
router.delete('/deleteUser/:id', AuthController.deleteUser)

//check
router.get('/check/email/:email', AuthController.checkEmail)
router.get('/check/username/:username', AuthController.checkUsername)
router.get('/check/cin/:cinNumber', AuthController.checkCINAdminProf)
router.get('/check/phone/:phoneNumber', AuthController.checkPhoneAdminProf)

//get => affichage
router.get('/admins', AuthController.getAllAdmins)
router.get('/clients', AuthController.getAllClients)
router.get('/profs', AuthController.getAllProfs)

//verify the refresh token
router.post('/refreshtoken', VerifyRefreshToken)

//edit functions
router.patch('/editAdminProf/:id', AuthController.editAdminProf)
router.patch('/editClient/:id', AuthController.editClient)

router.get('/user/:id', AuthController.getUserById)


// password reset
router.post('/forgotpasswordtoken', AuthController.forgotPasswordToken)
router.put('/passwordReset', authMiddleware, AuthController.updatePassword)
router.put('/passwordReset/:token', AuthController.resetPassword)


module.exports = router