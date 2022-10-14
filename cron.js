const insertTeams = require('./public/js/seedingTeams')
const algorithm = require('./public/js/algorithm');
const sortTeams = require('./public/js/sorter');
const insertEvents = require('./public/js/seedingEvents');

async function cron() {
    console.log('scheduled')
    await insertTeams()
    await algorithm()
    await sortTeams()
    await insertEvents()
}

cron()

// console.log('')