const moment = require("moment");
const User = require("../models/user");
const Exercise = require("../models/exercise");

exports.userAdd = async (req, res) => {
    try {
        const { username } = req.body;
        const foundUser = await User.findOne({ username: username });
        if (foundUser) return res.json({ username, _id: foundUser._id });
        const userCreated = new User({ username });
        await userCreated.save();
        return res.json({ username, _id: userCreated._id });
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: "error occurred while adding user" });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const foundUser = await User.find();
        return res.send(foundUser);
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: "error occurred while getting user" });
    }
};

exports.addExercise = async (req, res) => {
    try {
        const { description, duration, date: dateGot = new Date() } = req.body;
        const userId = req.params.userId;
        const foundUser = await User.findById(userId);
        if (!foundUser) return res.json({ error: "user does not exist" });
        const dateToSave = moment(dateGot).format("ddd MMM DD YYYY");
        const exerciseCreated = new Exercise({
            description,
            duration: Number(duration),
            date: dateToSave,
        });
        foundUser.log.push(exerciseCreated);
        await exerciseCreated.save();
        await foundUser.save();
        res.json({
            _id: foundUser._id,
            username: foundUser.username,
            date: exerciseCreated.date,
            duration: exerciseCreated.duration,
            description: exerciseCreated.description,
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: "error occurred while add exercise" });
    }
};

exports.findUserLog = async (req, res) => {
    try {
        const { id } = req.params;
        const { from, to, limit } = req.query;
        const mainData = await User.findById(id).populate({ path: "log" });
        if (!mainData) return res.json({ error: "No logs found with same id" });
        let dataToSend = JSON.parse(JSON.stringify(mainData));
        dataToSend["count"] = dataToSend.log ? dataToSend.log.length : 0;
        let allLogs;
        if (from || to) {
            const unixFrom = Date.parse(from);
            const unixTo = Date.parse(to);
            if (from && to) {
                allLogs = dataToSend.log.filter((currentExercise) => {
                    const currentDate = Date.parse(currentExercise.date);
                    if (currentDate > unixFrom && currentDate < unixTo)
                        return true;
                    return false;
                });
            } else if (from) {
                allLogs = dataToSend.log.filter((currentExercise) => {
                    const currentDate = Date.parse(currentExercise.date);
                    return currentDate > unixFrom;
                });
                console.log(allLogs, "exuec");
            } else if (to) {
                allLogs = dataToSend.log.filter((currentExercise) => {
                    const currentDate = Date.parse(currentExercise.date);
                    return currentDate < unixTo;
                });
            }
            dataToSend.log = allLogs;
        }
        if (limit && dataToSend.log.length > limit) {
            let newLogs = [];
            for (let i = 0; i < limit; i++) {
                newLogs.push(dataToSend.log[i]);
            }
            dataToSend["log"] = newLogs;
        }
        res.send(dataToSend);
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: "error occurred while list logs" });
    }
};
