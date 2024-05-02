const express = require('express')
const router = express.Router()
const AuthController = require('../Controllers/AuthController')
const decodeToken = require('../Helpers/DecodeToken')
const VerifyRefreshToken = require('../Helpers/RefreshTokenEndpoint')
const { authMiddleware, adminMiddleware } = require('../Middleware/Authorization');

// Register
router.post('/register', AuthController.registerClient)
router.post('/registerClient', AuthController.registerClient)
router.post('/registerAdmin', AuthController.registerAdmin)
router.post('/registerProf', AuthController.registerProf)

// Login
router.post('/loginEmail', AuthController.loginWithEmail)
router.post('/loginUsername', AuthController.loginWithUsername)

// Check
router.get('/check/email/:email', AuthController.checkEmail)
router.get('/check/username/:username', AuthController.checkUsername)
router.get('/check/cin/:cinNumber', AuthController.checkCINAdminProf)
router.get('/check/phone/:phoneNumber', AuthController.checkPhoneAdminProf)

// Get All
router.get('/admins', AuthController.getAllAdmins)
router.get('/clients', AuthController.getAllClients)
router.get('/profs', AuthController.getAllProfs)

// Edit
router.patch('/editAdminProf/:id', AuthController.editAdminProf)
router.patch('/editClient/:id', AuthController.editClient)

// Password
router.post('/forgotpasswordtoken', AuthController.forgotPasswordToken)
router.put('/passwordReset', AuthController.updatePassword)
router.put('/passwordReset/:token', AuthController.resetPassword)

// Verification
router.post('/verificationCode', AuthController.sendVerificationCode)
router.post('/hashverificationcode', AuthController.hashVerificationCode)
router.post('/verifycode', AuthController.compareVerificationCode)

// Subscription
router.put('/updateSubscription/:id', AuthController.updateSubscription)
router.put('/cancelSubscription/:id', AuthController.cancelSubscription)
router.post('/addSubscriptionHistory/:id', AuthController.addSubscriptionHistory)
router.post('/cancelSubscriptionHistory/:id', AuthController.cancelSubscriptionHistory)
router.get('/getAllHistorySubscriptions', AuthController.findAllHistorySubscriptions)
router.get('/getHistorySubscriptionByClient/:id', AuthController.findAllHistorySubscriptionByClient)
router.get('/subscription/totalincome', AuthController.calculateTotalIncome)
router.get('/subscription/totalincomeThisMonth', AuthController.calculateTotalIncomeThisMonth)
router.get('/subscription/SubscriptionThisMonth', AuthController.calculateTotalSubscriptionsThisMonth)
router.get('/subscription/TotalClients', AuthController.calculateTotalClients)
router.get('/subscription/topclients', AuthController.calculateTopClients)
router.get('/subscription/status', AuthController.calculateSubscriptionStatus)
router.get('/subscription/type', AuthController.calculateSubscriptionByType)


// Others
router.post('/refreshtoken', VerifyRefreshToken)
router.delete('/deleteUser/:id', authMiddleware, adminMiddleware, AuthController.deleteUser)
router.get('/user/:id', AuthController.getUserById)

module.exports = router