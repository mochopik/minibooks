const express = require('express');
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

const router = express.Router();
const Story = mongoose.model('stories');
const User = mongoose.model('users');

// Stories index
router.get('/', (req, res) => {
    Story.find({status: 'public'})
        .populate('user')
        .then(stories => {
            res.render('stories/index', {
                stories: stories
            });
        });
});

// Show single story
router.get('/show/:id', (req, res) => {
    Story.findOne({
        _id: req.params.id
    })
    .populate('user')
    .then(story => {
        res.render('stories/show', {
            story: story
        });
    });
});

// Add Story form
router.get('/add',ensureAuthenticated, (req, res) => {
    res.render('stories/add');
});

// Process add stories
router.post('/', (req, res) => {
    let allowComment;

    if(req.body.allowComment) {
       allowComment = true; 
    } else {
        allowComment = false;
    }

    const newStory = {
        title: req.body.title,
        body: req.body.body,
        status: req.body.status,
        allowComment: allowComment,
        user: req.user.id
    };

    // Create new story
    new Story(newStory)
        .save()
        .then(story => {
            res.redirect(`/stories/show/${story.id}`);
        });
}); 

module.exports = router;