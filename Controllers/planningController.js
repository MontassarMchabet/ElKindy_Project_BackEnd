const Planning = require('../Models/Planning');
const Room = require('../Models/Room');
const User = require('../Models/User');
const validatePlanning = require('./validatePlanning');
//////////////////////// create ///////////////////

const isRoomAvailable = async (req, res) => {
    try {
        const { roomId, date, startTime, endTime } = req.params;

        // Recherchez les plannings existants dans la salle pour la date et l'heure spécifiées
        const existingPlanningInRoom = await Planning.findOne({
            roomId,
            date,
            $or: [
                { startDate: { $lt: endTime }, endDate: { $gt: startTime } },
                { startDate: { $eq: startTime }, endDate: { $eq: endTime } }
            ]
        });

        // Vérifiez si un planning existe dans la salle pour l'heure spécifiée
        const isRoomAvailable = !existingPlanningInRoom;

        // Envoyez la réponse appropriée en fonction de la disponibilité de la salle
        res.json({ isRoomAvailable });
    } catch (error) {
        console.error('Error checking room availability:', error);
        // Gérer les erreurs de requête en renvoyant une réponse avec un statut d'erreur
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
/* 
const areStudentsAvailable = async (studentIds, date, startDate, endDate) => {
    for (const studentId of studentIds) {
        const existingPlanningForStudent = await Planning.findOne({
            date,
            studentIds: studentId,
            $or: [
                { startDate: { $lt: endDate }, endDate: { $gt: startDate } },
                { startDate: { $eq: startDate }, endDate: { $eq: endDate } }
            ]
        });
        if (existingPlanningForStudent) {
            return false;
        }
    }
    return true;
} */;
const areStudentsAvailable = async (req, res) => {
    try {
        const { studentIds, date, startTime, endTime } = req.params;
        const studentIdsArray = studentIds.split(',');
        console.log(studentIdsArray);

        for (const studentId of studentIdsArray) {
            const existingPlanningForStudent = await Planning.findOne({
                date,
                studentIds: studentId,
                $or: [
                    { startDate: { $lt: endTime }, endDate: { $gt: startTime } },
                    { startDate: { $eq: startTime }, endDate: { $eq: endTime } }
                ]
            });
            if (existingPlanningForStudent) {
                return res.json({ areStudentsAvailable: false });
            }
        }
        // Si aucune planification existante n'est trouvée pour aucun des étudiants
        return res.json({ areStudentsAvailable: true });
       
    } catch (error) {
        console.error('Error checking student availability:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};



const isTeacherAvailable = async (req, res) => {
    try {
        const { teacherId, date, startTime, endTime } = req.params;
        const existingPlanningForTeacher = await Planning.findOne({
            date,
            teacherId,
            $or: [
                { startDate: { $lt: endTime }, endDate: { $gt: startTime } },
                { startDate: { $eq: startTime }, endDate: { $eq: endTime } }
            ]
        });
        
        const isTeacherAvailable = !existingPlanningForTeacher;

        // Envoyez la réponse appropriée en fonction de la disponibilité de la salle
        res.json({ isTeacherAvailable });
    } catch (error) {
        console.error('Error checking teacher availability:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const createPlanning = async (req, res) => {
    const session = await Planning.startSession();
    session.startTransaction();
    try {
        const { courseId, date, startDate, endDate, roomId, teacherId, studentIds } = req.body;

       /*  const isRoomAvailableResult = await isRoomAvailable(roomId, date, startDate, endDate);
        if (!isRoomAvailableResult) {
            return res.status(400).json({ message: "La salle de cours est déjà réservée à ce moment-là." });
        } */

      /*   const areStudentsAvailableResult = await areStudentsAvailable(studentIds, date, startDate, endDate);
        if (!areStudentsAvailableResult) {
            return res.status(400).json({ message: "Certains étudiants sont déjà occupés à ce moment-là." });
        } */

        /* const isTeacherAvailableResult = await isTeacherAvailable(teacherId, date, startDate, endDate);
        if (!isTeacherAvailableResult) {
            return res.status(400).json({ message: "L'enseignant est déjà occupé à ce moment-là." });
        } */
         // Validation du nombre d'heures d'étude par semaine
        /*  const isValidPlanning = await validatePlanning(studentIds,courseId, date, startDate, endDate);
         if (!isValidPlanning) {
             return res.status(400).json({ message: "Le nombre d'heures d'étude par semaine est dépassé pour cet utilisateur." });
         } */
        const newPlanning = new Planning({
            courseId,
            date,
            startDate,
            endDate,
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
        const { courseId, date, startDate, endDate, roomId, teacherId, studentIds } = req.body;

        // Vérifier la disponibilité de la salle de cours
        const isRoomAvailable = await isStudentsAndTeacherAvailable(roomId, date, startDate, endDate, studentIds, teacherId);
        if (!isRoomAvailable) {
            return res.status(400).json({ message: "La salle de cours est déjà réservée à ce moment-là." });
        }

        // Mettre à jour le planning
        const updatedPlanning = await Planning.findByIdAndUpdate(id, {
            courseId,
            date,
            startDate,
            endDate,
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
    updatePlanning,
    isRoomAvailable,
    isTeacherAvailable,
    areStudentsAvailable

};
