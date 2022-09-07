const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
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
    unformatEnd: String
})

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;