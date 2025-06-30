const { useState } = React

export function MailFilter({ onSetFilter }) {
    const [filterBy, setFilterBy] = useState({
        txt: '',
        isRead: null, // null means show all
    })

    function handleChange(ev) {
        const { name, value } = ev.target
        let val

        if (name === 'isRead') {
            if (value === 'all') {
                val = null
            } else if (value === 'read') {
                val = true
            } else {
                val = false
            }
        } else {
            val = value
        }

        const newFilterBy = { ...filterBy, [name]: val }
        setFilterBy(newFilterBy)   // update local state
        onSetFilter(newFilterBy)   // notify parent
    }


    return (
        <section className="mail-filter">
            <input
                type="text"
                name="txt"
                placeholder="Search mail..."
                value={filterBy.txt}
                onChange={handleChange}
            />
            <select
                name="isRead"
                value={(() => {
                    if (filterBy.isRead === null) {
                        return 'all'
                    } else if (filterBy.isRead === true) {
                        return 'read'
                    } else {
                        return 'unread'
                    }
                })()}
                onChange={handleChange}
            >
                <option value="all">All</option>
                <option value="read">Read</option>
                <option value="unread">Unread</option>
            </select>
        </section>
    )
}
