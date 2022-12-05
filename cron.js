const insertTeams = require('./public/js/seedingTeams')
const algorithm = require('./public/js/algorithm');
const sortTeams = require('./public/js/sorter');
const insertEvents = require('./public/js/seedingEvents');
const cron = require('node-cron')

async function cron1() {
    await insertTeams()
    await algorithm()
    await sortTeams()
    await insertEvents()
}


cron.schedule('0 12 * * *', async () => {
    console.log('scheduled')
    await cron1()
}
)
