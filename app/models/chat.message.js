const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    userId: String,
    socketId:String,
    message: String

}, {
    timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);
