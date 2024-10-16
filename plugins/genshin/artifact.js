import genshindb from 'genshin-db'

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
    if (!text) throw `Example : *${usedPrefix + command} Flame*`
    try {
        let anu = await genshindb.artifacts(text)
        let txt = `*Found : ${anu.name}*\n\n`
        txt += `*Rarity :* `
        for (let i of anu.rarityList) {
            txt += `${i}, `
        }
        txt += `\n*Effect 2 Pieces :* ${anu.effect2Pc}\n`
        txt += `*Effect 4 Pieces :* ${anu.effect4Pc}\n\n`
        txt += `*Flower :*\n`
        txt += `*Name :* ${anu.flower.name}\n`
        txt += `*Relic Type :* ${anu.flower.relictype}\n`
        txt += `*Description :* ${anu.flower.Description}\n\n`
        txt += `*Story :*\n${anu.flower.story}\n\n`
        txt += `*Plume* :\n`
        txt += `*Name :* ${anu.plume.name}\n`
        txt += `*Relic Type :* ${anu.plume.relictype}\n`
        txt += `*Description :* ${anu.plume.Description}\n\n`
        txt += `*Story :*\n${anu.plume.story}\n\n`
        txt += `*Sands :*\n`
        txt += `*Name :* ${anu.sands.name}\n`
        txt += `*Relic Type :* ${anu.sands.relictype}\n`
        txt += `*Description :* ${anu.sands.Description}\n\n`
        txt += `*Story :*\n${anu.sands.story}\n\n`
        txt += `*Goblet :*\n`
        txt += `*Name :* ${anu.goblet.name}\n`
        txt += `*Relic Type :* ${anu.goblet.relictype}\n`
        txt += `*Description :* ${anu.goblet.Description}\n\n`
        txt += `*Story :*\n${anu.goblet.story}\n\n`
        txt += `*Circlet :*\n`
        txt += `*Name :* ${anu.circlet.name}\n`
        txt += `*Relic Type :* ${anu.circlet.relictype}\n`
        txt += `*Description :* ${anu.circlet.Description}\n\n`
        txt += `*Story :*\n${anu.circlet.story}\n\n`
        conn.sendMsg(m.chat, { image: { url: anu.images.flower }, caption: txt }, { quoted: m })
    } catch (e) {
        console.log(e)
        try {
            let anu = await (await fetch(`https://genshin-db-api.vercel.app/api/v5/artifacts?query=${text}`)).json()
            let txt = `*Found : ${anu.name}*\n\n`
            txt += `*Rarity :* `
            for (let i of anu.rarityList) {
                txt += `${i}, `
            }
            txt += `\n*Effect 2 Pieces :* ${anu.effect2Pc}\n`
            txt += `*Effect 4 Pieces :* ${anu.effect4Pc}\n\n`
            txt += `*Flower :*\n`
            txt += `*Name :* ${anu.flower.name}\n`
            txt += `*Relic Type :* ${anu.flower.relictype}\n`
            txt += `*Description :* ${anu.flower.Description}\n\n`
            txt += `*Story :*\n${anu.flower.story}\n\n`
            txt += `*Plume* :\n`
            txt += `*Name :* ${anu.plume.name}\n`
            txt += `*Relic Type :* ${anu.plume.relictype}\n`
            txt += `*Description :* ${anu.plume.Description}\n\n`
            txt += `*Story :*\n${anu.plume.story}\n\n`
            txt += `*Sands :*\n`
            txt += `*Name :* ${anu.sands.name}\n`
            txt += `*Relic Type :* ${anu.sands.relictype}\n`
            txt += `*Description :* ${anu.sands.Description}\n\n`
            txt += `*Story :*\n${anu.sands.story}\n\n`
            txt += `*Goblet :*\n`
            txt += `*Name :* ${anu.goblet.name}\n`
            txt += `*Relic Type :* ${anu.goblet.relictype}\n`
            txt += `*Description :* ${anu.goblet.Description}\n\n`
            txt += `*Story :*\n${anu.goblet.story}\n\n`
            txt += `*Circlet :*\n`
            txt += `*Name :* ${anu.circlet.name}\n`
            txt += `*Relic Type :* ${anu.circlet.relictype}\n`
            txt += `*Description :* ${anu.circlet.Description}\n\n`
            txt += `*Story :*\n${anu.circlet.story}\n\n`
            conn.sendMsg(m.chat, { image: { url: anu.images.flower }, caption: txt }, { quoted: m })
        } catch (e) {
            console.log(e)
            m.reply(`*Artifact Not Found*`)
        }
    }
}

handler.menugenshin = ['giartifact <name>']
handler.tagsgenshin = ['search']
handler.command = /^((gi|genshin)artifact?)$/i

handler.limit = true

export default handler