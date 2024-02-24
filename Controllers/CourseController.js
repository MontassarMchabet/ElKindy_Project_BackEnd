const Course = require('../Models/Course');

const createCourse = async (req, res) => {
    try {
        const { name, type, duration, startDate, endDate, capacity } = req.body;
        const newCourse = new Course({
            name,
            type,
            duration,
            startDate,
            endDate,
            capacity
        });
        const savedCourse = await newCourse.save();
        res.status(201).json(savedCourse);
    } catch (error) {
        console.error("Erreur lors de la création du cours :", error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la création du cours." });
    }
};

const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        console.error("Erreur lors de la récupération des cours :", error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des cours." });
    }
};

const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).json({ message: "Cours non trouvé." });
        }
        res.status(200).json(course);
    } catch (error) {
        console.error("Erreur lors de la récupération du cours par ID :", error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la récupération du cours." });
    }
};

const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, type, duration, startDate, endDate, capacity } = req.body;
        const updatedCourse = await Course.findByIdAndUpdate(id, {
            name,
            type,
            duration,
            startDate,
            endDate,
            capacity
        }, { new: true });
        if (!updatedCourse) {
            return res.status(404).json({ message: "Cours non trouvé." });
        }
        res.status(200).json(updatedCourse);
    } catch (error) {
        console.error("Erreur lors de la mise à jour du cours :", error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la mise à jour du cours." });
    }
};

const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCourse = await Course.findByIdAndDelete(id);
        if (!deletedCourse) {
            return res.status(404).json({ message: "Cours non trouvé." });
        }
        res.status(200).json({ message: "Cours supprimé avec succès." });
    } catch (error) {
        console.error("Erreur lors de la suppression du cours :", error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la suppression du cours." });
    }
};

module.exports = {
    createCourse ,
    getAllCourses ,
    getCourseById ,
    updateCourse ,
    deleteCourse
};
