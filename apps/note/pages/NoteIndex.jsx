import { noteService } from '../services/note.service.js'
import { NoteList } from '../cmps/NoteList.jsx'

import '/assets/css/apps/note/NoteIndex.css'

const { useState, useEffect } = React

export function NoteIndex() {
    const [notes, setNotes] = useState([])
    const [newTxt, setNewTxt] = useState('')
    const [newTitle, setNewTitle] = useState('')
    const [newLabel, setNewLabel] = useState('')
    const [newColor, setNewColor] = useState('#ffffff')
    const [filterByTxt, setFilterByTxt] = useState('')
    const [filterByType, setFilterByType] = useState('')
    const [filterByLabel, setFilterByLabel] = useState('')

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
            info: {
                title: newTitle,
                txt: newTxt,
                label: newLabel
            },
            style: {
                backgroundColor: newColor,
                color: '#000000',
                left: 0,
                top: 0
            },
            createdAt: Date.now()
        }
        noteService.save(newNote).then(() => {
            setNewTxt('')
            setNewTitle('')
            setNewLabel('')
            setNewColor('#ffffff')
            const txtArea = document.querySelector('.note-form textarea')
            if (txtArea) {
                txtArea.style.height = 'auto'
                txtArea.style.width = 'auto'
            }
            loadNotes()
        })
    }

    function onDeleteNote(noteId) {
        noteService.remove(noteId).then(loadNotes)
    }

    function onUpdateNote(noteId, newText, newBgColor = null, newStyle = null, newTitle = null, newLabel = null) {
        const note = notes.find(note => note.id === noteId)
        const updatedNote = {
            ...note,
            info: {
                txt: newText,
                title: newTitle !== null ? newTitle : note.info.title,
                label: newLabel !== null ? newLabel : (note.info.label || '')
            },
            style: {
                backgroundColor: (newStyle && newStyle.backgroundColor) || (note.style && note.style.backgroundColor) || '#ffffff',
                color: (newStyle && newStyle.color) || (note.style && note.style.color) || '#000000',
                left: (newStyle && typeof newStyle.left === 'number') ? newStyle.left : (note.style && note.style.left) || 0,
                top: (newStyle && typeof newStyle.top === 'number') ? newStyle.top : (note.style && note.style.top) || 0
            }
        }
        noteService.save(updatedNote).then(loadNotes)
    }

    function handleAutoResize(ev) {
        const el = ev.target
        const softBreakTxt = el.value.replace(/(\S{30})/g, '$1\u200B')
        setNewTxt(softBreakTxt)
        el.style.height = 'auto'
        el.style.height = el.scrollHeight + 'px'
        el.style.width = 'auto'
        el.style.width = el.scrollWidth < 400 ? el.scrollWidth + 'px' : '400px'
    }

    const filteredNotes = notes.filter(note => {
        const title = (note.info.title || '').toLowerCase()
        const txt = (note.info.txt || '').toLowerCase()
        const label = note.info.label || ''
        const type = note.type || ''
        return (
            title.includes(filterByTxt.toLowerCase()) ||
            txt.includes(filterByTxt.toLowerCase())
        ) &&
            (filterByType === '' || type === filterByType) &&
            (filterByLabel === '' || label === filterByLabel)
    })

    return (
        <section className="note-index">
            <h1>MissKeep</h1>
            <form onSubmit={onAddNote} className="note-form">
                <input
                    type="text"
                    placeholder="Title"
                    value={newTitle}
                    onChange={(ev) => setNewTitle(ev.target.value)}
                />
                <textarea
                    placeholder="Write a note..."
                    value={newTxt}
                    onChange={handleAutoResize}
                    style={{
                        resize: 'none',
                        minWidth: '200px',
                        maxWidth: '400px',
                        overflow: 'hidden',
                        height: 'auto',
                        width: 'auto'
                    }}
                />
                <select value={newLabel} onChange={(ev) => setNewLabel(ev.target.value)}>
                    <option value="">Label</option>
                    <option value="critical">Critical</option>
                    <option value="family">Family</option>
                    <option value="work">Work</option>
                    <option value="friends">Friends</option>
                    <option value="spam">Spam</option>
                    <option value="memories">Memories</option>
                    <option value="romantic">Romantic</option>
                </select>
                <input
                    type="color"
                    value={newColor}
                    onChange={(ev) => setNewColor(ev.target.value)}
                    title="Choose background color"
                />
                <button>Add</button>
            </form>

            <section className="note-filter">
                <input
                    type="text"
                    placeholder="Search..."
                    value={filterByTxt}
                    onChange={(ev) => setFilterByTxt(ev.target.value)}
                />
                <select value={filterByType} onChange={(ev) => setFilterByType(ev.target.value)}>
                    <option value="">All Types</option>
                    <option value="NoteTxt">Text</option>
                    <option value="NoteImg">Image</option>
                    <option value="NoteVideo">Video</option>
                </select>
                <select value={filterByLabel} onChange={(ev) => setFilterByLabel(ev.target.value)}>
                    <option value="">All Labels</option>
                    <option value="critical">Critical</option>
                    <option value="family">Family</option>
                    <option value="work">Work</option>
                    <option value="friends">Friends</option>
                    <option value="spam">Spam</option>
                    <option value="memories">Memories</option>
                    <option value="romantic">Romantic</option>
                </select>
            </section>

            <NoteList
                notes={filteredNotes}
                onDelete={onDeleteNote}
                onUpdate={onUpdateNote}
            />
        </section>
    )
}
