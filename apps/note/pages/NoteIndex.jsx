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
            style: {
                backgroundColor: '#ffffff',
                color: '#000000',
                left: 0,
                top: 0
            },
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

    function onUpdateNote(noteId, newText, newBgColor = null, newStyle = null) {
        const note = notes.find(note => note.id === noteId)
        const updatedNote = {
            ...note,
            info: { txt: newText },
            style: {
                backgroundColor: newStyle && newStyle.backgroundColor
                    ? newStyle.backgroundColor
                    : (note.style && note.style.backgroundColor) || '#ffffff',
                color: newStyle && newStyle.color
                    ? newStyle.color
                    : (note.style && note.style.color) || '#000000',
                left: newStyle && typeof newStyle.left === 'number'
                    ? newStyle.left
                    : (note.style && note.style.left) || 0,
                top: newStyle && typeof newStyle.top === 'number'
                    ? newStyle.top
                    : (note.style && note.style.top) || 0
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
