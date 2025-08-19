import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { matchRoutes } from 'react-router-dom'
import routes from './routes'
import { App } from './App'
import './index.css'

export function render(url) {

  const location = typeof url === 'string' && url.length > 0 && url[0] !== '/' ? `/${url}` : (url || '/')
  const matches = matchRoutes(routes, location)
  // If the matched leaf route is our notFound route, mark status 404
  const isNotFound = Array.isArray(matches) && matches.length > 0
    ? Boolean(matches[matches.length - 1]?.route?.notFound)
    : !matches
  const status = isNotFound ? 404 : 200

  const html = renderToString(
    <StaticRouter location={location}>
      <App />
    </StaticRouter>
  )

  return { html, status }
}


