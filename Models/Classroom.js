const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema({
    name: { type: String, required: true },
    capacity: { type: Number, required: true },
    level: {
        type: String,
        enum: ['Initiation', 'Préparatoire', '1ère année', '2ème année', '3ème année', '4ème année', '5ème année', '6ème année', '7ème année'],
        required: true
    },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Référence aux utilisateurs associés
    // Autres attributs de la salle de classe...
});

const Classroom = mongoose.model('Classroom', classroomSchema);
module.exports = Classroom;
