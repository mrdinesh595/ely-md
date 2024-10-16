import genshindb from 'genshin-db'

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
    if (!text) throw `Example : *${usedPrefix + command} Flame*`
    try {
        let anu = await genshindb.domains(text)
        let txt = `*Found : ${anu.name}*\n\n`
        txt += `*Description :*\n${anu.description}\n\n`
        txt += `*Domain Type :* ${anu.domainText}\n`
        txt += `*Recommended Level :* ${anu.recommendedLevel}\n`
        txt += `*Recommended Elements :*\n`
        for (let i of anu.recommendedElements) {
            txt += `- ${i}\n`
        }
        if (anu.daysOfWeek) {
            txt += `\n*Day of Week* : \n`
            for (let i of anu.daysOfWeek) {
                txt += `- ${i}\n`
            }
        }
        txt += `\n*Unlock Rank :* ${anu.unlockRank}\n\n`
        txt += `*Reward :*\n`
        for (let i of anu.rewardPreview) {
            txt += `- ${i.name}\n`
        }
        txt += `\n*Disorder* :\n${anu.disorder}\n\n`
        txt += `*Monsters* :\n`
        for (let i of anu.monsterList) {
            txt += `- ${i.name}\n`
        }
        m.reply(txt)
    } catch (e) {
        console.log(e)
        try {
            let anu2 = await genshindb.domains(`${text}`, { matchCategories: true })
            m.reply(`*List Available domain in ${text} :*\n\n- ${anu2 ? anu2.toString().replaceAll(',', '\n- ') : 'Not Found'}`)
        } catch (e) {
            console.log(e)
            try {
                let anu = await (await fetch(`https://genshin-db-api.vercel.app/api/v5/domains?query=${text}`)).json()
                let txt = `*Found : ${anu.name}*\n\n`
                txt += `*Description :*\n${anu.description}\n\n`
                txt += `*Domain Type :* ${anu.domainText}\n`
                txt += `*Recommended Level :* ${anu.recommendedLevel}\n`
                txt += `*Recommended Elements :*\n`
                for (let i of anu.recommendedElements) {
                    txt += `- ${i}\n`
                }
                if (anu.daysOfWeek) {
                    txt += `\n*Day of Week* : \n`
                    for (let i of anu.daysOfWeek) {
                        txt += `- ${i}\n`
                    }
                }
                txt += `\n*Unlock Rank :* ${anu.unlockRank}\n\n`
                txt += `*Reward :*\n`
                for (let i of anu.rewardPreview) {
                    txt += `- ${i.name}\n`
                }
                txt += `\n*Disorder* :\n${anu.disorder}\n\n`
                txt += `*Monsters* :\n`
                for (let i of anu.monsterList) {
                    txt += `- ${i.name}\n`
                }
                m.reply(txt)
            } catch (e) {
                console.log(e)
                try {
                    let anu2 = await (await fetch(`https://genshin-db-api.vercel.app/api/v5/domains?query=${text}&matchCategories=true`)).json()
                    m.reply(`*List Available domain in ${text} :*\n\n- ${anu2 ? anu2.toString().replaceAll(',', '\n- ') : 'Not Found'}`)
                } catch (e) {
                    console.log(e)
                    m.reply(`*Domains not found*`)
                }
            }
        }
    }
}

handler.menugenshin = ['gidomain <name>']
handler.tagsgenshin = ['search']
handler.command = /^((gi|genshin)domain(s?)?)$/i

handler.limit = true

export default handler