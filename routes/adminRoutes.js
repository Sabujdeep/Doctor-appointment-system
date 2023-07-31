const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const { getAllUsers, getAllDoctors, changeAccountStatusController } = require('../controllers/adminCtrl')

const router = express.Router()

// GET METHOD || USERS
router.get('/getAllUsers', authMiddleware, getAllUsers)

// GET METHOD || DOCTORS
router.get('/getAllDoctors', authMiddleware, getAllDoctors)

// Post METHOD || Change Account
router.post('/changeAccountStatus', authMiddleware, changeAccountStatusController)

module.exports = router