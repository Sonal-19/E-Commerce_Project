const Notification = require('../model/notificationModel');

const notificationController = {
    getNotification:async(req,res)=>{
        try{
            const notifications = await Notification.find();
            res.status(200).json(notifications);
        }catch(error){
            console.error("Error fetching notifications",error);
            res.status(500).json({message:"Error fetching all notifications"});
        }
    },

    markNotificationAsRead: async(req,res)=>{
        try{
            const notificationId = req.params.id;
            const notification = await Notification.findByIdAndUpdate(
                notificationId,
                {read:true},
                {new:true}
            );
            res.status(200).json(notification);
        }catch(error){
            console.error("Error marking notification as read",error);
            res.status(500).json({message:"error marking notification as  read"});
        }
    },

    getunreadNotification:async(req,res)=>{
        try{
            const unreadNotifications = await Notification.find({read:false});
            res.status(200).json(unreadNotifications);
        }catch(error){
            console.error("error fetching unread notifications",error);
            res.status(500).json({message:"error fetchinh unread notifiactions"});
        }
    }
}

module.exports = notificationController;