import { showSuccessMsg } from '../services/event-bus.service.js'
const { NavLink } = ReactRouterDOM

export function Home() {
    return <section className="container home">
        <h1>Welcome to Appsus </h1>
        <button onClick={() => showSuccessMsg('Yep, that works')}>Show Msg</button>
        <div className="box-container">
            <NavLink to="/mail" className="box1 app-link">
                Check your Mailbox
            </NavLink>
            <NavLink to="/note" className="box2 app-link">
                Check your Notes
            </NavLink>
        </div>
    </section>
}