const Planning = require('../Models/Planning');
const User = require('../Models/User');
const Course = require('../Models/Course');
const mongoose = require('mongoose');

const validatePlanning = async (studentIds, courseId, date, startDate, endDate) => {
    
    try {
        let isPlanningValid = true;
        for (const userId of studentIds) {
            
            const isValid = await validatePlanningForUser(userId, courseId, date, startDate, endDate);
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

const validatePlanningForUser = async (userId, courseId, date, startDate, endDate) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error(`Utilisateur avec l'ID ${userId} non trouvé`);
        }

        const userLevel = user.level;
        //console.log('userLevel'+userLevel);
        const maxWeeklyHours = getMaxWeeklyHoursForLevel(userLevel);
        
        const totalStudyHoursPerWeek = await calculateTotalStudyHoursPerWeek(userId, date, startDate, endDate);
        console.log(totalStudyHoursPerWeek);
        const d =calculateDuration(startDate, endDate);
        console.log('d:'+d);
        console.log('maxWeeklyHours:'+maxWeeklyHours);
        if (totalStudyHoursPerWeek +d  > maxWeeklyHours) {
            console.log('11');
            return false;
           
        }

        const course = await Course.findById(courseId);
        if (!course) {
            throw new Error("Cours non trouvé");
        }
        const totalIndividualStudyHoursPerWeek = await calculateTotalIndividualStudyHoursPerWeek(userId, date, startDate, endDate,courseId);
        if (course.type === 'individual' && calculateDuration(startDate, endDate) > 30 && (totalIndividualStudyHoursPerWeek + calculateDuration(startDate, endDate) > 30) ) {
            console.log('22');
            return false;
        }
        
      /*   if (totalIndividualStudyHoursPerWeek + calculateDuration(startDate, endDate) > 30) {
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

/* // Fonction pour calculer la durée entre deux horaires donnés 
const calculateDuration = (startDate, endDate) => {
    const start = new Date(`2000-01-01T${startDate}`);
    const end = new Date(`2000-01-01T${endDate}`);
    const durationMilliseconds = end - start;
    return (durationMilliseconds / (1000 * 60 * 60))*60;
}; */
const calculateDuration = (startTime, endTime) => {
    const start = new Date(`01/01/2000 ${startTime}`);
    const end = new Date(`01/01/2000 ${endTime}`);
    const durationInMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    return durationInMinutes;
};
const calculateTotalStudyHoursPerWeek = async (userId, date) => {
    try {
        const weekStartDate = getWeekStartDate(date);
        const weekEndDate = getWeekEndDate(date);

        // Rechercher tous les plannings de l'utilisateur pour la semaine donnée
        const userPlannings = await Planning.find({
            studentIds: new mongoose.Types.ObjectId(userId), 
            date: { $gte: new Date(weekStartDate), $lte: new Date(weekEndDate) },
        });

        // Calculer la durée totale d'étude pour tous les plannings de l'utilisateur
        let totalStudyHours = 0;
        for (const planning of userPlannings) {
            // Convertir les heures de début et de fin en objets Date
            const startDate = new Date(`2000-01-01T${planning.startDate}`);
            const endDate = new Date(`2000-01-01T${planning.endDate}`);
            
            // Calculer la différence de temps en minutes
            const diffInMinutes = (endDate - startDate) / (1000 * 60);

            // Ajouter la durée de ce planning à la durée totale
            totalStudyHours += diffInMinutes;
        }

        console.log(totalStudyHours);
        return totalStudyHours;
    } catch (error) {
        console.error("Erreur lors du calcul du nombre total d'heures d'étude par semaine :", error);
        return 0;
    }
};



const calculateTotalIndividualStudyHoursPerWeek = async (userId, date, startDate, endDate,courseId) => {
    console.log (courseId)
    try {
        const weekStartDate = getWeekStartDate(date);
        const weekEndDate = getWeekEndDate(date);
        const startDateDate = new Date(`2000-01-01T${startDate}`);
        const endDateDate = new Date(`2000-01-01T${endDate}`);
        const startMinutes = startDateDate.getHours() * 60 + startDateDate.getMinutes();
        const endMinutes = endDateDate.getHours() * 60 + endDateDate.getMinutes();

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
                        /* //courseId: new mongoose.Types.ObjectId(courseId) // Filtrer par ID de cours */
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
/////////////////////////////////////////////////////////////
const CheckDurationOfCourse = async (req, res) => {
    try {
        const { startTime, endTime } = req.params;
        // Vérifier que la durée du cours ne dépasse pas 30 minutes
        if (calculateDuration(startTime, endTime) > 30) {
            return res.json({ correctDuration: false });
        }
        // Vérifier que l'heure de fin est après l'heure de début
        if (endTime <= startTime) {
            return res.json({ correctDuration: false });
        }
        return res.json({ correctDuration: true });
    } catch (error) {
        console.error('Error checking Duration:', error);
        // Gérer les erreurs de requête en renvoyant une réponse avec un statut d'erreur
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
const calculateTotalIndividualStudy = async (req, res) => {
    try {
        const { userId,date,startTime, endTime,courseId } = req.params;
        const totalIndividualStudyHoursPerWeek = await calculateTotalIndividualStudyHoursPerWeek(userId, date, startTime, endTime,courseId);
        console.log(totalIndividualStudyHoursPerWeek);
        if (totalIndividualStudyHoursPerWeek >= 30 ) {
            
            return res.json({ TotalIndividualStudy: false });
        }
        return res.json({ TotalIndividualStudy: true });
    } catch (error) {
        console.error('Error checking Duration:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
const calculateTotalStudyHours = async (req, res) => {
    try {
        const { userId,date,startTime, endTime } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            
            return res.status(500).json({ error: `Utilisateur avec l'ID ${userId} non trouvé` });
        }

        const userLevel = user.level;
        console.log('userLevel'+userLevel);
        const maxWeeklyHours = getMaxWeeklyHoursForLevel(userLevel);
        const totalStudyHoursPerWeek = await calculateTotalStudyHoursPerWeek(userId, date);
        console.log('aaa'+totalStudyHoursPerWeek);
        const d =calculateDuration(startTime, endTime);
        console.log('d:'+d);
        console.log('maxWeeklyHours:'+maxWeeklyHours);
        if (totalStudyHoursPerWeek +d  > maxWeeklyHours) {
            
            return res.json({ totalStudyHoursPerWeek: false });
           
        }
        return res.json({ totalStudyHoursPerWeek: true });
    } catch (error) {
        console.error('Error checking Duration:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
module.exports = {validatePlanning,CheckDurationOfCourse,calculateTotalIndividualStudy,calculateTotalStudyHours};
