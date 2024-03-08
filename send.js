// seed.js

const mongoose = require('mongoose');
const Course = require('./models/Course');

// Connectez-vous à votre base de données MongoDB
mongoose.connect("mongodb+srv://nourbenaissa:eOzGcg6xlKBzMj7E@cluster0.ysfg0up.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Créez une nouvelle instance de cours et sauvegardez-la dans la base de données
const createCourse = async () => {
  try {
    const newCourse = new Course({
      name: 'Cours de piano',
      type: 'individual',
      duration: 60, // Durée en minutes
      startDate: new Date('2024-02-01'), // Date de début du cours
      endDate: new Date('2024-05-30'), // Date de fin du cours
      capacity: 8, // Capacité maximale d'étudiants
      // Autres attributs du cours
    });

    const savedCourse = await newCourse.save();
    console.log('Nouveau cours ajouté avec succès :', savedCourse);
  } catch (error) {
    console.error('Erreur lors de l\'ajout du cours :', error);
  } finally {
    // Déconnectez-vous de la base de données après avoir ajouté le cours
    mongoose.disconnect();
  }
};

createCourse();
