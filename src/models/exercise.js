const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const exerciseSchema = new Schema({
    description: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
});

module.exports = model("Exercise", exerciseSchema);
