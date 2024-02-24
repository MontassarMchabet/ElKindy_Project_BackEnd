const Planning = require('../models/Planning');
const Room = require('../models/Room');
const User = require('../models/UsersP');

//////////////////////// create ///////////////////

const isStudentsAndTeacherAvailable = async (roomId, date, startTime, endTime, studentIds, teacherId) => {
    // Vérifier la disponibilité de la salle
    const existingPlanningInRoom = await Planning.findOne({
        roomId,
        date,
        $or: [
            { startTime: { $lt: endTime }, endTime: { $gt: startTime } }, // Vérifier si les plages horaires se chevauchent
            { startTime: { $eq: startTime }, endTime: { $eq: endTime } } // Vérifier si les plages horaires sont les mêmes
        ]
    });
    if (existingPlanningInRoom) {
        return res.status(400).json({ message: "La salle de cours est déjà réservée à ce moment-là." });
    }

    // Vérifier la disponibilité des étudiants
    for (const studentId of studentIds) {
        const existingPlanningForStudent = await Planning.findOne({
            date,
            studentIds: studentId,
            $or: [
                { startTime: { $lt: endTime }, endTime: { $gt: startTime } }, // Vérifier si les plages horaires se chevauchent
                { startTime: { $eq: startTime }, endTime: { $eq: endTime } } // Vérifier si les plages horaires sont les mêmes
            ]
        });
        if (existingPlanningForStudent) {
            return res.status(400).json({ message: "L'étudiant est déjà occupé à ce moment-là." });
        }
    }

    // Vérifier la disponibilité de l'enseignant
    const existingPlanningForTeacher = await Planning.findOne({
        date,
        teacherId,
        $or: [
            { startTime: { $lt: endTime }, endTime: { $gt: startTime } }, // Vérifier si les plages horaires se chevauchent
            { startTime: { $eq: startTime }, endTime: { $eq: endTime } } // Vérifier si les plages horaires sont les mêmes
        ]
    });
    if (existingPlanningForTeacher) {
        return res.status(400).json({ message: "L'enseignant est déjà occupé à ce moment-là." });
    }

    return true; // pas PRB de planification trouvé
};


const createPlanning = async (req, res) => {
    try {
        // Validation des données d'entrées 
        const { courseId, date, startTime, endTime, roomId, teacherId, studentIds } = req.body;

        // Vérifier la disponibilité de la salle 
        const isRoomAvailable = await isStudentsAndTeacherAvailable(roomId, date, startTime, endTime, studentIds, teacherId);
        if (!isRoomAvailable) {
            return res.status(400).json({ message: "La salle de cours est déjà réservée à ce moment-là." });
        }

        // Créer le planning
        const newPlanning = new Planning({
            courseId,
            date,
            startTime,
            endTime,
            roomId,
            teacherId,
            studentIds
        });

        // Sauvegarder le planning dans BD
        const savedPlanning = await newPlanning.save();

        res.status(201).json(savedPlanning);
    } catch (error) {
        console.error("Erreur lors de la création du planning :", error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la création du planning." });
    }
};
////////////// Read ////////////////////////////////////////////
const getAllPlannings = async (req, res) => {
    try {
        // Récupérer tous les plannings 
        const plannings = await Planning.find();

        res.status(200).json(plannings);
    } catch (error) {
        console.error("Erreur lors de la récupération des plannings :", error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des plannings." });
    }
};
///////////// getById ///////////////////
const getPlanningById = async (req, res) => {
    try {
        // Récupérer l'ID du planning à partir des paramètres de la requête
        const { id } = req.params;

        // Recherche du planning dans la base de données par son ID
        const planning = await Planning.findById(id);

        // Vérifier si le planning existe
        if (!planning) {
            return res.status(404).json({ message: "Planning non trouvé." });
        }

        res.status(200).json(planning);
    } catch (error) {
        console.error("Erreur lors de la récupération du planning par ID :", error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la récupération du planning par ID." });
    }
};
//////////////////deletePlanning/////////////////////
const deletePlanning = async (req, res) => {
    try {
        // Récupérer l'ID du planning à supprimer à partir des paramètres de la requête
        const { id } = req.params;

        // Recherche du planning dans la base de données par son ID et suppression
        const deletedPlanning = await Planning.findByIdAndDelete(id);

        // Vérifier si le planning a été trouvé et supprimé
        if (!deletedPlanning) {
            return res.status(404).json({ message: "Planning non trouvé." });
        }

        res.status(200).json({ message: "Planning supprimé avec succès.", deletedPlanning });
    } catch (error) {
        console.error("Erreur lors de la suppression du planning :", error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la suppression du planning." });
    }
};
///////////////////////// updatePlanning ////////////////////////
const updatePlanning = async (req, res) => {
    try {
        // Récupérer l'ID du planning à mettre à jour à partir des paramètres de la requête
        const { id } = req.params;
        
        // Validation des entrées (ajoutez votre logique ici)
        const { courseId, date, startTime, endTime, roomId, teacherId, studentIds } = req.body;

        // Vérifier la disponibilité de la salle de cours
        const isRoomAvailable = await isStudentsAndTeacherAvailable(roomId, date, startTime, endTime, studentIds, teacherId);
        if (!isRoomAvailable) {
            return res.status(400).json({ message: "La salle de cours est déjà réservée à ce moment-là." });
        }

        // Mettre à jour le planning
        const updatedPlanning = await Planning.findByIdAndUpdate(id, {
            courseId,
            date,
            startTime,
            endTime,
            roomId,
            teacherId,
            studentIds
        }, { new: true });

        // Vérifier si le planning a été trouvé et mis à jour
        if (!updatedPlanning) {
            return res.status(404).json({ message: "Planning non trouvé." });
        }

        res.status(200).json({ message: "Planning mis à jour avec succès.", updatedPlanning });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du planning :", error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la mise à jour du planning." });
    }
};
module.exports = {
    createPlanning,
    getAllPlannings,
    getPlanningById,
    deletePlanning,
    updatePlanning
};
