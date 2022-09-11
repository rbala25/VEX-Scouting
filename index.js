const express = require('express')
const app = express();
const path = require('path');
const mongoose = require('mongoose');
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
const cron = require('node-cron');

const Team = require('./models/teams');
const Event = require('./models/upcomingEvents');
const allevents = require('./models/allEvents');
const insertTeams = require('./public/js/seedingTeams')
const algorithm = require('./public/js/algorithm');
const sortTeams = require('./public/js/sorter')
const insertEvents = require('./public/js/seedingEvents');
const { events, findOne } = require('./models/teams');
const { on } = require('events');
const e = require('express');

async function forceSchedule() {
    // await insertTeams()
    // await algorithm()
    // await sortTeams()
    // await insertEvents()
}

// forceSchedule()

cron.schedule('0 */12 * * *', async () => {
    console.log('scheduled')
    await insertTeams()
    await algorithm()
    sortTeams()
})

cron.schedule('0 * * * *', async () => {
    console.log('Seeding Events')
    await insertEvents()
})

// cron.schedule('* * * * *', () => {
//     console.log('scheduled')
//     insertTeams()
// })


mongoose.connect('mongodb://localhost:27017/vexScouting')
    .then(() => {
        console.log('mongo connection open: index')
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
app.use(express.static('public'));


app.post('/team/', async (req, res) => {
    const searcher = req.body.teamSearcher;
    const newTeam = await Team.findOne({ number: searcher })

    if (newTeam !== null) {
        res.redirect(`/team/${newTeam.number}`)
    } else {
        const type = 'team';
        res.render('default', { type, searcher })
    }
})

app.get('/teams/worlds', async (req, res) => {
    const teams = await Team.find({})
    res.render('worlds', { teams })
})

app.get('/teams/nj', async (req, res) => {
    const teams = await Team.find({})
    const newArr = []
    for (team of teams) {
        if (team.location.region === 'New Jersey') {
            newArr.push(team)
        }
    }
    res.render('nj', { teams: newArr })
})

app.get('/team/:teamNumber', async (req, res) => {
    const { teamNumber } = req.params;
    const foundTeam = await Team.find({ number: teamNumber })
    const teamObject = foundTeam[0];

    res.render('team', { team: teamObject })
})

app.get('/event/:id', async (req, res) => {
    const { id } = req.params;
    const foundEvent = await allevents.find({ id: id });
    const foundEventObj = foundEvent[0];

    res.render('eventOne', { event: foundEventObj })
})

app.post('/event/', async (req, res) => {
    let searcher = req.body.eventSearcher;
    const newEvent = await allevents.findOne({ id: searcher })

    if (newEvent !== null) {
        res.redirect(`/event/${newEvent.id}`)
    } else {
        const type = 'event';
        res.render('default', { type, searcher })
    }
})

app.get('/events', async (req, res) => {
    const events = await Event.find({})
    // const allEvents = await allevents.find({})
    res.render('event', { events })
})

app.get('/events/pastIncluded', async (req, res) => {
    const events = await allevents.find({});
    res.render('pastIncluded', { events })
})


app.post('/events/pastIncluded', async (req, res) => {
    res.redirect('pastIncluded')
})

app.get('/events/region/:region', async (req, res) => {
    const { region: place } = req.params;
    const list = await Event.find({});
    const placelower = place.toLowerCase()

    const events = []
    for (lists of list) {
        const region2 = lists.location.region;
        if (region2 !== null) {
            const lower = region2.toLowerCase()
            if (lower === placelower) {
                events.push(lists);
            }
        }
    }

    res.render('specificplace', { events, place })
})

app.get('/events/country/:country', async (req, res) => {
    const { country: place } = req.params;
    const list = await Event.find({});
    const placelower = place.toLowerCase()

    const events = []
    for (lists of list) {
        const region2 = lists.location.country;
        if (region2 !== null) {
            const lower = region2.toLowerCase()
            if (lower === placelower) {
                events.push(lists);
            }
        }
    }

    res.render('specificplace', { events, place })
})

app.post('/events/region/', async (req, res) => {
    const region = req.body.search;
    res.redirect(`/events/region/${region}`)
})

app.post('/events/country/', async (req, res) => {
    const country = req.body.search;
    res.redirect(`/events/country/${country}`)
})

app.get('/events/level/:level', async (req, res) => {
    const { level } = req.params;
    const list = await Event.find({});
    const lvllower = level.toLowerCase()

    const events = []
    for (lists of list) {
        const leveled = lists.level;
        if (leveled !== null) {
            const lower = leveled.toLowerCase()
            if (lower === lvllower) {
                events.push(lists);
            }
        }
    }

    res.render('level', { events, level })
})

app.post('/events/level', async (req, res) => {
    const level = req.body.select;
    res.redirect(`/events/level/${level}`)
})

app.get('/matchpicker', async (req, res) => {
    const events = await Event.find({})
    // const allEvents = await allevents.find({})
    res.render('picker', { events })
})

app.get('/matchpicker/region/:region', async (req, res) => {
    const { region: place } = req.params;
    const list = await Event.find({});
    const placelower = place.toLowerCase()

    const events = []
    for (lists of list) {
        const region2 = lists.location.region;
        if (region2 !== null) {
            const lower = region2.toLowerCase()
            if (lower === placelower) {
                events.push(lists);
            }
        }
    }

    res.render('specificplacepick', { events, place })
})

app.get('/matchpicker/country/:country', async (req, res) => {
    const { country: place } = req.params;
    const list = await Event.find({});
    const placelower = place.toLowerCase()

    const events = []
    for (lists of list) {
        const region2 = lists.location.country;
        if (region2 !== null) {
            const lower = region2.toLowerCase()
            if (lower === placelower) {
                events.push(lists);
            }
        }
    }

    res.render('specificplacepick', { events, place })
})

app.post('/matchpicker/region/', async (req, res) => {
    const region = req.body.search;
    res.redirect(`/matchpicker/region/${region}`)
})

app.post('/matchpicker/country/', async (req, res) => {
    const country = req.body.search;
    res.redirect(`/matchpicker/country/${country}`)
})

app.get('/matchpicker/level/:level', async (req, res) => {
    const { level } = req.params;
    const list = await Event.find({});
    const lvllower = level.toLowerCase()

    const events = []
    for (lists of list) {
        const leveled = lists.level;
        if (leveled !== null) {
            const lower = leveled.toLowerCase()
            if (lower === lvllower) {
                events.push(lists);
            }
        }
    }

    res.render('levelteampicker', { events, level })
})

app.post('/matchpicker/level', async (req, res) => {
    const level = req.body.select;
    res.redirect(`/matchpicker/level/${level}`)
})

app.get('/picker/:id', async (req, res) => {
    const { id } = req.params;
    const foundEvent = await allevents.find({ id: id });
    const foundEventObj = foundEvent[0];
    const teams = foundEventObj.teamID;
    const usedArr = [];

    function compare(a, b) {
        if (a.trueSkill > b.trueSkill) {
            return -1;
        }
        if (a.trueSkill < b.trueSkill) {
            return 1;
        }
        return 0;
    }

    for (team of teams) {
        const usableTeam = await Team.find({ id: team })
        const canUse = usableTeam[0]
        if (canUse) {
            usedArr.push(canUse);
        }
    }

    const sorted = usedArr.sort(compare)

    const finalArr = []
    for (sort of sorted) {
        const usable = sort;
        finalArr.push(usable)
    }

    // for (finalAr of finalArr) {
    //     console.log(finalAr)
    // }
    res.render('pickerOne', { event: foundEventObj, sorted: finalArr })
})


app.post('/picker/', async (req, res) => {
    let searcher = req.body.eventSearcher;
    if (searcher.type !== Number) {
        const type = 'event';
        res.render('default', { type, searcher })
    } else {
        const newEvent = await allevents.findOne({ id: searcher })

        console.log(newEvent)
        if (newEvent !== null) {
            res.redirect(`/picker/${newEvent.id}`)
        } else {
            const type = 'event';
            res.render('default', { type, searcher })
        }
    }
})

app.post('/boxes/:id', async (req, res) => {
    const { id } = req.params;
    const checker = await Team.findOne({ id: id })
    if (!checker) {
        const type = 'team';
        const searcher = id
        res.render('default', { type, searcher })
    } else {
        let { fourmd, twomd, sixmd, twomf, onemf, cata, aut, autwp } = req.body;

        if (fourmd === 'on') {
            await Team.findOneAndUpdate({ id: id }, { fourmdrive: true })
        }
        else {
            await Team.findOneAndUpdate({ id: id }, { fourmdrive: false })
        }
        if (twomd === 'on') {
            await Team.findOneAndUpdate({ id: id }, { twomdrive: true })
        }
        else {
            await Team.findOneAndUpdate({ id: id }, { twomdrive: false })
        }
        if (sixmd === 'on') {
            await Team.findOneAndUpdate({ id: id }, { sixmdrive: true })
        } else {
            await Team.findOneAndUpdate({ id: id }, { sixmdrive: false })
        }
        if (twomf === 'on') {
            await Team.findOneAndUpdate({ id: id }, { dbflywheel: true })
        } else {
            await Team.findOneAndUpdate({ id: id }, { dbflywheel: false })
        }
        if (onemf === 'on') {
            await Team.findOneAndUpdate({ id: id }, { snflywheel: true })
        } else {
            await Team.findOneAndUpdate({ id: id }, { snflywheel: false })
        }
        if (cata === 'on') {
            await Team.findOneAndUpdate({ id: id }, { cata: true })
        } else {
            await Team.findOneAndUpdate({ id: id }, { cata: false })
        }
        if (aut === 'on') {
            await Team.findOneAndUpdate({ id: id }, { auton: true })
            // const team = await findOne({ id: id })
            // console.log(team)
        } else {
            await Team.findOneAndUpdate({ id: id }, { auton: false })
        }
        if (autwp === 'on') {
            await Team.findOneAndUpdate({ id: id }, { wpauton: true })
        } else {
            await Team.findOneAndUpdate({ id: id }, { wpauton: false })
        }

        res.redirect('/teams/worlds')
    }
})

app.get('/display/:event/:number', async (req, res) => {
    const { number, event } = req.params;
    const team = await Team.findOne({ number: number })
    const foundEvent = await allevents.findOne({ id: event })

    res.render('displayPicker', { team, foundEvent })
})

app.post('/picker/:id/filtered', async (req, res) => {
    const select = req.body.selectBox;
    const { id } = req.params;

    const foundEvent = await allevents.find({ id: id });
    const foundEventObj = foundEvent[0];
    const teams = foundEventObj.teamID;
    const usedArr = [];

    function compare(a, b) {
        if (a.trueSkill > b.trueSkill) {
            return -1;
        }
        if (a.trueSkill < b.trueSkill) {
            return 1;
        }
        return 0;
    }

    for (team of teams) {
        const usableTeam = await Team.find({ id: team })
        const canUse = usableTeam[0]
        if (canUse) {
            usedArr.push(canUse);
        }
    }

    const sorted = usedArr.sort(compare)

    const finalArr = []
    for (sort of sorted) {
        const usable = sort;
        finalArr.push(usable)
    }

    if (select) {
        for (option of select) {
            if (option == 'fourmd') {
                for (finalAr of finalArr) {
                    if (finalAr.fourmdrive) {
                        finalAr.trueSkill += 3;
                    }
                }
            } if (option == 'twomd') {
                for (finalAr of finalArr) {
                    if (finalAr.twomdrive) {
                        finalAr.trueSkill += 3;
                    }
                }
            } if (option == 'sixmd') {
                for (finalAr of finalArr) {
                    if (finalAr.sixmdrive) {
                        finalAr.trueSkill += 3;
                    }
                }
            } if (option == 'onemf') {
                for (finalAr of finalArr) {
                    if (finalAr.snflywheel) {
                        finalAr.trueSkill += 3;
                    }
                }
            } if (option == 'twomf') {
                for (finalAr of finalArr) {
                    if (finalAr.dbflywheel) {
                        finalAr.trueSkill += 3;
                    }
                }
            } if (option == 'aut') {
                for (finalAr of finalArr) {
                    if (finalAr.auton) {
                        finalAr.trueSkill += 3;
                    }
                }
            } if (option == 'cata') {
                for (finalAr of finalArr) {
                    if (finalAr.cata) {
                        finalAr.trueSkill += 3;
                    }
                }
            } if (option == 'autwp') {
                for (finalAr of finalArr) {
                    if (finalAr.wpauton) {
                        finalAr.trueSkill += 3;
                    }
                }
            }
        }
    }


    res.render('filtered', { sorted: finalArr, event: foundEventObj })

    // let { fourmd, twomd, sixmd, twomf, onemf, cata, aut, autwp } = req.body;
    // if (fourmd === 'on') {

    // } if (twomd === 'on') {

    // } if (cata === 'on') {

    // } if (autwp === 'on') {

    // } if (aut === 'on') {

    // } if (sixmd === 'on') {

    // } if (twomf === 'on') {

    // } if (onemf === 'on') {

    // }

})

app.get('/info', (req, res) => {
    res.render('info')
})

app.listen(3000, () => {
    console.log("Listening on Port 300")
})
