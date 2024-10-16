import genshindb from 'genshin-db'

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
    if (!text) throw `Example : *${usedPrefix + command} 60*`
    try {
        let anu = await genshindb.adventureranks(text)
        let txt = `*Rank Level : ${anu.name}*\n\n`
        if (anu.unlockDescription) txt += `*Unlock Description :* ${anu.unlockDescription}\n`
        for (let i of anu.reward) {
            txt += `*${i.name} :* ${i.count}x\n`
        }
        m.reply(txt)
    } catch (e) {
        try {
            let anu = await (await fetch(`https://genshin-db-api.vercel.app/api/v5/adventureranks?query=${text[0]}`)).json()
            let txt = `*Rank Level : ${anu.name}*\n\n`
            if (anu.unlockDescription) txt += `*Unlock Description :* ${anu.unlockDescription}\n`
            for (let i of anu.reward) {
                txt += `*${i.name} :* ${i.count}x\n`
            }
            m.reply(txt)
        } catch (e) {
            console.log(e)
            m.reply(`*Not Found*\n\n*Available adventureranks is :* 1-60`)
        }
    }
}

handler.menugenshin = ['giadvrank <level>']
handler.tagsgenshin = ['search']
handler.command = /^((gi|genshin)advrank(s?)?|giadventureranks|giadventurerank|genshinadventureranks|genshinadventurerank)$/i

handler.limit = true

export default handler