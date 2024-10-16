import express from 'express'
import path from 'path'
import { createServer } from 'http'
import { Server } from 'socket.io'
import os from 'os'
import { parse } from 'node-html-parser';
import { convert } from 'html-to-text';
import fetch from 'node-fetch';
import Helper from './lib/helper.js'
import db from './lib/database.js'

const headers = {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
};

async function fetchNewsContent(news) {
    if (!news || !news.url) {
        throw new Error('Invalid news object or URL');
    }

    const embeds = [];
    const response = await fetch(news.url, { headers });

    if (response.status !== 200) {
        throw new Error(`Failed to fetch ${news.url}, status code: ${response.status}`);
    }

    const content = await response.text();
    const root = parse(content);
    const newsBox = root.querySelector('div.useBox.newsBox');

    if (!newsBox) {
        throw new Error(`News Box not found in ${news.url}`);
    }

    const children = newsBox.childNodes.slice(
        newsBox.childNodes.findIndex((child) => child.classList?.contains('smallTitleLine')) + 1,
        newsBox.childNodes.findIndex((child) => child.classList?.contains('deluxetitle') && child.text === 'Note' && child.text === 'PERHATIAN')
    );

    const sections = [[null]];

    for (const child of children) {
        if (child.text === 'Back to Top') continue;
        if (child.text === 'Kembali ke atas') continue;

        if (child.classList?.contains('deluxetitle') && child.id) {
            sections.push([child]);
        } else {
            sections[sections.length - 1].push(child);
        }
    }

    for (const [head, ...contents] of sections) {
        const title = head === null ? news.title : head.text;
        const url = head === null ? news.url : `${news.url}#${head.id}`;
        const thumbnail = head === null ? { url: news.thumbnail } : undefined;

        const section = parse(contents.join(''));
        const text = convert(section.toString(), {
            wordwrap: false,
            formatters: {
                markdownLink: (elem, walk, builder, _) => {
                    const text = elem.children?.filter((child) => child.type === 'text')?.length === 1;
                    const href = elem.attribs?.href || '';
                    const link = href.startsWith('//') ? `https:${href}` : href.startsWith('#') ? `${news.url}${href}` : '';

                    if (text && link) {
                        builder.startNoWrap();
                        builder.addLiteral(`[`);
                        walk(elem.children, builder);
                        builder.addLiteral(`](`);
                        builder.addInline(link, { noWordTransform: true });
                        builder.addLiteral(`)`);
                        builder.stopNoWrap();
                    } else {
                        walk(elem.children, builder);
                        builder.addInline(link, { noWordTransform: true });
                    }
                },
            },
            selectors: [
                { selector: 'a', format: 'markdownLink' },
                { selector: 'hr', format: 'skip' },
                { selector: 'img', format: 'skip' },
                { selector: 'button', format: 'skip' },
                { selector: 'table', format: 'dataTable' },
                { selector: 'font', format: 'inlineSurround', options: { prefix: '*', suffix: '*' } },
                { selector: 'span', format: 'inlineSurround', options: { prefix: '*', suffix: '*' } },
                { selector: 'strong', format: 'inlineSurround', options: { prefix: '*', suffix: '*' } },
            ],
        }).replace(/\n{3,}/g, '\n\n');

        const description = text.length > 5000 ? `${text.slice(0, 4097)}...` : text;
        const images = section.querySelectorAll('img').map((img) => ({ url: img.getAttribute('src') }));

        embeds.push({
            title,
            url,
            thumbnail,
            description,
            image: images.shift(),
            category: news.category,
        });

        for (const image of images) {
            embeds.push({ url, image, category: news.category });
        }
    }

    return embeds;
}

function delay(min, max) {
    const ms = Math.random() * (max - min) + min;
    return new Promise(resolve => setTimeout(resolve, ms));
}

