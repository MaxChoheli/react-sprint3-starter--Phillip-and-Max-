const { useState, useEffect } = React

export function MailFilter({ filterBy, onSetFilter, sortBy, onSetSort }) {
  const [localFilter, setLocalFilter] = useState(filterBy)
  const [localSort, setLocalSort] = useState(sortBy)

  useEffect(() => {
    setLocalFilter(filterBy)
  }, [filterBy])

  useEffect(() => {
    setLocalSort(sortBy)
  }, [sortBy])

  function handleFilterChange(ev) {
    const { name, value } = ev.target
    let val = value
    if (name === 'isRead') {
      if (value === 'all') val = null
      else if (value === 'read') val = true
      else val = false
    }
    const newFilter = { ...localFilter, [name]: val }
    setLocalFilter(newFilter)
    onSetFilter(newFilter)
  }

  function handleSortChange(ev) {
    const [field, direction] = ev.target.value.split('-')
    const newSort = { field, direction }
    setLocalSort(newSort)
    onSetSort(newSort)
  }

  return (
    <section className="mail-filter">
      <div className="search-bar">
        <span className="material-symbols-outlined">search</span>
        <input
          type="text"
          name="txt"
          placeholder="Search mail"
          value={localFilter.txt}
          onChange={handleFilterChange}
        />
        <label style={{ marginLeft: '2px', marginRight: '2px', }}>Filter:</label>
          
        <select
          name="isRead"
          value={
            localFilter.isRead === null
              ? 'all'
              : localFilter.isRead === true
              ? 'read'
              : 'unread'
          }
          onChange={handleFilterChange}
        >
          <option value="all">All</option>
          <option value="read">Read</option>
          <option value="unread">Unread</option>
        </select>

        {/* Sorting dropdown here */}
        <label style={{ marginLeft: '2px', marginRight: '2px', }}>Sort by:</label>
        <select
          value={`${localSort.field}-${localSort.direction}`}
          onChange={handleSortChange}
        > 
          <option value="date-desc">Date ↓</option>
          <option value="date-asc">Date ↑</option>
          <option value="title-asc">Title A-Z</option>
          <option value="title-desc">Title Z-A</option>
        </select>
      </div>
    </section>
  )
}
