import genshindb from 'genshin-db'

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
	if (!text) throw `Example : *${usedPrefix + command} klee*`
	try {
		let anu = await genshindb.namecards(text)
		let txt = `*${anu.name}*\n\n`
		txt += `*[ ${anu.description.replace('\n', ' ]*\n_"')}"_\n\n`
		txt += `${anu.source ? `*Source :* ${anu.source.toString().replaceAll(',', ', ')}` : ''}\n\n`
		if (anu.images) {
			txt += `*Icon Filename:* ${anu.images.filename_icon ? anu.images.filename_icon : ''}\n`;
			txt += `*Banner Filename:* ${anu.images.filename_banner ? anu.images.filename_banner : ''}\n`;
			txt += `*Background Filename:* ${anu.images.filename_background ? anu.images.filename_background : ''}\n`;
		}
		m.reply(txt)
	} catch (e) {
		console.log(e)
		try {
			let anu2 = await genshindb.namecards(`names`, { matchCategories: true })
			m.reply(`*Not Found*\n\n*Available namecards is :*\n${anu2.join(", ")}`)
		} catch (e) {
			try {
				let anu = await (await fetch(`https://genshin-db-api.vercel.app/api/v5	/namecards?query=${text}`)).json()
				let txt = `*${anu.name}*\n\n`
				txt += `*[ ${anu.description.replace('\n', ' ]*\n_"')}"_\n\n`
				txt += `${anu.source ? `*Source :* ${anu.source.toString().replaceAll(',', ', ')}` : ''}\n\n`
				if (anu.images) {
					txt += `*Icon Filename:* ${anu.images.filename_icon ? anu.images.filename_icon : ''}\n`;
					txt += `*Banner Filename:* ${anu.images.filename_banner ? anu.images.filename_banner : ''}\n`;
					txt += `*Background Filename:* ${anu.images.filename_background ? anu.images.filename_background : ''}\n`;
				}
				m.reply(txt)
			} catch (e) {
				console.log(e)
				let anu2 = await (await fetch(`https://genshin-db-api.vercel.app/api/v5/namecards?query=names&matchCategories=true`)).json()
				m.reply(`*Not Found*\n\n*Available namecards is :*\n${anu2.join(", ")}`)
			}
		}
	}
}

handler.menugenshin = ['ginamecard <item>']
handler.tagsgenshin = ['search']
handler.command = /^((gi|genshin)(name)?cards?)$/i

handler.limit = true

export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)