const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/Login-tut", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB connected successfully");
}).catch((err) => {
    console.error("Failed to connect:", err);
});

const donationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    donationType: { type: String, required: true },
    address: { type: String, required: true },
    message: { type: String, required: true }
});

const Donation = mongoose.model('donations', donationSchema);

module.exports = Donation;