function connect(conn, PORT) {
    let app = global.app = express()

    app.use(express.json())

    let server = global.server = createServer(app)
    // let _qr = 'invalid'

    // conn.ev.on('connection.update', function appQR({ qr }) {
    //     if (qr) _qr = qr
    // })

    app.get(`/`, async (req, res, next) => {
        const serverDetails = {
            name: "Ely-MD",
            version: "3.2.0",
            description: "This is details about the server for run ely-md.",
            author: "arasea",
            system: {
                platform: os.platform(),
                architecture: os.arch(),
                cpuCount: os.cpus().length,
                cpuModel: os.cpus()[0].model,
                totalMemory: `${(os.totalmem() / (1024 ** 3)).toFixed(2)} GB`,
                freeMemory: `${(os.freemem() / (1024 ** 3)).toFixed(2)} GB`,
                uptime: `${(os.uptime() / 3600).toFixed(2)} hours`,
            }
        };
        res.json(serverDetails);
    })

    app.post('/toramnewsupdate', async (req, res) => {
        const data = req.body.content;

        if (Array.isArray(data) && data.length > 0) {
            res.status(200).send('Data telah diterima')

            try {
                let combinedContents = [];

                for (const item of data) {
                    const date = item.date;
                    const news = {
                        url: item.url,
                        title: item.title,
                        thumbnail: item.thumbnail,
                        category: item.category,
                    };

                    try {
                        const content = await fetchNewsContent(news);
                        let messageContent = `*${date}*   *${news.category}*\n\n`;

                        messageContent += content
                            .map(c => {
                                if (!c.title) {
                                    return null
                                }
                                const description = c.description ? `${c.description}` : '';
                                return `*${c.title}*${description}`;
                            })
                            .filter(item => item !== null)
                            .join('\n-------------------------------\n');


                        while (messageContent.length > 20000) {
                            combinedContents.push(messageContent.substring(0, 20000) + `....\n_*This is too much character for this message. Go to ${news.url} for more info!*_`);
                            messageContent = messageContent.substring(20000);
                        }
                        combinedContents.push(messageContent);
                    } catch (error) {
                        console.error(`Error fetching content for ${news.url}:`, error);
                    }
                }

                for (const [chatId, chatInfo] of Object.entries(db.data.chats)) {
                    if (chatInfo.newstoram) {
                        for (const content of combinedContents) {
                            await conn.sendMessage(chatId, { text: content })
                            await delay(2000, 5500)
                        }
                    }
                }
            } catch (error) {
                console.error('Error processing the content:', error);
                res.status(500).send('Error processing the content');
            }
        } else {
            res.status(400).send('Invalid data')
        }
    })
    app.post(`/botupdate`, async (req, res) => {
        const payload = req.body;
        let txt = `*New Commit Push!!!*\n\n`

        if (payload && payload.commits) {
            payload.commits.forEach(commit => {
                txt += `*Author:* arasea\n`
                txt += `*Message:* ${commit.message}`
                if (commit.added && commit.added.length > 0) {
                    txt += `\n\n*Added files:* ${commit.added.join(`\n`)}`;
                }
                if (commit.modified && commit.modified.length > 0) {
                    txt += `\n\n*Modified files:* ${commit.modified.join(`\n`)}\n`;
                }
                if (commit.removed && commit.removed.length > 0) {
                    txt += `\n\n*Removed files:* ${commit.removed.join(`\n`)}`;
                }
            })
            try {
                await conn.sendMessage(`120363346650560029@g.us`, { text: txt })
            } catch (err) {
                console.error(err.message);
            }

            res.status(200).send('Webhook received and processed');
        } else {
            res.status(400).send('Invalid payload');
        }
    })

    app.use(express.static(path.join(Helper.__dirname(import.meta.url), 'views')))

    let io = new Server(server)
    io.on('connection', socket => {
        let { unpipeEmit } = pipeEmit(conn, socket, 'conn-')
        socket.once('disconnect', unpipeEmit)
    })

    server.listen(PORT, () => {
        console.log('App listened on port', PORT)
        if (opts['keepalive']) keepAlive()
    })
}

function pipeEmit(event, event2, prefix = '') {
    let old = event.emit
    event.emit = function (event, ...args) {
        old.emit(event, ...args)
        event2.emit(prefix + event, ...args)
    }
    return {
        unpipeEmit() {
            event.emit = old
        }
    }
}

function keepAlive() {
    const url = `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`
    if (/(\/\/|\.)undefined\./.test(url)) return
    setInterval(() => {
        fetch(url).catch(console.error)
    }, 5 * 1000 * 60)
}


export default connect
