// uploadImage.js
const express = require("express");
const multer = require("multer");
const adminApp = require("../Config/Firebase");

const router = express.Router();
const storage = adminApp.storage();
const bucket = storage.bucket();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/uploadimage", upload.single("image"), async (req, res) => {
    try {
        // Get file from request
        const image = req.file;

        // Check if file exists
        if (!image) {
            return res.status(400).send("No image file provided");
        }

        // Create a reference to the storage bucket and specify the filename
        const file = bucket.file(image.originalname);

        // Upload the file to Firebase Storage
        await file.save(image.buffer);

        // Get the download URL for the file
        const downloadURL = await file.getSignedUrl({ action: "read", expires: "03-09-2491" });

        console.log("File uploaded successfully:", downloadURL);

        // Send response with download URL
        res.json({ downloadURL });
    } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;