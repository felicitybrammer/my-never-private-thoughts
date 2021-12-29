const router = require('express').Router();
const { getAllThought,
    getThoughtById,
    addThought, 
    removeThought,
    addReaction,
    removeReaction
} = require('../../controllers/thought-controller');

// /api/thoughts/userId
router.route('/')
    .get(getAllThought)
    .post(addThought);

// /api/thoughts/userId/thoughtId
router
    .route('/:userId/:thoughtId')
    .get(getThoughtById)
    .delete(removeThought);

router
    .route('/:thoughtId/reactions')
    .post(addReaction)
    .delete(removeReaction);


    

module.exports = router;