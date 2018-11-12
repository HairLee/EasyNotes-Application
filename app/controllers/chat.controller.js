const Message = require('../models/chat.message.js');

exports.create = (req, res) => {
    // Validate request
    if(!req.body.message) {
        return res.status(400).send({
            message: "Message content can not be empty"
        });
    }

    // Create a Note
    const note = new Message({

        userId: req.body.userId || "1",
        message: req.body.message
    });

    // Save Note in the database
    note.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Note."
        });
    });
};


exports.findAll = (req, res) => {
    Message.find()
    .then(messages => {
        res.send(messages);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });
};
