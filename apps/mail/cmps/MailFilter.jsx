export function MailFilter({ filterBy, onSetFilter }) {

  function handleChange(ev) {
    const { name, value } = ev.target
    let val

    if (name === 'isRead') {
      if (value === 'all') val = null
      else if (value === 'read') val = true
      else val = false
    } else {
      val = value
    }

    const newFilterBy = { ...filterBy, [name]: val }
    onSetFilter(newFilterBy)
  }

  return (
    <section className="mail-filter">
      <div className="search-bar">
        <span className="material-symbols-outlined">search</span>
        <input
          type="text"
          name="txt"
          placeholder="Search mail"
          value={filterBy.txt}
          onChange={handleChange}
        />
        <select
          name="isRead"
          value={
            filterBy.isRead === null
              ? 'all'
              : filterBy.isRead === true
                ? 'read'
                : 'unread'
          }
          onChange={handleChange}
        >
          <option value="all">All</option>
          <option value="read">Read</option>
          <option value="unread">Unread</option>
        </select>
      </div>
    </section>
  )
}
