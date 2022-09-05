const { Template } = require('ejs');
const mongoose = require('mongoose');
const { count } = require('./models/teams');
const Team = require('./models/teams');
const axios = require('axios').default;

mongoose.connect('mongodb://localhost:27017/vexScouting')
    .then(() => {
        console.log('mongo connection open')
    })
    .catch((err) => {
        console.log('mongo error')
        console.log(err)
    })

async function getTeamsGeneral() {
    async function getFirst() {
        const config = { headers: { 'Authorization': 'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiZjNiMzA2NDJlNGUyNmVjYzc0MGNiNzU4M2E3N2MwYjZhZmNjZjNkZDNkZjJiNDIwYTY5ODhjNjU0OWE1NTJmY2Q5MTExM2NmODc5MmY5YmMiLCJpYXQiOjE2NjE2MzIxMjAuOTQ5OTE5LCJuYmYiOjE2NjE2MzIxMjAuOTQ5OTIyMSwiZXhwIjoyNjA4NDA2OTIwLjkzOTM4NjgsInN1YiI6IjEwMDk0OCIsInNjb3BlcyI6W119.OCxtefDO9asOhFySsZP8vOlAEACl3zUTBgZRx8pFxssOkOYsaPXHoOA2LT6L_wH6wjEH_ilRrM0fXyXreb6ofF_SzbXLE2QXJGnCJMa3gcAS3QjHyib-bcB6QrLmcyJ-vk8JTgog_k9BgEwxSbjtHB1kjSvo--AkB8jghp6V7noGQzr2cGhLdJEK2FH8VKi7ni5DTXPl0e5fdDGlbKW-ylRhFOO8sdBgRPAFiV040H33EJ50HfbWAatapcfvYpBjaVC5O7wE67RiUB2ufNV7n7W4as8SyEGGVwyEKi5KnTt28hsRFKqCQg-0JB-0CapisBBXpr4wPsojsiCAR8YiZqHDGxQYRmdlJHsmeJcBzOvvjokVrsJmBRB1iMZeVBOYzcl1J7_PiBKfekrjPsCnWTOkZIiyGLVOYP9xqw_qmvYh3xd0XQAaIuKxzGbVlaalQzOHDENnqY7QhDjLp2wPEvyj0MStyD5H8Uhx7TKKeI55b2zcZqinCc8ye5Alt12ltpoBJNkXn8c5asCxUVGC8lNhUlb7e-kveXCWXpihEt1XCftDCrALAvZl-NZikMvhx7gezL51vVlKd_pbCFiNny_1KYVp_GMFSIIVydX7bgrUnyMjH_931DOb6PwVFEjy3zQ6p6Tur_KiaW1aMVQYoYMyP9lUn1I2peqp_XgKIbE' } }
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
            const config = { headers: { 'Authorization': 'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiZjNiMzA2NDJlNGUyNmVjYzc0MGNiNzU4M2E3N2MwYjZhZmNjZjNkZDNkZjJiNDIwYTY5ODhjNjU0OWE1NTJmY2Q5MTExM2NmODc5MmY5YmMiLCJpYXQiOjE2NjE2MzIxMjAuOTQ5OTE5LCJuYmYiOjE2NjE2MzIxMjAuOTQ5OTIyMSwiZXhwIjoyNjA4NDA2OTIwLjkzOTM4NjgsInN1YiI6IjEwMDk0OCIsInNjb3BlcyI6W119.OCxtefDO9asOhFySsZP8vOlAEACl3zUTBgZRx8pFxssOkOYsaPXHoOA2LT6L_wH6wjEH_ilRrM0fXyXreb6ofF_SzbXLE2QXJGnCJMa3gcAS3QjHyib-bcB6QrLmcyJ-vk8JTgog_k9BgEwxSbjtHB1kjSvo--AkB8jghp6V7noGQzr2cGhLdJEK2FH8VKi7ni5DTXPl0e5fdDGlbKW-ylRhFOO8sdBgRPAFiV040H33EJ50HfbWAatapcfvYpBjaVC5O7wE67RiUB2ufNV7n7W4as8SyEGGVwyEKi5KnTt28hsRFKqCQg-0JB-0CapisBBXpr4wPsojsiCAR8YiZqHDGxQYRmdlJHsmeJcBzOvvjokVrsJmBRB1iMZeVBOYzcl1J7_PiBKfekrjPsCnWTOkZIiyGLVOYP9xqw_qmvYh3xd0XQAaIuKxzGbVlaalQzOHDENnqY7QhDjLp2wPEvyj0MStyD5H8Uhx7TKKeI55b2zcZqinCc8ye5Alt12ltpoBJNkXn8c5asCxUVGC8lNhUlb7e-kveXCWXpihEt1XCftDCrALAvZl-NZikMvhx7gezL51vVlKd_pbCFiNny_1KYVp_GMFSIIVydX7bgrUnyMjH_931DOb6PwVFEjy3zQ6p6Tur_KiaW1aMVQYoYMyP9lUn1I2peqp_XgKIbE' } }
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
        const teamId = arr.id;
        console.log("Skills Request ", counter)
        counter++;
        try {
            const config2 = { headers: { 'Authorization': 'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiZjNiMzA2NDJlNGUyNmVjYzc0MGNiNzU4M2E3N2MwYjZhZmNjZjNkZDNkZjJiNDIwYTY5ODhjNjU0OWE1NTJmY2Q5MTExM2NmODc5MmY5YmMiLCJpYXQiOjE2NjE2MzIxMjAuOTQ5OTE5LCJuYmYiOjE2NjE2MzIxMjAuOTQ5OTIyMSwiZXhwIjoyNjA4NDA2OTIwLjkzOTM4NjgsInN1YiI6IjEwMDk0OCIsInNjb3BlcyI6W119.OCxtefDO9asOhFySsZP8vOlAEACl3zUTBgZRx8pFxssOkOYsaPXHoOA2LT6L_wH6wjEH_ilRrM0fXyXreb6ofF_SzbXLE2QXJGnCJMa3gcAS3QjHyib-bcB6QrLmcyJ-vk8JTgog_k9BgEwxSbjtHB1kjSvo--AkB8jghp6V7noGQzr2cGhLdJEK2FH8VKi7ni5DTXPl0e5fdDGlbKW-ylRhFOO8sdBgRPAFiV040H33EJ50HfbWAatapcfvYpBjaVC5O7wE67RiUB2ufNV7n7W4as8SyEGGVwyEKi5KnTt28hsRFKqCQg-0JB-0CapisBBXpr4wPsojsiCAR8YiZqHDGxQYRmdlJHsmeJcBzOvvjokVrsJmBRB1iMZeVBOYzcl1J7_PiBKfekrjPsCnWTOkZIiyGLVOYP9xqw_qmvYh3xd0XQAaIuKxzGbVlaalQzOHDENnqY7QhDjLp2wPEvyj0MStyD5H8Uhx7TKKeI55b2zcZqinCc8ye5Alt12ltpoBJNkXn8c5asCxUVGC8lNhUlb7e-kveXCWXpihEt1XCftDCrALAvZl-NZikMvhx7gezL51vVlKd_pbCFiNny_1KYVp_GMFSIIVydX7bgrUnyMjH_931DOb6PwVFEjy3zQ6p6Tur_KiaW1aMVQYoYMyP9lUn1I2peqp_XgKIbE' } }
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

    //SKILLS IS COMMENTED OFF SECTION ABOVE
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
    //     const config2 = { headers: { 'Authorization': 'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiZjNiMzA2NDJlNGUyNmVjYzc0MGNiNzU4M2E3N2MwYjZhZmNjZjNkZDNkZjJiNDIwYTY5ODhjNjU0OWE1NTJmY2Q5MTExM2NmODc5MmY5YmMiLCJpYXQiOjE2NjE2MzIxMjAuOTQ5OTE5LCJuYmYiOjE2NjE2MzIxMjAuOTQ5OTIyMSwiZXhwIjoyNjA4NDA2OTIwLjkzOTM4NjgsInN1YiI6IjEwMDk0OCIsInNjb3BlcyI6W119.OCxtefDO9asOhFySsZP8vOlAEACl3zUTBgZRx8pFxssOkOYsaPXHoOA2LT6L_wH6wjEH_ilRrM0fXyXreb6ofF_SzbXLE2QXJGnCJMa3gcAS3QjHyib-bcB6QrLmcyJ-vk8JTgog_k9BgEwxSbjtHB1kjSvo--AkB8jghp6V7noGQzr2cGhLdJEK2FH8VKi7ni5DTXPl0e5fdDGlbKW-ylRhFOO8sdBgRPAFiV040H33EJ50HfbWAatapcfvYpBjaVC5O7wE67RiUB2ufNV7n7W4as8SyEGGVwyEKi5KnTt28hsRFKqCQg-0JB-0CapisBBXpr4wPsojsiCAR8YiZqHDGxQYRmdlJHsmeJcBzOvvjokVrsJmBRB1iMZeVBOYzcl1J7_PiBKfekrjPsCnWTOkZIiyGLVOYP9xqw_qmvYh3xd0XQAaIuKxzGbVlaalQzOHDENnqY7QhDjLp2wPEvyj0MStyD5H8Uhx7TKKeI55b2zcZqinCc8ye5Alt12ltpoBJNkXn8c5asCxUVGC8lNhUlb7e-kveXCWXpihEt1XCftDCrALAvZl-NZikMvhx7gezL51vVlKd_pbCFiNny_1KYVp_GMFSIIVydX7bgrUnyMjH_931DOb6PwVFEjy3zQ6p6Tur_KiaW1aMVQYoYMyP9lUn1I2peqp_XgKIbE' } }
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

        const config2 = { headers: { 'Authorization': 'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiZjNiMzA2NDJlNGUyNmVjYzc0MGNiNzU4M2E3N2MwYjZhZmNjZjNkZDNkZjJiNDIwYTY5ODhjNjU0OWE1NTJmY2Q5MTExM2NmODc5MmY5YmMiLCJpYXQiOjE2NjE2MzIxMjAuOTQ5OTE5LCJuYmYiOjE2NjE2MzIxMjAuOTQ5OTIyMSwiZXhwIjoyNjA4NDA2OTIwLjkzOTM4NjgsInN1YiI6IjEwMDk0OCIsInNjb3BlcyI6W119.OCxtefDO9asOhFySsZP8vOlAEACl3zUTBgZRx8pFxssOkOYsaPXHoOA2LT6L_wH6wjEH_ilRrM0fXyXreb6ofF_SzbXLE2QXJGnCJMa3gcAS3QjHyib-bcB6QrLmcyJ-vk8JTgog_k9BgEwxSbjtHB1kjSvo--AkB8jghp6V7noGQzr2cGhLdJEK2FH8VKi7ni5DTXPl0e5fdDGlbKW-ylRhFOO8sdBgRPAFiV040H33EJ50HfbWAatapcfvYpBjaVC5O7wE67RiUB2ufNV7n7W4as8SyEGGVwyEKi5KnTt28hsRFKqCQg-0JB-0CapisBBXpr4wPsojsiCAR8YiZqHDGxQYRmdlJHsmeJcBzOvvjokVrsJmBRB1iMZeVBOYzcl1J7_PiBKfekrjPsCnWTOkZIiyGLVOYP9xqw_qmvYh3xd0XQAaIuKxzGbVlaalQzOHDENnqY7QhDjLp2wPEvyj0MStyD5H8Uhx7TKKeI55b2zcZqinCc8ye5Alt12ltpoBJNkXn8c5asCxUVGC8lNhUlb7e-kveXCWXpihEt1XCftDCrALAvZl-NZikMvhx7gezL51vVlKd_pbCFiNny_1KYVp_GMFSIIVydX7bgrUnyMjH_931DOb6PwVFEjy3zQ6p6Tur_KiaW1aMVQYoYMyP9lUn1I2peqp_XgKIbE' } }
        const res2 = await axios.get(`https://www.robotevents.com/api/v2/events/45434/teams?registered=true&myTeams=false&per_page=250&page=1`, config2)

        const iterator = res2.data.meta.last_page;

        for (i = 1; i <= iterator; i++) {
            const config2 = { headers: { 'Authorization': 'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiZjNiMzA2NDJlNGUyNmVjYzc0MGNiNzU4M2E3N2MwYjZhZmNjZjNkZDNkZjJiNDIwYTY5ODhjNjU0OWE1NTJmY2Q5MTExM2NmODc5MmY5YmMiLCJpYXQiOjE2NjE2MzIxMjAuOTQ5OTE5LCJuYmYiOjE2NjE2MzIxMjAuOTQ5OTIyMSwiZXhwIjoyNjA4NDA2OTIwLjkzOTM4NjgsInN1YiI6IjEwMDk0OCIsInNjb3BlcyI6W119.OCxtefDO9asOhFySsZP8vOlAEACl3zUTBgZRx8pFxssOkOYsaPXHoOA2LT6L_wH6wjEH_ilRrM0fXyXreb6ofF_SzbXLE2QXJGnCJMa3gcAS3QjHyib-bcB6QrLmcyJ-vk8JTgog_k9BgEwxSbjtHB1kjSvo--AkB8jghp6V7noGQzr2cGhLdJEK2FH8VKi7ni5DTXPl0e5fdDGlbKW-ylRhFOO8sdBgRPAFiV040H33EJ50HfbWAatapcfvYpBjaVC5O7wE67RiUB2ufNV7n7W4as8SyEGGVwyEKi5KnTt28hsRFKqCQg-0JB-0CapisBBXpr4wPsojsiCAR8YiZqHDGxQYRmdlJHsmeJcBzOvvjokVrsJmBRB1iMZeVBOYzcl1J7_PiBKfekrjPsCnWTOkZIiyGLVOYP9xqw_qmvYh3xd0XQAaIuKxzGbVlaalQzOHDENnqY7QhDjLp2wPEvyj0MStyD5H8Uhx7TKKeI55b2zcZqinCc8ye5Alt12ltpoBJNkXn8c5asCxUVGC8lNhUlb7e-kveXCWXpihEt1XCftDCrALAvZl-NZikMvhx7gezL51vVlKd_pbCFiNny_1KYVp_GMFSIIVydX7bgrUnyMjH_931DOb6PwVFEjy3zQ6p6Tur_KiaW1aMVQYoYMyP9lUn1I2peqp_XgKIbE' } }
            const res2 = await axios.get(`https://www.robotevents.com/api/v2/events/45434/teams?registered=true&myTeams=false&per_page=250&page=${i}`, config2)

            const usables = res2.data.data
            for (usable of usables) {
                teamsWorlds.push(usable);
            }
        }
        console.log("Done Middle School")

        const config3 = { headers: { 'Authorization': 'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiZjNiMzA2NDJlNGUyNmVjYzc0MGNiNzU4M2E3N2MwYjZhZmNjZjNkZDNkZjJiNDIwYTY5ODhjNjU0OWE1NTJmY2Q5MTExM2NmODc5MmY5YmMiLCJpYXQiOjE2NjE2MzIxMjAuOTQ5OTE5LCJuYmYiOjE2NjE2MzIxMjAuOTQ5OTIyMSwiZXhwIjoyNjA4NDA2OTIwLjkzOTM4NjgsInN1YiI6IjEwMDk0OCIsInNjb3BlcyI6W119.OCxtefDO9asOhFySsZP8vOlAEACl3zUTBgZRx8pFxssOkOYsaPXHoOA2LT6L_wH6wjEH_ilRrM0fXyXreb6ofF_SzbXLE2QXJGnCJMa3gcAS3QjHyib-bcB6QrLmcyJ-vk8JTgog_k9BgEwxSbjtHB1kjSvo--AkB8jghp6V7noGQzr2cGhLdJEK2FH8VKi7ni5DTXPl0e5fdDGlbKW-ylRhFOO8sdBgRPAFiV040H33EJ50HfbWAatapcfvYpBjaVC5O7wE67RiUB2ufNV7n7W4as8SyEGGVwyEKi5KnTt28hsRFKqCQg-0JB-0CapisBBXpr4wPsojsiCAR8YiZqHDGxQYRmdlJHsmeJcBzOvvjokVrsJmBRB1iMZeVBOYzcl1J7_PiBKfekrjPsCnWTOkZIiyGLVOYP9xqw_qmvYh3xd0XQAaIuKxzGbVlaalQzOHDENnqY7QhDjLp2wPEvyj0MStyD5H8Uhx7TKKeI55b2zcZqinCc8ye5Alt12ltpoBJNkXn8c5asCxUVGC8lNhUlb7e-kveXCWXpihEt1XCftDCrALAvZl-NZikMvhx7gezL51vVlKd_pbCFiNny_1KYVp_GMFSIIVydX7bgrUnyMjH_931DOb6PwVFEjy3zQ6p6Tur_KiaW1aMVQYoYMyP9lUn1I2peqp_XgKIbE' } }
        const res3 = await axios.get(`https://www.robotevents.com/api/v2/events/45258/teams?registered=true&myTeams=false&per_page=250&page=1`, config3)
        const iterator3 = res3.data.meta.last_page;

        for (i = 1; i <= iterator3; i++) {
            const config3 = { headers: { 'Authorization': 'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiZjNiMzA2NDJlNGUyNmVjYzc0MGNiNzU4M2E3N2MwYjZhZmNjZjNkZDNkZjJiNDIwYTY5ODhjNjU0OWE1NTJmY2Q5MTExM2NmODc5MmY5YmMiLCJpYXQiOjE2NjE2MzIxMjAuOTQ5OTE5LCJuYmYiOjE2NjE2MzIxMjAuOTQ5OTIyMSwiZXhwIjoyNjA4NDA2OTIwLjkzOTM4NjgsInN1YiI6IjEwMDk0OCIsInNjb3BlcyI6W119.OCxtefDO9asOhFySsZP8vOlAEACl3zUTBgZRx8pFxssOkOYsaPXHoOA2LT6L_wH6wjEH_ilRrM0fXyXreb6ofF_SzbXLE2QXJGnCJMa3gcAS3QjHyib-bcB6QrLmcyJ-vk8JTgog_k9BgEwxSbjtHB1kjSvo--AkB8jghp6V7noGQzr2cGhLdJEK2FH8VKi7ni5DTXPl0e5fdDGlbKW-ylRhFOO8sdBgRPAFiV040H33EJ50HfbWAatapcfvYpBjaVC5O7wE67RiUB2ufNV7n7W4as8SyEGGVwyEKi5KnTt28hsRFKqCQg-0JB-0CapisBBXpr4wPsojsiCAR8YiZqHDGxQYRmdlJHsmeJcBzOvvjokVrsJmBRB1iMZeVBOYzcl1J7_PiBKfekrjPsCnWTOkZIiyGLVOYP9xqw_qmvYh3xd0XQAaIuKxzGbVlaalQzOHDENnqY7QhDjLp2wPEvyj0MStyD5H8Uhx7TKKeI55b2zcZqinCc8ye5Alt12ltpoBJNkXn8c5asCxUVGC8lNhUlb7e-kveXCWXpihEt1XCftDCrALAvZl-NZikMvhx7gezL51vVlKd_pbCFiNny_1KYVp_GMFSIIVydX7bgrUnyMjH_931DOb6PwVFEjy3zQ6p6Tur_KiaW1aMVQYoYMyP9lUn1I2peqp_XgKIbE' } }
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
            const config = { headers: { 'Authorization': 'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiZjNiMzA2NDJlNGUyNmVjYzc0MGNiNzU4M2E3N2MwYjZhZmNjZjNkZDNkZjJiNDIwYTY5ODhjNjU0OWE1NTJmY2Q5MTExM2NmODc5MmY5YmMiLCJpYXQiOjE2NjE2MzIxMjAuOTQ5OTE5LCJuYmYiOjE2NjE2MzIxMjAuOTQ5OTIyMSwiZXhwIjoyNjA4NDA2OTIwLjkzOTM4NjgsInN1YiI6IjEwMDk0OCIsInNjb3BlcyI6W119.OCxtefDO9asOhFySsZP8vOlAEACl3zUTBgZRx8pFxssOkOYsaPXHoOA2LT6L_wH6wjEH_ilRrM0fXyXreb6ofF_SzbXLE2QXJGnCJMa3gcAS3QjHyib-bcB6QrLmcyJ-vk8JTgog_k9BgEwxSbjtHB1kjSvo--AkB8jghp6V7noGQzr2cGhLdJEK2FH8VKi7ni5DTXPl0e5fdDGlbKW-ylRhFOO8sdBgRPAFiV040H33EJ50HfbWAatapcfvYpBjaVC5O7wE67RiUB2ufNV7n7W4as8SyEGGVwyEKi5KnTt28hsRFKqCQg-0JB-0CapisBBXpr4wPsojsiCAR8YiZqHDGxQYRmdlJHsmeJcBzOvvjokVrsJmBRB1iMZeVBOYzcl1J7_PiBKfekrjPsCnWTOkZIiyGLVOYP9xqw_qmvYh3xd0XQAaIuKxzGbVlaalQzOHDENnqY7QhDjLp2wPEvyj0MStyD5H8Uhx7TKKeI55b2zcZqinCc8ye5Alt12ltpoBJNkXn8c5asCxUVGC8lNhUlb7e-kveXCWXpihEt1XCftDCrALAvZl-NZikMvhx7gezL51vVlKd_pbCFiNny_1KYVp_GMFSIIVydX7bgrUnyMjH_931DOb6PwVFEjy3zQ6p6Tur_KiaW1aMVQYoYMyP9lUn1I2peqp_XgKIbE' } }
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

    //SECTIOn ABOVE IS AWARDS
    //BELOW IS RANKINGS

    counter = 0;
    for (arr of arrs) {
        // for (j = 0; j < 50; j++) {
        console.log("Rankings for team ", counter)
        counter++;

        let wins = 0;
        let losses = 0;
        let weightedRate = 0;
        let unweightedRate = 0;
        let avgSoS = 0;
        const id = arr.id;

        let weightedWins = 0;
        let SosCalc = 0;

        try {
            const config = { headers: { 'Authorization': 'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiZjNiMzA2NDJlNGUyNmVjYzc0MGNiNzU4M2E3N2MwYjZhZmNjZjNkZDNkZjJiNDIwYTY5ODhjNjU0OWE1NTJmY2Q5MTExM2NmODc5MmY5YmMiLCJpYXQiOjE2NjE2MzIxMjAuOTQ5OTE5LCJuYmYiOjE2NjE2MzIxMjAuOTQ5OTIyMSwiZXhwIjoyNjA4NDA2OTIwLjkzOTM4NjgsInN1YiI6IjEwMDk0OCIsInNjb3BlcyI6W119.OCxtefDO9asOhFySsZP8vOlAEACl3zUTBgZRx8pFxssOkOYsaPXHoOA2LT6L_wH6wjEH_ilRrM0fXyXreb6ofF_SzbXLE2QXJGnCJMa3gcAS3QjHyib-bcB6QrLmcyJ-vk8JTgog_k9BgEwxSbjtHB1kjSvo--AkB8jghp6V7noGQzr2cGhLdJEK2FH8VKi7ni5DTXPl0e5fdDGlbKW-ylRhFOO8sdBgRPAFiV040H33EJ50HfbWAatapcfvYpBjaVC5O7wE67RiUB2ufNV7n7W4as8SyEGGVwyEKi5KnTt28hsRFKqCQg-0JB-0CapisBBXpr4wPsojsiCAR8YiZqHDGxQYRmdlJHsmeJcBzOvvjokVrsJmBRB1iMZeVBOYzcl1J7_PiBKfekrjPsCnWTOkZIiyGLVOYP9xqw_qmvYh3xd0XQAaIuKxzGbVlaalQzOHDENnqY7QhDjLp2wPEvyj0MStyD5H8Uhx7TKKeI55b2zcZqinCc8ye5Alt12ltpoBJNkXn8c5asCxUVGC8lNhUlb7e-kveXCWXpihEt1XCftDCrALAvZl-NZikMvhx7gezL51vVlKd_pbCFiNny_1KYVp_GMFSIIVydX7bgrUnyMjH_931DOb6PwVFEjy3zQ6p6Tur_KiaW1aMVQYoYMyP9lUn1I2peqp_XgKIbE' } }
            const res = await axios.get(`https://www.robotevents.com/api/v2/teams/${id}/rankings?season%5B%5D=173&per_page=250&page=1`, config)

            const usables = res.data.data;
            for (i = 0; i < usables.length; i++) {
                // console.log(arr.number)
                const usable = usables[i];
                const eWins = usable.wins;
                const eLosses = usable.losses;
                wins += eWins;
                losses += eLosses;

                const totalMatches = wins + losses;
                unweightedRate = wins / totalMatches;

                const eSos = usable.sp / totalMatches;
                SosCalc += eSos;

                // console.log(eventId)
                try {
                    let level = '';
                    const eventId = usable.event.id;

                    const config = { headers: { 'Authorization': 'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiZjNiMzA2NDJlNGUyNmVjYzc0MGNiNzU4M2E3N2MwYjZhZmNjZjNkZDNkZjJiNDIwYTY5ODhjNjU0OWE1NTJmY2Q5MTExM2NmODc5MmY5YmMiLCJpYXQiOjE2NjE2MzIxMjAuOTQ5OTE5LCJuYmYiOjE2NjE2MzIxMjAuOTQ5OTIyMSwiZXhwIjoyNjA4NDA2OTIwLjkzOTM4NjgsInN1YiI6IjEwMDk0OCIsInNjb3BlcyI6W119.OCxtefDO9asOhFySsZP8vOlAEACl3zUTBgZRx8pFxssOkOYsaPXHoOA2LT6L_wH6wjEH_ilRrM0fXyXreb6ofF_SzbXLE2QXJGnCJMa3gcAS3QjHyib-bcB6QrLmcyJ-vk8JTgog_k9BgEwxSbjtHB1kjSvo--AkB8jghp6V7noGQzr2cGhLdJEK2FH8VKi7ni5DTXPl0e5fdDGlbKW-ylRhFOO8sdBgRPAFiV040H33EJ50HfbWAatapcfvYpBjaVC5O7wE67RiUB2ufNV7n7W4as8SyEGGVwyEKi5KnTt28hsRFKqCQg-0JB-0CapisBBXpr4wPsojsiCAR8YiZqHDGxQYRmdlJHsmeJcBzOvvjokVrsJmBRB1iMZeVBOYzcl1J7_PiBKfekrjPsCnWTOkZIiyGLVOYP9xqw_qmvYh3xd0XQAaIuKxzGbVlaalQzOHDENnqY7QhDjLp2wPEvyj0MStyD5H8Uhx7TKKeI55b2zcZqinCc8ye5Alt12ltpoBJNkXn8c5asCxUVGC8lNhUlb7e-kveXCWXpihEt1XCftDCrALAvZl-NZikMvhx7gezL51vVlKd_pbCFiNny_1KYVp_GMFSIIVydX7bgrUnyMjH_931DOb6PwVFEjy3zQ6p6Tur_KiaW1aMVQYoYMyP9lUn1I2peqp_XgKIbE' } }
                    const res2 = await axios.get(`https://www.robotevents.com/api/v2/events/${eventId}`, config)

                    level = res2.data.level;

                    if (level === 'Signature') {
                        const weightedWinsCalc = wins * 1.1;
                        weightedWins += weightedWinsCalc;
                    } else if (level === "World") {
                        const weightedWinsCalc = wins * 1.2;
                        weightedWins += weightedWinsCalc;
                    } else {
                        weightedWins += wins;
                    }

                } catch (e) {
                    console.log(e)
                }
            }
            const totalMatches = wins + losses;
            weightedRate = weightedWins / totalMatches;

            const i1 = usables.length;
            avgSoS = SosCalc / i1;

            const Obj = {
                wins: wins,
                losses: losses,
                weightedRate: weightedRate,
                unweightedRate: unweightedRate,
                avgSoS: avgSoS
            }

            arr.rankings = Obj;

        } catch (e) {
            console.log(e)
        }
    }

    return arrs;
}

async function insertTeams() {
    const arr = await getAllElse()
    console.log('inserting teams')
    await Team.deleteMany({})
    await Team.insertMany(arr)
        .then(() => {
            console.log('inserted')
        })
        .catch(err => {
            console.log(err)
        })
    const count2 = await Team.count()
    console.log(count2)
}

module.exports = insertTeams;