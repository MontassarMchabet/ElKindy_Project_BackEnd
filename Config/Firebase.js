const admin = require("firebase-admin");

const serviceAccount = require("./elkindy-firebase-adminsdk-vw7kn-c31f0147a6.json");

const firebaseConfig = {
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "elkindy.appspot.com"
};

const app = admin.initializeApp(firebaseConfig, 'elkindy');

module.exports = app;
