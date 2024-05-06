
const Room = require('../Models/Room');
const User = require('../Models/User');
const Classroom = require('../Models/Classroom');
const { getMaxWeeklyHoursForLevel } = require('../Controllers/validatePlanning');
const axios = require('axios');

// Fonction pour incrémenter le temps
const incrementTime = (time, minutes) => {
    const [hours, mins] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
    const newMins = (totalMinutes % 60).toString().padStart(2, '0');
    return `${newHours}:${newMins}`;
};

// Fonction de création de plannings automatiques
const createAutomaticPlannings = async (req, res) => {
    try {
        const { startOfWeek, endOfWeek, startTime, endTime } = req.params;
        const startDate = new Date(startOfWeek);
        const endDate = new Date(endOfWeek);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || startDate >= endDate) {
            return res.status(400).json({ error: 'Invalid date range' });
        }

        const students = await User.find({ role: 'client', $and:[{classroom:{$exists: true}}]});
    
        const teachers = await User.find({ role: 'prof' });
        const rooms = await Room.find();

        if (students.length === 0) {
            return res.status(400).json({ error: 'No students found' });
        }

        const createdPlannings = [];
        

        const uniqueClassroomList = [...new Set(students.map(student => student.classroom.toString()))];
        
        let studentIndex = 0;
        let classroomIndex = 0;

        // Boucle pour créer les plannings d'instrument
        for (let currentDate = new Date(startDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
            const date = currentDate.toISOString().split('T')[0];
            let currentStartTime = startTime; // Réinitialiser le temps de départ

            while (currentStartTime < endTime && studentIndex < students.length) {
                const currentEndTime = incrementTime(currentStartTime, 30); // Ajouter 30 minutes

                const [randomTeacher, randomRoom] = [
                    teachers[Math.floor(Math.random() * teachers.length)],
                    rooms[Math.floor(Math.random() * rooms.length)],
                ];

                const [roomAvailable, teacherAvailable, correctDuration,totalHours] = await Promise.all([
                    axios.get(`http://localhost:9090/api/plannings/availability/room/${randomRoom._id}/${date}/${currentStartTime}/${currentEndTime}`),
                    axios.get(`http://localhost:9090/api/plannings/availability/teacher/${randomTeacher._id}/${date}/${currentStartTime}/${currentEndTime}`),
                    axios.get(`http://localhost:9090/api/plannings/CheckDuration/${currentStartTime}/${currentEndTime}/instrument`),
                    axios.get(`http://localhost:9090/api/plannings/TotalIndividualStudy/${students[studentIndex]._id}/${date}/instrument`),
                ]);
                const isStudentWithinLimit = totalHours.data.TotalIndividualStudy; // Vérifier si l'étudiant est dans la limite
                   
                if (roomAvailable.data.isRoomAvailable && teacherAvailable.data.isTeacherAvailable && correctDuration.data.correctDuration && isStudentWithinLimit) {
                    const student = students[studentIndex];
                    
                    const planning = {
                        date,
                        startDate: currentStartTime,
                        endDate: currentEndTime,
                        roomId: randomRoom._id,
                        teacherId: randomTeacher._id,
                        studentIds: student._id,
                        type: 'instrument',
                    };

                    createdPlannings.push(planning);

                    studentIndex++; // Passe au prochain étudiant
                    currentStartTime = currentEndTime; // Déplacer le temps de départ
                } else {
                   
                    studentIndex++;
                }
            }
        }

        // Boucle pour créer les plannings de solfège
        if (createdPlannings.length > 0) {
            const lastPlanning = createdPlannings[createdPlannings.length - 1];
            const lastDate = lastPlanning.date;
            let lastEndTime = lastPlanning.endDate;

            for (let currentDate = new Date(lastDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
                const date = currentDate.toISOString().split('T')[0];
                
                if (lastEndTime >= endTime) {
                    lastEndTime = '08:00'; // Réinitialiser à 08:00 si le temps dépasse 12:00
                }
                
                while (classroomIndex < uniqueClassroomList.length && lastEndTime < endTime) {
                    const classroom = await Classroom.findById(uniqueClassroomList[classroomIndex]);
                    
                    const maxWeeklyHours = getMaxWeeklyHoursForLevel(classroom.level);
                    
                    const classroomPlannings = createdPlannings.filter(planning => planning.classroomId === classroom._id);
                    const totalWeeklyHours = classroomPlannings.reduce((totalHours, planning) => {
                        const [start, end] = [planning.startTime, planning.endTime].map(str => {
                            const [h, m] = str.split(':').map(Number);
                            return h * 60 + m;
                        });
                        return totalHours + (end - start);
                    }, 0);

                    if (totalWeeklyHours >= maxWeeklyHours) {
                        classroomIndex++; // Passe à la prochaine classe
                        continue;
                    }

                    const randomTeacher = teachers[Math.floor(Math.random() * teachers.length)];
                    const randomRoom = rooms[Math.floor(Math.random() * rooms.length)];
                    const solfegeEndTime = incrementTime(lastEndTime, maxWeeklyHours); // Temps du planning de solfège

                    const planning = {
                        date,
                        startDate: lastEndTime,
                        endDate: solfegeEndTime,
                        roomId: randomRoom._id,
                        teacherId: randomTeacher._id,
                        classroomId: classroom._id,
                        type: 'solfège',
                    };

                    createdPlannings.push(planning);
                    lastEndTime = solfegeEndTime; // Avancer le temps
                    classroomIndex++; // Passe à la prochaine classe
                }
            }
        }

        res.json({ createdPlannings });
    } catch (error) {
        console.error('Error creating automatic plannings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { createAutomaticPlannings };
