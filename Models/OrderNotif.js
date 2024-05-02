const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var orderNotifSchema = new mongoose.Schema({
    senderName: {
    type: String,
    required: true,
  },
  receiverName: {
    type: String,
    required: true,
  },
  orderStatus: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
});

//Export the model
module.exports = mongoose.model("OredrNotif", orderNotifSchema);