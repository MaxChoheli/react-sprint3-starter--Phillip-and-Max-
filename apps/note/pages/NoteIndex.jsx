import { noteService } from '../services/note.service.js'
import { NoteList } from '../cmps/NoteList.jsx'

import '/assets/css/apps/note/NoteIndex.css'

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

    function onUpdateNote(noteId, newText, newBgColor = null) {
        const note = notes.find(note => note.id === noteId)
        const updatedNote = {
            ...note,
            info: { txt: newText },
            style: {
                backgroundColor: newBgColor !== null && newBgColor !== undefined
                    ? newBgColor
                    : (note.style && note.style.backgroundColor) || '#ffffff'
            }
        }
        noteService.save(updatedNote).then(loadNotes)
    }

    return (
        <section className="note-index">
            <h1>MissKeep</h1>
            <form onSubmit={onAddNote} className="note-form">
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
