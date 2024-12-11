require("dotenv").config();

let appConfig = {
  PORT: process.env.APIPORT,
  VERIFF_API_URL: process.env.VERIFF_API_URL,
  AUTH_CLIENT_KEY: process.env.AUTH_CLIENT_KEY,
  JWT_ENCRYPTION: "iAmAgeProof#2024",
  CRYPT_SECRET_KEY: "iAmAgeProofEncrypt_&&^^(())",

  SUCCESS_CODE: 200,
  ERROR_CODE_UNAUTHORIZED: 401,
  ERROR_CODE_FORBIDDEN: 403,
  ERROR_CODE: 422,
  ERROR_CODE_BLOCKED_USER: 450,
  ERROR_CODE_DELETED_USER: 451,
  ERROR_CODE_TOO_MAY_ATTEMPTS: 300,

  ACTIVE_STATUS: 1,
  INACTIVE_STATUS: 0,
  DELETED_STATUS: 2,

  // Auth
  ERR_SERVER_MSG: "ERR SERVER MSG",
  TOKENNOTCORRECT: "TOKENNOTCORRECT",
  TOKEN_MISSING: "TOKEN MISSING",
  DISABLED_AUTHORIZATION: "DISABLED AUTHORIZATION",
  ERR_INVALID_EMAIL: "ERR INVALID EMAIL",
  ERR_INVALID_PASSWORD: "ERR INVALID PASSWORD",
  ERR_EMAIL_ALREADY_TAKEN: "ERR EMAIL ALREADY TAKEN",
  ERR_MISSING_PASSWORD: "ERR MISSING PASSWORD",
  ERR_MISSING_EMAIL: "ERR MISSING EMAIL",
  EMAIL_NOT_CORRECT: "EMAIL NOT CORRECT",
  PASS_NOT_CORRECT: "PASSWORD NOT CORRECT",
  CREATED_MSG: "CREATED MSG",
  UPDATED_MSG: "UPDATED MSG",
  EMAIL_LOGIN_CASE_DEVICE: "Email Login Case",
  NO_DATA_PRESENT_ONBOARD: "No Data Present",
  DELETED_MSG: "DELETED MSG",
  SUCCESS_EMAIL_SENT: "Email Sent Successfully",
  SUCCESS_ONBOARDING_DELETED: "Onboarding Deleted Successfully",
  SUCCESS_ONBOARDING_UPDATED: "Onboarding Updated Successfully",
  SAVE_MSG: "SAVE MSG",
  NOT_FOUND_ONBOARDING: "Onboarding Not Found",
  ID_NOT_CORRECT: "ID NOT CORRECT",
  SUCCESS_DATE_UPDATE: "Successfull Date Update",
  ERROR_CODE_SAME_ONBOARDING: "Same Onloading Language Already Exists",
  PASS_NOT_REQUIRED: "This Login is Not Possible through Password",
  EMAIL_ALREADY_EXISTS: "Email Already Exists",
  SUCCESS_USER_PASSWORD_UPDATED: "Password Changed Successfully",
  SUCCESS_ONBOARDING_RETRIEVAL: "Onboarding Retrieval Successfull",
  PHONE_ALREADY_EXISTS: "Phone Number Already Exists",
  UUID_ALREADY_EXISTS: "UUID Already Exists",
  NOT_EXISTS_USER: "User Doesn't Exists",
  ALREADY_EXISTS_USER: "User Already Logged In",
  NOT_LOGGED_IN_USER: "Logged User Out",
  ALREADY_UPDATED_DEVICE: "New Device Used To Login",
  LOGOUT_USER: "Logout User",
  USER_SIX_MONTHS_OLD: "User is 6 Months Old",
  USER_NOT_SIX_MONTHS_OLD: "User is Not 6 Months Old",
  SUCCESS_USERS_VISITS: "User Visits Retrieved Successfully",
  NOT_FOUND_DATE_AND_USER: "User data or createdAt date not found",
  SUCCESS_MANAGER_RETRIEVAL: "Manager Counts Retreived ",
  SUCCESS_COUNTS_RETRIEVAL: "Successfull Login Counts Retreived",
  SUCCESS_USERS_DATA: "User Data Retrieved Successfully",
  SUCCESS_USERS_DATA_UPDATED: "User Data Updated Successfully",
  SUCCESS_COUNTS_RETRIEVAL_ADMIN: "User Visits Counts ",
  SUCCESS_NEARBY_STORES_FOUND: "Nearby Stores Found",
  DATE_NOT_FOUND: "Start Date or End Date Not Found",
  SUCCESS_TERMS_RETRIEVAL: "Terms and Conditions Retreived",
  SUCCESS_STORES_FOUND: "Stores Found",
  USER_LOGGED_OUT_SUCCESSFULLY: "Log Out Successfull",
  SUCCESS_TERMS_CREATED: "Terms and Conditions Created Successfully",
  SUCCESS_STORES_NOT_FOUND: "Stores Not Found",
  ALREADY_LOGGEDOUT_DEVICE: "Already Logged Out Device",
  NOT_FOUND_STORE: "Not Found Store",
  SUCCESS_SETTINGS_RETRIEVAL: "Settings Retreived",
  SUCCESS_STORE_UPDATED: "Store Updated Successfully ",
  SUCCESS_STORE_LIST: "Store List Retrieved Successfully",
  SUCCESS_STORE_RECIEVED: "Store Retrieved Successfully",
  SUCCESS_STORE_DELETED: "Store Deleted Successfully",
  SUCCESS_MANAGER_CREATED: "New Manager Created",
  NOT_FOUND_MANAGER: "Manager Not Found",
  SUCCESS_ONBOARDING: "Onboarding Creation Successfull",
  MANAGER_NOT_FOUND: "Wrong QR Code Scan",
  USER_SUCCESSFUL_LOGIN: "User Successfull Login",
  USER_SUCCESSFUL_UPDATE: "User Updated Successfully",
  SAME_UUID_EXISTS: "Same User Already Exists",
  USER_SUCCESSFUL_CREATION: "MIT User Successful Creation ",
  USER_CREATION: "User Created Successfully",
  SUCCESS_RADIUS_UPDATED: "Radius Updated Successfully",
  NOT_FOUND_USER: "User Not Found",
  SUCCESS_USER_RECIEVED: "User Retreievd Successfully",
  SUCCESS_USER_DELETED: "User Deleted Successfully",
  SUCCESS_USER_LIST: "User List Retreievd Successfully",
  SUCCESS_USER_DATA: "User Data Retreievd Successfully",
  USER_ID_MISSED: "User ID Missed",
  SUCCESS_SETTINGS_CREATED: "Settings Created",
  SUCCESS_USER_DELETED: "User Deleted Successfully",
  USER_LOGGED_OUT_SUCCESSFULLY: "Logout Successfull",
  SUCCESS_ADMIN_CREATION: "Admin Created Successfully ",
  SUCCESS_ADMIN_PASSWORD_UPDATED: "Admin Password Updated Successfully",
  SUCCESS_ADMIN_LIST: "Admin List Retreievd Successfully",
  ADMIN_ID_MISSED: "Admin Id Missing",
  ADMIN_NOT_FOUND: "Admin Not Found",
  SUCCESS_CODE_ADMIN_RETRIEVAL: "Admin Retreievd Successfully ",
  OTP_SUCCESS: "Email sent successfully!",
  OTPVERIFY: "otp Verified Successfully",
  OTPNOTVERIFY: "otp Not Verified",
  SUCCESS_CODE_ADMIN_DELETED: "Admin Deleted Successfully",
  DATA_CREATED_SUCCESSFULLY: "Age Data Created Successfully",
  SUCCESS_STORES_RETRIEVAL: "Stores Retreievd Successfully",
  ERROR_CODE_SAME_STORE: "Same Store Name Exists",
  QR_GENERATE_FAILED: "Qr Code Generation Failed",
  SUCCESS_CODE_STORE_ADDED: "Store Added Successfully",
  SUCCESS_STORE_RETRIEVAL: "Store Retreievd Successfully",
  SUCCESS_STORE_DELETED: "Store Deleted Successfully",
  SUCCESS_USER_VISIT_FOUND: "User Visits Retrieved Successfully",
  ERROR_CODE_SAME_EMAIL: "Same Email User Exists",
  NOT_FOUND_USER_EMAIL: "User Not Found",
  SUCCESS_USER_PASSWORD_UPDATED: "User Password Updated Successfully",
  SUCCESS_STORE_NOT_FOUND: "Store not found",
  SUCCESS_STORE_FOUND: "Store found Successfully",
  SUCCESS_VERIFICATION_CREATED: "Verification session created successfully",
  SUCCESS_CALLBACK_CREATED: "Callback created Successfully",
  ADMIN_SUCCESSFUL_LOGIN: "Admin login Successfully",
  SUCCESS_ADMIN_UPDATE: "Admin Updated Successfully",
  SUCCESS_DOCTOR_LIST: "Doctor list Retrieved Successfully",
  DOCTOR_ID_MISSED: "Doctor Id missed",
  DOCTOR_NOT_FOUND: "Doctor not found",
  SUCCESS_CODE_DOCTOR_RETRIEVAL: "Doctor Retrieved Successfully",
  NOT_FOUND_DOCTOR: "Not Found doctor",
  SUCCESS_DOCTOR_UPDATE: "Doctor updated Successfully",
  SUCCESS_CODE_DOCTOR_DELETED: "Doctor deleted Successfully",
  SUCCESS_DOCTOR_CREATION: "Doctor created Successfully",
  SUCCESS_STAFF_CREATION: "Staff created Successfully",
  SUCCESS_STAFF_LIST: "Staff list Retrieved Successfully",
  STAFF_ID_MISSED: "Staff Id Missing",
  STAFF_NOT_FOUND: "Staff not found",
  SUCCESS_CODE_STAFF_RETRIEVAL: "Staff Retrieved Successfully",
  NOT_FOUND_STAFF: "Not found staff",
  SUCCESS_STAFF_UPDATE: "Staff updated Successfully",
  SUCCESS_CODE_STAFF_DELETED: "Staff deleted Successfully",
  DOCTOR_SUCCESSFUL_LOGIN: "Doctor Login Successfully",
  STAFF_SUCCESSFUL_LOGIN: "Staff Login Successfull",
  SUCCESS_DOCTOR_PASSWORD_UPDATED: "Doctor password updated Successfully",
  SUCCESS_STAFF_PASSWORD_UPDATED: "Staff password changed Successfully",
  SUPERADMIN_SUCCESSFUL_LOGIN: "Super Admin login Successfully",
  SAME_PATIENT_ALREADY_EXISTS: "Same Patient already exists",
  SUCCESS_PATIENT_CREATION: "Patient created Successfully",
  PATIENT_ID_MISSED: "Patient Id missing",
  PATIENT_NOT_FOUND: "Patient not found",
  SUCCESS_CODE_PATIENT_RETRIEVAL: "Patient Retrieved Successfully",
  SUCCESS_PATIENT_UPDATE: "Patient updated Successfully",
  SUCCESS_CODE_PATIENT_DELETED: "Patient deleted Successfully",
  SUCCESS_PATIENT_VITALS_LIST: "Patient vitals Retrieved Successfully",
  SUCCESS_PATIENT_VITALS_CREATION: "Patient vitals created Successfully",
  PATIENT_VITALS_NOT_FOUND: "Patient vitals not found",
  SUCCESS_CODE_PATIENT_VITAL_RETRIEVAL: "Patient vitals found Successfully",
  SUCCESS_PATIENT_VITALS_UPDATE: "Patient vitals updated Successfully",
  SUCCESS_CODE_PATIENT_VITALS_DELETED: "Patient vitals deleted Successfully ",
  SUCCESS_CODE_ADMIN_LIST_RETRIEVAL: "Admin list Retrieved Successfully",
  SUCCESS_PATIENT_PRESCRIPTION_CREATION: "Patient Prescription created Successfully",
  SUCCESS_PATIENT_PRESCRIPTION_LIST: "Patient Prescription list Retrieved Successfully",
  PATIENT_PRESCRIPTION_NOT_FOUND: "Patient Prescription not found",
  SUCCESS_CODE_PATIENT_PRESCRIPTION_RETRIEVAL: "Patient Prescription Retrieved Successfully",
  SUCCESS_PATIENT_PRESCRIPTION_UPDATE: "Patient Prescription Updated Successfully",
  SUCCESS_CODE_PATIENT_PRESCRIPTION_DELETED: "Patient Prescription Deleted Successfully"

};

module.exports = appConfig;
