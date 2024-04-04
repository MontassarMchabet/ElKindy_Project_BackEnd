const Classroom = require('../Models/Classroom');
const createClassrom = async (req, res) => {
    try {
        const { name,level, capacity,users } = req.body;
        const newClassroom = new Classroom({
            name,
            level,
            capacity,
            users
        });
        const savedCourse = await newClassroom.save();
        res.status(201).json(savedCourse);
    } catch (error) {
        console.error("Erreur lors de la création du cours :", error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la création du cours." });
    }
};
const getAllclassroom = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Numéro de la page, par défaut 1
        const limit = parseInt(req.query._limit) ; // Limite d'éléments par page, par défaut 10
        const classroom = await Classroom.find().skip((page - 1) * limit)
        .limit(limit);
        const totalDocuments = await Classroom.countDocuments();
        res.status(200).json({classroom,totalDocuments});
    } catch (error) {
        console.error("Erreur lors de la récupération des cours :", error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des cours." });
    }
};
const getClassroomById = async (req, res) => {
    try {
        const { id } = req.params;
        const classroom = await Classroom.findById(id);
        if (!classroom) {
            return res.status(404).json({ message: "classroom non trouvé." });
        }
        res.status(200).json(classroom);
    } catch (error) {
        console.error("Erreur lors de la récupération du classroom par ID :", error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la récupération du classroom." });
    }
};

const updateClassroom = async (req, res) => {
    try {
        const { id } = req.params;
        const { name,level, capacity,users } = req.body;
        const updatedClassroom = await Classroom.findByIdAndUpdate(id, {
            name,
            level,
            capacity,
            users
        }, { new: true });
        if (!updatedClassroom) {
            return res.status(404).json({ message: "Cours non trouvé." });
        }
        res.status(200).json(updatedClassroom);
    } catch (error) {
        console.error("Erreur lors de la mise à jour du cours :", error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la mise à jour du cours." });
    }
};

const deleteClassroom = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedClassroom = await Classroom.findByIdAndDelete(id);
        if (!deletedClassroom) {
            return res.status(404).json({ message: "Classroom non trouvé." });
        }
        res.status(200).json({ message: "Classroom supprimé avec succès." });
    } catch (error) {
        console.error("Erreur lors de la suppression du Classroom :", error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la suppression du Classroom." });
    }
};
module.exports = {
    createClassrom ,getAllclassroom,getClassroomById,updateClassroom,deleteClassroom
  
};

