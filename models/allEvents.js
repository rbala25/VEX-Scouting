const mongoose = require('mongoose');

const alleventschema = new mongoose.Schema({
    id: Number,
    sku: String,
    name: String,
    start: String,
    end: String,
    season: {
        id: Number,
        name: String,
    },
    location: {
        venue: String,
        address1: String,
        city: String,
        region: String,
        postcode: String,
        country: String,
    },
    divisions: [
        {
            id: Number,
            name: String,
            order: Number
        }
    ],
    level: String,
    ongoing: Boolean,
    awards_finalized: Boolean,
    unformatStart: String,
    unformatEnd: String,
    // teamID: {
    //     type: Array,
    //     require: true,
    //     default: []
    // }
    teamID: Array
})

const allevents = mongoose.model('allevents', alleventschema);
module.exports = allevents;