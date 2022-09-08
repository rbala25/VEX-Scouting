const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    id: Number,
    number: String,
    team_name: String,
    robot_name: String,
    organization: String,
    location: {
        venue: String,
        address_1: String,
        address_2: String,
        city: String,
        region: String,
        postcode: String,
        country: String,
        coordinates: {
            lat: Number,
            lon: Number
        }
    },
    registered: Boolean,
    program: {
        id: Number,
        name: String,
        code: String
    },
    grade: String,
    skills: {
        driving: Number,
        auton: Number,
        total: Number
    },
    rankings: {
        wins: Number,
        losses: Number,
        weightedRate: Number,
        unweightedRate: Number,
        avgSoS: Number
    },
    worlds: Boolean,
    awards: {
        excellence: Number,
        champion: Number,
        skills: Number,
        finalist: Number,
        skills2: Number,
        skills3: Number,
        think: Number,
    },
    tpawards: {
        excellence: Number,
        champion: Number,
        skills: Number,
        finalist: Number,
        skills2: Number,
        skills3: Number,
        think: Number,
    },
    trueSkill: Number,
    showableTrueSkill: Number,
    worldSkillsRank: Number,
    fourmdrive: Boolean,
    twomdrive: Boolean,
    sixmdrive: Boolean,
    dbflywheel: Boolean,
    snflywheel: Boolean,
    cata: Boolean,
    auton: Boolean,
    wpauton: Boolean,
})

const Team = mongoose.model('Team', teamSchema);


module.exports = Team;