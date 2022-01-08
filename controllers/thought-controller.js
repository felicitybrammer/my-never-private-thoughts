const { Thought, User } = require('../models');

const thoughtController = {

    getAllThought(req, res) {
        Thought.find({})
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
            .sort({ _id: -1 })
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    getThoughtById({ params: { thoughtId } }, res) {
        Thought.findById(thoughtId, '-id')
            .then(thoughtData => {
                if (!thoughtData) {
                    res.status(404).json({ message: 'no thought found with that id' })
                    return
                }
                res.status(200).json(thoughtData)
            })
            .catch(err => res.status(500).json(err))
    },

    updateThought({ body: { thoughtText }, params: { thoughtId } }, res) {
        Thought.findByIdAndUpdate(thoughtId, { thoughtText }, { new: true })
            .then(thoughtData => {
                if (!thoughtData) {
                    res.status(404).json({ message: 'no thought found with that id' })
                    return
                }
                res.status(200).json(thoughtData)
            })
            .catch(err => res.status(500).json(err))
    },

    removeThought({ params: { thoughtId } }, res) {
        Thought.findByIdAndDelete(thoughtId)
            .then(thoughtData => {
                if (!thoughtData) {
                    res.status(404).json({ message: 'no thought found with that id' })
                    return
                }
                User.findByIdAndUpdate(thoughtData.userId)
                res.status(200).json(thoughtData)
            })
            .catch(err => res.status(500).json(err))
    },

    // getThoughtById({ params }, res) {
    //     Thought.findOne({ _id: params.id })
    //         .populate({
    //             path: 'reactions',
    //             select: '-__v'
    //         })
    //         .select('-__v')
    //         .then(dbUserData => {
    //             if (!dbUserData) {
    //                 res.status(404).json({ message: 'No user found with this id' });
    //                 return;
    //             }
    //             res.json(dbUserData);
    //         })
    //         .catch(err => {
    //             console.log(err);
    //             res.status(400).json(err);
    //         });
    // },

    addThought({ body}, res) {
        console.log(body);
        Thought.create(body)
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                    { _id: body.userId },
                    { $push: { thoughts: thoughtText} },
                    { new: true }
                );
            })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this id' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
    },

    // updateThought({ params, body }, res) {
    //     Thought.findOneAndUpdate({ _id: params.id }, body, { new: true })
    //         .then(dbThoughtData => {
    //             if (!dbThoughtData) {
    //                 res.status(404).json({ message: 'No thought found with this id' });
    //                 return;
    //             }
    //             res.json(dbThoughtData);
    //         })
    //         .catch(err => res.status(400).json(err));
    // },

    // removeThought({ params }, res) {
    //     Thought.findOneAndDelete({ _id: params.thoughtId })
    //         .then(deletedThought => {
    //             if (!deletedThought) {
    //                 return res.status(404).json({ message: 'No thought found with this id' });
    //             }
    //             return User.findOneAndUpdate(
    //                 { _id: params.userId },
    //                 { $pull: { thoughts: params.thoughtId } },
    //                 { new: true }
    //             );
    //         })
    //         .then(dbThoughtData => {
    //             if(!dbThoughtData) {
    //                 res.status(400).json({ message: 'No user found with this id' });
    //                 return;
    //             }
    //             res.json(dbThoughtData);
    //         })
    //         .catch(err => res.json(err));
    // },

    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true }
        )
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No user found with this id' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
    },
    
    // removeReaction({ params }, res) {
    //     Thought.findOneAndUpdate(
    //         { _id: params.thoughtId },
    //         { $pull: { reactions: { reactionId: params.reactionId } } },
    //         { new: true }
    //     )
    //         .then(dbThoughtData => res.json(dbThoughtData))
    //         .catch(err => res.json(err));
        
    // }
    removeReaction({ body: {reactionId}, params: { thoughtId } }, res) {
        Thought.findByIdAndUpdate(
            thoughtId,
            {'$pull': {'reactions': {'_id':reactionId}}},
            {new: true},
            (err, thought) => {
                if(err) {
                    res.status(500).json(err)
                    return
                }
                if(!thought) {
                    res.status(404).json({message: 'no thought found with that id'})
                    return
                }
                res.status(200).json(thought)
            }
        )
    }
};

module.exports = thoughtController;