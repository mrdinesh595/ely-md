import genshindb from 'genshin-db'

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
    if (!text) throw `Example : *${usedPrefix + command} Lost Prayer*`
    try {
        let anu = await genshindb.weapons(text)
        let txt = `*Found : ${anu.name}*\n\n`
        txt += `*Description :* ${anu.description}\n`
        txt += `*Type :* ${anu.weaponText}\n`
        txt += `*Rarity :* ${anu.rarity}\n\n`
        txt += `*Story :*\n${anu.story}\n\n`
        txt += `*Base Attack :* ${anu.baseAtkValue}\n`
        txt += `*Stat :* ${anu.mainStatText} ( ${anu.baseStatText} )\n\n`
        txt += `*Effect Name :* ${anu.effectName}\n`
        txt += `*Effect R1 :* ${anu.r1}\n`
        txt += `*Effect R2 :* ${anu.r2}\n`
        txt += `*Effect R3 :* ${anu.r3}\n`
        txt += `*Effect R4 :* ${anu.r4}\n`
        txt += `*Effect R5 :* ${anu.r5}\n`
        txt += `*Effect R6 :* ${anu.r6}\n\n`
        Object.keys(anu.costs).forEach(level => {
            txt += `\nCosts for ${level}:\n`
            anu.costs[level].forEach(item => {
                txt += `- ${item.name}: ${item.count}\n`
            });
        });
        m.reply(txt)
    } catch (e) {
        try {
            let anu2 = await genshindb.weapons(`names`, { matchCategories: true })
            m.reply(`*Not Found*\n\n*Available Weapons is :*\n${anu2.join(", ")}`)
        } catch (e) {
            try {
                let anu = await (await fetch(`https://genshin-db-api.vercel.app/api/v5/weapons?query=${text}`)).json()
                let txt = `*Found : ${anu.name}*\n\n`
                txt += `*Description :* ${anu.description}\n`
                txt += `*Type :* ${anu.weaponText}\n`
                txt += `*Rarity :* ${anu.rarity}\n\n`
                txt += `*Story :*\n${anu.story}\n\n`
                txt += `*Base Attack :* ${anu.baseAtkValue}\n`
                txt += `*Stat :* ${anu.mainStatText} ( ${anu.baseStatText} )\n\n`
                txt += `*Effect Name :* ${anu.effectName}\n`
                txt += `*Effect R1 :* ${anu.r1}\n`
                txt += `*Effect R2 :* ${anu.r2}\n`
                txt += `*Effect R3 :* ${anu.r3}\n`
                txt += `*Effect R4 :* ${anu.r4}\n`
                txt += `*Effect R5 :* ${anu.r5}\n`
                txt += `*Effect R6 :* ${anu.r6}\n\n`
                Object.keys(anu.costs).forEach(level => {
                    txt += `\nCosts for ${level}:\n`
                    anu.costs[level].forEach(item => {
                        txt += `- ${item.name}: ${item.count}\n`
                    });
                });
                m.reply(txt)
            } catch (e) {
                console.log(e)
                m.reply(`*Weapon Not Found*`)
            }
        }
    }
}

handler.menugenshin = ['giweapon <name>']
handler.tagsgenshin = ['search']
handler.command = /^((gi|genshin)weap(ons?)?)$/i

handler.limit = true

export default handler