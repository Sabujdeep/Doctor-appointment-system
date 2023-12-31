const express = require('express')
const { 

    loginController, 
    registerController, 
    authController, 
    applyDoctorController, 
    getAllNotificationController, 
    deleteAllNotificationController,
    getAllDoctorsController,
    bookAppointmentController

} = require('../controllers/userCtrl')

const authMiddleware = require('../middleware/authMiddleware')

// express object
const router = express.Router()

// routes
// LOGIN || POST
router.post('/login', loginController)

// REGISTER ||POST
router.post('/register', registerController)

// Auth || POST
router.post('/getuserData', authMiddleware, authController)

// Apply-Doctor || POST
router.post('/apply-doctor', authMiddleware, applyDoctorController)

// Notification-Doctor || POST
router.post('/get-all-notification', authMiddleware, getAllNotificationController)

// Notification-Doctor || POST
router.post('/delete-all-notification', authMiddleware, deleteAllNotificationController)


router.get('/getAllDoctors', authMiddleware, getAllDoctorsController)


router.post('/book-appointment', authMiddleware, bookAppointmentController)


module.exports = router