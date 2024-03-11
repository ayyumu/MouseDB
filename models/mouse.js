const mongoose = require('mongoose');

const mouseSchema = new mongoose.Schema({
    creator: String,
    name: {
        type: String,
        require: true,

    },
    weight: Number,
    length: Number,
    width: Number,
    height: Number,


    shape: {
        type: String,
        enum: ['symmetrical', 'ergonomic']
    },
    connection: {
        type: String,
        enum: ['Paracord', 'Vinyl Cable', 'wireless', 'wired']
    },
    sensor: String,

    pollRate: String,
    dpi: Number,
    surface: String,
    btnNum: Number,
    mainSw: String,
    trackSpd: Number,
    
    accel: Number,
    keyRes: Number,
    minLod: Number,
    maxLod: Number,
    battery: String,
    
    isRound: Boolean,
    led: Boolean,
    middleSw: String,
    description: String,
    originalURL: String,

    date: String,
    material: String,
    country: String,
    color: [String],
    amzn: String,
    tweet: String,

    clickForce: Number,
});

const Mouse = mongoose.model('Mouse', mouseSchema);

module.exports = Mouse;