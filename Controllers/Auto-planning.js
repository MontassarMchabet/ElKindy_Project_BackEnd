
const Planning = require('../Models/Planning');
const Room = require('../Models/Room');
const User = require('../Models/User');
const Classroom = require('../Models/Classroom');
const { isRoomAvailable,isTeacherAvailable,areStudentsAvailable } = require('../Controllers/planningController');
const { checkDurationOfCourse } = require('../Controllers/validatePlanning');
//const isRoomAvailable = require('../Controllers/planningController');
const axios = require('axios');
const createAutomaticPlannings = async (req, res) => {
    try {
        const { startOfWeek,endOfWeek,type } = req.params;
        // Convertir les chaînes de caractères en objets Date
        const startDate = new Date(startOfWeek);
        const endDate = new Date(endOfWeek);

        // Vérifier la validité de la plage de dates
        if (startDate >= endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw new Error('Invalid date range');
        }
        // Récupérer tous les étudiants
        const students = await User.find({ role: 'client' });
        const teachers = await User.find({ role: 'prof' });
       
       const rooms = await Room.find();
        // Liste pour stocker les plannings créés
        const createdPlannings = [];

        // Boucle pour chaque jour de la semaine
        for (let currentDate = new Date(startDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
            const date = currentDate.toISOString().split('T')[0]; // Format de la date

            // Boucle pour chaque créneau horaire de la journée
            for (let startTime = 8; startTime < 18; startTime++) {
                const endTime = startTime + 1; // Durée du cours d'une heure

                // Vos validations
                //const roomAvailable = await isRoomAvailable(rooms.id, date, startTime, endTime);
                const RoomResponse = await axios.get(`http://localhost:9090/api/plannings/availability/room/${rooms[0]._id}/${date}/${startTime}/${endTime}`);
                const correctRoom = RoomResponse.data.isRoomAvailable;
                console.log(correctRoom)
                //const teacherAvailable = await isTeacherAvailable(teachers.id, date, startTime, endTime);
                //const studentsAvailable = await areStudentsAvailables(students[0]._id, date, startTime, endTime);
                //console.log(studentsAvailable)
                //const correctDuration = await checkDurationOfCourse(startTime, endTime, type);
                const DurationResponse = await axios.get(`http://localhost:9090/api/plannings/CheckDuration/${startTime}/${endTime}/${type}`);
                const correctDuration = DurationResponse.data.correctDuration;
                console.log(startTime+'//'+endTime+'//'+correctDuration)
                // Vérification de toutes les conditions pour créer un planning
                if (correctRoom && correctDuration) {
                    // Créer le planning
                    const planning = {
                        "date":date,
                        "startDate":startTime,
                        "endDate":endTime,
                        "roomId": rooms[0]._id,
                        "teacherId": teachers[0]._id,
                        "studentIds": students.map(student => student._id),
                        "type":type
                    };
                    console.log(planning)
                    createdPlannings.push(planning); // Ajouter le planning à la liste des plannings créés
                }
            }
        }

        return res.json({ createdPlannings });; // Retourner la liste des plannings créés
    } catch (error) {
        console.error('Error creating automatic plannings:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

/* const CheckStudents = async (req, res, next) => {
    try {
        const { studentIds, date, startTime, endTime } = req.params;
        const response = await axios.get(`http://localhost:9090/api/plannings/availability/students/${studentIds}/${date}/${startTime}/${endTime}`);
        const areStudentsAvailable = response.data.areStudentsAvailable;
        req.areStudentsAvailable = areStudentsAvailable;
        next();
    } catch (error) {
        console.error('Error checking student availability:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}; */
module.exports = {createAutomaticPlannings
   

};