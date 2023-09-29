const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Story = require('../models/story');
const { body, validationResult } = require('express-validator');

// ROUTE 1: Get All the Notes using: GET "/api/notes/getuser". Login required
router.get('/fetchallstories', fetchuser, async (req, res) => {
    try {
        const stories = await Story.find({ user: req.user.id });
        res.json(stories)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 2: Add a new Note using: POST "/api/notes/addnote". Login required
router.post('/addStory', fetchuser, [
    body('prompt', 'Enter a valid title').isLength({ min: 10 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 50 }),], async (req, res) => {
        try {
            const { prompt, description } = req.body;

            // If there are errors, return Bad request and the errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const story = new Story({
                prompt, description, user: req.user.id
            })
            const savedStory = await story.save()

            res.json(savedStory)

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    })

// ROUTE 3: Delete an existing Note using: DELETE "/api/notes/deletenote". Login required
router.delete('/deletestory/:id', fetchuser, async (req, res) => {
    try {
        // Find the note to be delete and delete it
        let story = await Story.findById(req.params.id);
        if (!story) { return res.status(404).send("Not Found") }

        // Allow deletion only if user owns this Note
        if (story.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        story = await Story.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Story has been deleted", story: story });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


// ROUTE 4: like an existing story using: post "/likestory". Login required
router.post('/likestory/:id', fetchuser, async (req, res) => {
    try {

        let story = await Story.findById(req.params.id);
        if (!story) { return res.status(404).send("Not Found") }

        const index = story.likes.indexOf(req.user.id);
        if(index != -1){
            return res.status(404).json({"message" : "You have already liked the story."})
        }
        story.likes.push(req.user.id);
        await story.save();
        res.json({ "Success": "Story has been liked", story : story });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 5: like an existing story using: post "/unlikestory". Login required
router.delete('/unlikestory/:id', fetchuser, async (req, res) => {
    try {

        let story = await Story.findById(req.params.id);
        if (!story) { return res.status(404).send("Not Found") }

        // delete user id from likes 
        const index = story.likes.indexOf(req.user.id);
        if (index > -1) { // only splice array when item is found
            story.likes.splice(index, 1); // 2nd parameter means remove one item only
        }
        else{
            return res.status(404).json({"message" : "You have not liked the story."})
        }
        
        await story.save();
        res.json({ "Success": "Story has been unliked", story : story });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 6: Get a Notes using: GET "/fetchstory/:id". Login required
router.get('/fetchstory/:id', fetchuser, async (req, res) => {
    try {
        const story_ = await Story.findById(req.params.id);
        res.json(story_)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})
module.exports = router