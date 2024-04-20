const Planning = require('../Models/Planning');
const Room = require('../Models/Room');
const User = require('../Models/User');
const Classroom = require('../Models/Classroom');
const { getMaxWeeklyHoursForLevel } = require('../Controllers/validatePlanning');
const axios = require('axios');
const { set } = require('mongoose');

const createAutomaticPlannings = async (req, res) => {
    try {
        const { startOfWeek, endOfWeek, type } = req.params;
        const startDate = new Date(startOfWeek);
        const endDate = new Date(endOfWeek);

        if (startDate >= endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw new Error('Invalid date range');
        }

        const students = await User.find({ role: 'client' });
        const teachers = await User.find({ role: 'prof' });
        const rooms = await Room.find();
        const createdPlannings = [];
        const classroomlist = []; // Ensemble pour stocker les salles de classe sans redondance
        let classroomSet = new Set();
        let studentIndex = 0;
        let classroomIndex = 0;
        const classroomList = new Set();
        for (let currentDate = new Date(startDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
            const date = currentDate.toISOString().split('T')[0];

            for (let startTime = 8; startTime < 11; startTime++) {
                const endTime = startTime + 1;
                const randomTeacher = teachers[Math.floor(Math.random() * teachers.length)];
                
                const randomRoom = rooms[Math.floor(Math.random() * rooms.length)];
                const RoomResponse = await axios.get(`http://localhost:9090/api/plannings/availability/room/${randomRoom._id}/${date}/${startTime}/${endTime}`);
                const correctRoom = RoomResponse.data.isRoomAvailable;

                const Teacherresponse = await axios.get(`http://localhost:9090/api/plannings/availability/teacher/${randomTeacher._id}/${date}/${startTime}/${endTime}`);
                const correctTeacher = Teacherresponse.data.isTeacherAvailable;

                const DurationResponse = await axios.get(`http://localhost:9090/api/plannings/CheckDuration/${startTime}/${endTime}/${type}`);
                const correctDuration = DurationResponse.data.correctDuration;

                if (studentIndex < students.length) {
                    if (correctRoom && correctDuration && correctTeacher) {
                        const student = students[studentIndex];
                        const studentId = student._id;
                        const classroomId = student.classroom; // Supposons que vous récupérez l'ID de la salle de classe pour chaque étudiant
                        if (!classroomSet.has(classroomId)) {
                            classroomSet.add(classroomId);
                            classroomList.add(classroomId); // Add the classroom ID to the list set as well
                        }
                        const planning = {
                            date,
                            startTime,
                            endTime,
                            roomId: randomRoom._id,
                            teacherId: randomTeacher._id,
                            studentIds: studentId,
                            type
                        };
                        createdPlannings.push(planning);
                        studentIndex++;                 
                    }
                }
            }
        }

        const lastPlanning = createdPlannings[createdPlannings.length - 1];
        
        
        const lastDate = lastPlanning.date;
        console.log('set'+classroomSet.size)
        classroomSet.forEach(async classroomId => {
            classroomlist.push(classroomId) 
            });
        console.log('list'+classroomlist)   
        for (let currentDate = new Date(lastDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {

            const date = currentDate.toISOString().split('T')[0];
            let lastEndTime = lastPlanning.endTime;
            for (let startTime = lastEndTime; startTime < 20; startTime++) {
                //console.log('aaa'+classroomSet.length)
                if (classroomIndex < classroomlist.length){
                    //console.log(classroomIndex)
                    //.log(classroomSet[classroomIndex])
                    // Récupérer la classe associée à ce groupe de students (classroom)
                    const classroom = await Classroom.findById(classroomlist[classroomIndex]);
                    //console.log(classroom)
                
                    // Récupérer les étudiants de ce groupe
                    const students = await User.find({ classroom:classroomlist[classroomIndex]});
                    //console.log(students)
                    // Si la classe (classroom) n'a pas d'étudiants, passez à la suivante
                    if (students.length === 0) {
                        continue;
                    }
                
                    // Calculer le nombre d'heures de cours pour ce groupe de students
                    const maxWeeklyHours = getMaxWeeklyHoursForLevel(classroom.level); // Obtenez le nombre maximum d'heures par semaine pour ce niveau
                
                    // Si le groupe de students a atteint son quota d'heures hebdomadaires, passez à la suivante
                    const classroomPlannings = createdPlannings.filter(planning => planning.classroomId === classroomlist[classroomIndex]);
                    const weeklyHours = classroomPlannings.reduce((totalHours, planning) => {
                        return totalHours + (planning.endTime - planning.startTime);
                    }, 0);
                
                    if (weeklyHours >= maxWeeklyHours) {
                        continue;
                    }
                
                    const randomTeacher = teachers[Math.floor(Math.random() * teachers.length)];
                    const randomRoom = rooms[Math.floor(Math.random() * rooms.length)];
                    
                    // Utiliser l'heure de fin de ce dernier créneau horaire comme heure de début pour les plannings de type "solfège"
                    const solfegeEndTime = startTime + (maxWeeklyHours / 60); 
                    
                    // Créer le planning pour ce groupe de students (classroom)
                    const planning = {
                        date,
                        startTime,
                        solfegeEndTime,
                        roomId: randomRoom._id, 
                        teacherId: randomTeacher._id,
                        classroomId: classroomlist[classroomIndex], 
                        type: 'solfège' // Vous pouvez définir le type de cours ici, par exemple "solfège"

                    };
                
                    createdPlannings.push(planning);
                    lastEndTime += solfegeEndTime;
                    classroomIndex++; 
                } 
            }
        }

        return res.json({ createdPlannings });
    } catch (error) {
        console.error('Error creating automatic plannings:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { createAutomaticPlannings };
