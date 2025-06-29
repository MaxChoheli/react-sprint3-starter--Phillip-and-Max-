const { Link, Outlet } = ReactRouterDOM

export function About() {
    return (
        <section className="about container">
            <h1>About this library</h1>
            <p>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Optio dolore sapiente, iste animi corporis nisi atque tempora assumenda dolores.
                Nobis nam dolorem rerum illo facilis nemo sit voluptatibus laboriosam necessitatibus!
            </p>

            <nav className="about-nav">
                <Link to="team" className="btn">Team</Link>
                <Link to="goal" className="btn">Goal</Link>
            </nav>

            <Outlet />
        </section>
    )
}
