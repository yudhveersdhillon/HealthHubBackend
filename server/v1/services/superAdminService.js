// const User = require("../../models/user");
require("dotenv").config();
const jwtUtil = require("../../utils/JwtUtils");
const CONFIG = require("../../config/appConfig");
const Util = require("../../utils/commonUtils");
const moment = require("moment");
const Admin = require("../../models/admin");
const Prescription = require("../../models/prescription");
const SuperAdmin = require("../../models/superAdmin");
const Doctor = require("../../models/doctor");
const Staff = require("../../models/staff");
const User = require("../../models/staff");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const ObjectId = require("mongoose").Types.ObjectId;

class superAdminService {

    adminRegister(req, res) {
        return new Promise(async (resolve, reject) => {
            try {
                var adminData = req.body;
                if (req.file) {
                    // File upload successful
                    adminData.profileImage = `static/profileImage/${req.file.filename}`;
                } else {
                    console.log("No file uploaded");
                }
                if (adminData.email && !Util.isValidEmail(adminData.email)) {
                    return reject({
                        code: CONFIG.ERROR_CODE,
                        message: CONFIG.ERR_INVALID_EMAIL,
                    });
                } else if (adminData.password && !Util.isValidPassword(adminData.password)) {
                    return reject({
                        code: CONFIG.ERROR_CODE,
                        message: CONFIG.ERR_INVALID_PASSWORD,
                    });
                }
                try {
                    const exists = await Admin.findOne({ email: adminData.email.toLowerCase(), status: { $ne: 2 } });
                    if (exists) {
                        return reject({
                            code: CONFIG.ERROR_CODE,
                            message: CONFIG.ERR_EMAIL_ALREADY_TAKEN,
                        });
                    }

                    let adminInstance = new Admin(adminData);
                    adminInstance.password = await adminInstance.setPassword(adminData.password);
                    const result = await adminInstance.save();
                    const data = JSON.parse(JSON.stringify(result));
                    delete data.password;

                    resolve({
                        code: CONFIG.SUCCESS_CODE,
                        message: CONFIG.SUCCESS_ADMIN_CREATION,
                        data: data,
                    });

                } catch (err) {
                    console.error("Database error:", err.message);
                    return reject({
                        code: CONFIG.ERROR_CODE,
                        message: err.message,
                    });
                }

            } catch (err) {
                console.error("Unexpected error:", err.message);
                return reject({
                    code: CONFIG.ERROR_CODE,
                    message: err.message,
                });
            }
        });
    }
    loginAdmin(req, res) {
        return new Promise(async function (resolve, reject) {
            var body = req.body;
            if (!body.password)
                return reject({
                    code: CONFIG.ERROR_CODE,
                    message: CONFIG.ERR_MISSING_PASSWORD,
                });
            else if (!body.email)
                return reject({
                    code: CONFIG.ERROR_CODE,
                    message: CONFIG.ERR_MISSING_EMAIL,
                });
            SuperAdmin.findOne({
                email: body.email.toLowerCase(),
                status: CONFIG.ACTIVE_STATUS,
            })
                .select("+password")
                .then(async (user) => {
                    if (!user)
                        return reject({
                            code: CONFIG.ERROR_CODE_FORBIDDEN,
                            message: CONFIG.EMAIL_NOT_CORRECT,
                        });
                    const iscorrect = await user.comparePassword(body.password);
                    if (!iscorrect)
                        return reject({
                            code: CONFIG.ERROR_CODE_FORBIDDEN,
                            message: CONFIG.PASS_NOT_CORRECT,
                        });
                    var data = JSON.parse(JSON.stringify(user));
                    delete data.password;

                    let token = jwtUtil.issue({
                        email: data.email,
                        _id: data._id,
                    });
                    data.token = token;
                    return resolve({
                        code: CONFIG.SUCCESS_CODE,
                        message: CONFIG.SUPERADMIN_SUCCESSFUL_LOGIN,
                        data: data,
                    });
                })
                .catch((err) => {
                    return reject({ code: CONFIG.ERROR_CODE, message: err.message });
                });
        });
    }

