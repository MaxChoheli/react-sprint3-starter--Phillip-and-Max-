const { Route, Routes } = ReactRouterDOM
const Router = ReactRouterDOM.HashRouter

import { AppHeader } from './cmps/AppHeader.jsx'
import { UserMsg } from './cmps/UserMsg.jsx'
import { About } from './pages/About.jsx'
import { Home } from './pages/Home.jsx'
import { MailIndex } from './apps/mail/pages/MailIndex.jsx'
import { MailDetails } from './apps/mail/pages/MailDetails.jsx'
import { NoteIndex } from './apps/note/pages/NoteIndex.jsx'
import { BooksWrapper } from './pages/BooksWrapper.jsx'

const { useState } = React

export function RootCmp() {
    const [filterByTxt, setFilterByTxt] = useState('')
    const [filterByType, setFilterByType] = useState('')
    const [filterByLabel, setFilterByLabel] = useState('')

    return (
        <Router>
            <section className="root-cmp">
                <AppHeader
                    filterByTxt={filterByTxt}
                    setFilterByTxt={setFilterByTxt}
                    filterByType={filterByType}
                    setFilterByType={setFilterByType}
                    filterByLabel={filterByLabel}
                    setFilterByLabel={setFilterByLabel}
                />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/mail" element={<MailIndex />} />
                    <Route path="/mail/:mailId" element={<MailDetails />} />
                    <Route path="/note" element={
                        <NoteIndex
                            filterByTxt={filterByTxt}
                            setFilterByTxt={setFilterByTxt}
                            filterByType={filterByType}
                            filterByLabel={filterByLabel}
                        />
                    } />
                    <Route path="/books" element={<BooksWrapper />} />
                </Routes>
                <UserMsg />
            </section>
        </Router>
    )
}
