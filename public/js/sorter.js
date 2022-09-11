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

async function sortTeams() {
    const arrs = await Team.find({});
    // console.log('found')

    try {
        function compare(a, b) {
            if (a.trueSkill > b.trueSkill) {
                return -1;
            }
            if (a.trueSkill < b.trueSkill) {
                return 1;
            }
            return 0;
        }

        for (arr of arrs) {
            const fixed = arr.trueSkill.toFixed(2)
            arr.showableTrueSkill = fixed;
        }

        function compareSkills(a, b) {
            if (a.skills.total > b.skills.total) {
                return -1;
            }
            if (a.skills.total < b.skills.total) {
                return 1;
            }
            return 0;
        }
        const sortedskills = arrs.sort(compareSkills);

        for (i = 0; i < arrs.length; i++) {
            const arr = sortedskills[i];
            arr.worldSkillsRank = i + 1;
        }

        const sorted = arrs.sort(compare);

        // console.log(sorted)
        await Team.deleteMany({})
        console.log('deleted all')
        await Team.insertMany(sorted)
        console.log('inserted all')
    } catch (e) {
        console.log(e)
    }

}

// sortTeams()
module.exports = sortTeams;