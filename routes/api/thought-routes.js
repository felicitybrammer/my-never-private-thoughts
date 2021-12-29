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
    .put(addReaction)
    .delete(removeThought);

router
    .route('/:userId/:thoughtId/:reactionId')
    .delete(removeReaction);

module.exports = router;