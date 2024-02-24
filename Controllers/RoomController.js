const Room = require('../models/Room');

const createRoom = async (req, res) => {
    try {
        const { name, capacity } = req.body;
        const newRoom = new Room({
            name,
            capacity
        });
        const savedRoom = await newRoom.save();
        res.status(201).json(savedRoom);
    } catch (error) {
        console.error("Erreur lors de la création de la salle :", error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la création de la salle." });
    }
};


const getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.status(200).json(rooms);
    } catch (error) {
        console.error("Erreur lors de la récupération des salles :", error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des salles." });
    }
};


const getRoomById = async (req, res) => {
    try {
        const { id } = req.params;
        const room = await Room.findById(id);
        if (!room) {
            return res.status(404).json({ message: "Salle non trouvée." });
        }
        res.status(200).json(room);
    } catch (error) {
        console.error("Erreur lors de la récupération de la salle :", error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la récupération de la salle." });
    }
};

const updateRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, capacity } = req.body;

        const updatedRoom = await Room.findByIdAndUpdate(id, { name, capacity }, { new: true });
        if (!updatedRoom) {
            return res.status(404).json({ message: "Salle non trouvée." });
        }
        res.status(200).json({ message: "Salle mise à jour avec succès.", updatedRoom });
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la salle :", error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la mise à jour de la salle." });
    }
};

const deleteRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRoom = await Room.findByIdAndDelete(id);
        if (!deletedRoom) {
            return res.status(404).json({ message: "Salle non trouvée." });
        }
        res.status(200).json({ message: "Salle supprimée avec succès." });
    } catch (error) {
        console.error("Erreur lors de la suppression de la salle :", error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la suppression de la salle." });
    }
};

module.exports = {
    createRoom,
    getAllRooms,
    getRoomById,
    updateRoom,
    deleteRoom
};
