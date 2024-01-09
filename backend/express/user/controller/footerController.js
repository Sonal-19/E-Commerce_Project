const Footer = require("../model/footerModel");
const ContactUs = require("../model/contactUsModel");
const Notification = require("../model/notificationModel");
// const User = require("../model/userModel");
// const token = require("../../middleware/token");
// const jwt = require("jsonwebtoken");

const {sendNotificationEmail} = require('../../utils/emailNotification');

const footerController = {
  // addCustomerPolicy: async (req, res) => {
  //   try {
  //     const { description,type } = req.body;
  //     let payload=req.body
  //     // console.log('payload', payload)
  //       const existingPolicy = await Footer.findOne({type:type});
  //       // console.log('description', description)
  //       if (existingPolicy) {
  //       const existingPolicy = await Footer.findByIdAndUpdate({_id:existingPolicy._id},payload);
  //         res.status(200).json({ message: 'Privacy Policy Updated' });
  //       } else {
  //         const newPrivacyPolicy = new Footer( payload );
  //         await newPrivacyPolicy.save();
  //         res.status(201).json({ message: 'Privacy Policy Saved' });
  //       }
  //     } catch (error) {
  //       console.error('Error saving policy', error);
  //       res.status(500).json({ message: 'Error saving policy' });
  //     }
  //   },

  addCustomerPolicy: async (req, res) => {
    try {
      const { description, type } = req.body;
      let payload = req.body;

      const existingPolicy = await Footer.findOne({ type: type });

      if (existingPolicy) {
        // Update the existing policy directly
        await Footer.findByIdAndUpdate({ _id: existingPolicy._id }, payload);
        res.status(200).json({ message: 'Privacy Policy Updated' });
      } else {
        // Create a new policy if it doesn't exist
        const newPrivacyPolicy = new Footer(payload);
        await newPrivacyPolicy.save();
        res.status(201).json({ message: 'Privacy Policy Saved' });
      }
    } catch (error) {
      console.error('Error saving policy', error);
      res.status(500).json({ message: 'Error saving policy' });
    }
  },

  getCustomerPolicy: async(req, res)=>{
    try{
      let {type}=req.query
      const policy = await Footer.findOne({type:type});
        if(policy){
          res.status(200).json({content: policy});
        }else{
          res.status(404).json({message: 'Privacy policy not found'});
        }
    }catch(error){
      console.error("Error getting provacy policy",error);
      res.status(500).json({message:"Error getting privacy policy"});
    }
  },

  contactUs: async (req, res) => {
    const { name, email, message } = req.body;
    try {
      let userId = req.decoded.userId;
      if (!userId) {
        return res.status(400).send("User ID is missing in the request.");
      }
      const newContactUs = new ContactUs({
        name,
        email,
        message,
      });
      await newContactUs.save();

      // Send email notification
      sendNotificationEmail({ name, email, message });

      // Save the notification
      const newNotification = new Notification({ content: "New Contact Form Add", type:0});
      await newNotification.save();

      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getAllContactFormSubmission: async(req, res)=>{
    try{
      const contactForms = await ContactUs.find().sort({createdAt:-1});
      res.status(200).json({contactForms});
    } catch(error){
      console.error("Error fetching contact form submissions", error);
      res.status(500).json({message: "Error fetching contact form submissions" })
    }
  },
  
  //Get Contact Form Detail by Id
  getContactFormDetailById : async(req, res)=>{
    try{
      const contactFormId = req.params.contactFormId;
      const contactForm = await ContactUs.findById(contactFormId);
        res.status(200).json(contactForm);
    } catch (error) {
      console.error('Error getting contact form details', error);
      res.status(500).json({ message: 'Error getting contact form details' });
    }
  },

  //Delete Contact Form Detail by Id
  deleteContactFormById: async(req,res)=>{
    try{
      const contactFormId = req.params.contactFormId;
      await ContactUs.findByIdAndDelete(contactFormId);
        res.status(200).json({success:true, message:"Contact form deleted Successfully"});
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

};

module.exports = footerController;