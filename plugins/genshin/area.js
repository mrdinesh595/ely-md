import genshindb from 'genshin-db'

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
	if (!text) throw `Example : *${usedPrefix + command} library*`
	try {
		let anu = await genshindb.geographies(text)
		let txt = `*Found : ${anu.name}*\n\n`
		txt += `_"${anu.description}"_\n\n`
		txt += `*Area :* ${anu.areaName}\n`
		txt += `*Region :* ${anu.regionName}\n`
		txt += `_sort order : ${anu.sortOrder}_`
		m.reply(txt)
	} catch (e) {
		console.log(e)
		try {
			let anu2 = await genshindb.geographies(`names`, { matchCategories: true })
			m.reply(`*Not Found*\n\n*Available geographies is :*\n${anu2.join(", ")}`)
		} catch (e) {
			try {
				let anu = await (await fetch(`https://genshin-db-api.vercel.app/api/v5/geographies?query=${text}`)).json()
				let txt = `*Found : ${anu.name}*\n\n`
				txt += `_"${anu.description}"_\n\n`
				txt += `*Area :* ${anu.areaName}\n`
				txt += `*Region :* ${anu.regionName}\n`
				txt += `_sort order : ${anu.sortOrder}_`
				m.reply(txt)
			} catch (e) {
				console.log(e)
				let anu2 = await (await fetch(`https://genshin-db-api.vercel.app/api/v5/geographies?query=names&matchCategories=true`)).json()
				m.reply(`*Not Found*\n\n*Available geographies is :*\n${anu2.join(", ")}`)
			}
		}
	}
}

handler.menugenshin = ['giarea <place>']
handler.tagsgenshin = ['search']
handler.command = /^((gi|genshin)(areas?|geogra(fi|ph(y|ies?))))$/i

handler.limit = true

export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)