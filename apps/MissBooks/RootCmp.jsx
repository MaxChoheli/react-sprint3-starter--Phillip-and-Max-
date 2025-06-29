const Router = ReactRouterDOM.HashRouter
const { Routes, Route, useLocation } = ReactRouterDOM

import { AppHeader } from "./cmps/AppHeader.jsx"
import { UserMsg } from "./cmps/UserMsg.jsx"
import { About } from "./pages/About.jsx"
import { AboutTeam } from "./pages/AboutTeam.jsx"
import { AboutGoal } from "./pages/AboutGoal.jsx"
import { Home } from "./pages/Home.jsx"
import { BookIndex } from "./pages/BookIndex.jsx"
import { BookDetails } from "./pages/BookDetails.jsx"
import { BookAdd } from "./cmps/BookAdd.jsx"
import { Dashboard } from "./pages/Dashboard.jsx"

function MainRoutes() {
    const location = useLocation()

    return (
        <main key={location.pathname} className="route-view animate__animated animate__fadeIn">
            <Routes location={location}>
                <Route path="/" element={<Home />} />

                <Route path="/about" element={<About />}>
                    <Route path="team" element={<AboutTeam />} />
                    <Route path="goal" element={<AboutGoal />} />
                </Route>

                <Route path="/book" element={<BookIndex />} />
                <Route path="/book/:bookId" element={<BookDetails />} />
                <Route path="/book/edit" element={<h1>Book Edit (to do)</h1>} />
                <Route path="/book/add" element={<BookAdd />} />

                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </main>
    )
}

export function RootCmp() {
    return (
        <Router>
            <section className="app">
                <AppHeader />
                <UserMsg />
                <MainRoutes />
            </section>
        </Router>
    )
}
