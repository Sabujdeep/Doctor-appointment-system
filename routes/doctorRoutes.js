const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const { getDoctorInfoController, updateProfileController, getDoctorByIdController } = require('../controllers/doctorCtrl')

const router = express.Router()

// Post single doctor info
router.post("/getDoctorInfo", authMiddleware, getDoctorInfoController)

// Post update profile
router.post("/updateProfile", authMiddleware, updateProfileController)

// post get single doctor
router.post("/getDoctorById", authMiddleware, getDoctorByIdController)

module.exports = router