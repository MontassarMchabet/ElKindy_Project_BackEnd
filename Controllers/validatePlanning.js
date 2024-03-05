const Planning = require('../models/Planning');
const User = require('../models/UsersP');
const Course = require('../Models/Course');
const mongoose = require('mongoose');

const validatePlanning = async (studentIds, courseId, date, startTime, endTime) => {
    
    try {
        let isPlanningValid = true;

        // Récupérer les heures d'étude hebdomadaires pour chaque utilisateur
        for (const userId of studentIds) {
            
            const isValid = await validatePlanningForUser(userId, courseId, date, startTime, endTime);
            if (!isValid) {
                isPlanningValid = false;
                
            }
        }

        return isPlanningValid;
    } catch (error) {
        console.error(" Erreur lors de la validation du planning : ", error);
        return false;
    }
};

const validatePlanningForUser = async (userId, courseId, date, startTime, endTime) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error(`Utilisateur avec l'ID ${userId} non trouvé`);
        }

        const userLevel = user.level;

        const maxWeeklyHours = getMaxWeeklyHoursForLevel(userLevel);
        
        const totalStudyHoursPerWeek = await calculateTotalStudyHoursPerWeek(userId, date, startTime, endTime);
        console.log(totalStudyHoursPerWeek);
        if (totalStudyHoursPerWeek + calculateDuration(startTime, endTime) > maxWeeklyHours) {
            return false;
        }

        const course = await Course.findById(courseId);
        if (!course) {
            throw new Error("Cours non trouvé");
        }

        if (course.type === 'individual' && calculateDuration(startTime, endTime) > 0.5 ) {
            return false;
        }

        return true;
    } catch (error) {
        console.error("Erreur lors de la validation du planning pour l'utilisateur :", error);
        return false;
    }
};

// Fonction pour récupérer les heures d'étude hebdomadaires maximales pour un niveau donné
const getMaxWeeklyHoursForLevel = (level) => {
    switch (level) {
        case "Initiation":
            return 75; // 1h15mn
        case "Préparatoire":
            return 90; // 1h30mn
        case "1ère année":
            return 120; // 2h
        case "2ème année":
            return 120; // 2h
        case "3ème année":
            return 150; // 2h30mn
        case "4ème année":
            return 180; // 3h
        case "5ème année":
            return 210; // 3h30mn
        case "6ème année":
            return 240; // 4h
        case "7ème année":
            return 6.5; // 6h30mn
        default:
            return 0; // Valeur par défaut si le niveau n'est pas trouvé
    }
};

// Fonction pour calculer la durée entre deux horaires donnés en heures décimales
const calculateDuration = (startTime, endTime) => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const durationMilliseconds = end - start;
    return durationMilliseconds / (1000 * 60 * 60); // Convertir la durée en heures décimales
};

const calculateTotalStudyHoursPerWeek = async (userId, date, startTime, endTime) => {
    console.log(userId)
    try {
        const weekStartDate = getWeekStartDate(date);
        const weekEndDate = getWeekEndDate(date);
       // Convertir startTime et endTime en objets Date
       const startTimeDate = new Date(`2000-01-01T${startTime}`);
       const endTimeDate = new Date(`2000-01-01T${endTime}`);
       // Calculer les minutes de début et de fin
       const startMinutes = startTimeDate.getHours() * 60 + startTimeDate.getMinutes();
       const endMinutes = endTimeDate.getHours() * 60 + endTimeDate.getMinutes();
        const totalStudyHours = await Planning.aggregate([
            {
                $match: {
                    studentIds: new mongoose.Types.ObjectId(userId), // Conversion en ObjectId
                    date: { $gte: new Date(weekStartDate), $lte: new Date(weekEndDate) },
                }
            },
            {
                $group: {
                    _id: null,
                    totalHours: {
                        $sum: {
                            $subtract: [
                                endMinutes,
                                startMinutes,
                            
                            ]
                        }
                    }
                }
            }
        ]);

        console.log(totalStudyHours);
        return totalStudyHours.length > 0 ? totalStudyHours[0].totalHours : 0;
    } catch (error) {
        console.error("Erreur lors du calcul du nombre total d'heures d'étude par semaine :", error);
        return 0;
    }
};


const getWeekStartDate = (dateString) => {
    const date = new Date(dateString);
    const currentDay = date.getDay();
    const weekStartDate = new Date(date);
    weekStartDate.setDate(weekStartDate.getDate() - currentDay);
    weekStartDate.setHours(0, 0, 0, 0);
    return weekStartDate;
};

const getWeekEndDate = (dateString) => {
    const date = new Date(dateString);
    const currentDay = date.getDay();
    const weekEndDate = new Date(date);
    weekEndDate.setDate(weekEndDate.getDate() + (6 - currentDay));
    weekEndDate.setHours(23, 59, 59, 999);
    return weekEndDate;
};


module.exports = validatePlanning;
