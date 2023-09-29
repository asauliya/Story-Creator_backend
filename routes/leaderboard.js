const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Story = require('../models/story');

// ROUTE 1: Get top 8 stories using: GET "/topstory". Login required
router.get('/fetchtopstories', fetchuser, async (req, res) => {
    try {
        // const stories = await Story.find().sort({"likesCount":-1});
        const sortBy = "likes";
        let stories = await Story.aggregate().addFields({"length": {"$size": `$${sortBy}`}}).sort({"length" : -1}).limit(10);
        res.status(200).json({stories});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router