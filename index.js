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
const sortTeams = require('./public/js/sorter');
const insertEvents = require('./public/js/seedingEvents');
const { events, findOne } = require('./models/teams');
const cookieParser = require('cookie-parser')
const sessions = require('express-session');
const e = require('express');
const { count } = require('console');
const config = require('./config')


async function forceSchedule() {
    await insertTeams()
    // await algorithm()
    // await sortTeams()
    // await insertEvents()
    // await addElements()
}

forceSchedule()

mongoose.connect('mongodb://127.0.0.1:27017/vexScouting', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('mongo connection open: index')
    })
    .catch((err) => {
        console.log('mongo error')
        console.log(err)
    })

let running = false;

cron.schedule('0 4,16 * * *', async function () {
    if (running === false) {
        running = true;
        console.log('scheduled')
        await insertTeams()
        await algorithm()
        await sortTeams()
        running = false;
    }
})

cron.schedule('1 * * * *', async function () {
    if (running === false) {
        console.log('Seeding Events')
        await insertEvents()
    }
})

// const MONGODB_URI = process.env.MONGODB_URL || "mongodb://0.0.0.0:27017/vexScouting";
const sixh = 1000 * 60 * 60 * 6;
app.use(sessions({
    secret: "verynicecoolsecretkey123123123123",
    saveUninitialized: true,
    cookie: { maxAge: sixh },
    resave: false
}));
app.use(cookieParser());

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));
app.use(express.static('public'));


const myusername = config.username;
const mypassword = config.password;
let session = false;

app.get('/', (req, res) => {
    session = req.session;
    if (session.userid) {
        res.redirect('/teams/worlds')
    } else {
        const query = req.query.incorrect;
        if (query) {
            const incorrect = true;
            res.render('login', { root: __dirname, incorrect })
        } else {
            const incorrect = false;
            res.render('login', { root: __dirname, incorrect })
        }
    }
});

app.post('/user', (req, res) => {
    if (req.body.username == myusername && req.body.password == mypassword) {
        session = req.session;
        session.userid = req.body.username;
        res.redirect('/teams/worlds')
    }
    else {
        res.redirect('/?incorrect=true')
    }
})

app.post('/team/', async (req, res) => {
    if (session.userid) {
        const searcher = req.body.teamSearcher;
        const usable = searcher.toUpperCase()
        const newTeam = await Team.findOne({ number: usable })
        if (newTeam !== null) {
            res.redirect(`/team/${newTeam.number}`)
        } else {
            const type = 'team';
            res.render('default', { type, searcher })
        }
    } else {
        res.redirect('/')
    }
})

app.get('/teams/worlds', async (req, res) => {
    if (session.userid) {
        const teams = await Team.find({})
        res.render('worlds', { teams })
    } else {
        res.redirect('/')
    }
})

app.get('/teams/nj', async (req, res) => {
    if (session.userid) {
        const teams = await Team.find({})
        const newArr = []
        for (team of teams) {
            if (team.location.region === 'New Jersey') {
                newArr.push(team)
            }
        }
        res.render('nj', { teams: newArr })
    } else {
        res.redirect('/')
    }
})

app.get('/team/:teamNumber', async (req, res) => {
    if (session.userid) {
        const { teamNumber } = req.params;
        const usable = teamNumber.toUpperCase()
        const foundTeam = await Team.find({ number: usable })
        const teamObject = foundTeam[0];
        let eventT = false;

        const event = req.query.event;
        if (event) {
            eventT = true;
            const foundEvent = await allevents.findOne({ id: event })

            res.render('team', { team: teamObject, eventT, foundEvent })
        } else {
            res.render('team', { team: teamObject, eventT })
        }
    } else {
        res.redirect('/')
    }
})

app.get('/event/:id', async (req, res) => {
    if (session.userid) {
        const { id } = req.params;
        const foundEvent = await allevents.find({ id: id });
        const foundEventObj = foundEvent[0];

        res.render('eventOne', { event: foundEventObj })
    } else {
        res.redirect('/')
    }
})

app.post('/event/', async (req, res) => {
    if (session.userid) {
        let searcher = req.body.eventSearcher;
        const newEvent = await allevents.findOne({ id: searcher })

        if (newEvent !== null) {
            res.redirect(`/event/${newEvent.id}`)
        } else {
            const type = 'event';
            res.render('default', { type, searcher })
        }
    } else {
        res.redirect('/')
    }
})

