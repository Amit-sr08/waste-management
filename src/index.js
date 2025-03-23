const express = require("express");
const path = require("path");
const bcrypt = require("bcryptjs");

const collection = require("./config");
const Donation = require("./mongodb");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.name,
        username: req.body.username,
        password: req.body.password
    };

    try {
        const existingUser = await collection.findOne({ username: data.username });

        if (existingUser) {
            res.send("User already exists. You can login or use a different username.");
        } else {
            const saltRounds = 10;
            data.password = await bcrypt.hash(data.password, saltRounds);

            await collection.insertMany(data);
            res.render("success", { message: "User registered successfully!" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while registering the user.");
    }
});

// Login user
app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ username: req.body.username });
        if (!check) {
            return res.send("Username not found");
        }

        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (isPasswordMatch) {
            res.render("home");
        } else {
            res.send("Wrong password");
        }
    } catch {
        res.send("Wrong details, enter correctly");
    }
});

// Home route
app.get("/home", (req, res) => {
    res.render("home");
});

app.post("/home", async (req, res) => {
    console.log("Received donation data:", req.body);  

    try {
        const donation = new Donation({
            name: req.body.name,
            mobileNumber: req.body.mobno,  
            donationType: req.body.donation,
            address: req.body.address,
            message: req.body.text || "No message provided"  
        });

        await donation.save();  
        console.log("Donation saved successfully:", donation);  
        res.send("Submitted successfully, thank you!");  
    } catch (error) {
        console.error("Error storing donation:", error);
        res.status(400).send(`Error submitting donation: ${error.message}`);
    }
});

// Remove `app.listen()` for Vercel compatibility
module.exports = app;  // ✅ Export app for Vercel
