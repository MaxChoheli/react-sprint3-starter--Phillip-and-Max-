const { NavLink } = ReactRouterDOM

export function AppHeader() {
    return (
        <header className="app-header container">
            <section>
                <h1>Miss Books</h1>
                <nav className="app-nav">
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/about">About</NavLink>
                    <NavLink to="/book">Books</NavLink>
                    <NavLink to="/book/add">Add Book</NavLink>
                    <NavLink to="/dashboard">Dashboard</NavLink>
                </nav>
            </section>
        </header>
    )
}
