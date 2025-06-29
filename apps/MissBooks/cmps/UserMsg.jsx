const { useState, useEffect } = React
import { eventBusService } from '../services/event-bus.service.js'

export function UserMsg() {
    const [msg, setMsg] = useState(null)

    useEffect(() => {
        eventBusService.on('show-user-msg', onShowMsg)
        return () => {
            eventBusService.off('show-user-msg', onShowMsg)
        }
    }, [])

    function onShowMsg(event) {
        setMsg(event.detail)
        setTimeout(() => {
            setMsg(null)
        }, 3000)
    }

    if (!msg) return null
    return (
        <section className={`user-msg ${msg.type}`}>
            {msg.txt}
        </section>
    )
}
