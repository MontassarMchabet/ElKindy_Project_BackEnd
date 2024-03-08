const Planning = require('../models/Planning');
const User = require('../Models/User');
const Course = require('../Models/Course');
const mongoose = require('mongoose');

const validatePlanning = async (studentIds, courseId, date, startTime, endTime) => {
    
    try {
        let isPlanningValid = true;
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
        if (totalStudyHoursPerWeek + calculateDuration(startTime, endTime) > maxWeeklyHours) {
            return false;
        }

        const course = await Course.findById(courseId);
        if (!course) {
            throw new Error("Cours non trouvé");
        }
        const totalIndividualStudyHoursPerWeek = await calculateTotalIndividualStudyHoursPerWeek(userId, date, startTime, endTime,courseId);
        if (course.type === 'individual' && calculateDuration(startTime, endTime) > 0.5 && (totalIndividualStudyHoursPerWeek + calculateDuration(startTime, endTime) > 30) ) {
            return false;
        }
        
      /*   if (totalIndividualStudyHoursPerWeek + calculateDuration(startTime, endTime) > 30) {
            return false;
        } */
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
            return 0; 
    }
};

// Fonction pour calculer la durée entre deux horaires donnés 
const calculateDuration = (startTime, endTime) => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const durationMilliseconds = end - start;
    return durationMilliseconds / (1000 * 60 * 60); // Convertir la durée en heures decimales
};

const calculateTotalStudyHoursPerWeek = async (userId, date, startTime, endTime) => {
    
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
                    studentIds: new mongoose.Types.ObjectId(userId), 
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

        
        return totalStudyHours.length > 0 ? totalStudyHours[0].totalHours : 0;
    } catch (error) {
        console.error("Erreur lors du calcul du nombre total d'heures d'étude par semaine :", error);
        return 0;
    }
};

const calculateTotalIndividualStudyHoursPerWeek = async (userId, date, startTime, endTime,courseId) => {
    console.log (courseId)
    try {
        const weekStartDate = getWeekStartDate(date);
        const weekEndDate = getWeekEndDate(date);
        const startTimeDate = new Date(`2000-01-01T${startTime}`);
        const endTimeDate = new Date(`2000-01-01T${endTime}`);
        const startMinutes = startTimeDate.getHours() * 60 + startTimeDate.getMinutes();
        const endMinutes = endTimeDate.getHours() * 60 + endTimeDate.getMinutes();

        // Récupérer le type de cours à partir de l'ID du cours
        const courseDetails = await Course.findById(courseId);
        const courseType = courseDetails ? courseDetails.type : null;
        // Vérifier si le type de cours est individuel
        if (courseType === 'individual') {
            // Calculer le nombre total d'heures d'étude par semaine pour les cours individuels
            const totalIndividualStudyHours = await Planning.aggregate([
                {
                    $match: {
                        studentIds: new mongoose.Types.ObjectId(userId),
                        date: { $gte: new Date(weekStartDate), $lte: new Date(weekEndDate) },
                        courseId: new mongoose.Types.ObjectId(courseId) // Filtrer par ID de cours
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalHours: {
                            $sum: {
                                $subtract: [
                                    endMinutes,
                                    startMinutes
                                ]
                            }
                        }
                    }
                }
            ]);

            console.log(totalIndividualStudyHours);
            return totalIndividualStudyHours.length > 0 ? totalIndividualStudyHours[0].totalHours : 0;
        } else {
            // Si le cours n'est pas individuel retouné 0 
            return 0;
        }
    } catch (error) {
        console.error("Erreur lors du calcul du nombre total d'heures d'étude par semaine pour les cours individuels :", error);
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
