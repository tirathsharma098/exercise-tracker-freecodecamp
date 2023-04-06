const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    log: [
        {
            type: Schema.Types.ObjectId,
            ref: "Exercise",
        },
    ],
});

module.exports = model("User", userSchema);
