const { Template } = require('ejs');
const e = require('express');
const mongoose = require('mongoose');
const { count } = require('../../models/teams');
const Team = require('../../models/teams');
const axios = require('axios').default;
const config = require('../../config')

mongoose.connect('mongodb://127.0.0.1:27017/vexScouting')
    .then(() => {
        console.log('mongo connection open: seedingTeams')
    })
    .catch((err) => {
        console.log('mongo error')
        console.log(err)
    })

const auth = config.auth;
async function getTeamsGeneral() {
    async function getFirst() {
        const config = { headers: { 'Authorization': 'Bearer ' + auth } }
        const res = await axios.get(`https://www.robotevents.com/api/v2/teams?registered=true&program=1=&myTeams=false&page=1&per_page=250`, config)
        // .then(msg => {
        //     console.log(msg)
        // })
        // .catch(err => {
        //     console.log(err)
        // })

        return res
    }

    async function getRest(res) {
        const iterator = res.data.meta.last_page;
        const arr = []
        for (i = 1; i <= iterator; i++) {
            const config = { headers: { 'Authorization': 'Bearer ' + auth } }
            const res2 = await axios.get(`https://www.robotevents.com/api/v2/teams?registered=true&program=1=&myTeams=false&page=${i}&per_page=250`, config)
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


async function getAllElse() {
    const arrs = await getTeamsGeneral();

    let counter = 0;

    for (arr of arrs) {
        // for (i = 0; i < 50; i++) {
        // const arr = arrs[i];
        const teamId = arr.id;
        console.log("Skills Request ", counter)
        counter++;
        try {
            const config2 = { headers: { 'Authorization': 'Bearer ' + auth } }
            const res2 = await axios.get(`https://www.robotevents.com/api/v2/teams/${teamId}/skills?season%5B%5D=173&per_page=250`, config2)

            if (res2.data.data.length > 0) {
                const usables = res2.data.data;
                let driversk = 0;
                let auton = 0;
                for (usable of usables) {
                    if (usable.type === 'driver') {
                        if (usable.score > driversk) {
                            driversk = usable.score;
                        }
                    } else {
                        if (usable.score > auton) {
                            auton = usable.score
                        }
                    }
                }

                const Obj = {
                    driving: driversk,
                    auton: auton,
                    total: driversk + auton
                }

                arr.skills = Obj;

                // await Team.findOneAndUpdate({ id: teamId }, { skills: Obj }, { upsert: true, new: true })
            } else {
                const Obj = {
                    driving: 0,
                    auton: 0,
                    total: 0
                }

                arr.skills = Obj;
                // await team.save()
                // const team = await Team.findByIdAndUpdate(mongoId, { skills: Obj }, { new: true })
                // const Foundteam = await Team.findOne({ id: teamId });
                // console.log(Foundteam)
            }
        } catch (e) {
            console.log(e)
        }
    }

    //SKILLS IS ABOVE
    //BELOW IS OLD MATCHES

    // counter = 0;

    // for (arr of arrs) {
    //     let wins = 0;
    //     let losses = 0;
    //     let r16 = 0;
    //     let qf = 0;
    //     let sf = 0;
    //     let f = 0;
    //     let fW = 0;
    //     const id = arr.id;
    //     console.log("Match Request ", counter)
    //     counter++
    //     const config2 = { headers: { 'Authorization': 'Bearer ' + auth } }
    //     const res2 = await axios.get(`https://www.robotevents.com/api/v2/teams/${id}/matches?season%5B%5D=173&per_page=250`, config2)

    //     if (res2.data.data !== undefined) {
    //         const matches = res2.data.data;
    //         for (match of matches) {
    //             switch (match.round) {
    //                 case 1:
    //                     break;
    //                 case 2:
    //                     if ((match.alliances[0].teams[0].team.id === id) || (match.alliances[0].teams[1].team.id === id)) {
    //                         if (match.alliances[0].score > match.alliances[1].score) {
    //                             wins++;
    //                         } else {
    //                             losses++;
    //                         }
    //                     } else {
    //                         if (match.alliances[1].score > match.alliances[0].score) {
    //                             wins++;
    //                         } else {
    //                             losses++;
    //                         }
    //                     }
    //                     break;
    //                 case 3:
    //                     if ((match.alliances[0].teams[0].team.id === id) || (match.alliances[0].teams[1].team.id === id)) {
    //                         if (match.alliances[0].score > match.alliances[1].score) {
    //                             wins++;
    //                             sf++;
    //                         } else {
    //                             losses++;
    //                         }
    //                     } else {
    //                         if (match.alliances[1].score > match.alliances[0].score) {
    //                             wins++;
    //                             sf++;
    //                         } else {
    //                             losses++;
    //                         }
    //                     }
    //                     break;
    //                 case 4:
    //                     if ((match.alliances[0].teams[0].team.id === id) || (match.alliances[0].teams[1].team.id === id)) {
    //                         if (match.alliances[0].score > match.alliances[1].score) {
    //                             wins++;
    //                             f++;
    //                         } else {
    //                             losses++;
    //                         }
    //                     } else {
    //                         if (match.alliances[1].score > match.alliances[0].score) {
    //                             wins++;
    //                             f++;
    //                         } else {
    //                             losses++;
    //                         }
    //                     }
    //                     break;
    //                 case 5:
    //                     if ((match.alliances[0].teams[0].team.id === id) || (match.alliances[0].teams[1].team.id === id)) {
    //                         if (match.alliances[0].score > match.alliances[1].score) {
    //                             wins++;
    //                             fW++;
    //                         } else {
    //                             losses++;
    //                         }
    //                     } else {
    //                         if (match.alliances[1].score > match.alliances[0].score) {
    //                             wins++;
    //                             fW++;
    //                         } else {
    //                             losses++;
    //                         }
    //                     }
    //                     break;
    //                 case 6:
    //                     if ((match.alliances[0].teams[0].team.id === id) || (match.alliances[0].teams[1].team.id === id)) {
    //                         if (match.alliances[0].score > match.alliances[1].score) {
    //                             wins++;
    //                             qf++;
    //                         } else {
    //                             losses++;
    //                             r16++;
    //                         }
    //                     } else {
    //                         if (match.alliances[1].score > match.alliances[0].score) {
    //                             wins++;
    //                             qf++;
    //                         } else {
    //                             losses++;
    //                             r16++;
    //                         }
    //                     }
    //                     break;
    //                 default:
    //                     break;
    //             }

    //             const Obj = {
    //                 wins: wins,
    //                 losses: losses,
    //                 r16: r16,
    //                 qf: qf,
    //                 sf: sf,
    //                 f: f,
    //                 fW: fW
    //             }

    //             arr.matches = Obj;
    //             console.log(Obj)
    //         }


    //     } else {
    //         const Obj = {
    //             wins: null,
    //             losses: null,
    //             r16: null,
    //             qf: null,
    //             sf: null,
    //             f: null,
    //             fW: null
    //         }

    //         arr.matches = Obj;
    //     }
    // }

    //ABOVE IS OLD MATCHES
    //BELOW IS WORLDS

    for (k = 0; k < 1; k++) {
        const teamsWorlds = []

        const config2 = { headers: { 'Authorization': 'Bearer ' + auth } }
        const res2 = await axios.get(`https://www.robotevents.com/api/v2/events/45434/teams?registered=true&myTeams=false&per_page=250&page=1`, config2)

        const iterator = res2.data.meta.last_page;

        for (i = 1; i <= iterator; i++) {
            const config2 = { headers: { 'Authorization': 'Bearer ' + auth } }
            const res2 = await axios.get(`https://www.robotevents.com/api/v2/events/45434/teams?registered=true&myTeams=false&per_page=250&page=${i}`, config2)

            const usables = res2.data.data
            for (usable of usables) {
                teamsWorlds.push(usable);
            }
        }
        console.log("Done Middle School")

        const config3 = { headers: { 'Authorization': 'Bearer ' + auth } }
        const res3 = await axios.get(`https://www.robotevents.com/api/v2/events/45258/teams?registered=true&myTeams=false&per_page=250&page=1`, config3)
        const iterator3 = res3.data.meta.last_page;

        for (i = 1; i <= iterator3; i++) {
            const config3 = { headers: { 'Authorization': 'Bearer ' + auth } }
            const res3 = await axios.get(`https://www.robotevents.com/api/v2/events/45258/teams?registered=true&myTeams=false&per_page=250&page=${i}`, config3)

            const usables = res3.data.data
            for (usable of usables) {
                teamsWorlds.push(usable);
            }
        }
        console.log("Done High School")

        for (i = 0; i < teamsWorlds.length; i++) {
            const teamId = teamsWorlds[i].id;
            const l = arrs.findIndex(e => e.id === teamId);
            if (l > -1) {
                // console.log(arrs[l].number)
                arrs[l].worlds = true;
            }
        }

        for (i = 0; i < arrs.length; i++) {
            const arr = arrs[i];
            if (arr.worlds === true) {
                continue;
            } else {
                arr.worlds = false;
            }
        }
    }


    //ABOVE IS AWARDS
    // SECTION BELOW = AWARDS


    counter = 0;
    // for (i = 0; i < 50; i++) {
    for (arr of arrs) {
        // const arr = arrs[i];
        let excellence = 0;
        let champion = 0;
        let skills = 0;
        let finalist = 0;
        let skills2 = 0;
        let skills3 = 0;
        let think = 0;

        let excellence2 = 0;
        let champion2 = 0;
        let skills_2 = 0;
        let finalist2 = 0;
        let skills22 = 0;
        let skills32 = 0;
        let think2 = 0;

        console.log("Awards for team ", counter);
        counter++;

        const id = arr.id;

        try {
            const config = { headers: { 'Authorization': 'Bearer ' + auth } }
            const res = await axios.get(`https://www.robotevents.com/api/v2/teams/${id}/awards?season%5B%5D=173&per_page=250&page=1`, config)
            const res2 = await axios.get(`https://www.robotevents.com/api/v2/teams/${id}/awards?season%5B%5D=154&per_page=250&page=1`, config)

            const usables = res.data.data;
            for (usable of usables) {
                // console.log(arr.number)
                // console.log('Usable arr', usable)
                if (usable.title === "Excellence Award (VRC/VEXU/VAIC)") {
                    excellence++;
                } else if (usable.title === "Tournament Champions (VRC/VEXU/VAIC)") {
                    champion++;
                } else if (usable.title === "Robot Skills Champion (VRC/VEXU)") {
                    skills++;
                } else if (usable.title === "Tournament Finalists (VRC/VEXU/VAIC)") {
                    finalist++;
                } else if (usable.title === "Robot Skills 2nd Place (VRC/VEXU/VAIC)") {
                    skills2++;
                } else if (usable.title === "Robot Skills 3rd Place (VRC/VEXU/VAIC)") {
                    skills3++;
                } else if (usable.title === "Think Award (VRC/VEXU/VAIC)") {
                    think++;
                }
            }

            const moreusables = res2.data.data;
            for (moreusable of moreusables) {
                // console.log(arr.number)
                if (moreusable.title === "Excellence Award (VRC/VEXU/VAIC)") {
                    excellence2++;
                } else if (moreusable.title === "Tournament Champions (VRC/VEXU/VAIC)") {
                    champion2++;
                } else if (moreusable.title === "Robot Skills Champion (VRC/VEXU)") {
                    skills_2++;
                } else if (moreusable.title === "Tournament Finalists (VRC/VEXU/VAIC)") {
                    finalist2++;
                } else if (moreusable.title === "Robot Skills 2nd Place (VRC/VEXU/VAIC)") {
                    skills22++;
                } else if (moreusable.title === "Robot Skills 3rd Place (VRC/VEXU/VAIC)") {
                    skills32++;
                } else if (moreusable.title === "Think Award (VRC/VEXU/VAIC)") {
                    think2++;
                }
            }

            const obj1 = {
                excellence: excellence,
                champion: champion,
                skills: skills,
                finalist: finalist,
                skills2: skills2,
                skills3: skills3,
                think: think,
            }

            const obj2 = {
                excellence: excellence2,
                champion: champion2,
                skills: skills_2,
                finalist: finalist2,
                skills2: skills22,
                skills3: skills32,
                think: think2,
            }

            arr.awards = obj1;
            arr.tpawards = obj2;

        } catch (e) {
            console.log(e)
        }

    }

    // //SECTIOn ABOVE IS AWARDS
    // //BELOW IS RANKINGS

    counter = 0;
    for (arr of arrs) {
        // for (j = 0; j < 2100; j++) {
        // let arr = arrs[j]
        // console.log(arr.number)
        console.log("Rankings for team ", counter)
        counter++;

        try {
            let wins = 0;
            let losses = 0;
            let unweightedRate = 0;
            let avgSoS = 0;
            const id = arr.id;

            let weightedWins = 0;
            let SosCalc = 0;

            const config = { headers: { 'Authorization': 'Bearer ' + auth } }
            const res = await axios.get(`https://www.robotevents.com/api/v2/teams/${id}/rankings?season%5B%5D=173&per_page=250&page=1`, config)

            const usables = res.data.data;
            // console.log(usables)
            for (i = 0; i < usables.length; i++) {
                // console.log(arr.number)
                const usable = usables[i];
                const eWins = usable.wins;
                const eLosses = usable.losses;
                wins += eWins;
                losses += eLosses;

                const totalMatches = wins + losses;
                unweightedRate = wins / totalMatches;

                let eSos = 0;
                if (totalMatches > 0) {
                    eSos = usable.sp / totalMatches;
                } else {
                    eSos = 0;
                }
                SosCalc += eSos;

                // console.log(eventId)
                try {
                    const eventId = usable.event.id;

                    const config = { headers: { 'Authorization': 'Bearer ' + auth } }
                    const res2 = await axios.get(`https://www.robotevents.com/api/v2/events/${eventId}`, config)

                    const level = res2.data.level;
                    // console.log(level)

                    if (level == 'Signature') {
                        const weightedWinsCalc = wins * 1.1;
                        weightedWins += weightedWinsCalc;
                    } else if (level == "World") {
                        const weightedWinsCalc = wins * 1.2;
                        weightedWins += weightedWinsCalc;
                    } else {
                        weightedWins += wins;
                        // console.log(arr.number)
                        // console.log(weightedWins)
                        // console.log('else state')
                    }

                } catch (e) {
                    console.log(e)
                }

            }

            const totalMatches = wins + losses;
            if (totalMatches > 0) {
                weightedRate = weightedWins / totalMatches;
                // console.log(avgSoS, weightedWins, weightedRate)
            } else {
                weightedRate = unweightedRate;
                // console.log(avgSoS, weightedWins)
            }

            const i1 = usables.length;
            if (i1 > 0) {
                avgSoS = SosCalc / i1;
            } else {
                avgSoS = 0;
            }

            if (weightedRate == NaN) {
                console.log('Got Here - Weighted Rate');
                weightedRate = 0;
            }
            if (unweightedRate == NaN) {
                console.log('Got Here - Unwieghted Rate');
                unweightedRate = 0;
            }
            if (avgSoS == NaN) {
                console.log('Got Here - avgSoS')
                avgSoS = 0;
            }
            if (wins == NaN) {
                console.log('Got Here - Wins');
                wins = 0;
            }
            if (losses == NaN) {
                console.log('Got Here - Losses');
                losses = 0;
            }

            const Obj = {
                wins: wins,
                losses: losses,
                weightedRate: weightedRate,
                unweightedRate: unweightedRate,
                avgSoS: avgSoS
            }

            // Object.assign({ rankings: Obj })

            arr.rankings = Obj;

        } catch (e) {
            console.log(e)
            const Obj = {
                wins: 0,
                losses: 0,
                weightedRate: 0,
                unweightedRate: 0,
                avgSoS: 0
            }
            arr.rankings = Obj;
        }

    }
    return arrs;

}

async function insertTeams() {
    const arr = await getAllElse()
    for (ar of arr) {
        if (ar.rankings.avgSoS !== undefined && ar.rankings.avgSoS !== NaN) {
            continue
        } else {
            console.log(ar.number, 'avgSoS');
            ar.rankings.avgSoS = 0;
        }
        if (ar.rankings.weightedRate !== undefined && ar.rankings.weightedRate !== NaN) {
            continue
        } else {
            console.log(ar.number, 'avgSoS');
            ar.rankings.avgSoS = 0;
        }
        if (ar.rankings.unweightedRate !== undefined && ar.rankings.unweightedRate !== NaN) {
            continue
        } else {
            console.log(ar.number, 'avgSoS');
            ar.rankings.avgSoS = 0;
        }
        if (ar.rankings.wins !== undefined && ar.rankings.wins !== NaN) {
            continue
        } else {
            console.log(ar.number, 'wins');
            ar.rankings.wins = 0;
        }
        if (ar.rankings.losses !== undefined && ar.rankings.losses !== NaN) {
            continue
        } else {
            console.log(ar.number, 'losses');
            ar.rankings.losses = 0;
        }
    }
    console.log('inserting teams')
    await Team.deleteMany({})
    console.log('deleted')
    for (ar of arr) {
        await Team.insertMany(ar)
            .then(() => {

            })
            .catch((e) => {
                console.log(ar.number, e)
            })
    }
    // await Team.insertMany(arr)
    //     .then(() => {
    //         console.log('inserted')
    //     })
    //     .catch(err => {
    //         console.log(err)
    //     })
    const count2 = await Team.count()
    console.log(count2)
}

module.exports = insertTeams;