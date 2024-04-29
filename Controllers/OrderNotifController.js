const OrderNotif = require("../Models/OrderNotif");
const asynHandler = require("express-async-handler");

const createNotif = asynHandler(async (req, res) => {
  try {
    const newNotif = await OrderNotif.create(req.body);
    res.json(newNotif);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllNotifs = asynHandler(async (req, res) => {
    try {
        const allnotifs = await OrderNotif.find();
        res.json(allnotifs);
    } catch (error) {
        throw new Error(error);
    }
});

const updateNotifStatus = asynHandler(async (req, res) => {
    try {
        const notifs = await OrderNotif.find();
        // Loop through each notification and update its 'read' property
        for (let notif of notifs) {
            notif.read = req.body.read;
            await notif.save();
        }
        res.json({
            notifs
        });
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    createNotif,
    getAllNotifs,
    updateNotifStatus,
  };