import fs from 'node:fs/promises'
import { createServer as createHttpServer } from 'node:http'
import express from 'express'

// Constants
const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 3005
const base = process.env.BASE || '/'

// Cached production assets
const templateHtml = isProduction
    ? await fs.readFile('./dist/client/index.html', 'utf-8')
    : ''

// Create http server
const app = express()
const httpServer = createHttpServer(app)

// Add Vite or respective production middlewares
/** @type {import('vite').ViteDevServer | undefined} */
let vite
if (!isProduction) {
    const { createServer } = await import('vite')
    vite = await createServer({
        server: {
            middlewareMode: true,
            hmr: {
                server: httpServer,
            },
        },
        appType: 'custom',
        base,
    })
    app.use(vite.middlewares)
} else {
    const compression = (await import('compression')).default
    const sirv = (await import('sirv')).default
    app.use(compression())
    app.use(base, sirv('./dist/client', { extensions: [] }))
}

// Serve HTML
app.use('*', async (req, res) => {
    try {
        const url = req.originalUrl.replace(base, '')

        /** @type {string} */
        let template
        /** @type {import('./src/entry-server.js').render} */
        let render
        if (!isProduction) {
            // Always read fresh template in development
            template = await fs.readFile('./index.html', 'utf-8')
            template = await vite.transformIndexHtml(url, template)
            render = (await vite.ssrLoadModule('/src/entry-server.jsx')).render
        } else {
            template = templateHtml
            render = (await import('./dist/server/entry-server.js')).render
        }

        const rendered = await render(url)

        const appHead = typeof rendered === 'object' && rendered !== null ? (rendered.head ?? '') : ''
        const appHtml = typeof rendered === 'string' ? rendered : (rendered.html ?? '')
        const status = typeof rendered === 'object' && rendered !== null ? (rendered.status ?? 200) : 200

        const html = template
            .replace(`<!--app-head-->`, appHead)
            .replace(`<!-- SSR OUTLET -->`, appHtml)
            .replace(`<!--app-html-->`, appHtml)

        res.status(status).set({ 'Content-Type': 'text/html' }).send(html)
    } catch (e) {
        vite?.ssrFixStacktrace(e)
        console.log(e.stack)
        res.status(500).end(e.stack)
    }
})

// Start http server
httpServer.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
})