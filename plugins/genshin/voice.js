import genshindb from 'genshin-db'

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
    if (!text) throw `Example : *${usedPrefix + command} Eula*`
    try {
        let anu = await genshindb.voiceovers(text)
        let txt = `*Found: ${anu.name}*\n\n`
        txt += 'friendLines: \n\n'

        const chunkSize = 10
        for (let i = 0; i < anu.friendLines.length; i += chunkSize) {
            let chunk = anu.friendLines.slice(i, i + chunkSize)
            let chunkTxt = ''

            for (let j of chunk) {
                chunkTxt += `Title: *${j.title}*\n`
                chunkTxt += `Description: *${j.description}*\n`
                chunkTxt += `Voicefile: *${j.voicefile}*\n\n`
            }

            await m.reply(txt + chunkTxt)
            txt = ''
        }
    } catch (e) {
        console.log(e)
        try {
            let anu2 = await genshindb.voiceovers(`names`, { matchCategories: true })
            m.reply(`*Not Found*\n\n*Available voiceovers are:*\n${anu2.join(", ")}`)
        } catch (e) {
            try {
                let anu = await (await fetch(`https://genshin-db-api.vercel.app/api/v5/voiceovers?query=${text}`)).json()
                let txt = `*Found: ${anu.name}*\n\n`
                txt += '*FRIENDLINES:* \n'
                for (let j of anu.friendLines) {
                    txt += `-------------------\n`
                    txt += `Title: *${j.title}*\n\n`
                    txt += `*Description:* ${j.description}\n\n`
                    txt += `Voicefile: *${j.voicefile}*\n`
                }

                await m.reply(txt)
            } catch (e) {
                console.log(e)
                let anu2 = await (await fetch(`https://genshin-db-api.vercel.app/api/v5/voiceovers?query=names&matchCategories=true`)).json()
                m.reply(`*Not Found*\n\n*Available voiceovers are:*\n${anu2.join(", ")}`)
            }
        }
    }
}

handler.menugenshin = ['givoice <name>']
handler.tagsgenshin = ['search']
handler.command = /^((gi|genshin)voice(overs?)?)$/i

handler.limit = true

export default handler