app.get('/events', async (req, res) => {
    if (session.userid) {
        let filtered = false;

        var pastInc;
        var reg;
        var countr;
        var lvl;

        pastInc = req.query.pastIncluded;
        reg = req.query.region;
        countr = req.query.country;
        lvl = req.query.level;

        if ((pastInc !== undefined) || (reg !== undefined) || (countr !== undefined) || (lvl !== undefined)) {
            if (pastInc) {
                const events = await allevents.find({});
                filtered = true;
                res.render('event', { events, filtered })
            }

            if (reg) {
                const arr = [];
                const events = await Event.find({})
                filtered = true;
                for (event1 of events) {
                    const location = event1.location.region;
                    if (location) {
                        const lower = location.toLowerCase()
                        if (lower === reg) {
                            arr.push(event1)
                        }
                    }
                }
                res.render('event', { events: arr, filtered })
            }

            if (countr) {
                const arr = [];
                const events = await Event.find({})
                filtered = true;
                for (event1 of events) {
                    const location = event1.location.country;
                    if (location) {
                        const lower = location.toLowerCase()
                        if (lower === countr) {
                            arr.push(event1)
                        }
                    }
                }
                res.render('event', { events: arr, filtered })
            }

            if (lvl) {
                const arr = [];
                const events = await Event.find({})
                filtered = true;
                for (event1 of events) {
                    const level = event1.level;
                    const lower = level.toLowerCase()
                    if (lower === lvl) {
                        arr.push(event1)
                    }
                }
                res.render('event', { events: arr, filtered })

            }
        } else {
            const events = await Event.find({})
            res.render('event', { events, filtered })
        }
    } else {
        res.redirect('/')
    }
})

app.get('/events/pastIncluded', async (req, res) => {
    if (session.userid) {
        // const events = await allevents.find({});
        // res.render('pastIncluded', { events })
        res.redirect('/events?pastIncluded=true')
    } else {
        res.redirect('/')
    }
})


app.post('/events/pastIncluded', async (req, res) => {
    if (session.userid) {
        res.redirect('/events?pastIncluded=true')
    } else {
        res.redirect('/')
    }
})

app.get('/events/region/:region', async (req, res) => {
    if (session.userid) {
        const { region: place } = req.params;
        const placelower = place.toLowerCase()

        // const events = []
        // for (lists of list) {
        //     const region2 = lists.location.region;
        //     if (region2 !== null) {
        //         const lower = region2.toLowerCase()
        //         if (lower === placelower) {
        //             events.push(lists);
        //         }
        //     }
        // }

        res.redirect(`/events?region=${placelower}`)
    } else {
        res.redirect('/')
    }
})

app.get('/events/country/:country', async (req, res) => {
    if (session.userid) {
        const { country: place } = req.params;
        const placelower = place.toLowerCase()

        // const events = []
        // for (lists of list) {
        //     const region2 = lists.location.country;
        //     if (region2 !== null) {
        //         const lower = region2.toLowerCase()
        //         if (lower === placelower) {
        //             events.push(lists);
        //         }
        //     }
        // }

        res.redirect(`/events?country=${placelower}`)
    } else {
        res.redirect('/')
    }
})

app.post('/events/region/', async (req, res) => {
    if (session.userid) {
        const region = req.body.search;
        res.redirect(`/events/region/${region}`)
    } else {
        res.redirect('/')
    }
})

app.post('/events/country/', async (req, res) => {
    if (session.userid) {
        const country = req.body.search;
        res.redirect(`/events/country/${country}`)
    } else {
        res.redirect('/')
    }
})

app.get('/events/level/:level', async (req, res) => {
    if (session.userid) {
        const { level } = req.params;
        const lvllower = level.toLowerCase()

        // const events = []
        // for (lists of list) {
        //     const leveled = lists.level;
        //     if (leveled !== null) {
        //         const lower = leveled.toLowerCase()
        //         if (lower === lvllower) {
        //             events.push(lists);
        //         }
        //     }
        // }

        res.redirect(`/events?level=${lvllower}`)
    } else {
        res.redirect('/')
    }
})

