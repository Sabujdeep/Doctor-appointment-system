const userModel = require('../models/userModels')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const doctorModel = require('../models/doctorModels')
const appointmentModel = require('../models/appointmentModels')
const moment = require("moment")

// regiter callback
const registerController = async (req, res) => {
    try {
        // checking if the user exists
        const existingUser = await userModel.findOne({email: req.body.email});
        if (existingUser){
            return res.status(200).send({message: "User already exist", success: false})
        }
        
        // hashing password
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;

        // creating new user
        const newUser = new userModel(req.body)
        await newUser.save();
        res.status(201).send({ message: "Register Successfully", success: true})

    } catch (error) {
        console.log(error)
        res.status(500).send({success: false, message: `Register Controller ${error.message}`})
    }
}

// login callback
const loginController = async (req, res) => {
    try {
        const user = await userModel.findOne({email: req.body.email})
        if(!user){
            return res.status(200).send({message: `user not found`, success: false})
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password)
        if(!isMatch){
            return res.status(200).send({message:'Invalid email or password', success: false})
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'})
        res.status(200).send({message: 'login successful', success: true, token})
    } catch (error) {
        console.log(error)
        res.status(500).send({message: `Error in login CTRL ${error.message}`})
    }
}

// userAuth 
const authController = async (req, res) => {
    try {
        const user = await userModel.findOne({_id: req.body.userId})
        user.password = undefined
        if(!user){
            return res.status(200).send({
                message: 'user not found',
                success: false
            })
        } else {
            res.status(200).send({
                success: true,
                data: user
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message:'auth error',
            success: false,
            error
        })
    }
}

// applyDoctor
const applyDoctorController = async (req, res) => {
    try {
        const newDoc = await doctorModel({...req.body, status: "pending"})
        await newDoc.save()
        const adminUser = await userModel.findOne({isAdmin: true})
        const notification = adminUser.notification
        notification.push({
            type:"apply-doctor-request",
            message: `${newDoc.firstName} ${newDoc.lastName} has Applied for a doctor account`,
            data: {
                doctorId: newDoc._id,
                name: newDoc.firstName + " " + newDoc.lastName,
                onClickPath: '/admin/doctors'
            }
        })
        await userModel.findByIdAndUpdate(adminUser._id, {notification})
        res.status(201).send({
            success:true,
            message: "Doctor Account applied successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error while applying"
        })
    }
}

// notification controller

const getAllNotificationController = async (req, res) => {
    try {
        const user = await userModel.findOne({_id: req.body.userId})
        const seenNotification = user.seenNotification;
        const notification = user.notification
        seenNotification.push(...notification)
        user.notification = [];
        user.seenNotification = notification;
        const updatedUser = await user.save();
        res.status(200).send({
            success: true,
            message:"all notification marked as read",
            data: updatedUser,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "Error in notification",
            success: false,
            error
        })
    }
}

const deleteAllNotificationController = async (req, res) =>{
    try {
        const user = await userModel.findOne({_id: req.body.userId})
        user.notification = [];
        user.seenNotification = [];
        const updatedUser = await user.save()
        updatedUser.password = undefined
        res.status(200).send({
            success: true,
            message: "Notification Deleted Successfully",
            data: updatedUser
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "error deleting",
            success: false,
            error
        })
    }
}

// Get all doctor
const getAllDoctorsController = async (req, res) => {
    try {
        const doctors = await doctorModel.find({ status: "approved" })
        res.status(200).send({
            success: true,
            data: doctors,
            message: "Doctors fetched successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error while fetching Doctor'
        })
    }
}


const bookAppointmentController = async (req, res) =>{
    try {
        req.body.date = moment(req.body.date, 'DD-MM-YYYY').toISOString()
        req.body.time = moment(req.body.time, "HH:mm").toISOString()
        req.body.status = "pending"
        const newAppointment = new appointmentModel(req.body)
        await newAppointment.save()
        const user = await userModel.findOne({_id: req.body.doctorInfo.userId})
        user.notification.push({
            type: "New Appointment request",
            message: `A new request from ${req.body.userInfo.name}`,
            onClickPath: "/user/appointments",
        })
        await user.save()
        res.status(200).send({
            success: true,
            message: "appointment book successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error while booking Appointment'
        })
    }
}

module.exports = {loginController, registerController, authController, applyDoctorController, getAllNotificationController, deleteAllNotificationController, getAllDoctorsController, bookAppointmentController}