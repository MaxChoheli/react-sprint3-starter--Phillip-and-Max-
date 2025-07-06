const { Link, NavLink, useLocation } = ReactRouterDOM

export function AppHeader({ filterByTxt, setFilterByTxt }) {
    const location = useLocation()
    const isMissKeep = location.pathname.startsWith('/note')

    return (
        <header className="app-header" style={{ backgroundColor: 'lightblue', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="left-section" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Link to="/" style={{ color: 'goldenrod', textDecoration: 'none' }}>
                    <h3 style={{ border: '1px solid goldenrod', padding: '4px 8px', borderRadius: '4px' }}>Home</h3>
                </Link>

                {isMissKeep && (
                    <React.Fragment>
                        <h3 className="misskeep-logo">MissKeep</h3>
                        <input
                            type="text"
                            className="misskeep-search"
                            placeholder="Search notes..."
                            value={filterByTxt}
                            onChange={(ev) => setFilterByTxt(ev.target.value)}
                            style={{ padding: '4px', borderRadius: '4px', border: '1px solid gray' }}
                        />
                    </React.Fragment>
                )}
            </div>

            <nav style={{ display: 'flex', gap: '10px' }}>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/about">About</NavLink>
                <NavLink to="/mail">Mail</NavLink>
                <NavLink to="/note">Note</NavLink>
                <NavLink to="/books">Books</NavLink>
            </nav>
        </header>
    )
}
