// routes/users.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const token = require('../middleware/token');
const userController = require("../user/controller/userController");
const cartController = require('../user/controller/cartController');
const wishlistController = require('../user/controller/wishlistController');

const adminController = require('../user/controller/adminController');
const productController = require('../user/controller/productController');

const footerController = require('../user/controller/footerController');
const blogController = require('../user/controller/blogController');
const notificationController = require('../user/controller/notificationController');

// Multer
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './upload');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + "--" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Routes
//user
router.post("/api/signup", userController.signup);
//router.post("/api/addUser", userController.signup);
router.post("/api/addUser",token.verify, userController.addUser);
router.post("/api/login", userController.login);
router.post("/api/emailVerification", userController.verifyEmail);
router.post("/api/forget-password", userController.forgetPassword);
router.post("/api/resetpassword", userController.resetPassword);
router.get("/api/user", token.verify, userController.getUserData);
router.put("/api/user", token.verify, userController.updateUser);
router.get("/api/monthlySignupData", token.verify, userController.monthlySignupData);

//router.post("/api/addproducts", upload.single('image'), token.verify, userController.addProducts);
router.get("/api/viewproducts", userController.viewProducts);
router.get("/api/viewallproducts", productController.viewAllProducts);
router.get("/api/viewproducts/:productId", userController.getProductById);
router.post("/api/addToCart", token.verify, cartController.addToCart);
router.get("/api/getCart", token.verify, cartController.getCart);
router.get("/api/getAllCart", token.verify, cartController.getAllCart);
router.delete("/api/deleteFromCart/:productId", token.verify, cartController.deleteFromCart);
router.put("/api/updateCartItem/:productId", token.verify, cartController.updateCartItemQuantity);
router.put("/api/updateCartItemSize/:productId", token.verify, cartController.updateCartItemSize);
router.post('/api/addToWishlist', token.verify, wishlistController.addToWishList);
router.get("/api/getWishlist", token.verify, wishlistController.getWishlist);
router.get("/api/getAllWishlist", token.verify, wishlistController.getAllWishlist);
router.delete("/api/removeFromWishlist/:productId", token.verify, wishlistController.removeFromWishlist);
router.get("/api/monthlyProductData", token.verify, productController.monthlyProductData);
router.get("/api/getLatestProducts", token.verify, productController.getLatestProducts);

//admin
//router.post("/api/signupAdmin",upload.single("image"), adminController.signupAdmin);
router.post("/api/signupAdmin", upload.single("image"), adminController.signupAdmin);
router.post("/api/addAdmin", adminController.signupAdmin);
router.post("/api/loginAdmin", adminController.loginAdmin);
router.post("/api/emailVerificationAdmin", adminController.verifyAdminEmail);
router.post("/api/forget-password-admin", adminController.forgetAdminPassword);
router.post("/api/resetpasswordadmin", adminController.resetAdminPassword);
router.get("/api/admin", token.verify, adminController.getAdminData);
router.put("/api/admin", upload.single("image"), token.verify, adminController.updateAdmin);
router.post("/api/addproducts", upload.single('image'),  token.verify, productController.addProducts);
//router.get("/api/viewproducts/:productId", token.verify, productController.getProductById);
router.put("/api/editproduct/:productId",upload.single("image"), productController.editProduct);
router.delete("/api/deleteproduct/:productId", productController.deleteProduct );
router.get("/api/allAdmins", token.verify, adminController.getAllAdmins);
router.get("/api/getAdminById/:adminId", token.verify, adminController.getAdminById);
router.put('/api/updateAdminById/:adminId', upload.single('image'), token.verify, adminController.updateAdminById);
router.delete("/api/deleteAdminById/:adminId", token.verify, adminController.deleteAdminById);

router.get("/api/allUsers", token.verify, userController.getAllUsers);
router.get("/api/getUserById/:userId", token.verify, userController.getUserById);
router.put("/api/updateUserById/:userId", token.verify, userController.updateUserById);
router.delete("/api/deleteUserById/:userId", token.verify, userController.deleteUserById);

router.post("/api/contactus", token.verify, footerController.contactUs);
router.get("/api/getAllContactForms", token.verify, footerController.getAllContactFormSubmission);
router.get("/api/getContactFormDetailById/:contactFormId", token.verify, footerController.getContactFormDetailById);
router.delete("/api/deleteContactFormById/:contactFormId", token.verify, footerController.deleteContactFormById);
router.get("/api/getNotification", token.verify, notificationController.getNotification);
router.get("/api/getunreadNotification",token.verify, notificationController.getunreadNotification);
router.patch("/api/readNotification/:id/read",token.verify, notificationController.markNotificationAsRead);

router.get("/api/getCustomerPolicy", footerController.getCustomerPolicy);
router.post('/api/addCustomerPolicy', token.verify, footerController.addCustomerPolicy);

router.post("/api/addblog", upload.single('image'),  token.verify, blogController.addBlog);
router.get("/api/getBlog", blogController.getBlog);
router.get("/api/getBlogById/:blogId", blogController.getBlogById);

router.put("/api/editBlog/:blogId",upload.single("image"), blogController.editBlog);
router.delete("/api/deleteBlog/:blogId", blogController.deleteBlog);

router.post("/api/like/:blogId", token.verify, blogController.likeBlog);
router.post("/api/like/:blogId", token.verify, blogController.likeBlog);
router.post("/api/comment/:blogId", token.verify, blogController.addComment);
router.put("/api/editcomment/:commentId", token.verify, blogController.editComment);
router.delete("/api/deletecomment/:commentId", token.verify, blogController.deleteComment);


module.exports = router;

