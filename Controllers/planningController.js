const Planning = require('../Models/Planning');
const mongoose = require('mongoose');
const User = require('../Models/User');
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

const areStudentsAvailable = async (req, res) => {
    try {
        const { studentIds, date, startTime, endTime } = req.params;
        const student = await User.findById(studentIds);
        const classroom = student.classroom;

        const query = {
            date,
            $or: [
                { $and: [{ studentIds: studentIds }, { classroomId: { $exists: false } }] },
                { $and: [{ classroomId: classroom }, { studentIds: { $exists: false } }] }
            ],
            $or: [
                { startDate: { $lt: endTime }, endDate: { $gt: startTime } },
                { startDate: { $eq: startTime }, endDate: { $eq: endTime } }
            ]
        };

        const existingPlanningForStudents = await Planning.findOne(query);
        if (existingPlanningForStudents) {
            return res.json({ areStudentsAvailable: false });
        }

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
    try {
        const {  date, startDate, endDate, roomId, teacherId, type,classroomId } = req.body;
        let newPlanning;

        if (type === "instrument") {
            const { studentIds } = req.body;
            newPlanning = new Planning({
               
                date,
                startDate,
                endDate,
                type,
                roomId,
                teacherId,
                studentIds,
            });
        };
        if (type === "solfège")  {
            newPlanning = new Planning({
                
                date,
                startDate,
                endDate,
                type,
                roomId,
                teacherId,
                classroomId,
            });
            
        }

        const savedPlanning = await newPlanning.save();
        res.status(201).json(savedPlanning);
    } catch (error) {
        console.error("Error creating planning:", error);
        res.status(500).json({ message: "An error occurred while creating the planning." });
    }
};

////////////// Read ////////////////////////////////////////////
const getAllPlannings = async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Numéro de la page, par défaut 1
    const limit = parseInt(req.query._limit) ; // Limite d'éléments par page, par défaut 10
    
    // Logique pour récupérer les plannings en fonction de la page et de la limite
    try {
        const plannings = await Planning.find()
            .skip((page - 1) * limit)
            .limit(limit);
 
            const totalDocuments = await Planning.countDocuments();
        res.json({plannings,totalDocuments}
            
        );
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
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
        
        const {  date, startDate, endDate, roomId, teacherId, type,classroomId } = req.body;
        let updatedPlanning;

        if (type === "instrument") {
            const { studentIds } = req.body;
            updatedPlanning = await Planning.findByIdAndUpdate(id, {
            
                date,
                startDate,
                endDate,
                roomId,
                teacherId,
                studentIds
            }, { new: true });
        };
        if (type === "solfège")  {
            updatedPlanning = await Planning.findByIdAndUpdate(id, {
            
                date,
                startDate,
                endDate,
                roomId,
                teacherId,
                classroomId
            }, { new: true });
            
        }

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
const getPlanningWithStudentIds = async (req, res) => {
    try {
        // Recherchez les plannings avec le champ studentIds
        const planningsWithStudentIds = await Planning.find({ studentIds: { $exists: true } });

        res.status(200).json(planningsWithStudentIds);
    } catch (error) {
        console.error("Erreur lors de la recherche des plannings :", error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la recherche des plannings." });
    }
};
const getPlanningWithTeacherId = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const planningsWithTeacherId = await Planning.find({ teacherId: new mongoose.Types.ObjectId(teacherId)});

        res.status(200).json(planningsWithTeacherId);
    } catch (error) {
        console.error("Erreur lors de la recherche des plannings :", error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la recherche des plannings." });
    }
};
///////////// SaveMorePlannings after auto plannning  ///////////////////
const SaveMorePlannings = async (req, res) => {
    try {
        const { plannings } = req.body;

        if (!plannings || !Array.isArray(plannings)) {
            return res.status(400).json({ error: 'Invalid data' });
        }

        // Enregistrer les plannings dans la base de données
        const savedPlannings = await Planning.insertMany(plannings);

        res.status(200).json({ savedPlannings });
    } catch (error) {
        console.error("Error saving plannings:", error);
        res.status(500).json({ error: 'Internal server error' });
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
    areStudentsAvailable,
    getPlanningWithStudentIds,
    getPlanningWithTeacherId,
    SaveMorePlannings

};
