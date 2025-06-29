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

    function onSave() {
        setIsEditing(false)
        onUpdate(note.id, txt)
    }

    return (
        <article className="note-item">
            {isEditing ? (
                <React.Fragment>
                    <textarea value={txt} onChange={(e) => setTxt(e.target.value)} />
                    <button onClick={onSave}>Save</button>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <p>{note.info.txt}</p>
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                </React.Fragment>
            )}
            <button onClick={() => onDelete(note.id)}>Delete</button>
        </article>
    )
}
