import genshindb from 'genshin-db'

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
	if (!text) throw `Example : *${usedPrefix + command} outrider*`
	try {
		let anu = await genshindb.outfits(text)
		let txt = `*Found : ${anu.name}*\n\n`
		txt += `_"${anu.description}"_\n\n`
		txt += `*Character :* ${anu.characterName}`
		txt += `${anu.url.modelviewer ? `\n_${anu.url.modelviewer}_` : ''}`
		m.reply(txt)
	} catch (e) {
		console.log(e)
		try {
			let anu2 = await genshindb.outfits(`${text}`, { matchCategories: true })
			m.reply(`*List ${text} outfit :*\n\n- ` + anu2.toString().replaceAll(',', '\n- '))
		} catch (e) {
			console.log(e)
			try {
				let anu2 = await genshindb.outfits(`names`, { matchCategories: true })
				m.reply(`*Not Found*\n\n*Available outfits is :*\n${anu2.join(", ")}`)
			} catch (e) {
				try {
					let anu = await (await fetch(`https://genshin-db-api.vercel.app/api/v5/outfits?query=${text}`)).json()
					let txt = `*Found : ${anu.name}*\n\n`
					txt += `_"${anu.description}"_\n\n`
					txt += `*Character :* ${anu.characterName}`
					txt += `${anu.url.modelviewer ? `\n_${anu.url.modelviewer}_` : ''}`
					m.reply(txt)
				} catch (e) {
					console.log(e)
					try {
						let anu2 = await (await fetch(`https://genshin-db-api.vercel.app/api/v5/outfits?query=${text}&matchCategories=true`)).json()
						m.reply(`*List ${text} outfit :*\n\n- ` + anu2.toString().replaceAll(',', '\n- '))
					} catch (e) {
						console.log(e)
						let anu2 = await (await fetch(`https://genshin-db-api.vercel.app/api/v5/outfits?query=names&matchCategories=true`)).json
						m.reply(`*Not Found*\n\n*Available outfits is :*\n${anu2.join(", ")}`)
					}
				}
			}
		}
	}
}

handler.menugenshin = ['gioutfit <item>']
handler.tagsgenshin = ['search']
handler.command = /^((gi|genshin)(costumes?|outfits?))$/i

handler.limit = true

export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)