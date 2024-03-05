const Planning = require('../models/Planning');
const Room = require('../Models/Room');
const User = require('../models/UsersP');
const validatePlanning = require('./validatePlanning');
//////////////////////// create ///////////////////

const isRoomAvailable = async (roomId, date, startTime, endTime) => {
    const existingPlanningInRoom = await Planning.findOne({
        roomId,
        date,
        $or: [
            { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
            { startTime: { $eq: startTime }, endTime: { $eq: endTime } }
        ]
    });
    return !existingPlanningInRoom;
};

const areStudentsAvailable = async (studentIds, date, startTime, endTime) => {
    for (const studentId of studentIds) {
        const existingPlanningForStudent = await Planning.findOne({
            date,
            studentIds: studentId,
            $or: [
                { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
                { startTime: { $eq: startTime }, endTime: { $eq: endTime } }
            ]
        });
        if (existingPlanningForStudent) {
            return false;
        }
    }
    return true;
};

const isTeacherAvailable = async (teacherId, date, startTime, endTime) => {
    const existingPlanningForTeacher = await Planning.findOne({
        date,
        teacherId,
        $or: [
            { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
            { startTime: { $eq: startTime }, endTime: { $eq: endTime } }
        ]
    });
    return !existingPlanningForTeacher;
};

const createPlanning = async (req, res) => {
    const session = await Planning.startSession();
    session.startTransaction();
    try {
        const { courseId, date, startTime, endTime, roomId, teacherId, studentIds } = req.body;

        const isRoomAvailableResult = await isRoomAvailable(roomId, date, startTime, endTime);
        if (!isRoomAvailableResult) {
            return res.status(400).json({ message: "La salle de cours est déjà réservée à ce moment-là." });
        }

        const areStudentsAvailableResult = await areStudentsAvailable(studentIds, date, startTime, endTime);
        if (!areStudentsAvailableResult) {
            return res.status(400).json({ message: "Certains étudiants sont déjà occupés à ce moment-là." });
        }

        const isTeacherAvailableResult = await isTeacherAvailable(teacherId, date, startTime, endTime);
        if (!isTeacherAvailableResult) {
            return res.status(400).json({ message: "L'enseignant est déjà occupé à ce moment-là." });
        }
         // Validation du nombre d'heures d'étude par semaine
         const isValidPlanning = await validatePlanning(studentIds,courseId, date, startTime, endTime);
         if (!isValidPlanning) {
             return res.status(400).json({ message: "Le nombre d'heures d'étude par semaine est dépassé pour cet utilisateur." });
         }
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
        const savedPlanning = await newPlanning.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json(savedPlanning);
    } catch (error) {
        console.error("Erreur lors de la création du planning :", error);
        await session.abortTransaction();
        session.endSession();
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
