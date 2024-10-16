import { fileTypeFromBuffer } from 'file-type'
import { niceBytes } from './func.js'

/**
 * Upload image to telegra.ph / imgbb / neko.pe
 * Supported all mimetype
 * @param {Buffer} buffer Media Buffer
 * @return {Promise<string>}
 */
export default async (buffer, json = false) => {
	const { ext, mime } = await fileTypeFromBuffer(buffer)
	let form = new FormData()
	let host, link, filesize, status = true
	const r = (Math.random() + 1).toString(36).substring(2)
	const blob = new Blob([buffer], { type: mime })
	const filename = r + '.' + ext
	form.append(mime.split('/')[0], blob, filename)
	try {
		const res = await fetch('https://telegra.ph/upload', {
			method: 'POST',
			body: form
		})
		if (!res.ok) {
			throw new Error('Failed to upload file to an api telegraph.ph');
		}
		const img = await res.json()
		host = 'https://telegra.ph'
		link = host + img[0].src
		filesize = niceBytes(Buffer.byteLength(buffer))
	} catch (e) {
		console.log(e)
		try {
			form = new FormData()
			form.append('file', blob, filename)

			const response = await fetch("https://8030.us.kg/api/upload.php", {
				method: "POST",
				body: form,
			});
			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.error || 'Failed to upload file');
			}
			host = `https://8030.us.kg`
			link = data.result.url
			filesize = data.result.size
		} catch (e) {
			try {
				form = new FormData()
				form.append('file', blob, filename)

				const response = await fetch("https://widipe.com/api/upload.php", {
					method: "POST",
					body: form,
				});
				const data = await response.json();
				if (!response.ok) {
					throw new Error(data.error || 'Failed to upload file');
				}
				host = `https://widipe.com`
				link = data.result.url
				filesize = data.result.size
			} catch (e) {
				console.log(e)
				try {
					form = new FormData()
					form.append('file', blob, filename)

					const response = await fetch("https://cdn.meitang.xyz/upload", {
						method: "POST",
						body: form,
					});
					const data = await response.json();
					if (!response.ok) {
						throw new Error(data.error || 'Failed to upload file');
					}
					host = `https://cdn.meitang.xyz`
					link = data.file.url
					filesize = data.file.size
				} catch (e) {
					console.log(e)
					status = false
				}
			}
		}
	}
	if (!status) return false
	if (json) return {
		status: true,
		result: {
			host: host,
			filename: filename,
			mimetype: mime,
			filesize: filesize,
			url: link
		}
	}
	else return link
}