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
        .sort({date: 'desc'})
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
    .populate('comments.commentUser')
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

// Edit Story form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Story.findOne({
        _id: req.params.id
    })
    .then(story => {
        if(story.user != req.user.id) {
            res.redirect('/stories');
        } else {
            res.render('stories/edit', {
                story: story
            }); 
        }
    });
});

// Process add stories
router.post('/', (req, res) => {
    let allowComments;

    if(req.body.allowComments) {
       allowComments = true; 
    } else {
        allowComments = false;
    }

    const newStory = {
        title: req.body.title,
        body: req.body.body,
        status: req.body.status,
        allowComments: allowComments,
        user: req.user.id
    };

    // Create new story
    new Story(newStory)
        .save()
        .then(story => {
            res.redirect(`/stories/show/${story.id}`);
        });
}); 

// Edit from proccess
router.put('/:id', (req, res) => {
    Story.findOne({
        _id: req.params.id
    })
    .then(story => {
        let allowComments;

        if(req.body.allowComments) {
            allowComments = true; 
        } else {
            allowComments = false;
        }

        story.title = req.body.title;
        story.body = req.body.body;
        story.status = req.body.status;
        story.allowComments = allowComments;

        story.save().then(story => {
            res.redirect('/dashboard');
        });
    }); 
});

// Delete stories
router.delete('/:id', (req, res) => {
    Story.remove({_id: req.params.id})
        .then(() => {
            res.redirect('/dashboard');
        });
});

// Add comment
router.post('/comment/:id', (req, res) => {
    Story.findOne({
        _id: req.params.id
    })
    .then(story => {
        const newComment = {
            commentBody: req.body.commentBody,
            commentUser: req.user.id
        };

        // Add to comment arrays to begining
        story.comments.unshift(newComment);

        story.save()
            .then(story => {
                res.redirect(`/stories/show/${story.id}`);
            });
    });
});

module.exports = router;