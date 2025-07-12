const { NavLink } = ReactRouterDOM

export function About() {
    return (
        <section className="container about">
            <h1>About Appsus</h1>
            <p>
                Appsus is a multifunctional single-page application that brings together three powerful mini apps:
            </p>
            <ul>
                <li><NavLink to="/mail"><strong>misterEmail</strong></NavLink> — Manage your emails efficiently.</li>
                <li><NavLink to="/note"><strong>missKeep</strong></NavLink> — Take notes and organize your ideas.</li>
                <li><NavLink to="/books"><strong>missBooks</strong></NavLink> — Explore and manage your favorite books.</li>
            </ul>
            <p>
                This project demonstrates how to integrate multiple apps into one seamless experience,
                with smooth navigation, responsive design, and clean code architecture.
            </p>
            <p>
                Built with React and modern web technologies, Appsus is designed to be functional, beautiful, and intuitive.
            </p>
            <p>
                Whether you want to handle your daily emails, jot down quick notes, or dive into your reading list,
                Appsus has got you covered.
            </p>
        </section>
    )
}
