const Planning = require('../Models/Planning');
const Classroom = require('../Models/Classroom');
const mongoose = require('mongoose');

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
            return 390; // 6h30mn
        default:
            return 0; 
    }
};

const calculateDuration = (startTime, endTime) => {
    const start = new Date(`01/01/2000 ${startTime}`);
    const end = new Date(`01/01/2000 ${endTime}`);
    const durationInMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    return durationInMinutes;
};
const calculateTotalStudyHoursPerWeek = async (classroom, date) => {
    try {
        const weekStartDate = getWeekStartDate(date);
        const weekEndDate = getWeekEndDate(date);

        // Rechercher tous les plannings de l'utilisateur pour la semaine donnée
        const userPlannings = await Planning.find({
            classroomId: new mongoose.Types.ObjectId(classroom), 
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

        //console.log(totalStudyHours);
        return totalStudyHours;
    } catch (error) {
        console.error("Erreur lors du calcul du nombre total d'heures d'étude par semaine :", error);
        return 0;
    }
};



const calculateTotalIndividualStudyHoursPerWeek = async (userId, date) => {

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
        const { startTime, endTime,type } = req.params;
        if (type==="instrument"){
            // Vérifier que la durée du cours ne dépasse pas 30 minutes
            if (calculateDuration(startTime, endTime) > 30) {
                return res.json({ correctDuration: false });
            }
            // Vérifier que l'heure de fin est après l'heure de début
            if (endTime <= startTime) {
                return res.json({ correctDuration: false });
            }
        }
        if (type==="solfège"){
      
            // Vérifier que l'heure de fin est après l'heure de début
            if (endTime <= startTime) {
                return res.json({ correctDuration: false });
            }
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
        const { userId,date,type } = req.params;
        if(type==="instrument"){
            const totalIndividualStudyHoursPerWeek = await calculateTotalIndividualStudyHoursPerWeek(userId, date);
            //console.log(totalIndividualStudyHoursPerWeek);
            if (totalIndividualStudyHoursPerWeek >= 30 ) {
                
                return res.json({ TotalIndividualStudy: false });
            }
    }
        return res.json({ TotalIndividualStudy: true });
    } catch (error) {
        console.error('Error checking Duration:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
const calculateTotalStudyHours = async (req, res) => {
    try {
        const { classroomId,date,startTime, endTime } = req.params;
        const classroom = await Classroom.findById(classroomId);
        if (!Classroom) {
            
            return res.status(500).json({ error: `Utilisateur avec l'ID ${classroomId} non trouvé` });
        }

        const ClassroomLevel = classroom.level;
        //console.log('ClassroomLevel'+ClassroomLevel);
       
        const maxWeeklyHours = getMaxWeeklyHoursForLevel(ClassroomLevel);
        const totalSolfegeStudyHoursPerWeek = await calculateTotalStudyHoursPerWeek(classroomId, date);
        //console.log('totalSolfegeStudyHoursPerWeek:'+totalSolfegeStudyHoursPerWeek);
      
        const d =calculateDuration(startTime, endTime);
        //console.log('d:'+d);
        //console.log('maxWeeklyHours:'+maxWeeklyHours);
        
        if ((totalSolfegeStudyHoursPerWeek +d)  > (maxWeeklyHours-30)) {
            
            return res.json({ totalStudyHoursPerWeek: false });
           
        }
        return res.json({ totalStudyHoursPerWeek: true });
    } catch (error) {
        console.error('Error checking Duration:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
module.exports = {CheckDurationOfCourse,calculateTotalIndividualStudy,calculateTotalStudyHours};
