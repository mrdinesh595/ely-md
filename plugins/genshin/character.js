import genshindb from 'genshin-db'

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
    if (!text) throw `Example : *${usedPrefix + command} Eula*`
    try {
        let data = await genshindb.characters(text)
        let txt = `Found: *${data.name}*\n\n`
        txt += `Title: *${data.title}*\n\n`
        txt += `Description: ${data.description}\n\n`
        txt += `*Weapon:* ${data.weaponText}\n`
        txt += `*Gender:* ${data.gender}\n`
        txt += `*Rarity:* ${data.rarity}\n`
        txt += `*Birthday (MM/DD):* ${data.birthdaymmdd}\n`
        txt += `*Birthday:* ${data.birthday}\n`
        txt += `*Element:* ${data.elementText}\n`
        txt += `*Affiliation:* ${data.affiliation}\n`
        txt += `*Region:* ${data.region}\n`
        txt += `*Substat:* ${data.substatText}\n`
        txt += `*Constellation:* ${data.constellation}\n`
        txt += `*CV (English):* ${data.cv.english}\n`
        txt += `*CV (Chinese):* ${data.cv.chinese}\n`
        txt += `*CV (Japanese):* ${data.cv.japanese}\n`
        txt += `*CV (Korean):* ${data.cv.korean}\n`
        txt += `*Version:* ${data.version}\n`

        Object.keys(data.costs).forEach(level => {
            txt += `\nCosts for ${level}:\n`
            data.costs[level].forEach(item => {
                txt += `- ${item.name}: ${item.count}\n`
            });
        });
        if (data.images.cover1) await conn.sendMsg(m.chat, { image: { url: data.images.cover1 }, caption: txt }, { quoted: m })
        else m.reply(txt)
    } catch (e) {
        console.log(e)
        try {
            let anu2 = await genshindb.characters(`names`, { matchCategories: true })
            m.reply(`*Not Found*\n\n*Available Characters is :*\n${anu2.join(", ")}`)
        } catch (e) {
            try {
                let data = await (await fetch(`https://genshin-db-api.vercel.app/api/v5/characters?query=${text}`)).json()
                let txt = `*Found: ${data.name}*\n`
                txt += `*Title :* ${data.title}\n`
                txt += `*Description :* ${data.description}\n`
                txt += `*Weapon* : ${data.weaponText}\n`
                txt += `*Gender* : ${data.gender}\n`
                txt += `*Rarity :* ${data.rarity}\n`
                txt += `*Birthday* : ${data.birthday}\n`
                txt += `*Element* : ${data.elementText}\n`
                txt += `*Affiliation* : ${data.affiliation}\n`
                txt += `*Region* : ${data.region}\n`
                txt += `*Substat* : ${data.substatText}\n`
                txt += `*Constellation* : ${data.constellation}\n`
                txt += `*CV (English)* : ${data.cv.english}\n`
                txt += `*CV (Chinese)* : ${data.cv.chinese}\n`
                txt += `*CV (Japanese)* : ${data.cv.japanese}\n`
                txt += `*CV (Korean)* : ${data.cv.korean}\n`
                txt += `*Version* : ${data.version}\n`

                Object.keys(data.costs).forEach(level => {
                    txt += `\n*Costs for ${level}* :\n`
                    data.costs[level].forEach(item => {
                        txt += `- ${item.name}: ${item.count}\n`
                    });
                });
                if (data.images.cover1) await conn.sendMsg(m.chat, { image: { url: data.images.cover1 }, caption: txt }, { quoted: m })
                else m.reply(txt)
            } catch (e) {
                console.log(e)
                let anu2 = await (await fetch(`https://genshin-db-api.vercel.app/api/v5/characters?query=names&matchCategories=true`)).json()
                m.reply(`*Not Found*\n\n*Available Characters is :*\n${anu2.join(", ")}`)
            }
        }
    }
}

handler.menugenshin = ['gichar <name>']
handler.tagsgenshin = ['search']
handler.command = /^((gi|genshin)char(acter?)?)$/i

handler.limit = true

export default handler