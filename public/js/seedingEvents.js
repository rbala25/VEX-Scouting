const e = require('express');
const mongoose = require('mongoose');
const Event = require('../../models/upcomingEvents');
const allevents = require('../../models/allEvents');
const axios = require('axios').default;

mongoose.connect('mongodb://0.0.0.0:27017/vexScouting')
    .then(() => {
        console.log('mongo connection open: seedingEvents')
    })
    .catch((err) => {
        console.log('mongo error')
        console.log(err)
    })

async function getEvents() {
    async function getFirst() {
        const config = { headers: { 'Authorization': 'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiZjNiMzA2NDJlNGUyNmVjYzc0MGNiNzU4M2E3N2MwYjZhZmNjZjNkZDNkZjJiNDIwYTY5ODhjNjU0OWE1NTJmY2Q5MTExM2NmODc5MmY5YmMiLCJpYXQiOjE2NjE2MzIxMjAuOTQ5OTE5LCJuYmYiOjE2NjE2MzIxMjAuOTQ5OTIyMSwiZXhwIjoyNjA4NDA2OTIwLjkzOTM4NjgsInN1YiI6IjEwMDk0OCIsInNjb3BlcyI6W119.OCxtefDO9asOhFySsZP8vOlAEACl3zUTBgZRx8pFxssOkOYsaPXHoOA2LT6L_wH6wjEH_ilRrM0fXyXreb6ofF_SzbXLE2QXJGnCJMa3gcAS3QjHyib-bcB6QrLmcyJ-vk8JTgog_k9BgEwxSbjtHB1kjSvo--AkB8jghp6V7noGQzr2cGhLdJEK2FH8VKi7ni5DTXPl0e5fdDGlbKW-ylRhFOO8sdBgRPAFiV040H33EJ50HfbWAatapcfvYpBjaVC5O7wE67RiUB2ufNV7n7W4as8SyEGGVwyEKi5KnTt28hsRFKqCQg-0JB-0CapisBBXpr4wPsojsiCAR8YiZqHDGxQYRmdlJHsmeJcBzOvvjokVrsJmBRB1iMZeVBOYzcl1J7_PiBKfekrjPsCnWTOkZIiyGLVOYP9xqw_qmvYh3xd0XQAaIuKxzGbVlaalQzOHDENnqY7QhDjLp2wPEvyj0MStyD5H8Uhx7TKKeI55b2zcZqinCc8ye5Alt12ltpoBJNkXn8c5asCxUVGC8lNhUlb7e-kveXCWXpihEt1XCftDCrALAvZl-NZikMvhx7gezL51vVlKd_pbCFiNny_1KYVp_GMFSIIVydX7bgrUnyMjH_931DOb6PwVFEjy3zQ6p6Tur_KiaW1aMVQYoYMyP9lUn1I2peqp_XgKIbE' } }
        const res = await axios.get(`https://www.robotevents.com/api/v2/events?season%5B%5D=173&myEvents=false&eventTypes%5B%5D=tournament&eventTypes%5B%5D=league&page=1&per_page=250`, config)

        return res
    }
    async function getRest(res) {
        const iterator = res.data.meta.last_page;
        const arr = []
        for (i = 1; i <= iterator; i++) {
            const config = { headers: { 'Authorization': 'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiZjNiMzA2NDJlNGUyNmVjYzc0MGNiNzU4M2E3N2MwYjZhZmNjZjNkZDNkZjJiNDIwYTY5ODhjNjU0OWE1NTJmY2Q5MTExM2NmODc5MmY5YmMiLCJpYXQiOjE2NjE2MzIxMjAuOTQ5OTE5LCJuYmYiOjE2NjE2MzIxMjAuOTQ5OTIyMSwiZXhwIjoyNjA4NDA2OTIwLjkzOTM4NjgsInN1YiI6IjEwMDk0OCIsInNjb3BlcyI6W119.OCxtefDO9asOhFySsZP8vOlAEACl3zUTBgZRx8pFxssOkOYsaPXHoOA2LT6L_wH6wjEH_ilRrM0fXyXreb6ofF_SzbXLE2QXJGnCJMa3gcAS3QjHyib-bcB6QrLmcyJ-vk8JTgog_k9BgEwxSbjtHB1kjSvo--AkB8jghp6V7noGQzr2cGhLdJEK2FH8VKi7ni5DTXPl0e5fdDGlbKW-ylRhFOO8sdBgRPAFiV040H33EJ50HfbWAatapcfvYpBjaVC5O7wE67RiUB2ufNV7n7W4as8SyEGGVwyEKi5KnTt28hsRFKqCQg-0JB-0CapisBBXpr4wPsojsiCAR8YiZqHDGxQYRmdlJHsmeJcBzOvvjokVrsJmBRB1iMZeVBOYzcl1J7_PiBKfekrjPsCnWTOkZIiyGLVOYP9xqw_qmvYh3xd0XQAaIuKxzGbVlaalQzOHDENnqY7QhDjLp2wPEvyj0MStyD5H8Uhx7TKKeI55b2zcZqinCc8ye5Alt12ltpoBJNkXn8c5asCxUVGC8lNhUlb7e-kveXCWXpihEt1XCftDCrALAvZl-NZikMvhx7gezL51vVlKd_pbCFiNny_1KYVp_GMFSIIVydX7bgrUnyMjH_931DOb6PwVFEjy3zQ6p6Tur_KiaW1aMVQYoYMyP9lUn1I2peqp_XgKIbE' } }
            const res2 = await axios.get(`https://www.robotevents.com/api/v2/events?season%5B%5D=173&myEvents=false&eventTypes%5B%5D=tournament&eventTypes%5B%5D=league&page=${i}&per_page=250`, config)
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
    console.log("Adding teams to Events")
    const usables = await getEvents();
    console.log('got events')
    let counter = 0;
    for (usable of usables) {
        // for (i = 0; i < 50; i++) {
        const arr = []
        // const usable = usables[i]
        console.log(usable.id, 'Team ', counter)
        counter++;
        const id = usable.id;
        const config = { headers: { 'Authorization': 'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiZjNiMzA2NDJlNGUyNmVjYzc0MGNiNzU4M2E3N2MwYjZhZmNjZjNkZDNkZjJiNDIwYTY5ODhjNjU0OWE1NTJmY2Q5MTExM2NmODc5MmY5YmMiLCJpYXQiOjE2NjE2MzIxMjAuOTQ5OTE5LCJuYmYiOjE2NjE2MzIxMjAuOTQ5OTIyMSwiZXhwIjoyNjA4NDA2OTIwLjkzOTM4NjgsInN1YiI6IjEwMDk0OCIsInNjb3BlcyI6W119.OCxtefDO9asOhFySsZP8vOlAEACl3zUTBgZRx8pFxssOkOYsaPXHoOA2LT6L_wH6wjEH_ilRrM0fXyXreb6ofF_SzbXLE2QXJGnCJMa3gcAS3QjHyib-bcB6QrLmcyJ-vk8JTgog_k9BgEwxSbjtHB1kjSvo--AkB8jghp6V7noGQzr2cGhLdJEK2FH8VKi7ni5DTXPl0e5fdDGlbKW-ylRhFOO8sdBgRPAFiV040H33EJ50HfbWAatapcfvYpBjaVC5O7wE67RiUB2ufNV7n7W4as8SyEGGVwyEKi5KnTt28hsRFKqCQg-0JB-0CapisBBXpr4wPsojsiCAR8YiZqHDGxQYRmdlJHsmeJcBzOvvjokVrsJmBRB1iMZeVBOYzcl1J7_PiBKfekrjPsCnWTOkZIiyGLVOYP9xqw_qmvYh3xd0XQAaIuKxzGbVlaalQzOHDENnqY7QhDjLp2wPEvyj0MStyD5H8Uhx7TKKeI55b2zcZqinCc8ye5Alt12ltpoBJNkXn8c5asCxUVGC8lNhUlb7e-kveXCWXpihEt1XCftDCrALAvZl-NZikMvhx7gezL51vVlKd_pbCFiNny_1KYVp_GMFSIIVydX7bgrUnyMjH_931DOb6PwVFEjy3zQ6p6Tur_KiaW1aMVQYoYMyP9lUn1I2peqp_XgKIbE' } }
        const res2 = await axios.get(`https://www.robotevents.com/api/v2/events/${id}/teams?registered=true&myTeams=false&page=1&per_page=250`, config)
        const reusables = res2.data.data;
        const iterator = res2.data.meta.last_page;
        if (iterator > 1) {
            console.log(reusables.length)
            for (i = 0; i < reusables.length; i++) {
                const config = { headers: { 'Authorization': 'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiZjNiMzA2NDJlNGUyNmVjYzc0MGNiNzU4M2E3N2MwYjZhZmNjZjNkZDNkZjJiNDIwYTY5ODhjNjU0OWE1NTJmY2Q5MTExM2NmODc5MmY5YmMiLCJpYXQiOjE2NjE2MzIxMjAuOTQ5OTE5LCJuYmYiOjE2NjE2MzIxMjAuOTQ5OTIyMSwiZXhwIjoyNjA4NDA2OTIwLjkzOTM4NjgsInN1YiI6IjEwMDk0OCIsInNjb3BlcyI6W119.OCxtefDO9asOhFySsZP8vOlAEACl3zUTBgZRx8pFxssOkOYsaPXHoOA2LT6L_wH6wjEH_ilRrM0fXyXreb6ofF_SzbXLE2QXJGnCJMa3gcAS3QjHyib-bcB6QrLmcyJ-vk8JTgog_k9BgEwxSbjtHB1kjSvo--AkB8jghp6V7noGQzr2cGhLdJEK2FH8VKi7ni5DTXPl0e5fdDGlbKW-ylRhFOO8sdBgRPAFiV040H33EJ50HfbWAatapcfvYpBjaVC5O7wE67RiUB2ufNV7n7W4as8SyEGGVwyEKi5KnTt28hsRFKqCQg-0JB-0CapisBBXpr4wPsojsiCAR8YiZqHDGxQYRmdlJHsmeJcBzOvvjokVrsJmBRB1iMZeVBOYzcl1J7_PiBKfekrjPsCnWTOkZIiyGLVOYP9xqw_qmvYh3xd0XQAaIuKxzGbVlaalQzOHDENnqY7QhDjLp2wPEvyj0MStyD5H8Uhx7TKKeI55b2zcZqinCc8ye5Alt12ltpoBJNkXn8c5asCxUVGC8lNhUlb7e-kveXCWXpihEt1XCftDCrALAvZl-NZikMvhx7gezL51vVlKd_pbCFiNny_1KYVp_GMFSIIVydX7bgrUnyMjH_931DOb6PwVFEjy3zQ6p6Tur_KiaW1aMVQYoYMyP9lUn1I2peqp_XgKIbE' } }
                const res3 = await axios.get(`https://www.robotevents.com/api/v2/events/${id}/teams?registered=true&myTeams=false&page=${i}&per_page=250`, config)
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
}

// getElse()
module.exports = getElse;