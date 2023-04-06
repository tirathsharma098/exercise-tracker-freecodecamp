require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const allRoutes = require("./src/routes/index");
const mongoose = require("mongoose");

// Connecting to database
main().catch((err) => console.log("Database Error Occured", err));
async function main() {
    await mongoose.connect(
        `${process.env.DB_URL}`
    );
    console.log("connected to database Successfully.");
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
});
app.use(allRoutes);

const listener = app.listen(process.env.PORT, () => {
    console.log("Your app is listening on port " + listener.address().port);
});
