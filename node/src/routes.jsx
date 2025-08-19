import React from 'react'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/404'

const routes = [
    { path: '/', element: <Home /> },
    { path: '/about', element: <About /> },
    { path: '/contact', element: <Contact /> },
    { path: '*', element: <NotFound />, notFound: true },
]

export default routes


