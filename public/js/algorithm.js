const Team = require('../../models/teams');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/vexScouting')
    .then(() => {
        console.log('mongo connection open: sorter')
    })
    .catch((err) => {
        console.log('mongo error')
        console.log(err)
    })

async function algorithm() {
    const arrs = await Team.find({});
    console.log('found')
    let counter = 0;

    for (arr of arrs) {
        console.log(arr.number, counter);
        counter++;

        const skills = arr.skills;
        const rankings = arr.rankings;
        const worlds = arr.worlds;
        const awards = arr.awards;
        const tpawards = arr.tpawards;
        let trueSkill = 0;

        const driverTrue = skills.driving / 20;
        const autonTrue = skills.auton / 25;
        const skillsTrue = driverTrue + autonTrue;

        const weightedRateTrue = rankings.weightedRate * 12;
        const SoSTrue = rankings.avgSoS / 50;
        const rankingsTrue = weightedRateTrue + SoSTrue;

        let worldsTrue = 0;
        if (worlds === true) {
            worldsTrue += 3;
        }

        let awardsTrue = 0;
        for (i = 0; i < awards.excellence; i++) {
            awardsTrue += 1.25;
        }
        for (i = 0; i < awards.champion; i++) {
            awardsTrue += 1.5;
        }
        for (i = 0; i < awards.skills; i++) {
            awardsTrue += 1.25;
        }
        for (i = 0; i < awards.finalist; i++) {
            awardsTrue += 0.75;
        }
        for (i = 0; i < awards.skills2; i++) {
            awardsTrue += 1;
        }
        for (i = 0; i < awards.skills3; i++) {
            awardsTrue += 0.6;
        }
        for (i = 0; i < awards.think; i++) {
            awardsTrue += 0.25;
        }

        let tpAwardsTrue = 0;
        for (i = 0; i < tpawards.excellence; i++) {
            awardsTrue += 0.375;
        }
        for (i = 0; i < tpawards.champion; i++) {
            awardsTrue += 0.5;
        }
        for (i = 0; i < tpawards.skills; i++) {
            awardsTrue += 0.375;
        }
        for (i = 0; i < tpawards.finalist; i++) {
            awardsTrue += 0.2;
        }
        for (i = 0; i < tpawards.skills2; i++) {
            awardsTrue += 0.2;
        }
        for (i = 0; i < tpawards.skills3; i++) {
            awardsTrue += 0.125;
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

// algorithm()
module.exports = algorithm;