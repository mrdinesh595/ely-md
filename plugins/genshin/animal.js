import genshindb from 'genshin-db'

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
	if (!text) throw `Example : *${usedPrefix + command} shiba*`
	try {
		let anu = await genshindb.animals(text)
		let txt = `*Found : ${anu.name}*\n\n`
		txt += `"${anu.description}"\n\n`
		txt += `*Category :* ${anu.categoryText}\n`
		txt += `*Count Type :* ${anu.countType}\n`
		txt += `_sort order : ${anu.sortOrder}_\n`
		txt += `*Filename Icon : ${anu.images.filename_icon}`
		m.reply(txt)
	} catch (e) {
		console.log(e)
		try {
			let anu = await (await fetch(`https://genshin-db-api.vercel.app/api/v5/animals?query=${text}`)).json()
			let txt = `*Found : ${anu.name}*\n\n`
			txt += `"${anu.description}"\n\n`
			txt += `*Category :* ${anu.categoryText}\n`
			txt += `*Count Type :* ${anu.countType}\n`
			txt += `_sort order : ${anu.sortOrder}_\n`
			txt += `*Filename Icon : ${anu.images.filename_icon}`
			m.reply(txt)
		} catch (e) {
			console.log(e)
			try {
				let anu2 = await (await fetch(`https://genshin-db-api.vercel.app/api/v5/animals?query=${text}&matchCategories=true`)).json
				m.reply(`*List ${text} categories :*\n\n- ` + anu2.toString().replaceAll(',', '\n- '))
			} catch (e) {
				console.log(e)
				let anu2 = await (await fetch(`https://genshin-db-api.vercel.app/api/v5/animals?query=names&matchCategories=true`)).json()
				m.reply(`*Not Found*\n\n*Available animals is :*\n${anu2.join(", ")}`)
			}
		}
	}
}

handler.menugenshin = ['gianimal <name>']
handler.tagsgenshin = ['search']
handler.command = /^((gi|genshin)animals?)$/i

handler.limit = true

export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)