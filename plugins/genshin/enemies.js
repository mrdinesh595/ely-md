import genshindb from 'genshin-db'

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
    if (!text) throw `Example : *${usedPrefix + command} Electro Slime*`
    try {
        let anu = await genshindb.enemies(text)
        let txt = `*Found : ${anu.name}*\n\n`
        txt += `*Description :*\n${anu.description}\n\n`
        txt += `*Special Name:*\n`
        for (let i of anu.specialNames) {
            txt += `- ${i}\n`;
        }
        txt += `\n*Enemy Type :* ${anu.enemyType}\n`
        txt += `*Category :* ${anu.categoryText}\n\n`
        txt += `*Investigation :*\n`
        txt += `- Name: *${anu.investigation.name}*\n`
        txt += `- Description: *${anu.investigation.description}*\n`
        txt += `- Category Type: *${anu.investigation.categoryType}*\n`
        txt += `- Category: *${anu.investigation.categoryText}*\n\n`
        txt += `*Drop:*\n`
        for (let i of anu.rewardPreview) {
            txt += `- ${i.name} ${i.count ? '(' + i.count + 'x)' : ''}\n`;
        }

        m.reply(txt)
    } catch (e) {
        console.log(e)
        try {
            let anu2 = await genshindb.enemies(`names`, { matchCategories: true })
            m.reply(`*Not Found*\n\n*Available Enemies is :*\n${anu2.join(", ")}`)
        } catch {
            try {
                let anu = await (await fetch(`https://genshin-db-api.vercel.app/api/v5/enemies?query=${text}`)).json()
                let txt = `*Found : ${anu.name}*\n\n`
                txt += `*Description :*\n${anu.description}\n\n`
                txt += `*Special Name:*\n`
                for (let i of anu.specialNames) {
                    txt += `- ${i}\n`;
                }
                txt += `\n*Enemy Type :* ${anu.enemyType}\n`
                txt += `*Category :* ${anu.categoryText}\n\n`
                txt += `*Investigation :*\n`
                txt += `- Name: *${anu.investigation.name}*\n`
                txt += `- Description: *${anu.investigation.description}*\n`
                txt += `- Category Type: *${anu.investigation.categoryType}*\n`
                txt += `- Category: *${anu.investigation.categoryText}*\n\n`
                txt += `*Drop:*\n`
                for (let i of anu.rewardPreview) {
                    txt += `- ${i.name} ${i.count ? '(' + i.count + 'x)' : ''}\n`;
                }

                m.reply(txt)
            } catch (e) {
                console.log(e)
                m.reply(`*Enemy Not Found*`)
            }
        }
    }
}

handler.menugenshin = ['gienemy <name>']
handler.tagsgenshin = ['search']
handler.command = /^((gi|genshin)enemy(ies?)?)$/i

handler.limit = true

export default handler