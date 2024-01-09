const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const token = require("../../middleware/token");
const Product = require("../model/userAddProductsModel");
const moment = require("moment");

const sendVerificationEmail = require("../../utils/emailVerification");
const sendResetPasswordEmail = require("../../utils/resetPasswordEmail");

const secretKey = "SecretKey1149";

//SignUp Logic
const signup = async (req, res) => {
  try {
    let { name, contact, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }
    let result = await bcrypt.genSalt(10, async function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        // returns hash
        console.log("hash", hash);
        password = hash;
        console.log("result", result);
        //OTP (token)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const newUser = new User({
          name,
          contact,
          email,
          password,
          otp,
        });
        await newUser.save();

        // Send verification email with OTP
        sendVerificationEmail(
          email,
          "Account Verification",
          otp
        );

        console.log("User Signed Up:", newUser);
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

//verifyEmail
const verifyEmail = async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    const { email, otp } = req.body;
    console.log("Received email and OTP for verification:", email, otp);

    const user = await User.findOne({ email, otp });
    console.log("Found user:", user);

    if (user) {
      user.verified = true;
      await user.save();
      console.log("User verification successful:", user);
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

//Login Logic
const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("Received login request for email:", email);
  try {
    const user = await User.findOne({ email });
    console.log("Found user:", user);

    if (user?.verified) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      console.log("Received login request for email:", email);
      console.log("Found user:", user);
      console.log("Password Match (Input):", password);
      console.log("Password Match (Database):", user);
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
        { userId: user._id, email: user.email },
        secretKey,
        {
          expiresIn: "19d",
        }
      );
      return res
        .status(200)
        .json({ success: true, message: "Login Successful", token ,userDetail:user});
    } else {
      return res.status(401).json({
        success: false,
        message: "User not verified !!",
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

// Forget Password
const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.send(404).json({ success: false, message: "User not found" });
    }
    const resetOTP = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOTP = resetOTP;
    await user.save();

    sendResetPasswordEmail(email, 
        "Reset Password Otp",
        resetOTP);

    return res.status(200).json({ message: "Reset OTP sent successfullly" });
  } catch (error) {
    console.error("Error sending reset OTP", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    const decodedToken = jwt.verify(resetToken, 'secretKey')
    const user = await User.findOne({ 
      email : decodedToken.email,
      resetToken,
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid or expired Token" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = null;

    await user.save();
    console.log("User New Password:", newPassword);
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

// User Data
const getUserData = async (req, res) => {
  try {
    const decoded = req.decoded;
    console.log("decoded", decoded)
    const user = await User.findOne({email:decoded.email});
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


//Update User Data
const updateUser = async (req, res) => {
  try {
    const userId = req.decoded.userId;
    const updatedUser = req.body;

    await User.findByIdAndUpdate(userId, updatedUser, { new: true });

    res.status(200).json({ success: true, message: "User details updated successfully" });
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

 

// Add User
const addUser = async (req, res) => {
  try {
    let { name, contact, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    let result = await bcrypt.genSalt(10, async function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        password = hash;

        // Set verified to true for all users added by admin
        const verified = true;

        const newUser = new User({
          name,
          contact,
          email,
          password,
          verified,
        });

        await newUser.save();

        console.log("User Add:", newUser);
        return res
          .status(201)
          .json({ success: true, message: "User Add Successful", user: newUser });
      });
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Get all Users Data
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'User' });
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

//Get user by ID
const getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// Update user data by Id
const updateUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const updatedUserData = req.body;
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    await User.findByIdAndUpdate(userId, updatedUserData, { new: true });
    res.status(200).json({ success: true, message: "User details updated successfully" });
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete user by ID
const deleteUserById = async(req,res) =>{
  try{
    const userId = req.params.userId;
    await User.findByIdAndDelete(userId);
    res.status(200).json({
      success: true, message: "User deleted Successfully",
    });
  } catch(error){
    console.error("Error deleting User:", error);
    res.status(500).json({error: "Internal Server Error"});
  }
};

// AddProducts
const addProducts = async (req, res) => {
  try {
    const { name, previousPrice, price, description, category, sizes } = req.body; 
    const image = req.file;

    const newProduct = new Product({
      name,
      previousPrice,
      price,
      image: image.path,
      description, 
      category, 
      sizes,
    });

    await newProduct.save();
    console.log("New Product:", newProduct);

    res.status(201).json({
      success: true,
      message: "Add New Product Successfully",
      newProduct,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//  //View all products
// const viewProducts = async (req, res) => {
//   try {
//     const page = req.query.page || 1;
//     const limit = 8;
//     const skip = (page - 1) * limit;

//     let  search  = req.query.search||"";
//     let products;

//     products = await Product.find({"name": {"$regex": search, $options: "i"}})
//       .skip(skip)
//       .limit(limit);

//    return res.status(200).json(products);
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// View all products
const viewProducts = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = 8;
    const skip = (page - 1) * limit;
    let search = req.query.search || "";
    let products;
    products = await Product.find({
      name: { $regex: search, $options: "i" },
    })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments({
      name: { $regex: search, $options: "i" },
    });
    return res
      .status(200)
      .json({ products, totalPages: Math.ceil(totalProducts / limit) });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//Get Product By Id
const getProductById = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }  
};

//getUserGraphData
const monthlySignupData = async (req, res) => {
  try {
    const monthlyData = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          count: 1,
        },
      },
      { $sort: { year: 1, month: 1 } },
    ]);

    res.json(monthlyData);
  } catch (error) {
    console.error('Error fetching monthly signup data:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};


module.exports = {
  signup, login, getUserData, verifyEmail, forgetPassword, resetPassword, updateUser, getAllUsers, addUser, addProducts, viewProducts, getProductById, 
  getUserById, updateUserById, deleteUserById, monthlySignupData,
};