app.post('/events/level', async (req, res) => {
    if (session.userid) {
        const level = req.body.select;
        res.redirect(`/events/level/${level}`)
    } else {
        res.redirect('/')
    }
})

app.get('/matchpicker', async (req, res) => {
    if (session.userid) {
        let filtered = false;

        var pastInc;
        var reg;
        var countr;
        var lvl;

        pastInc = req.query.pastIncluded;
        reg = req.query.region;
        countr = req.query.country;
        lvl = req.query.level;

        if ((pastInc !== undefined) || (reg !== undefined) || (countr !== undefined) || (lvl !== undefined)) {
            if (pastInc) {
                const events = await allevents.find({});
                filtered = true;
                res.render('picker', { events, filtered })
            }

            if (reg) {
                const arr = [];
                const events = await Event.find({})
                filtered = true;
                for (event1 of events) {
                    const location = event1.location.region;
                    if (location) {
                        const lower = location.toLowerCase()
                        if (lower === reg) {
                            arr.push(event1)
                        }
                    }
                }
                res.render('picker', { events: arr, filtered })
            }

            if (countr) {
                const arr = [];
                const events = await Event.find({})
                filtered = true;
                for (event1 of events) {
                    const location = event1.location.country;
                    if (location) {
                        const lower = location.toLowerCase()
                        if (lower === countr) {
                            arr.push(event1)
                        }
                    }
                }
                res.render('picker', { events: arr, filtered })
            }

            if (lvl) {
                const arr = [];
                const events = await Event.find({})
                filtered = true;
                for (event1 of events) {
                    const level = event1.level;
                    const lower = level.toLowerCase()
                    if (lower === lvl) {
                        arr.push(event1)
                    }
                }
                res.render('picker', { events: arr, filtered })

            }
        } else {
            const events = await Event.find({})
            res.render('picker', { events, filtered })
        }
    } else {
        res.redirect('/')
    }
})

app.get('/matchpicker/region/:region', async (req, res) => {
    if (session.userid) {
        const { region: place } = req.params;
        const placelower = place.toLowerCase()

        // const events = []
        // for (lists of list) {
        //     const region2 = lists.location.region;
        //     if (region2 !== null) {
        //         const lower = region2.toLowerCase()
        //         if (lower === placelower) {
        //             events.push(lists);
        //         }
        //     }
        // }

        res.redirect(`/matchpicker?region=${placelower}`)
    } else {
        res.redirect('/')
    }
})

app.get('/matchpicker/country/:country', async (req, res) => {
    if (session.userid) {
        const { country: place } = req.params;
        const placelower = place.toLowerCase()

        // const events = []
        // for (lists of list) {
        //     const region2 = lists.location.country;
        //     if (region2 !== null) {
        //         const lower = region2.toLowerCase()
        //         if (lower === placelower) {
        //             events.push(lists);
        //         }
        //     }
        // }

        res.redirect(`/matchpicker?country=${placelower}`)
    } else {
        res.redirect('/')
    }
})

app.post('/matchpicker/region/', async (req, res) => {
    if (session.userid) {
        const region = req.body.search;
        res.redirect(`/matchpicker/region/${region}`)
    } else {
        res.redirect('/')
    }
})

app.post('/matchpicker/country/', async (req, res) => {
    if (session.userid) {
        const country = req.body.search;
        res.redirect(`/matchpicker/country/${country}`)
    } else {
        res.redirect('/')
    }
})

app.get('/matchpicker/level/:level', async (req, res) => {
    if (session.userid) {
        const { level } = req.params;
        const lvllower = level.toLowerCase()

        res.redirect(`/matchpicker?level=${lvllower}`)
    } else {
        res.redirect('/')
    }
})

app.post('/matchpicker/level', async (req, res) => {
    if (session.userid) {
        const level = req.body.select;
        res.redirect(`/matchpicker/level/${level}`)
    } else {
        res.redirect('/')
    }
})

