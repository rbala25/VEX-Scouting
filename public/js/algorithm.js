const Team = require('../../models/teams');
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/vexScouting')
    .then(() => {
        console.log('mongo connection open: algorithm')
    })
    .catch((err) => {
        console.log('mongo error')
        console.log(err)
    })

async function algorithm() {
    const arrs = await Team.find({});
    console.log('found')

    // let drivingTot = 0;
    // let counter1 = 0;
    // for (arr of arrs) {
    //     if (arr.skills.driving > 0) {
    //         drivingTot += arr.skills.driving;
    //         counter1++;
    //     }
    // }
    // drivingTot /= counter1;

    // let autonTot = 0;
    // let counter2 = 0;
    // for (arr of arrs) {
    //     if (arr.skills.auton > 0) {
    //         autonTot += arr.skills.auton;
    //         counter2++;
    //     }
    // }
    // autonTot /= counter2;

    let sosTot = 0;
    let counter = 0;
    for (arr of arrs) {
        if (arr.rankings.avgSoS > 0) {
            sosTot += arr.rankings.avgSoS;
            counter++;
        }
    }
    if (counter > 0) {
        sosTot /= counter;
    } else {
        counter = 0;
    }
    console.log(sosTot)

    let count = 0;
    for (arr of arrs) {
        console.log(count)
        count++;

        const skills = arr.skills;
        const rankings = arr.rankings;
        const worlds = arr.worlds;
        const awards = arr.awards;
        const tpawards = arr.tpawards;
        let trueSkill = 0;

        const driverTrue = skills.driving / 40;
        const autonTrue = skills.auton / 50;
        const skillsTrue = driverTrue + autonTrue;

        const weightedRateTrue = rankings.weightedRate;
        const SoSTrue = rankings.avgSoS / sosTot;
        const weightedTemp = weightedRateTrue * SoSTrue;
        const rankingsTrue = weightedTemp * 6;

        let worldsTrue = 0;
        if (worlds === true) {
            worldsTrue += 2;
        }

        let awardsTrue = 0;
        for (i = 0; i < awards.excellence; i++) {
            awardsTrue += 1.75;
        }
        for (i = 0; i < awards.champion; i++) {
            awardsTrue += 1.75;
        }
        for (i = 0; i < awards.skills; i++) {
            awardsTrue += 1.25;
        }
        for (i = 0; i < awards.finalist; i++) {
            awardsTrue += 1;
        }
        for (i = 0; i < awards.skills2; i++) {
            awardsTrue += 0.75;
        }
        for (i = 0; i < awards.skills3; i++) {
            awardsTrue += 0.5;
        }
        for (i = 0; i < awards.think; i++) {
            awardsTrue += 0.2;
        }

        let tpAwardsTrue = 0;
        for (i = 0; i < tpawards.excellence; i++) {
            awardsTrue += 1;
        }
        for (i = 0; i < tpawards.champion; i++) {
            awardsTrue += 1;
        }
        for (i = 0; i < tpawards.skills; i++) {
            awardsTrue += 0.5;
        }
        for (i = 0; i < tpawards.finalist; i++) {
            awardsTrue += 0.25;
        }
        for (i = 0; i < tpawards.skills2; i++) {
            awardsTrue += 0.2;
        }
        for (i = 0; i < tpawards.skills3; i++) {
            awardsTrue += 0.1;
        }
        for (i = 0; i < tpawards.think; i++) {
            awardsTrue += 0.05;
        }



        if (skillsTrue) {
            trueSkill += skillsTrue;
        }
        if (rankingsTrue) {
            trueSkill += rankingsTrue;
        }
        if (awardsTrue) {
            trueSkill += awardsTrue;
        }
        if (worldsTrue) {
            trueSkill += worldsTrue;
        }
        if (tpAwardsTrue) {
            trueSkill += tpAwardsTrue;
        }

        // console.log(rankings)
        // console.log(skillsTrue)
        // console.log(rankingsTrue)
        // console.log(awardsTrue)
        // console.log(worldsTrue)
        // console.log(tpAwardsTrue)

        // console.log(trueSkill)
        const id = arr.id;
        // console.log(id, trueSkill)

        await Team.findOneAndUpdate({ id: id }, { trueSkill: trueSkill });
    }
}
module.exports = algorithm;