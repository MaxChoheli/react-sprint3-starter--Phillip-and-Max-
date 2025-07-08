export function NoteList({ notes, onDelete, onUpdate }) {
    return (
        <ul className="note-list">
            {notes.map(note => (
                <li key={note.id}>
                    <NoteItem note={note} onDelete={onDelete} onUpdate={onUpdate} />
                </li>
            ))}
        </ul>
    )
}

function NoteItem({ note, onDelete, onUpdate }) {
    const [isEditing, setIsEditing] = React.useState(false)
    const [txt, setTxt] = React.useState(note.info.txt)
    const [title, setTitle] = React.useState(note.info.title || '')
    const [label, setLabel] = React.useState(note.info.label || '')
    const [bgColor, setBgColor] = React.useState(note.style && note.style.backgroundColor ? note.style.backgroundColor : '#ffffff')
    const [position, setPosition] = React.useState({
        x: note.style && note.style.left ? note.style.left : 0,
        y: note.style && note.style.top ? note.style.top : 0
    })
    const [isDragging, setIsDragging] = React.useState(false)
    const [showColorPicker, setShowColorPicker] = React.useState(false)
    const [showLabelPicker, setShowLabelPicker] = React.useState(false)
    const STATIC_OFFSET = { x: -170, y: -320 }

    const colorOptions = [
        '#faafa8', '#f39f76', '#fff8b8', '#e2f6d3', '#b4ddd3',
        '#d4e4ed', '#aeccdc', '#d3bfdb', '#f6e2dd', '#e9e3d4', '#efeff1'
    ]

    function onSave() {
        setIsEditing(false)
        const updatedStyle = {
            backgroundColor: bgColor,
            color: '#000000',
            left: position.x,
            top: position.y
        }
        const updatedNote = {
            ...note,
            info: { txt, title, label },
            style: updatedStyle
        }
        onUpdate(note.id, txt, bgColor, updatedStyle, title, label)
    }

    function handleMouseDown(ev) {
        if (
            ev.target.tagName === 'TEXTAREA' ||
            ev.target.tagName === 'INPUT' ||
            ev.target.tagName === 'BUTTON' ||
            ev.target.tagName === 'SELECT' ||
            ev.target.closest('button')
        ) return
        setIsDragging(true)
    }

    function handleMouseMove(ev) {
        if (!isDragging) return
        const x = ev.clientX + STATIC_OFFSET.x
        const y = ev.clientY + STATIC_OFFSET.y
        setPosition({ x, y })
    }

    function handleMouseUp() {
        setIsDragging(false)
    }

    React.useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove)
            window.addEventListener('mouseup', handleMouseUp)
        } else {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isDragging])

    React.useEffect(() => {
        const updatedStyle = {
            backgroundColor: bgColor,
            color: '#000000',
            left: position.x,
            top: position.y
        }
        const updatedNote = {
            ...note,
            info: { txt, title, label },
            style: updatedStyle
        }
        onUpdate(note.id, txt, bgColor, updatedStyle, title, label)
    }, [position])

    function handleEditTxtResize(ev) {
        const el = ev.target
        const softBreakTxt = el.value.replace(/(\S{30})/g, '$1\u200B')
        setTxt(softBreakTxt)
        el.style.height = 'auto'
        el.style.height = el.scrollHeight + 'px'
        el.style.width = 'auto'
        el.style.width = el.scrollWidth < 400 ? el.scrollWidth + 'px' : '400px'
    }

    const iconBtnStyle = {
        background: 'transparent',
        border: 'none',
        borderRadius: '50%',
        cursor: 'pointer',
        padding: '6px',
        boxShadow: 'none',
        outline: 'none'
    }

    return (
        <div
            className="note-item"
            onMouseDown={handleMouseDown}
            style={{
                position: 'absolute',
                left: position.x + 'px',
                top: position.y + 'px',
                backgroundColor: bgColor,
                color: '#000000',
                cursor: isDragging ? 'grabbing' : 'grab',
                maxWidth: '400px'
            }}
        >
            {isEditing ? (
                <div>
                    <input
                        type="text"
                        value={title}
                        placeholder="Title"
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ fontWeight: 'bold', textTransform: 'uppercase' }}
                    />
                    <textarea
                        value={txt}
                        onChange={handleEditTxtResize}
                        style={{
                            resize: 'none',
                            width: '100%',
                            minWidth: '200px',
                            maxWidth: '400px',
                            height: 'auto',
                            overflow: 'hidden'
                        }}
                        onInput={handleEditTxtResize}
                    />
                    <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                        <button
                            type="button"
                            onClick={() => setShowLabelPicker(prev => !prev)}
                            style={iconBtnStyle}
                            title="Change Label"
                        >
                            <span className="material-symbols-outlined">label</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowColorPicker(prev => !prev)}
                            style={iconBtnStyle}
                            title="Change Color"
                        >
                            <span className="material-symbols-outlined">palette</span>
                        </button>
                        <button onClick={onSave} style={iconBtnStyle} title="Save">
                            <span className="material-symbols-outlined">save</span>
                        </button>
                        <button onClick={() => onDelete(note.id)} style={iconBtnStyle} title="Delete">
                            <span className="material-symbols-outlined">delete</span>
                        </button>
                    </div>

                    {showLabelPicker && (
                        <select
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            style={{ marginTop: '6px' }}
                        >
                            <option value="">Label</option>
                            <option value="critical">Critical</option>
                            <option value="family">Family</option>
                            <option value="work">Work</option>
                            <option value="friends">Friends</option>
                            <option value="spam">Spam</option>
                            <option value="memories">Memories</option>
                            <option value="romantic">Romantic</option>
                        </select>
                    )}

                    {showColorPicker && (
                        <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                            {colorOptions.map(color => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setBgColor(color)}
                                    style={{
                                        backgroundColor: color,
                                        border: bgColor === color ? '2px solid black' : '1px solid #ccc',
                                        width: '22px',
                                        height: '22px',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        padding: 0
                                    }}
                                    title={color}
                                />
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <h4 style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{note.info.title}</h4>
                    <p>{note.info.txt}</p>
                    {note.info.label && <p className="note-label">#{note.info.label}</p>}
                    <button onClick={() => setIsEditing(true)} style={iconBtnStyle} title="Edit">
                        <span className="material-symbols-outlined">edit</span>
                    </button>
                </div>
            )}
        </div>
    )
}
