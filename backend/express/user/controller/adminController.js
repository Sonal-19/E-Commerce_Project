const Admin = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const token = require("../../middleware/token");
//const Product = require("../model/userAddProductsModel");

const sendVerificationEmail = require("../../utils/emailVerification");
const sendResetPasswordEmail = require("../../utils/resetPasswordEmail");

const secretKey = "SecretKey1149";

//Admin Signup
const signupAdmin = async (req, res) => {
    try {
      let { name, contact, email, password } = req.body;
      const image = req.file ? req.file.path : null;
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(409)
          .json({ success: false, message: "Admin already exists" });
      }
      let result = await bcrypt.genSalt(10, async function (err, salt) {
        bcrypt.hash(password, salt, async function (err, hash) {
          // returns hash
          console.log("hash", hash);
          password = hash;
          console.log("result", result);
          //OTP (token)
          const otp = Math.floor(100000 + Math.random() * 900000).toString();
          const newAdmin = new Admin({
            name,
            contact,
            email,
            password,
            image: image,
            otp,
            role:"Admin"
          });
          await newAdmin.save();

          sendVerificationEmail(
            email,
            "Account Verification",
            otp
          );
  
          console.log("Admin Signed Up:", newAdmin);
          return res
            .status(201)
            .json({ success: true, message: "SignUp Successful", otp });
        });
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };

//verify Admin Email
const verifyAdminEmail = async (req, res) => {
    try {
      console.log("Received request body:", req.body);
      const { email, otp } = req.body;
      console.log("Received email and OTP for verification:", email, otp);
  
      const admin = await Admin.findOne({ email, otp });
      console.log("Found admin:", admin);
  
      if (admin) {
        admin.verified = true;
        await admin.save();
        console.log("Admin verification successful:", admin);
        return res
          .status(200)
          .json({ success: true, message: "Email verification successful" });
      } else {
        console.log("Incorrect OTP. Verification failed.");
        return res
          .status(401)
          .json({ success: false, message: "Incorrect OTP. Please try again." });
      }
    } catch (error) {
      console.error("Error during email verification:", error);
      return res
        .status(500)
        .json({
          success: false,
          message: "Internal server error during email verification",
        });
    }
  };

// Admin Login 
const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    console.log("Received login request for email:", email);
    try {
      const admin = await Admin.findOne({ email });
      console.log("Found admin:", admin);
  
      if (admin?.verified && admin.role=="Admin") {
        const passwordMatch = await bcrypt.compare(password, admin.password);
        console.log("Received login request for email:", email);
        console.log("Found admin:", admin);
        console.log("Password Match (Input):", password);
        console.log("Password Match (Database):", admin);
        console.log("Password Match (Result):", passwordMatch);
  
        if (!passwordMatch) {
          console.log("Incorrect Password for email:", email);
          return res.status(401).json({
            success: false,
            message: "Incorrect Password. Please try again.",
          });
        }
        console.log("Login successful for email:", email);
  
        //JWT Token
        const token = jwt.sign(
          { adminId: admin._id, email: admin.email },
          secretKey,
          {
            expiresIn: "19d",
          }
        );
        return res
          .status(200)
          .json({ success: true, message: "Login Successful", token,userDetail:admin });
      } else {
        return res.status(401).json({
          success: false,
          message: "UnAuthorized",
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "An error occured while logging in, Please try again later",
      });
    }
  };

//Forget Admin Password
const forgetAdminPassword = async (req, res) => {
    try {
      const { email } = req.body;
      const admin = await Admin.findOne({ email });
  
      if (!admin) {
        return res.send(404).json({ success: false, message: "Admin not found" });
      }
      const resetOTP = Math.floor(100000 + Math.random() * 900000).toString();
      admin.resetOTP = resetOTP;
      await admin.save();
  
      sendResetPasswordEmail(email, 
          "Reset Password Otp",
          resetOTP);
  
      return res.status(200).json({ message: "Reset OTP sent successfullly" });
    } catch (error) {
      console.error("Error sending reset OTP", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

// Reset Admin Password
const resetAdminPassword = async (req, res) => {
    try {
      const { resetToken, newPassword } = req.body;
      const decodedToken = jwt.verify(resetToken, 'secretKey')
      const admin = await Admin.findOne({ 
        email : decodedToken.email,
        resetToken,
      });
      if (!admin) {
        return res.status(401).json({ message: "Invalid or expired Token" });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      admin.password = hashedPassword;
      admin.resetToken = null;
  
      await admin.save();
      console.log("Admin New Password:", newPassword);
      return res.status(200).json({ message: "Reset Password successfullly" });
  
    } catch (error) {
      console.error("Error during reset password:", error);
      return res
        .status(500)
        .json({
          success: false,
          message: "Internal server error during reset password",
        });
    }
  };

//Get Admin Data
const getAdminData = async (req, res) => {
    try {
      const decoded = req.decoded;
      console.log("decoded", decoded)
      const admin = await Admin.findOne({email:decoded.email});
      if (!admin) {
        return res
          .status(404)
          .json({ success: false, message: "Admin not found" });
      }
      return res.status(200).json({ success: true, admin });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };

//Update Admin Data
const updateAdmin = async (req, res) => {
  try {
    const adminId = req.decoded.adminId;
    const updatedAdmin = req.body;
    updatedAdmin.image = req.file ? req.file.path : null;

    await Admin.findByIdAndUpdate(adminId, updatedAdmin, { new: true });

    res.status(200).json({ success: true, message: "Admin details updated successfully" });
  } catch (error) {
    console.error("Error updating admin details:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


//Get All Admins Data
const getAllAdmins = async(re,res) =>{
  try{
    const admins = await Admin.find({role: 'Admin'});
    res.status(200).json({success:true, admins});
  } catch(error){
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}


//Get Admin by ID
const getAdminById = async(req,res) =>{
  try{
    const adminId = req.params.adminId;
    const admin = await Admin.findById(adminId);
    res.status(200).json(admin);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

//Update Admin data by Id
const updateAdminById = async(req,res) =>{
  try{
    const adminId = req.params.adminId;
    const updatedAdminData = req.body;
    updatedAdminData.image = req.file ? req.file.path : null;
    const existingAdmin = await Admin.findById(adminId);
    if (!existingAdmin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }
    await Admin.findByIdAndUpdate(adminId, updatedAdminData, { new: true });
    res.status(200).json({ success: true, message: "Admin details updated successfully" });
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//Delete Admin by Id
const deleteAdminById = async(req, res) =>{
  try{
    const adminId = req.params.adminId;
    await Admin.findByIdAndDelete(adminId);
    res.status(200).json({
      success: true, message: "User deleted Successfully",
    });
  } catch(error){
    console.error("Error deleting User:", error);
    res.status(500).json({error: "Internal Server Error"});
  }
}


// //Add Products
// const addProducts = async (req, res) => {
//     try {
//       const { name, price, description, category } = req.body; 
//       const image = req.file;
  
//       const newProduct = new Product({
//         name,
//         price,
//         image: image.path,
//         description, 
//         category, 
//       });
  
//       await newProduct.save();
//       console.log("New Product:", newProduct);
  
//       res.status(201).json({
//         success: true,
//         message: "Add New Product Successfully",
//         newProduct,
//       });
//     } catch (error) {
//       console.error("Error adding product:", error);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   };


module.exports = {
    signupAdmin, loginAdmin, verifyAdminEmail, forgetAdminPassword, resetAdminPassword, getAdminData, updateAdmin,
    getAllAdmins, getAdminById, updateAdminById, deleteAdminById,
   
  }