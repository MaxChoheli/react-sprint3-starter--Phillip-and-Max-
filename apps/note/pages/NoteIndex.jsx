import { noteService } from '../services/note.service.js'
import { NoteList } from '../cmps/NoteList.jsx'
import '/assets/css/apps/note/NoteIndex.css'

const { useState, useEffect, useRef } = React

export function NoteIndex({ filterByTxt, filterByType, filterByLabel }) {
    const [notes, setNotes] = useState([])
    const [newTxt, setNewTxt] = useState([])
    const [newTitle, setNewTitle] = useState('')
    const [newLabel, setNewLabel] = useState('')
    const [newColor, setNewColor] = useState('#ffffff')
    const [imageFile, setImageFile] = useState(null)
    const [isExpanded, setIsExpanded] = useState(false)
    const [showLabels, setShowLabels] = useState(false)
    const [showColors, setShowColors] = useState(false)
    const [isList, setIsList] = useState(false)

    const formRef = useRef()
    const fileInputRef = useRef()

    useEffect(() => {
        loadNotes()
    }, [])

    useEffect(() => {
        const params = new URLSearchParams(window.location.hash.split('?')[1])
        const title = params.get('title')
        const txt = params.get('txt')
        const label = params.get('label')

        if (title || txt) {
            const newNote = {
                type: 'NoteTxt',
                info: { title: title || '', txt: [{ text: txt || '', done: false }], label: label || '', imgUrl: '' },
                style: {
                    backgroundColor: '#fff',
                    color: '#000',
                    left: 0,
                    top: 0
                },
                isPinned: false,
                createdAt: Date.now()
            }

            noteService.save(newNote).then(() => {
                loadNotes()
                const cleanHash = window.location.hash.split('?')[0]
                window.history.replaceState(null, '', cleanHash)
            })
        }
    }, [])

    useEffect(() => {
        function handleClickOutside(ev) {
            if (
                isExpanded &&
                formRef.current &&
                !formRef.current.contains(ev.target) &&
                newTxt.length === 0 &&
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

        const reader = new FileReader()

        reader.onloadend = () => {
            const newNote = {
                type: 'NoteTxt',
                info: {
                    title: newTitle,
                    txt: isList ? newTxt : (newTxt.length > 0 ? newTxt[0].text : ''),
                    label: newLabel,
                    imgUrl: imageFile ? reader.result : ''
                },
                style: {
                    backgroundColor: newColor,
                    color: '#000000',
                    left: 0,
                    top: 0
                },
                isPinned: false,
                createdAt: Date.now()
            }

            noteService.save(newNote).then(() => {
                setNewTxt([])
                setNewTitle('')
                setNewLabel('')
                setNewColor('#ffffff')
                setImageFile(null)
                setIsExpanded(false)
                loadNotes()
                setIsList(false)
            })
        }

        if (imageFile) reader.readAsDataURL(imageFile)
        else reader.onloadend()
    }

    function onDeleteNote(noteId) {
        noteService.remove(noteId).then(loadNotes)
    }

    function onUpdateNote(noteId, newText, newBgColor = null, newStyle = null, newTitle = null, newLabel = null, newIsPinned = null, newImgUrl = null) {
        const note = notes.find(note => note.id === noteId)
        if (!note) return
        const updatedNote = {
            ...note,
            info: {
                txt: newText,
                title: newTitle !== null ? newTitle : note.info.title,
                label: newLabel !== null ? newLabel : (note.info.label || ''),
                imgUrl: newImgUrl !== null ? newImgUrl : (note.info.imgUrl || '')
            },
            style: {
                backgroundColor: (newStyle && newStyle.backgroundColor) || (note.style && note.style.backgroundColor) || '#ffffff',
                color: (newStyle && newStyle.color) || (note.style && note.style.color) || '#000000',
                left: (newStyle && typeof newStyle.left === 'number') ? newStyle.left : (note.style && note.style.left) || 0,
                top: (newStyle && typeof newStyle.top === 'number') ? newStyle.top : (note.style && note.style.top) || 0
            },
            isPinned: newIsPinned !== null ? newIsPinned : note.isPinned || false
        }
        noteService.save(updatedNote).then(loadNotes)
    }

    function onDuplicateNote(noteToCopy) {
        const newNote = {
            type: 'NoteTxt',
            info: {
                title: noteToCopy.info.title || '',
                txt: noteToCopy.info.txt || [],
                label: noteToCopy.info.label || '',
                imgUrl: noteToCopy.info.imgUrl || ''
            },
            style: {
                backgroundColor: (noteToCopy.style && noteToCopy.style.backgroundColor) || '#ffffff',
                color: '#000000',
                left: 0,
                top: 0
            },
            isPinned: false,
            createdAt: Date.now()
        }
        noteService.save(newNote).then(loadNotes)
    }

    function onTxtChange(idx, value) {
        const updated = [...newTxt]
        updated[idx].text = value
        setNewTxt(updated)
    }

    function onTxtToggle(idx) {
        const updated = [...newTxt]
        updated[idx].done = !updated[idx].done
        setNewTxt(updated)
    }

    function onKeyDown(ev, idx) {
        if (ev.key === 'Enter') {
            ev.preventDefault()
            const updated = [...newTxt]
            updated.splice(idx + 1, 0, { text: '', done: false })
            setNewTxt(updated)
        }
    }

    const filteredNotes = notes.filter(note => {
        const title = (note.info.title || '').toLowerCase()
        const label = note.info.label || ''
        const type = note.type || ''
        const txt = Array.isArray(note.info.txt) ? note.info.txt.map(line => line.text).join(' ') : note.info.txt || ''
        return (
            (title.includes(filterByTxt.toLowerCase()) ||
                txt.toLowerCase().includes(filterByTxt.toLowerCase())) &&
            (filterByType === '' || type === filterByType) &&
            (filterByLabel === '' || label === filterByLabel)
        )
    })

    const pinnedNotes = filteredNotes.filter(note => note.isPinned)
    const unpinnedNotes = filteredNotes.filter(note => !note.isPinned)

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
                    {isList ? (
                        newTxt.map((line, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
                                <input
                                    type="checkbox"
                                    checked={line.done}
                                    onChange={() => onTxtToggle(idx)}
                                />
                                <input
                                    type="text"
                                    value={line.text}
                                    onChange={(ev) => onTxtChange(idx, ev.target.value)}
                                    onKeyDown={(ev) => onKeyDown(ev, idx)}
                                    onFocus={() => setIsExpanded(true)}
                                    style={{ flex: 1, marginLeft: '0.5rem' }}
                                />
                            </div>
                        ))
                    ) : (
                        <textarea
                            placeholder="Take a note..."
                            value={newTxt.length > 0 ? newTxt[0].text : ''}
                            onFocus={() => setIsExpanded(true)}
                            onChange={(ev) => setNewTxt([{ text: ev.target.value, done: false }])}
                        />
                    )}

                    {imageFile && (
                        <img
                            src={URL.createObjectURL(imageFile)}
                            alt="Preview"
                            style={{
                                width: '100%',
                                maxHeight: '200px',
                                objectFit: 'contain',
                                borderRadius: '8px',
                                marginTop: '0.5rem'
                            }}
                        />
                    )}

                    {isExpanded && (
                        <div className="note-options">
                            <span className="material-symbols-outlined" onClick={() => setShowLabels(prev => !prev)}>label</span>
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

                            <button
                                type="button"
                                onClick={() => {
                                    setIsList(true)
                                    setNewTxt([{ text: '', done: false }])
                                }}
                                className="note-action"
                                title="Make List"
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    padding: '4px',
                                    outline: 'none'
                                }}
                            >
                                <span className="material-symbols-outlined">format_list_bulleted</span>
                            </button>

                            <span className="material-symbols-outlined" onClick={() => setShowColors(prev => !prev)}>palette</span>
                            {showColors && (
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                                    {["#faafa8", "#f39f76", "#fff8b8", "#e2f6d3", "#b4ddd3", "#d4e4ed", "#aeccdc", "#d3bfdb", "#f6e2dd", "#e9e3d4", "#efeff1"].map(color => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setNewColor(color)}
                                            style={{
                                                backgroundColor: color,
                                                border: newColor === color ? '2px solid black' : '1px solid #ccc',
                                                width: '24px',
                                                height: '24px',
                                                borderRadius: '50%',
                                                padding: 0,
                                                display: 'inline-block',
                                                appearance: 'none'
                                            }}

                                        />
                                    ))}
                                </div>
                            )}
                            <span className="material-symbols-outlined" onClick={() => fileInputRef.current.click()}>photo</span>
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                ref={fileInputRef}
                                onChange={(e) => setImageFile(e.target.files[0])}
                            />
                            {newTxt.length > 0 && <button>Add</button>}
                        </div>
                    )}
                </div>
            </form>

            {pinnedNotes.length > 0 && (
                <section style={{ marginTop: '1em' }}>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1.1em' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>push_pin</span>
                        Pinned
                    </h2>
                    <NoteList notes={pinnedNotes} onDelete={onDeleteNote} onUpdate={onUpdateNote} onDuplicate={onDuplicateNote} />
                </section>
            )}

            <NoteList notes={unpinnedNotes} onDelete={onDeleteNote} onUpdate={onUpdateNote} onDuplicate={onDuplicateNote} />
        </section>
    )
}
