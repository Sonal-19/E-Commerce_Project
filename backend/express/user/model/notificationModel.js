const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  content: String,
  type: {
    type: Number,
    required: true,
    enum: [0, 1, 2, 3, 4] //0-contact, 1-product, 2-user, 3-admin, 4-blog
  },
  read: {
    type:Boolean,
    default:false,
  }
}
,{ timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
