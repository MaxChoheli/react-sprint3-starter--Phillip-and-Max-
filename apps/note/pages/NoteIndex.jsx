import { noteService } from '../services/note.service.js'
import { NoteList } from '../cmps/NoteList.jsx'
import '/assets/css/apps/note/NoteIndex.css'

const { useState, useEffect, useRef } = React

export function NoteIndex({ filterByTxt, filterByType, filterByLabel }) {
    const [notes, setNotes] = useState([])
    const [newTxt, setNewTxt] = useState('')
    const [newTitle, setNewTitle] = useState('')
    const [newLabel, setNewLabel] = useState('')
    const [newColor, setNewColor] = useState('#ffffff')
    const [isExpanded, setIsExpanded] = useState(false)
    const [showLabels, setShowLabels] = useState(false)
    const [showColors, setShowColors] = useState(false)

    const formRef = useRef()

    useEffect(() => {
        loadNotes()
    }, [])

    useEffect(() => {
        function handleClickOutside(ev) {
            if (
                isExpanded &&
                formRef.current &&
                !formRef.current.contains(ev.target) &&
                !newTxt.trim() &&
                !newTitle.trim()
            ) {
                setIsExpanded(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isExpanded, newTxt, newTitle])

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
            setIsExpanded(false)
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
            (title.includes(filterByTxt.toLowerCase()) ||
                txt.includes(filterByTxt.toLowerCase())) &&
            (filterByType === '' || type === filterByType) &&
            (filterByLabel === '' || label === filterByLabel)
        )
    })

    return (
        <section className="note-index">
            <form onSubmit={onAddNote} className="note-form" ref={formRef}>
                <div className={`note-inputs ${isExpanded ? 'expanded' : ''}`}>
                    {isExpanded && (
                        <input
                            type="text"
                            placeholder="Title"
                            value={newTitle}
                            onChange={(ev) => setNewTitle(ev.target.value)}
                        />
                    )}
                    <textarea
                        placeholder="Take a note..."
                        value={newTxt}
                        onFocus={() => setIsExpanded(true)}
                        onChange={handleAutoResize}
                    />
                    {isExpanded && (
                        <div className="note-options">
                            <span
                                className="material-symbols-outlined"
                                onClick={() => setShowLabels(prev => !prev)}
                                style={{ cursor: 'pointer', borderRadius: '50%', padding: '4px', backgroundColor: 'transparent' }}
                            >
                                label
                            </span>
                            {showLabels && (
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
                            )}

                            <span
                                className="material-symbols-outlined"
                                onClick={() => setShowColors(prev => !prev)}
                                style={{ cursor: 'pointer', borderRadius: '50%', padding: '4px', backgroundColor: 'transparent' }}
                            >
                                palette
                            </span>
                            {showColors && (
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                                    {['#faafa8', '#f39f76', '#fff8b8', '#e2f6d3', '#b4ddd3', '#d4e4ed', '#aeccdc', '#d3bfdb', '#f6e2dd', '#e9e3d4', '#efeff1'].map(color => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setNewColor(color)}
                                            style={{
                                                backgroundColor: color,
                                                border: newColor === color ? '2px solid black' : '1px solid #ccc',
                                                width: '22px',
                                                height: '22px',
                                                borderRadius: '50%',
                                                cursor: 'pointer',
                                                padding: 0
                                            }}
                                            title={color}
                                        />
                                    ))}
                                </div>
                            )}

                            {newTxt.trim() && <button>Add</button>}
                        </div>
                    )}
                </div>
            </form>

            <NoteList
                notes={filteredNotes}
                onDelete={onDeleteNote}
                onUpdate={onUpdateNote}
            />
        </section>
    )
}