app.get('/picker/:id', async (req, res) => {
    if (session.userid) {
        const { id } = req.params;
        const query = req.query;
        const foundEvent = await allevents.find({ id: id });
        const foundEventObj = foundEvent[0];
        const teams = foundEventObj.teamID;
        const usedArr = [];

        let filtered = false;

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

        if (query.options) {
            const finalCopy = finalArr;
            const keys = Object.keys(query);
            for (key of keys) {
                // console.log(key)
                // console.log(query)
                if (key == 'fourmd') {
                    for (finalCop of finalCopy) {
                        if (finalCop.fourmdrive) {
                            finalCop.trueSkill += 3;
                        }
                    }
                } if (key == 'twomd') {
                    for (finalCop of finalCopy) {
                        if (finalCop.twomdrive) {
                            finalCop.trueSkill += 3;
                        }
                    }
                } if (key == 'sixmd') {
                    for (finalCop of finalCopy) {
                        if (finalCop.sixmdrive) {
                            finalCop.trueSkill += 3;
                        }
                    }
                } if (key == 'onemf') {
                    for (finalCop of finalCopy) {
                        if (finalCop.snflywheel) {
                            finalCop.trueSkill += 3;
                        }
                    }
                } if (key == 'twomf') {
                    for (finalCop of finalCopy) {
                        if (finalCop.dbflywheel) {
                            finalCop.trueSkill += 3;
                        }
                    }
                } if (key == 'aut') {
                    for (finalCop of finalCopy) {
                        if (finalCop.auton) {
                            finalCop.trueSkill += 3;
                        }
                    }
                } if (key == 'cata') {
                    for (finalCop of finalCopy) {
                        if (finalCop.cata) {
                            finalCop.trueSkill += 3;
                        }
                    }
                } if (key == 'autwp') {
                    for (finalCop of finalCopy) {
                        if (finalCop.wpauton) {
                            finalCop.trueSkill += 3;
                        }
                    }
                }
            }

            filtered = true;
            res.render('pickerOne', { event: foundEventObj, sorted: finalCopy, filtered, id })
        } else {
            res.render('pickerOne', { event: foundEventObj, sorted: finalArr, filtered, id })
        }

        // for (finalAr of finalArr) {
        //     console.log(finalAr)
        // }
    } else {
        res.redirect('/')
    }
})


app.post('/picker/', async (req, res) => {
    if (session.userid) {
        let searcher = req.body.eventSearcher;
        if (searcher > 0) {
            const newEvent = await allevents.findOne({ id: searcher })
            if (newEvent) {
                if (newEvent !== null) {
                    res.redirect(`/picker/${newEvent.id}`)
                } else {
                    const type = 'event';
                    res.render('default', { type, searcher })
                }
            } else {
                const type = 'event';
                res.render('default', { type, searcher })
            }
        } else {
            const type = 'event';
            res.render('default', { type, searcher })
        }
    } else {
        res.redirect('/')
    }
})

app.post('/boxes/:id', async (req, res) => {
    if (session.userid) {
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
    } else {
        res.redirect('/')
    }
})

app.get('/display/:event/:number', async (req, res) => {
    if (session.userid) {
        const { number, event } = req.params;
        // const team = await Team.findOne({ number: number })
        // const foundEvent = await allevents.findOne({ id: event })

        // res.render('displayPicker', { team, foundEvent })

        res.redirect(`/team/${number}?event=${event}`)
    } else {
        res.redirect('/')
    }
})

