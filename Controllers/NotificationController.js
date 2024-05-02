/* const Notification = require('../Models/Notification');

// Fonction pour émettre des notifications via Socket.IO
const sendNotification = (io, userId, message) => {
  // Créez une nouvelle notification et sauvegardez-la dans la base de données
  const notification = new Notification({ userId, message, seen: false });

  notification.save((err) => {
    if (err) {
      console.error("Erreur lors de la sauvegarde de la notification", err);
    } else {
      // Émettez la notification au client spécifique
      io.to(userId).emit("notification", { userId, message });
    }
  });
};

// Fonction pour mettre à jour une notification comme vue
const updateNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const notification = await Notification.findById(notificationId);
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification non trouvée' });
    }

    notification.seen = true;
    await notification.save();

    res.status(200).json({ message: 'Notification marquée comme vue' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la notification', error);
    res.status(500).json({ error: 'Erreur du serveur' });
  }
};

module.exports = {
  sendNotification,
  updateNotification,
};
 */