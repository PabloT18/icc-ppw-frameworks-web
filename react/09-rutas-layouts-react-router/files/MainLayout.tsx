import { Outlet, NavLink } from 'react-router-dom'

function MainLayout() {
    const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
        color: isActive ? '#60a5fa' : 'white',
        textDecoration: 'none',
        fontWeight: isActive ? 700 : 400,
        borderBottom: isActive ? '2px solid #60a5fa' : '2px solid transparent',
        paddingBottom: '2px',
    })

    return (
        <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
            <header
                style={{
                    background: '#1a1a1a',
                    color: 'white',
                    padding: '1rem 2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <NavLink to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.25rem', fontWeight: 700 }}>
                    ReactStore
                </NavLink>
                <nav style={{ display: 'flex', gap: '1.5rem' }}>
                    <NavLink to="/" end style={navLinkStyle}>
                        Productos
                    </NavLink>
                    <NavLink to="/favorites" style={navLinkStyle}>
                        Favoritos ❤️
                    </NavLink>
                </nav>
            </header>

            <main>
                <Outlet />
            </main>

            <footer
                style={{
                    textAlign: 'center',
                    padding: '1.5rem',
                    color: '#9ca3af',
                    fontSize: '0.85rem',
                    borderTop: '1px solid #e5e7eb',
                    marginTop: '2rem',
                }}
            >
                ReactStore &copy; {new Date().getFullYear()}
            </footer>
        </div>
    )
}

export default MainLayout
