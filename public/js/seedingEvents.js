const e = require('express');
const mongoose = require('mongoose');
const Event = require('../../models/upcomingEvents');
const allevents = require('../../models/allEvents');
const axios1 = require('axios').default;
const config = require('../../config')
const rateLimit = require('axios-rate-limit');

const axios = rateLimit(axios1.create(), { maxRequests: 1, perMilliseconds: 1000 })

mongoose.connect('mongodb://127.0.0.1:27017/vexScouting')
    .then(() => {
        console.log('mongo connection open: seedingEvents')
    })
    .catch((err) => {
        console.log('mongo error')
        console.log(err)
    })

let tester = 0;
async function getAuth() {
    tester++;
    if (tester === 1) {
        const auth = config.auth;
        return auth;
    } else if (tester === 2) {
        const auth = config.auth2;
        return auth;
    } else if (tester === 3) {
        const auth = config.auth3;
        return auth;
    } else if (tester === 4) {
        const auth = config.auth4;
        return auth;
    } else if (tester === 5) {
        const auth = config.auth5;
        tester = 0;
        return auth;
    } else {
        const auth = config.auth;
        return auth;
    }
}

async function reRun(str, e, config) {

    // let time = e.config.timeout;
    // let time = e.response.headers['retry-after']
    // console.log(time)

    await new Promise(r => setTimeout(r, 100));
    try {
        const res = await axios.get(str, config, { retry: 3, retryDelay: 3000 })
        return res;
    } catch (e) {
        e.error = true;

        return e;
    }
}

async function getEvents() {
    async function getFirst() {
        const config2 = { headers: { 'Authorization': 'Bearer ' + await getAuth() } }

        let res = null
        try {
            res = await axios.get(`https://www.robotevents.com/api/v2/events?season%5B%5D=181&myEvents=false&eventTypes%5B%5D=tournament&eventTypes%5B%5D=league&page=1&per_page=250`, config2)
        } catch (e) {
        }
        return res

    }
    async function getRest(res) {
        const iterator = res.data.meta.last_page;
        const arr = []
        for (i = 1; i <= iterator; i++) {
            const config = { headers: { 'Authorization': 'Bearer ' + await getAuth() } }
            const res2 = await axios.get(`https://www.robotevents.com/api/v2/events?season%5B%5D=181&myEvents=false&eventTypes%5B%5D=tournament&eventTypes%5B%5D=league&page=${i}&per_page=250`, config)
                .catch(async (e) => {
                    console.log(i);
                    let time = e.config.timeout;
                    // let time = e.response.headers['retry-after']
                    // console.log(time)
                    if (time === 0) {
                        time = 2000;
                    }

                    await new Promise(r => setTimeout(r, time));
                    const res12 = await axios.get(`https://www.robotevents.com/api/v2/events?season%5B%5D=181&myEvents=false&eventTypes%5B%5D=tournament&eventTypes%5B%5D=league&page=${i}&per_page=250`, config)
                    return res12;
                })

            console.log('on page ', i)
            const usables = res2.data.data;

            for (usable of usables) {
                arr.push(usable);
            }
        }
        return arr;
    }

    const res = await getFirst();

    const arr = await getRest(res);
    return arr;
}

async function getSecond() {
    let failCount = 0;
    console.log("Adding teams to Events")
    const usables = await getEvents();
    console.log('got events')
    let counter = 0;
    for (usable of usables) {
        try {
            // for (i = 0; i < 50; i++) {
            const arr = []
            // const usable = usables[i]
            console.log(usable.id, 'Team ', counter)
            counter++;
            const id = usable.id;
            const config = { headers: { 'Authorization': 'Bearer ' + await getAuth() } }

            let failTemp = false;
            const res2 = await axios.get(`https://www.robotevents.com/api/v2/events/${id}/teams?registered=true&myTeams=false&page=1&per_page=250`, config)
                .catch(async (e) => {
                    failTemp = true;
                    failCount++;
                    let res3 = null;
                    let iterator = 0;

                    while ((res3 === null) && (iterator < 4)) {
                        iterator++;
                        res3 = await reRun(`https://www.robotevents.com/api/v2/events/${id}/teams?registered=true&myTeams=false&page=1&per_page=250`, e, { headers: { 'Authorization': 'Bearer ' + await getAuth() } })

                        if (!res3.error) {
                            return res3;
                        } else {
                            e = res3;
                            res3 = null;
                        }

                        if (iterator === 4) {
                            await new Promise(r => setTimeout(r, 500));

                            if (failCount >= 2) {
                                console.log("failCount")
                                await new Promise(r => setTimeout(r, 15000))
                                failCount = 0;
                            }

                        }
                    }
                })

            if (!failTemp) {
                failCount = 0;
            }
            const reusables = res2.data.data;
            const iterator = res2.data.meta.last_page;
            if (iterator > 1) {
                console.log(reusables.length)
                for (i = 0; i < reusables.length; i++) {
                    const config = { headers: { 'Authorization': 'Bearer ' + await getAuth() } }

                    let failTemp1 = false;
                    const res3 = await axios.get(`https://www.robotevents.com/api/v2/events/${id}/teams?registered=true&myTeams=false&page=${i}&per_page=250`, config)
                        .catch(async (e) => {
                            failTemp1 = true;
                            failCount++;
                            let res4 = null;
                            let iterator = 0;

                            while ((res4 === null) && (iterator < 4)) {
                                iterator++;
                                res4 = await reRun(`https://www.robotevents.com/api/v2/events/${id}/teams?registered=true&myTeams=false&page=${i}&per_page=250`, e, { headers: { 'Authorization': 'Bearer ' + await getAuth() } })

                                if (!res4.error) {
                                    return res4;
                                } else {
                                    e = res4;
                                    res4 = null;
                                }

                                if (iterator === 4) {
                                    await new Promise(r => setTimeout(r, 500));

                                    if (failCount >= 2) {
                                        console.log("failCount")
                                        await new Promise(r => setTimeout(r, 15000))
                                        failCount = 0;
                                    }

                                }
                            }
                        })

                    if (!failTemp1) {
                        failCount = 0;
                    }
                    const rereusables = res3.data.data;
                    for (rereusable of rereusables) {
                        console.log(rereusable.id)
                        const teamID = rereusable.id;
                        arr.push(teamID);
                    }
                }
            } else {
                for (reusable of reusables) {
                    const teamID = reusable.id;
                    arr.push(teamID);
                }
            }
            usable.teamID = arr;
        } catch (e) {

        }
    }
    console.log("Finished getting team IDs")
    return usables;
}


async function getElse() {
    const arrs = await getSecond();
    const sortedArrs = arrs.sort((a, b) => b.start - a.start)

    const today = new Date();
    const formatted = today.toISOString();

    for (sortedArr of sortedArrs) {
        const date = new Date(sortedArr.start);
        const formation = date.toUTCString();
        sortedArr.unformatStart = formation;
    }

    for (sortedArr of sortedArrs) {
        const date = new Date(sortedArr.end);
        const formation = date.toUTCString();
        sortedArr.unformatEnd = formation;
    }

    const newArr = []
    for (sortedArr of sortedArrs) {
        if (formatted < sortedArr.start) {
            newArr.push(sortedArr);
        }
    }

    await Event.deleteMany({});
    await allevents.deleteMany({});
    console.log("deleted everything")

    await Event.insertMany(newArr)
    console.log('inserted allevents')

    await allevents.insertMany(sortedArrs)
    console.log('inserted upcoming events')

    const lol = new Date();
    const lol2 = lol.toUTCString();
    console.log(lol2)
}

// getElse()
module.exports = getElse;