const express = require('express')
const app = express();
const path = require('path');
const mongoose = require('mongoose');
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
const cron = require('node-cron');

const Team = require('./models/teams');
const insertTeams = require('./seedingTeams')
const algorithm = require('./algorithm');
const sortTeams = require('./sorter')

async function forceSchedule() {
    await insertTeams()
    await algorithm()
    await sortTeams()
}

forceSchedule()

// cron.schedule('0 */12 * * *', async () => {
//     console.log('scheduled')
//     await insertTeams()
//     await algorithm()
//     sortTeams()
// })

// cron.schedule('* * * * *', () => {
//     console.log('scheduled')
//     insertTeams()
// })


mongoose.connect('mongodb://localhost:27017/vexScouting')
    .then(() => {
        console.log('mongo connection open')
    })
    .catch((err) => {
        console.log('mongo error')
        console.log(err)
    })

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/public', express.static('public'));

app.post('/team/', async (req, res) => {
    const teamSearcher = req.body.teamSearcher;
    const newTeam = await Team.find({ number: teamSearcher })
    res.redirect(`/team/${newTeam[0].number}`)
})

app.get('/teams/worlds', async (req, res) => {
    const teams = await Team.find({})
    res.render('worlds', { teams })
})

app.get('/team/:teamNumber', async (req, res) => {
    const { teamNumber } = req.params;
    const foundTeam = await Team.find({ number: teamNumber })
    console.log(foundTeam[0])
    const teamObject = foundTeam[0];

    res.render('team', { team: teamObject })
})

app.listen(3000, () => {
    console.log("Listening on Port 300")
})
