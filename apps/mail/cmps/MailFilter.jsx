const { useState, useEffect } = React

export function MailFilter({ filterBy, onSetFilter, sortBy, onSetSort, onToggleSidebar }) {
  function handleFilterChange(ev) {
    const { name, value } = ev.target
    let val = value

    if (name === 'isRead') {
      if (value === 'all') val = null
      else if (value === 'read') val = true
      else val = false
    }

    onSetFilter({ ...filterBy, [name]: val })
  }

  function handleSortChange(ev) {
    const [field, direction] = ev.target.value.split('-')
    onSetSort({ field, direction })
  }

  return (
    <section className="mail-filter">
      <div className="search-wrapper">
        <button
          type="button"
          className="menu-btn"
          onClick={(ev) => {
            ev.preventDefault()
            ev.stopPropagation()
            console.log('Hamburger menu clicked!')
            onToggleSidebar()
          }}
        >
          <span className="material-icons">menu</span>
        </button>

        <div className="search-input-wrapper">
          <span className="material-symbols-outlined search-icon">search</span>
          <input
            type="text"
            name="txt"
            placeholder="Search mail"
            value={filterBy.txt}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      <label>Filter:</label>
      <select
        name="isRead"
        value={
          filterBy.isRead === null
            ? 'all'
            : filterBy.isRead === true
              ? 'read'
              : 'unread'
        }
        onChange={handleFilterChange}
      >
        <option value="all">All</option>
        <option value="read">Read</option>
        <option value="unread">Unread</option>
      </select>

      <label>Sort by:</label>
      <select
        value={`${sortBy.field}-${sortBy.direction}`}
        onChange={handleSortChange}
      >
        <option value="date-desc">Date ↓</option>
        <option value="date-asc">Date ↑</option>
        <option value="title-asc">Title A-Z</option>
        <option value="title-desc">Title Z-A</option>
      </select>
    </section>
  )
}

