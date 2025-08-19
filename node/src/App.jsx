import React from 'react'
import { Link, Routes, Route } from 'react-router-dom'
import { Button } from './components/ui/button'
import routes from './routes'

export function App() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="space-y-6 text-center">
                {/* navigation links */}
                <nav className="flex items-center justify-center gap-4">
                    <Link className="underline" to="/">Home</Link>
                    <Link className="underline" to="/about">About</Link>
                    <Link className="underline" to="/contact">Contact</Link>
                </nav>
                <div className="pt-4 text-left">
                    <Routes>
                        {routes.map((route) => (
                            <Route key={route.path} path={route.path} element={route.element} />
                        ))}
                    </Routes>
                </div>
            </div>
        </div>
    )
}


