const express = require('express');
const router = express.Router();
const planningController = require('../Controllers/planningController');
const validatePlanning = require('../Controllers/validatePlanning');
const AutoPlanning = require('../Controllers/Auto-planning');
const axios = require('axios');
// Routes for CRUD operations
router.get('/getall', planningController.getAllPlannings);
router.get('/getById/:id', planningController.getPlanningById);
router.post('/add', planningController.createPlanning);
router.put('/update/:id', planningController.updatePlanning);
router.delete('/delete/:id', planningController.deletePlanning);
router.get('/availability/room/:roomId/:date/:startTime/:endTime',planningController.isRoomAvailable );
router.get('/availability/teacher/:teacherId/:date/:startTime/:endTime',planningController.isTeacherAvailable );
router.get('/availability/studends/:studentIds/:date/:startTime/:endTime', planningController.areStudentsAvailable);
router.get('/CheckDuration/:startTime/:endTime/:type', validatePlanning.CheckDurationOfCourse);
router.get('/TotalIndividualStudy/:userId/:date/:type', validatePlanning.calculateTotalIndividualStudy);
router.get('/TotalStudyHours/:classroomId/:date/:startTime/:endTime', validatePlanning.calculateTotalStudyHours);
router.get('/getallStudent/:studentId', planningController.getPlanningWithStudentIds);
router.get('/getByTeacherId/:teacherId', planningController.getPlanningWithTeacherId);

router.post('/autoplanning/:startOfWeek/:endOfWeek/:startTime/:endTime', AutoPlanning.createAutomaticPlannings);
router.post('/SaveMoreplannnings', planningController.SaveMorePlannings);
router.get('/GetStudentsWithClassroomAndId/:studentIds', planningController.GetStudentsWithClassroomAndId);

const  Meeting  = require('../Models/Meeting'); // Votre modèle de réunion

router.post('/create-meeting', async (req, res) => {
    try {
        const { roomName, teacherName, date, time, participants } = req.body;
 
        const meeting = new Meeting({
          roomName,
          teacherName,
          date,
          time,
          participants,
        });
    
        // Enregistrez la réunion dans la base de données
        await meeting.save();
    
        res.status(201).json({ message: 'Meeting created successfully', meeting });
      } catch (error) {
        console.error('Error creating meeting:', error);
        res.status(500).json({ message: 'An error occurred while creating the meeting' });
      }
});
router.get('/get-meetings', async (req, res) => {
    try {
        const meetings = await Meeting.find(); // Récupérer toutes les réunions
        res.status(200).json({ meetings });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching meetings', error });
    }
});
router.delete('/delete-meeting/:id', async (req, res) => { // Chemin de la route avec le paramètre ':id'
  try {
    const meetingId = req.params.id; // Récupérer l'ID de la réunion à partir des paramètres de la requête
    
    const meeting = await Meeting.findByIdAndDelete(meetingId); // Supprimer la réunion par ID
    
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' }); // Si la réunion n'existe pas, retourner 404
    }
    
    res.status(200).json({ message: 'Meeting deleted successfully' }); // Répondre avec un message de réussite
  } catch (error) {
    console.error('Error deleting meeting:', error); // Afficher l'erreur dans la console
    res.status(500).json({ message: 'Internal server error' }); // Répondre avec une erreur du serveur
  }
});
router.get('/meetings/participant/:participantId', async (req, res) => {
  try {
    const participantId = req.params.participantId; // Récupérer l'ID du participant depuis les paramètres de la requête

    const meetings = await Meeting.find({
      participants: participantId, // Filtrer les réunions où le participant est inclus
    });

   
    res.status(200).json({ meetings }); // Retourner les réunions trouvées
  } catch (error) {
    console.error('Error fetching meetings for participant:', error);
    res.status(500).json({ message: 'Internal server error' }); // Gérer les erreurs du serveur
  }
});


router.post('/autoplanning/:startOfWeek/:endOfWeek/:type', AutoPlanning.createAutomaticPlannings);
router.put('/updateevaluation/:id', planningController.updatePlanning2);

module.exports = router;