    getAllHospitalList(req, res) {
        return new Promise(async function (resolve, reject) {
            try {
                const adminList = await Admin.find({
                    status: { $ne: 2 }
                }).select('_id name');

                if (!adminList.length) {
                    return reject({
                        code: CONFIG.ERROR_CODE,
                        message: CONFIG.ADMIN_NOT_FOUND,
                    });
                }

                resolve({
                    code: CONFIG.SUCCESS_CODE,
                    message: CONFIG.SUCCESS_CODE_ADMIN_LIST_RETRIEVAL,
                    data: adminList
                });
            } catch (error) {
                reject({
                    code: CONFIG.ERROR_CODE,
                    message: error.message,
                });
            }
        });
    }


    getAdminList(req, res) {
        return new Promise(async function (resolve, reject) {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = 10;
                const skip = (page - 1) * limit;
                const word = req.query.word;
                const adminList = await Admin.find({
                    status: { $ne: 2 },
                    $or: [
                        { name: { $regex: new RegExp(word, "i") } },
                        { email: { $regex: new RegExp(word, "i") } },
                        { contactNumber: { $regex: new RegExp(word, "i") } },
                    ],
                }).sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit);

                if (!adminList.length) {
                    return reject({
                        code: CONFIG.ERROR_CODE,
                        message: CONFIG.ADMIN_NOT_FOUND,
                    });
                }
                const adminCount = await Admin.countDocuments({
                    status: { $ne: 2 },
                    $or: [
                        { name: { $regex: new RegExp(word, "i") } },
                        { email: { $regex: new RegExp(word, "i") } },
                        { contactNumber: { $regex: new RegExp(word, "i") } },
                    ]
                });
                resolve({
                    code: CONFIG.SUCCESS_CODE,
                    message: CONFIG.SUCCESS_CODE_ADMIN_LIST_RETRIEVAL,
                    data: { adminList, adminCount }
                });
            } catch (error) {
                reject({
                    code: CONFIG.ERROR_CODE,
                    message: error.message,
                });
            }
        });
    }

    getAdminById(req, res) {
        return new Promise(async function (resolve, reject) {
            try {
                const adminId = req.params.id;
                // Validate adminId
                if (!adminId) {
                    return reject({
                        code: CONFIG.ERROR_CODE,
                        message: CONFIG.ADMIN_ID_MISSED,
                    });
                }
                // Check if adminId is a valid ObjectId
                if (!adminId || !mongoose.Types.ObjectId.isValid(adminId)) {
                    reject({
                        code: CONFIG.ERROR_CODE,
                        message: CONFIG.ID_NOT_CORRECT,
                    });
                    return;
                }
                const admin = await Admin.findOne({
                    _id: adminId,
                    status: { $ne: 2 }
                });

                if (!admin) {
                    return reject({
                        code: CONFIG.ERROR_CODE,
                        message: CONFIG.ADMIN_NOT_FOUND,
                    });
                }
                resolve({
                    code: CONFIG.SUCCESS_CODE,
                    message: CONFIG.SUCCESS_CODE_ADMIN_RETRIEVAL,
                    data: admin,
                });
            } catch (error) {
                reject({
                    code: CONFIG.ERROR_CODE,
                    message: error.message,
                });
            }
        });
    }

    updateAdmin(req, res) {
        return new Promise(async function (resolve, reject) {
            try {
                const adminId = req.params.id;
                var adminData = req.body;

                if (req.file) {
                    // File upload successful
                    const adminDetails = await Admin.findOne({ _id: adminId });
                    if (adminDetails && req.file) {
                        if (adminDetails.profileImage) {
                            const filePath = path.join(
                                __dirname,
                                "../../",
                                "public",
                                "uploads",
                                adminDetails.profileImage.replace("static/", "")
                            );
                            fs.unlink(filePath, (err) => {
                                if (err) {
                                    console.error("Error removing old file:", err.message);
                                } else {
                                    console.log("File removed successfully");
                                }
                            });
                            adminData.profileImage = req.file
                                ? `static/profileImage/${req.file.filename}`
                                : null;
                        } else if (req.file) {
                            adminData.profileImage = req.file
                                ? `static/profileImage/${req.file.filename}`
                                : null;
                        }
                    }
                }

                const admin = await Admin.findOne({ _id: adminId });
                //let adminInstance = new Admin(adminData);
                if (!admin) {
                    return reject({
                        code: CONFIG.ERROR_CODE,
                        message: CONFIG.ERR_INVALID_EMAIL,
                    });
                }

                await Admin.updateOne(
                    { _id: adminId },
                    { $set: s },
                    { new: true, upsert: true }
                );
                const updatedAdmin = await Admin.findOne({ _id: adminId });
                resolve({
                    code: CONFIG.SUCCESS_CODE,
                    message: CONFIG.SUCCESS_ADMIN_UPDATE,
                    data: updatedAdmin,
                });
            } catch (error) {
                reject({
                    code: CONFIG.ERROR_CODE,
                    message: error.message,
                });
            }
        });
    }

    deleteAdmin(req, res) {
        return new Promise(async function (resolve, reject) {
            try {
                const adminId = req.params.id;
                const admin = await Admin.findOne({ _id: adminId });
                if (!admin) {
                    return reject({
                        code: CONFIG.ERROR_CODE,
                        message: CONFIG.ERR_INVALID_EMAIL,
                    });
                }

                // Delete Admin Soft Delete
                await Admin.updateOne({ _id: adminId }, { status: 2 }, { new: true });
                resolve({
                    code: CONFIG.SUCCESS_CODE,
                    message: CONFIG.SUCCESS_CODE_ADMIN_DELETED,
                });
            } catch (error) {
                reject({
                    code: CONFIG.ERROR_CODE,
                    message: error.message,
                });
            }
        });
    }

    SuperadminDoctorRegister(req, res) {
        return new Promise(async (resolve, reject) => {
            try {
                var doctorData = req.body;

                if (req.files) {
                    const profileImage = req.files["profileImage"]
                        ? `static/profileImage/${req.files["profileImage"][0].filename}`
                        : null;
                    const doctorSign = req.files["doctorSign"]
                        ? `static/doctorSign/${req.files["doctorSign"][0].filename}`
                        : null;
                    doctorData.profileImage = profileImage;
                    doctorData.doctorSign = doctorSign;
                }
                
                if (doctorData.email && !Util.isValidEmail(doctorData.email)) {
                    return reject({
                        code: CONFIG.ERROR_CODE,
                        message: CONFIG.ERR_INVALID_EMAIL,
                    });
                } else if (doctorData.password && !Util.isValidPassword(doctorData.password)) {
                    return reject({
                        code: CONFIG.ERROR_CODE,
                        message: CONFIG.ERR_INVALID_PASSWORD,
                    });
                }
                try {
                    const exists = await Doctor.findOne({ email: doctorData.email.toLowerCase(), status: { $ne: 2 } });
                    if (exists) {
                        return reject({
                            code: CONFIG.ERROR_CODE,
                            message: CONFIG.ERR_EMAIL_ALREADY_TAKEN,
                        });
                    }

                    let doctorInstance = new Doctor(doctorData);
                    doctorInstance.password = await doctorInstance.setPassword(doctorData.password);
                    const result = await doctorInstance.save();
                    const data = JSON.parse(JSON.stringify(result));
                    delete data.password;

                    resolve({
                        code: CONFIG.SUCCESS_CODE,
                        message: CONFIG.SUCCESS_DOCTOR_CREATION,
                        data: data,
                    });

                } catch (err) {
                    console.error("Database error:", err.message);
                    return reject({
                        code: CONFIG.ERROR_CODE,
                        message: err.message,
                    });
                }

            } catch (err) {
                console.error("Unexpected error:", err.message);
                return reject({
                    code: CONFIG.ERROR_CODE,
                    message: err.message,
                });
            }
        });

    }


    getAllDoctorList(req, res) {
        return new Promise(async function (resolve, reject) {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = 10;
                const skip = (page - 1) * limit;
                const word = req.query.word;
                let query = {
                    status: { $ne: 2 },
                };

                if (word) {
                    query.$or = [
                        { name: { $regex: new RegExp(word, "i") } },
                        { email: { $regex: new RegExp(word, "i") } },
                    ];
                }
                if (req.query.hospitalId) {
                    query.hospitalId = req.query.hospitalId;
                }
                const doctorList = await Doctor.find(query)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit).populate('hospitalId', 'name address email');
                ;
                const doctorCount = await Doctor.countDocuments(query);

                resolve({
                    code: CONFIG.SUCCESS_CODE,
                    message: CONFIG.SUCCESS_DOCTOR_LIST,
                    data: { doctorList, doctorCount }
                });
            } catch (error) {
                reject({
                    code: CONFIG.ERROR_CODE,
                    message: error.message,
                });
            }
        });
    }

    getDoctorbyId(req, res) {
        return new Promise(async function (resolve, reject) {
            try {
                const doctorId = req.params.id;
                // Validate adminId
                if (!doctorId) {
                    return reject({
                        code: CONFIG.ERROR_CODE,
                        message: CONFIG.DOCTOR_ID_MISSED,
                    });
                }
                // Check if adminId is a valid ObjectId
                if (!doctorId || !mongoose.Types.ObjectId.isValid(doctorId)) {
                    reject({
                        code: CONFIG.ERROR_CODE,
                        message: CONFIG.ID_NOT_CORRECT,
                    });
                    return;
                }
                const doctor = await Doctor.findOne({
                    _id: doctorId,
                    status: { $ne: 2 }
                });

                if (!doctor) {
                    return reject({
                        code: CONFIG.ERROR_CODE,
                        message: CONFIG.DOCTOR_NOT_FOUND,
                    });
                }
                resolve({
                    code: CONFIG.SUCCESS_CODE,
                    message: CONFIG.SUCCESS_CODE_DOCTOR_RETRIEVAL,
                    data: doctor,
                });
            } catch (error) {
                reject({
                    code: CONFIG.ERROR_CODE,
                    message: error.message,
                });
            }
        });
    }


    updateDoctor(req, res) {
        return new Promise(async function (resolve, reject) {
            try {
                const doctorId = req.params.id;
                let doctorData = req.body;
                console.log("step 1");

                const doctor = await Doctor.findOne({ _id: doctorId });
                if (!doctor) {
                    return reject({
                        code: CONFIG.ERROR_CODE,
                        message: CONFIG.NOT_FOUND_DOCTOR,
                    });
                }
                console.log("step 2");


                // if (req.file) {
                //     // File upload successful
                //     if (typeof doctor.profileImage === 'string' && doctor.profileImage.includes('static/profileImage/')) {
                //         const filePath = path.join(
                //             __dirname,
                //             "../../",
                //             "public",
                //             "uploads",
                //             "profileImage",
                //             doctor.profileImage.replace("static/", "")
                //         );
                //         try {
                //             await fs.promises.unlink(filePath);
                //             console.log("Old profile image removed successfully.");
                //         } catch (err) {
                //             console.error("Error removing old file:", err.message);
                //         }
                //     }

                //     // Update the new profile image path
                //     doctorData.profileImage = `static/profileImage/${req.file.filename}`;
                // }

                if (req.files) {

                    const profileImage = req.files["profileImage"]
                        ? `static/profileImage/${req.files["profileImage"][0].filename}`
                        : null;
                    const doctorSign = req.files["doctorSign"]
                        ? `static/doctorSign/${req.files["doctorSign"][0].filename}`
                        : null;
                    console.log(doctorSign, "doctorSign");

                    // Remove existing image files if new ones are provided
                    if (profileImage) {

                        doctorData.profileImage = profileImage;
                        let iurl = doctor.profileImage;
                        if (doctor.profileImage != null && doctor.profileImage != "") {
                            iurl = doctor.profileImage.replace("static/", "");
                        }
                        if (iurl != null && iurl != "") {


                            const filePath = path.join(
                                __dirname,
                                "../../",
                                "public",
                                "uploads",
                                iurl
                            );
                            fs.unlink(filePath, (err) => {
                                if (err) {
                                    console.error("Error removing old file:", err);
                                } else {
                                    console.log("Image file removed successfully");
                                }

                            });

                        }

                    }

                    if (doctorSign) {

                        doctorData.doctorSign = doctorSign;
                        let ilurl = doctor.doctorSign;
                        if (doctor.doctorSign != null && doctor.doctorSign != "") {
                            ilurl = doctor.doctorSign.replace("static/", "");
                        }
                        if (ilurl != null && ilurl != "") {


                            const filePath = path.join(
                                __dirname,
                                "../../",
                                "public",
                                "uploads",
                                ilurl
                            );
                            fs.unlink(filePath, (err) => {
                                if (err) {
                                    console.error("Error removing old file:", err);
                                } else {
                                    console.log("doctor sign image file removed successfully");
                                }

                            });
                        }

                    }

                }


                const updatedDoctor = await Doctor.findOneAndUpdate(
                    { _id: doctorId },
                    { $set: doctorData },
                    { new: true }
                );

                resolve({
                    code: CONFIG.SUCCESS_CODE,
                    message: CONFIG.SUCCESS_DOCTOR_UPDATE,
                    data: updatedDoctor,
                });
            } catch (error) {
                reject({
                    code: CONFIG.ERROR_CODE,
                    message: error.message,
                });
            }
        });
    }

    deleteDoctor(req, res) {
        return new Promise(async function (resolve, reject) {
            try {
                const doctorId = req.params.id;
                const doctor = await Doctor.findOne({ _id: doctorId });
                if (!doctor) {
                    return reject({
                        code: CONFIG.ERROR_CODE,
                        message: CONFIG.NOT_FOUND_DOCTOR,
                    });
                }

                await Doctor.updateOne({ _id: doctorId }, { status: 2 }, { new: true });
                resolve({
                    code: CONFIG.SUCCESS_CODE,
                    message: CONFIG.SUCCESS_CODE_DOCTOR_DELETED,
                });
            } catch (error) {
                reject({
                    code: CONFIG.ERROR_CODE,
                    message: error.message,
                });
            }
        });
    }


    adminStaffRegister(req, res) {
        return new Promise(async (resolve, reject) => {
            try {
                var staffData = req.body;
                if (req.file) {
                    // File upload successful
                    staffData.profileImage = `static/profileImage/${req.file.filename}`;
                } else {
                    console.log("No file uploaded");
                }
                if (staffData.email && !Util.isValidEmail(staffData.email)) {
                    return reject({
                        code: CONFIG.ERROR_CODE,
                        message: CONFIG.ERR_INVALID_EMAIL,
                    });
                } else if (staffData.password && !Util.isValidPassword(staffData.password)) {
                    return reject({
                        code: CONFIG.ERROR_CODE,
                        message: CONFIG.ERR_INVALID_PASSWORD,
                    });
                }
                try {
                    const exists = await Staff.findOne({ email: staffData.email.toLowerCase(), status: { $ne: 2 } });
                    if (exists) {
                        return reject({
                            code: CONFIG.ERROR_CODE,
                            message: CONFIG.ERR_EMAIL_ALREADY_TAKEN,
                        });
                    }

                    let staffInstance = new Staff(staffData);
                    staffInstance.password = await staffInstance.setPassword(staffData.password);
                    const result = await staffInstance.save();
                    const data = JSON.parse(JSON.stringify(result));
                    delete data.password;

                    resolve({
                        code: CONFIG.SUCCESS_CODE,
                        message: CONFIG.SUCCESS_STAFF_CREATION,
                        data: data,
                    });

                } catch (err) {
                    console.error("Database error:", err.message);
                    return reject({
                        code: CONFIG.ERROR_CODE,
                        message: err.message,
                    });
                }

            } catch (err) {
                console.error("Unexpected error:", err.message);
                return reject({
                    code: CONFIG.ERROR_CODE,
                    message: err.message,
                });
            }
        });

    }

    getAllStaffList(req, res) {
        return new Promise(async function (resolve, reject) {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = 10;
                const skip = (page - 1) * limit;

                let query = {
                    status: { $ne: 2 },
                };

                if (req.query.word) {
                    query.$or = [
                        { name: { $regex: new RegExp(word, "i") } },
                        { email: { $regex: new RegExp(word, "i") } },
                    ];
                }
                if (req.query.hospitalId) {
                    query.hospitalId = req.query.hospitalId;
                }
                const staffList = await Staff.find(query)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit).populate('hospitalId');

                const staffCount = await Staff.countDocuments(query);

                resolve({
                    code: CONFIG.SUCCESS_CODE,
                    message: CONFIG.SUCCESS_STAFF_LIST,
                    data: { staffList, staffCount }
                });
            } catch (error) {
                reject({
                    code: CONFIG.ERROR_CODE,
                    message: error.message,
                });
            }
        });
    }

    getStaffbyId(req, res) {
        return new Promise(async function (resolve, reject) {
            try {
                const staffId = req.params.id;
                // Validate adminId
                if (!staffId) {
                    return reject({
                        code: CONFIG.ERROR_CODE,
                        message: CONFIG.STAFF_ID_MISSED,
                    });
                }
                // Check if adminId is a valid ObjectId
                if (!staffId || !mongoose.Types.ObjectId.isValid(staffId)) {
                    reject({
                        code: CONFIG.ERROR_CODE,
                        message: CONFIG.ID_NOT_CORRECT,
                    });
                    return;
                }
                const staff = await Staff.findOne({
                    _id: staffId,
                    status: { $ne: 2 }
                });

                if (!staff) {
                    return reject({
                        code: CONFIG.ERROR_CODE,
                        message: CONFIG.STAFF_NOT_FOUND,
                    });
                }
                resolve({
                    code: CONFIG.SUCCESS_CODE,
                    message: CONFIG.SUCCESS_CODE_STAFF_RETRIEVAL,
                    data: staff,
                });
            } catch (error) {
                reject({
                    code: CONFIG.ERROR_CODE,
                    message: error.message,
                });
            }
        });
    }


    updateStaff(req, res) {
        return new Promise(async function (resolve, reject) {
            try {
                const staffId = req.params.id;
                const staff = await Staff.findOne({ _id: staffId });
                if (!staff) {
                    return reject({
                        code: CONFIG.ERROR_CODE,
                        message: CONFIG.NOT_FOUND_STAFF,
                    });
                }
                let staffData = req.body;
                if (req.file) {
                    // File upload successful
                    const staffDetails = await Staff.findOne({ email: staffData.email });
                    if (req.file && staffDetails.profileImage) {
                        const filePath = path.join(
                            __dirname,
                            "../../",
                            "public",
                            "uploads",
                            "profileImage",
                            staffDetails.profileImage.replace("static/", "")
                        );
                        fs.unlink(filePath, (err) => {
                            if (err) {
                                console.error("Error removing old file:", err.message);
                            } else {
                                console.log("File removed successfully");
                            }
                            staffData.profileImage = req.file
                                ? `static/profileImage/${req.file.filename}`
                                : null;
                            // Pass the uploaded data to the next middleware function
                        });
                    } else if (req.file) {
                        staffData.profileImage = req.file
                            ? `static/profileImage/${req.file.filename}`
                            : null;
                    }
                }

                await Staff.updateOne(
                    { _id: staffId },
                    { $set: staffData },
                    { new: true, upsert: true }
                );
                const updateStaff = await Staff.findOne({ _id: staffId });
                resolve({
                    code: CONFIG.SUCCESS_CODE,
                    message: CONFIG.SUCCESS_STAFF_UPDATE,
                    data: updateStaff,
                });
            } catch (error) {
                reject({
                    code: CONFIG.ERROR_CODE,
                    message: error.message,
                });
            }
        });
    }

    deleteStaff(req, res) {
        return new Promise(async function (resolve, reject) {
            try {
                const staffId = req.params.id;
                const staff = await Staff.findOne({ _id: staffId });
                if (!staff) {
                    return reject({
                        code: CONFIG.ERROR_CODE,
                        message: CONFIG.NOT_FOUND_STAFF,
                    });
                }

                await Staff.updateOne({ _id: staffId }, { status: 2 }, { new: true });
                resolve({
                    code: CONFIG.SUCCESS_CODE,
                    message: CONFIG.SUCCESS_CODE_STAFF_DELETED,
                });
            } catch (error) {
                reject({
                    code: CONFIG.ERROR_CODE,
                    message: error.message,
                });
            }
        });
    }

    // createTemplate(req, res) {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             var templateData = req.body;           

    //             try {      
    //                 i have prescriptionTemplate key in above  in Prescription model         templateData if my record exists in database then update that otherwise create   

    //                 resolve({
    //                     code: CONFIG.SUCCESS_CODE,
    //                     message: CONFIG.SUCCESS_TEMPLATE_CREATION,
    //                     data: data,
    //                 });

    //             } catch (err) {
    //                 console.error("Database error:", err.message);
    //                 return reject({
    //                     code: CONFIG.ERROR_CODE,
    //                     message: err.message,
    //                 });
    //             }

    //         } catch (err) {
    //             console.error("Unexpected error:", err.message);
    //             return reject({
    //                 code: CONFIG.ERROR_CODE,
    //                 message: err.message,
    //             });
    //         }
    //     });

    // }

    sendEmailForgotPasswordforAdmin(req, res) {
        return new Promise(async function (resolve, reject) {
            try {
                const otp = '12345';
                const checkAdmin = await Admin.findOneAndUpdate(
                    { email: req.body.email, status: { $ne: 2 } },
                    { otp: otp },
                    { new: true }
                );
                if (!checkAdmin) {
                    return reject({
                        code: CONFIG.ERROR_CODE,
                        message: CONFIG.EMAIL_NOT_CORRECT,
                    });
                }

                // let transporter = nodemailer.createTransport({
                //   host: process.env.HOST,
                //   port: 465,
                //   auth: {
                //     user: process.env.USERNAME,
                //     pass: process.env.PASS,
                //   },
                // });

                // let htmlContent = `
                //   <div style="text-align: center; font-family: Arial, sans-serif;">
                //     <img src=" ${process.env.BASEURL}/static/image1-1716183643198-334295482.jpg" alt="Company Logo" width="200px" height="auto" style="margin-bottom: 20px;">
                //     <h2>Forgot Password</h2>
                //     <p>Dear User,</p>
                //     <p>We received a request to reset your password. Please use the following One-Time Password (OTP) to reset your password:</p>
                //     <p style="font-size: 24px; font-weight: bold; color: #333;">${otp}</p>
                //     <p>This OTP is valid for the next 10 minutes. Please do not share it with anyone.</p>
                //     <p>If you did not request a password reset, please ignore this email or contact our support team.</p>
                //     <p style="font-style: italic;">Thank you for using our service!</p>
                //   </div>
                // `;

                // let mailOptions = {
                //   from: process.env.MAILFROM,
                //   to: email,
                //   subject: "Forgot Password",
                //   html: htmlContent,
                // };

                // Send email
                // transporter.sendMail(mailOptions, (error, info) => {
                //   if (error) {
                //     console.log("Error occurred while sending email:", error.message);
                //     return reject({
                //       code: CONFIG.ERROR_CODE,
                //       message: error.message,
                //     });
                //   } else {
                //     console.log("Email sent successfully!");
                //     resolve({
                //       code: CONFIG.SUCCESS_CODE,
                //       message: CONFIG.OTP_SUCCESS,
                //     });
                //   }
                // });

            } catch (error) {
                return reject({
                    code: CONFIG.ERROR_CODE,
                    message: error.message,
                });
            }
        });
    }

    verifyEmailOtpforAdmin(req, res) {
        return new Promise(async function (resolve, reject) {
            try {
                const { email, otp } = req.body;

                const check = await Admin.findOne({
                    email: email,
                    status: { $ne: 2 },
                });

                if (check) {
                    if (otp == check.otp) {
                        const cleanOtp = await Admin.findOneAndUpdate(
                            { email: email, status: { $ne: 2 } },
                            { otp: '' },
                            { new: true }
                        ).select('_id');
                        if (cleanOtp) {
                            resolve({
                                code: CONFIG.SUCCESS_CODE,
                                message: CONFIG.OTPVERIFY,
                                data: cleanOtp
                            });
                        }
                    } else {
                        resolve({
                            code: CONFIG.ERROR_CODE_BAD_REQUEST,
                            message: CONFIG.OTPNOTVERIFY,
                        });
                    }
                } else {
                    resolve({
                        code: CONFIG.ERROR_CODE,
                        message: CONFIG.ERR_INVALID_EMAIL,
                    });
                }
            } catch (error) {
                return reject({
                    code: CONFIG.ERROR_CODE,
                    message: error.message,
                });
            }
        });
    }


    updatePasswordforAdminEmail(req, res) {
        return new Promise(async function (resolve, reject) {
            try {
                const adminId = req.params.id;
                const newPassword = req.body.newPassword;
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                const adminData = await Admin.findOneAndUpdate(
                    { _id: adminId },
                    { password: hashedPassword },
                    { new: true }
                );

                resolve({
                    code: CONFIG.SUCCESS_CODE,
                    message: CONFIG.SUCCESS_ADMIN_PASSWORD_UPDATED,
                });
            } catch (error) {
                reject({
                    code: CONFIG.ERROR_CODE,
                    message: error.message,
                });
            }
        });
    }
    updateUser(req, res) {
        return new Promise(async function (resolve, reject) {
            try {
                const userId = req.params.id;
                const userUpdateData = req.body;
                const userUpdatedData = await User.findOneAndUpdate(
                    { _id: userId },
                    { $set: userUpdateData },
                    { new: true }
                );
                resolve({
                    code: CONFIG.SUCCESS_CODE,
                    message: CONFIG.SUCCESS_USER_DATA_UPDATED,
                    data: userUpdatedData,
                });
            } catch (error) {
                reject({
                    code: CONFIG.ERROR_CODE,
                    message: error.message,
                });
            }
        });
    }
}

module.exports = superAdminService;
