const insertTeams = require('./public/js/seedingTeams')
const algorithm = require('./public/js/algorithm');
const sortTeams = require('./public/js/sorter');
const insertEvents = require('./public/js/seedingEvents');
const cron = require('node-cron')

async function cron1() {
    const date = new Date();
    if (date.getHours === 19 && date.getMinutes === 0) {
        await insertTeams()
        await algorithm()
        await sortTeams()
        await insertEvents()
    }
}


let running = false;
cron.schedule('0 19 * * *', async () => {
    if (running === false) {
        running = true;
        console.log('scheduled')
        await cron1()
        running = false;
    }
})