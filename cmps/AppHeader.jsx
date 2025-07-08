const { NavLink, useLocation } = ReactRouterDOM
const { useState, useRef, useEffect } = React

export function AppHeader({ filterByTxt, setFilterByTxt }) {
    const location = useLocation()
    const isMissKeep = location.pathname === '/note'
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const menuRef = useRef()

    const pageMeta = {
        '/': { name: 'Home', icon: 'home' },
        '/about': { name: 'About', icon: 'info' },
        '/mail': { name: 'MisterEmail', icon: 'mail' },
        '/note': { name: 'MissKeep', icon: 'batch_prediction' },
        '/books': { name: 'MissBooks', icon: 'menu_book' },
    }

    const { pathname } = location
    const { name, icon } = pageMeta[pathname] || { name: '', icon: '' }

    useEffect(() => {
        function handleClickOutside(ev) {
            if (menuRef.current && !menuRef.current.contains(ev.target)) {
                setIsMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <header
            className="app-header"
            style={{
                backgroundColor: 'white',
                padding: '14px 20px',
                borderBottom: '1px solid #dadce0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'relative',
            }}
        >
            <div className="left-section" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span className="material-symbols-outlined" style={{ color: 'gray', fontSize: '30px' }}>{icon}</span>
                <h3 style={{ margin: 0, color: 'gray' }}>{name}</h3>

                {isMissKeep && (
                    <input
                        type="text"
                        className="misskeep-search"
                        placeholder="Search notes..."
                        value={filterByTxt}
                        onChange={(ev) => setFilterByTxt(ev.target.value)}
                        style={{ padding: '4px', borderRadius: '4px', border: '1px solid gray' }}
                    />
                )}
            </div>

            <div className="menu-toggle-section" style={{ position: 'relative' }}>
                <span
                    className="material-symbols-outlined"
                    style={{ fontSize: '28px', cursor: 'pointer', userSelect: 'none', color: 'grey' }}
                    onClick={() => setIsMenuOpen(prev => !prev)}
                >
                    apps
                </span>

                {isMenuOpen && (
                    <nav
                        className="popup-menu"
                        ref={menuRef}
                        style={{
                            position: 'absolute',
                            top: '40px',
                            right: '0px',
                            backgroundColor: 'white',
                            border: '1px solid #ccc',
                            borderRadius: '10px',
                            padding: '10px',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '10px',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                            zIndex: 100,
                        }}
                    >
                        <NavLink to="/" title="Home">
                            <span className="material-symbols-outlined" style={{ color: 'gray' }}>home</span>
                        </NavLink>
                        <NavLink to="/about" title="About">
                            <span className="material-symbols-outlined" style={{ color: 'gray' }}>info</span>
                        </NavLink>
                        <NavLink to="/mail" title="Mail">
                            <span className="material-symbols-outlined" style={{ color: 'gray' }}>mail</span>
                        </NavLink>
                        <NavLink to="/note" title="Note">
                            <span className="material-symbols-outlined" style={{ color: 'gray' }}>batch_prediction</span>
                        </NavLink>
                        <NavLink to="/books" title="Books">
                            <span className="material-symbols-outlined" style={{ color: 'gray' }}>menu_book</span>
                        </NavLink>
                    </nav>
                )}
            </div>
        </header>
    )
}
