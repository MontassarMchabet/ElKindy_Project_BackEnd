const express = require('express')
const router = express.Router()
const AuthController = require('../Controllers/AuthController')
const authorizationByRole = require('../Middleware/Authorization')
const authenticateToken = require('../Middleware/Authorization')
const decodeToken = require('../Middleware/DecodeToken')

// registering
router.post('/register', AuthController.registerClient)
router.post('/registerClient', AuthController.registerClient)
router.post('/registerAdmin', authenticateToken, authorizationByRole, AuthController.registerAdmin)
router.post('/registerProf', authenticateToken, authorizationByRole, AuthController.registerProf)

//login
router.post('/loginEmail', AuthController.loginWithEmail)
router.post('/loginUsername', AuthController.loginWithUsername)

//delete
router.delete('/deleteUser/:id', authenticateToken, authorizationByRole, AuthController.deleteUser)

// check
router.get('/check/email/:email', AuthController.checkEmail)
router.get('/check/username/:username', AuthController.checkUsername)
router.get('/check/cin/:cinNumber', AuthController.checkCINAdminProf)
router.get('/check/phone/:phoneNumber', AuthController.checkPhoneAdminProf)

// get => affichage
router.get('/admins', authenticateToken, AuthController.getAllAdmins)
router.get('/clients', authenticateToken, AuthController.getAllClients)
router.get('/profs', authenticateToken, AuthController.getAllProfs)

//decode token to retrieve the user id
router.post('/decodetoken', decodeToken)

module.exports = router