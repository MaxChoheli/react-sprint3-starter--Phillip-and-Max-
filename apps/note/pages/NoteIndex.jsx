import { noteService } from '../services/note.service.js'
import { NoteList } from '../cmps/NoteList.jsx'

const { useState, useEffect } = React

export function NoteIndex() {
    const [notes, setNotes] = useState([])
    const [newTxt, setNewTxt] = useState('')

    useEffect(() => {
        loadNotes()
    }, [])

    function loadNotes() {
        noteService.query().then(setNotes)
    }

    function onAddNote(ev) {
        ev.preventDefault()
        const newNote = {
            type: 'NoteTxt',
            info: { txt: newTxt },
            createdAt: Date.now()
        }
        noteService.save(newNote).then(() => {
            setNewTxt('')
            loadNotes()
        })
    }

    function onDeleteNote(noteId) {
        noteService.remove(noteId).then(loadNotes)
    }

    function onUpdateNote(noteId, newText) {
        const note = notes.find(note => note.id === noteId)
        const updatedNote = { ...note, info: { txt: newText } }
        noteService.save(updatedNote).then(loadNotes)
    }

    return (
        <section className="note-index container">
            <h1>MissKeep</h1>
            <form onSubmit={onAddNote}>
                <input
                    type="text"
                    placeholder="Write a note..."
                    value={newTxt}
                    onChange={(ev) => setNewTxt(ev.target.value)}
                />
                <button>Add</button>
            </form>

            <NoteList
                notes={notes}
                onDelete={onDeleteNote}
                onUpdate={onUpdateNote}
            />
        </section>
    )
}
