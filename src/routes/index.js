const express = require("express");
const {
    userAdd,
    getAllUsers,
    addExercise,
    findUserLog,
} = require("../controller");
const router = express.Router();

router.post("/api/users", userAdd);
router.get("/api/users", getAllUsers);
router.post("/api/users/:userId/exercises", addExercise);
router.get("/api/users/:id/logs", findUserLog);

module.exports = router;
