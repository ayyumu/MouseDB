const mongoose = require('mongoose');

const msgCountSchema = new mongoose.Schema({
    ip: String,
    count: Number,
    expirationDate: Date
});

const MsgCount = mongoose.model('MsgCount', msgCountSchema);

module.exports = MsgCount;