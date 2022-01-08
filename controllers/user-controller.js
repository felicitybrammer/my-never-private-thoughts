const { User } = require('../models');

const userController = {
    //get all users
    getAllUser(req, res) {
        User.find({})
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .populate({
                path: 'friends',
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

    //get one user by id
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .populate({
                path: 'friends',
                select: '-__v'
            })
            .select('-__v')
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    //create a user
    createUser({ body }, res) {
        User.create(body)
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.status(400).json(err));
    },

    //update user by id
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    },

    deleteUser({ params: { id } }, res) {
        User.findByIdAndDelete({ _id: id } )
            .then(userData => {
                if (!userData) {
                    res.status(404).json({ message: "No user found with that id" })
                    return
                }
                const thoughtIds = userData.thoughts
                Thought.deleteMany({_id: {$in: thoughtIds}})
                .then(console.log)
                res.status(200).json(userData)
            })
            .catch(err => res.json(err))
    },

    //delete a user
    // deleteUser({ params }, res) {
    //     User.findOneAndDelete({ _id: params.id })
    //         .then(dbUserData => {
    //             if (!dbUserData) {
    //                 res.status(404).json({ message: 'No user found with this id' });
    //                 return;
    //             }

    //             const thoughtIds = dbUserData.thoughts
    //             Thought.deleteMany({_id: {$in: thoughtIds}})
    //             .then(console.log)
    //             res.status(200).json(userData)
    //         })
    //         .catch(err => res.status(500).json(err))

                //res.json(dbUserData);
                //return dbUserData;
            
            // .then(dbUserData => {
            //     Thought.deleteMany({ username: dbUserData.username })
            //     .then(dbThoughtData => {
            //         console.log(dbThoughtData);
            //         return dbUserData;
            //     })
            // })
            // .then(dbUserData => {
            //     User.updateMany(
            //         { 'friends': dbUserData._id }, 
            //         { $pull: { friends: dbUserData._id } }, 
            //         { new: true })
            //     .then(dbUpdateData => {
            //         console.log(dbUpdateData);
            //         res.json(dbUserData);
            //     })
            // })
            // .catch(err => res.status(400).json(err));

    // },

    
    addFriend({ params: { userId, friendId } }, res) {  
        User.findByIdAndUpdate(
            { $addToSet: { friends: friendId } },
            // { _id: params.userId },
            // { $push: { friends: params.friendId } }, 
            { new: true }
        )
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },
    
    removeFriend({ params: { userId, friendId } }, res) {
        User.findOneAndUpdate(
            userId ,
            { $pull: { friends: friendId } },
            { new: true }
        )
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.json(err));
        
    }
    

};

module.exports = userController;