app.post('/picker/:id/filtered', async (req, res) => {
    if (session.userid) {
        const select = req.body.selectBox;
        const { id } = req.params;

        // const foundEvent = await allevents.find({ id: id });
        // const foundEventObj = foundEvent[0];
        // const teams = foundEventObj.teamID;
        // const usedArr = [];

        // function compare(a, b) {
        //     if (a.trueSkill > b.trueSkill) {
        //         return -1;
        //     }
        //     if (a.trueSkill < b.trueSkill) {
        //         return 1;
        //     }
        //     return 0;
        // }

        // for (team of teams) {
        //     const usableTeam = await Team.find({ id: team })
        //     const canUse = usableTeam[0]
        //     if (canUse) {
        //         usedArr.push(canUse);
        //     }
        // }

        // const sorted = usedArr.sort(compare)

        // const finalArr = []
        // for (sort of sorted) {
        //     const usable = sort;
        //     finalArr.push(usable)
        // }


        const options = [];
        // if (select) {
        //     for (option of select) {
        //         if (option == 'fourmd') {
        //             for (finalAr of finalArr) {
        //                 if (finalAr.fourmdrive) {
        //                     finalAr.trueSkill += 3;
        //                 }
        //             }
        //         } if (option == 'twomd') {
        //             for (finalAr of finalArr) {
        //                 if (finalAr.twomdrive) {
        //                     finalAr.trueSkill += 3;
        //                 }
        //             }
        //         } if (option == 'sixmd') {
        //             for (finalAr of finalArr) {
        //                 if (finalAr.sixmdrive) {
        //                     finalAr.trueSkill += 3;
        //                 }
        //             }
        //         } if (option == 'onemf') {
        //             for (finalAr of finalArr) {
        //                 if (finalAr.snflywheel) {
        //                     finalAr.trueSkill += 3;
        //                 }
        //             }
        //         } if (option == 'twomf') {
        //             for (finalAr of finalArr) {
        //                 if (finalAr.dbflywheel) {
        //                     finalAr.trueSkill += 3;
        //                 }
        //             }
        //         } if (option == 'aut') {
        //             for (finalAr of finalArr) {
        //                 if (finalAr.auton) {
        //                     finalAr.trueSkill += 3;
        //                 }
        //             }
        //         } if (option == 'cata') {
        //             for (finalAr of finalArr) {
        //                 if (finalAr.cata) {
        //                     finalAr.trueSkill += 3;
        //                 }
        //             }
        //         } if (option == 'autwp') {
        //             for (finalAr of finalArr) {
        //                 if (finalAr.wpauton) {
        //                     finalAr.trueSkill += 3;
        //                 }
        //             }
        //         }
        //     }
        // }

        if (select) {
            for (option of select) {
                if (option.length === 1) {
                    if (select == 'fourmd') {
                        options.push('fourmd')
                    }
                    if (select == 'twomd') {
                        options.push('twomd')
                    }
                    if (select == 'sixmd') {
                        options.push('sixmd')
                    }
                    if (select == 'onemf') {
                        options.push('onemf')
                    }
                    if (select == 'twomf') {
                        options.push('twomf')
                    }
                    if (select == 'aut') {
                        options.push('aut')
                    }
                    if (select == 'cata') {
                        options.push('cata')
                    }
                    if (select == 'autwp') {
                        options.push('autwp')
                    }
                    break;
                } else {
                    if (option == 'fourmd') {
                        options.push('fourmd')
                    }
                    if (option == 'twomd') {
                        options.push('twomd')
                    }
                    if (option == 'sixmd') {
                        options.push('sixmd')
                    }
                    if (option == 'onemf') {
                        options.push('onemf')
                    }
                    if (option == 'twomf') {
                        options.push('twomf')
                    }
                    if (option == 'aut') {
                        options.push('aut')
                    }
                    if (option == 'cata') {
                        options.push('cata')
                    }
                    if (option == 'autwp') {
                        options.push('autwp')

                    }
                }
            }

            let string = `/picker/${id}?options=true`;
            // console.log('options', options)
            for (option of options) {
                string += `&${option}=true`
            }
            res.redirect(string)
        } else {
            res.redirect(`/picker/${id}`)
        }


    } else {
        res.redirect('/')
    }
})

app.get('/info', (req, res) => {
    if (session.userid) {
        res.render('info')
    } else {
        res.redirect('/')
    }
})

// app.get('/picker/:id/filtered', async (req, res) => {
//     if (session.userid) {
//         const type = 'event';
//         const searcher = req.params.id;
//         res.render('default', { type, searcher })
//     } else {
//         res.redirect('/')
//     }
// })

app.get('/picker/filtered/pastIncluded', async (req, res) => {
    if (session.userid) {
        res.redirect('/matchpicker?pastIncluded=true')
    } else {
        res.redirect('/')
    }
})


app.post('/picker/filtered/', async (req, res) => {
    if (session.userid) {
        res.redirect('pastIncluded')
    } else {
        res.redirect('/')
    }
})

app.get('*', async (req, res) => {
    if (session.userid) {
        res.render('unkown')
    } else {
        res.redirect('/')
    }
})

app.post('*', async (req, res) => {
    if (session.userid) {
        res.render('unkown')
    } else {
        res.redirect('/')
    }
})

const PORT = 3000;
// app.listen(PORT, () => console.log(`Server is listening on port ${PORT}...`));

app.listen(PORT, () => {
    // console.log(`Listening on Port ${PORT}`)
    console.log("Listening")
})
