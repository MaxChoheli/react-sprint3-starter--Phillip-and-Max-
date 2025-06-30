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
    const [bgColor, setBgColor] = React.useState((note.style && note.style.backgroundColor) || '#ffffff')
    const [isWhiteText, setIsWhiteText] = React.useState((note.style && note.style.color) === '#ffffff')
    const [position, setPosition] = React.useState({
        x: (note.style && note.style.left) || 0,
        y: (note.style && note.style.top) || 0
    })
    const [isDragging, setIsDragging] = React.useState(false)
    const STATIC_OFFSET = { x: -170, y: -320 }

    function onSave() {
        setIsEditing(false)
        const updatedStyle = {
            backgroundColor: bgColor,
            color: isWhiteText ? '#ffffff' : '#000000',
            left: position.x,
            top: position.y
        }
        const updatedNote = {
            ...note,
            info: { txt },
            style: updatedStyle
        }
        onUpdate(note.id, txt, bgColor, updatedStyle)
    }

    function onColorChange(ev) {
        setBgColor(ev.target.value)
    }

    function handleMouseDown(ev) {
        setIsDragging(true)
        ev.preventDefault()
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
            color: isWhiteText ? '#ffffff' : '#000000',
            left: position.x,
            top: position.y
        }
        const updatedNote = {
            ...note,
            info: { txt },
            style: updatedStyle
        }
        onUpdate(note.id, txt, bgColor, updatedStyle)
    }, [position])

    return (
        <div
            className="note-item"
            onMouseDown={handleMouseDown}
            style={{
                position: 'absolute',
                left: position.x + 'px',
                top: position.y + 'px',
                backgroundColor: bgColor,
                color: isWhiteText ? '#ffffff' : '#000000',
                cursor: isDragging ? 'grabbing' : 'grab'
            }}
        >
            {isEditing ? (
                <div>
                    <textarea value={txt} onChange={(e) => setTxt(e.target.value)} />
                    <input type="color" value={bgColor} onChange={onColorChange} />
                    <button onClick={() => setIsWhiteText(prev => !prev)}>Toggle Text Color</button>
                    <button onClick={onSave}>Save</button>
                </div>
            ) : (
                <div>
                    <p>{note.info.txt}</p>
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                </div>
            )}
            <button onClick={() => onDelete(note.id)}>Delete</button>
        </div>
    )
}
