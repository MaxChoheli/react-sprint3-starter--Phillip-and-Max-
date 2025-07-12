import { noteService } from '../services/note.service.js'

function NoteList({ notes, onDelete, onUpdate, onDuplicate }) {
    const [noteList, setNoteList] = React.useState(notes)
    const [draggedIdx, setDraggedIdx] = React.useState(null)

    React.useEffect(() => {
        setNoteList(notes)
    }, [notes])

    function handleDragStart(idx) {
        setDraggedIdx(idx)
    }

    function handleDragOver(ev) {
        ev.preventDefault()
    }

    function handleDrop(idx) {
        if (draggedIdx === null || draggedIdx === idx) return
        const updated = [...noteList]
        const [draggedNote] = updated.splice(draggedIdx, 1)
        updated.splice(idx, 0, draggedNote)
        setDraggedIdx(null)
        setNoteList(updated)
        noteService.saveMany(updated)
    }

    return (
        <ul className="note-list">
            {noteList.map((note, idx) => (
                <li
                    key={note.id}
                    draggable
                    onDragStart={() => handleDragStart(idx)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(idx)}
                >
                    <NoteItem note={note} onDelete={onDelete} onUpdate={onUpdate} onDuplicate={onDuplicate} />
                </li>
            ))}
        </ul>
    )
}

function NoteItem({ note, onDelete, onUpdate, onDuplicate }) {
    const [isModalOpen, setIsModalOpen] = React.useState(false)
    const [txt, setTxt] = React.useState(note.info.txt)
    const [title, setTitle] = React.useState(note.info.title || '')
    const [label, setLabel] = React.useState(note.info.label || '')
    const [bgColor, setBgColor] = React.useState((note.style && note.style.backgroundColor) || '#ffffff')
    const [pinned, setPinned] = React.useState(note.isPinned || false)
    const [showColorPicker, setShowColorPicker] = React.useState(false)
    const [showLabelPicker, setShowLabelPicker] = React.useState(false)
    const [imageUrl, setImageUrl] = React.useState(note.info.imgUrl || '')
    const fileInputRef = React.useRef()
    const modalTextareaRef = React.useRef()


    const colorOptions = ['#faafa8', '#f39f76', '#fff8b8', '#e2f6d3', '#b4ddd3', '#d4e4ed', '#aeccdc', '#d3bfdb', '#f6e2dd', '#e9e3d4', '#efeff1']

    const noteRef = React.useRef()
    const modalRef = React.useRef()

    React.useEffect(() => {
        function handleClickOutside(ev) {
            if (isModalOpen) {
                if (modalRef.current && !modalRef.current.contains(ev.target)) {
                    setShowColorPicker(false)
                    setShowLabelPicker(false)
                }
            } else {
                if (noteRef.current && !noteRef.current.contains(ev.target)) {
                    setShowColorPicker(false)
                    setShowLabelPicker(false)
                }
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isModalOpen])

    React.useEffect(() => {
        if (isModalOpen && modalTextareaRef.current) {
            const el = modalTextareaRef.current
            el.style.height = 'auto'
            el.style.height = el.scrollHeight + 'px'
        }
    }, [isModalOpen, txt])

    function handleEditTxtResize(ev) {
        const el = ev.target
        const softBreakTxt = el.value.replace(/(\S{30})/g, '$1\u200B')
        setTxt(softBreakTxt)
        el.style.height = 'auto'
        el.style.height = el.scrollHeight + 'px'
        el.style.width = 'auto'
        el.style.width = el.scrollWidth < 400 ? el.scrollWidth + 'px' : '400px'
    }

    function handleMouseEnter() {
        const el = noteRef.current
        if (!el) return
        const actions = el.querySelector('.note-actions')
        const pin = el.querySelector('.note-pin')
        if (actions) actions.style.display = 'flex'
        if (pin) pin.style.display = 'block'
    }

    function handleMouseLeave() {
        const el = noteRef.current
        if (!el) return
        const actions = el.querySelector('.note-actions')
        const pin = el.querySelector('.note-pin')
        if (actions) actions.style.display = 'none'
        if (pin) pin.style.display = 'none'
    }

    function openModal(ev) {
        if (ev.target.closest('.note-action')) return
        setIsModalOpen(true)
    }

    function closeModal() {
        setIsModalOpen(false)
        const updatedStyle = {
            backgroundColor: bgColor,
            color: '#000000'
        }
        onUpdate(note.id, txt, bgColor, updatedStyle, title, label, pinned, imageUrl)
    }

    function handleLabelChange(value) {
        setLabel(value)
        if (!isModalOpen) {
            const updatedStyle = {
                backgroundColor: bgColor,
                color: '#000000'
            }
            onUpdate(note.id, txt, bgColor, updatedStyle, title, value, pinned, imageUrl)
        }
    }

    function handleColorChange(color) {
        setBgColor(color)
        if (!isModalOpen) {
            const updatedStyle = {
                backgroundColor: color,
                color: '#000000'
            }
            onUpdate(note.id, txt, bgColor, updatedStyle, title, label, pinned, imageUrl)
        }
    }

    function togglePin(ev) {
        ev.stopPropagation()
        const newPinned = !pinned
        setPinned(newPinned)
        if (!isModalOpen) {
            const updatedStyle = {
                backgroundColor: bgColor,
                color: '#000000'
            }
            onUpdate(note.id, txt, bgColor, updatedStyle, title, label, newPinned, imageUrl)

        }
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
        <React.Fragment>
            <div
                className="note-item"
                ref={noteRef}
                onClick={openModal}
                style={{
                    backgroundColor: bgColor,
                    color: '#000000',
                    maxWidth: '400px',
                    position: 'relative',
                    paddingBottom: '144px'
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}

            >
                <div
                    className="note-pin note-action"
                    style={{
                        position: 'absolute',
                        top: '2px',
                        right: '2px',
                        display: 'none',
                        zIndex: 2
                    }}
                >
                    <button
                        onClick={togglePin}
                        className="note-action"
                        style={{
                            background: 'none',
                            border: 'none',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            padding: '4px',
                            boxShadow: 'none',
                            outline: 'none'
                        }}
                        title="Pin note"
                    >
                        <span className="material-symbols-outlined">{pinned ? 'push_pin' : 'push_pin'}</span>
                    </button>
                </div>

                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt="Note"
                        style={{
                            width: '100%',
                            maxHeight: '200px',
                            objectFit: 'contain',
                            borderRadius: '8px',
                            marginBottom: '0.5rem'
                        }}
                    />
                )}

                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={(ev) => {
                        const file = ev.target.files[0]
                        if (!file) return
                        const reader = new FileReader()
                        reader.onload = () => {
                            const base64 = reader.result
                            setImageUrl(base64)
                            const updatedStyle = {
                                backgroundColor: bgColor,
                                color: '#000000'
                            }
                            onUpdate(note.id, txt, bgColor, updatedStyle, title, label, pinned, base64)
                        }
                        reader.readAsDataURL(file)
                    }}
                />

                <h4 style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{note.info.title}</h4>
                {Array.isArray(note.info.txt) ? (
                    <ul className="note-checklist">
                        {note.info.txt.map((item, idx) => (
                            <li key={idx} style={{ display: 'flex', alignItems: 'center' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '20px', marginRight: '0.5rem' }}>
                                    {item.done ? 'check_box' : 'check_box_outline_blank'}
                                </span>
                                <span style={{ textDecoration: item.done ? 'line-through' : 'none' }}>{item.text}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>{note.info.txt}</p>
                )}
                {note.info.label && <p className="note-label">#{note.info.label}</p>}

                <div className="note-actions note-action" style={{ position: 'absolute', bottom: '36px', left: '6px', display: 'none' }}>
                    <button className="note-action" onClick={(ev) => { ev.stopPropagation(); onDelete(note.id) }} style={iconBtnStyle}>
                        <span className="material-symbols-outlined">delete</span>
                    </button>
                    <button className="note-action" onClick={(ev) => { ev.stopPropagation(); setShowLabelPicker(prev => !prev); setShowColorPicker(false) }} style={iconBtnStyle}>
                        <span className="material-symbols-outlined">label</span>
                    </button>
                    <button className="note-action" onClick={(ev) => { ev.stopPropagation(); setShowColorPicker(prev => !prev); setShowLabelPicker(false) }} style={iconBtnStyle}>
                        <span className="material-symbols-outlined">palette</span>
                    </button>
                    <button className="note-action" onClick={(ev) => { ev.stopPropagation(); fileInputRef.current.click() }} style={iconBtnStyle}>
                        <span className="material-symbols-outlined">photo</span>
                    </button>
                    <button className="note-action" onClick={(ev) => { ev.stopPropagation(); onDuplicate(note) }} style={iconBtnStyle}>
                        <span className="material-symbols-outlined">content_copy</span>
                    </button>
                </div>


                {!isModalOpen && (showColorPicker || showLabelPicker) && (
                    <div style={{ position: 'absolute', bottom: '100px', left: '6px' }}>
                        {showLabelPicker && (
                            <select
                                className="note-action"
                                value={label}
                                onChange={(e) => handleLabelChange(e.target.value)}
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
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {colorOptions.map(color => (
                                    <button
                                        key={color}
                                        className="note-action"
                                        onClick={() => handleColorChange(color)}
                                        style={{
                                            backgroundColor: color,
                                            border: bgColor === color ? '2px solid black' : '1px solid #ccc',
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
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div
                    className="modal-backdrop"
                    onClick={closeModal}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                        overflow: 'auto'
                    }}
                >
                    <div
                        ref={modalRef}
                        className="modal-content"
                        onClick={(ev) => ev.stopPropagation()}
                        style={{
                            backgroundColor: bgColor,
                            padding: '1.5rem',
                            borderRadius: '12px',
                            maxWidth: '500px',
                            width: '100%',
                            boxShadow: '0 2px 16px rgba(0,0,0,0.25)',
                            position: 'relative',
                            color: '#000000'
                        }}
                    >
                        <button
                            onClick={togglePin}
                            className="note-action"
                            style={{
                                background: 'none',
                                border: 'none',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                padding: '6px',
                                boxShadow: 'none',
                                outline: 'none',
                                position: 'absolute',
                                top: '10px',
                                right: '10px'
                            }}
                            title="Pin note"
                        >
                            <span className="material-symbols-outlined">{pinned ? 'push_pin' : 'push_pin'}</span>
                        </button>
                        {imageUrl && (
                            <img
                                src={imageUrl}
                                alt="Note"
                                style={{
                                    width: '100%',
                                    maxHeight: '250px',
                                    objectFit: 'contain',
                                    borderRadius: '8px',
                                    marginBottom: '1rem'
                                }}
                            />
                        )}

                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={(ev) => {
                                const file = ev.target.files[0]
                                if (!file) return
                                const reader = new FileReader()
                                reader.onload = () => {
                                    const base64 = reader.result
                                    setImageUrl(base64)
                                    const updatedStyle = {
                                        backgroundColor: bgColor,
                                        color: '#000000'
                                    }
                                    onUpdate(note.id, txt, bgColor, updatedStyle, title, label, pinned, base64)
                                }
                                reader.readAsDataURL(file)
                            }}
                        />

                        <div style={{
                            position: 'absolute',
                            bottom: '1rem',
                            right: '1rem'
                        }}>
                            <button
                                onClick={closeModal}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    boxShadow: 'none',
                                    outline: 'none',
                                    color: '#000',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    textDecoration: 'underline',
                                    padding: 0
                                }}
                            >
                                Close
                            </button>
                        </div>

                        <textarea
                            value={title}
                            placeholder="Title"
                            onChange={(e) => setTitle(e.target.value)}
                            rows={1}
                            style={{
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                width: '100%',
                                maxWidth: '400px',
                                fontSize: '1.1rem',
                                marginBottom: '0.5rem',
                                border: 'none',
                                outline: 'none',
                                background: 'transparent',
                                resize: 'none',
                                overflowWrap: 'break-word',
                                wordBreak: 'break-word',
                                overflow: 'hidden'
                            }}
                        />



                        {Array.isArray(txt) ? (
                            <ul className="modal-checklist" style={{ padding: 0, listStyle: 'none' }}>
                                {txt.map((item, idx) => (
                                    <li key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                                        <input
                                            type="checkbox"
                                            checked={item.done}
                                            onChange={() => {
                                                const updated = [...txt]
                                                updated[idx].done = !updated[idx].done
                                                setTxt(updated)
                                            }}
                                            style={{ marginRight: '0.5rem' }}
                                        />
                                        <input
                                            type="text"
                                            value={item.text}
                                            onChange={(ev) => {
                                                const updated = [...txt]
                                                updated[idx].text = ev.target.value
                                                setTxt(updated)
                                            }}
                                            onKeyDown={(ev) => {
                                                if (ev.key === 'Enter') {
                                                    ev.preventDefault()
                                                    const updated = [...txt]
                                                    updated.splice(idx + 1, 0, { text: '', done: false })
                                                    setTxt(updated)
                                                }
                                            }}
                                            style={{
                                                flex: 1,
                                                background: 'transparent',
                                                border: 'none',
                                                outline: 'none',
                                                fontSize: '1rem'
                                            }}
                                        />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <textarea
                                ref={modalTextareaRef}
                                value={txt}
                                onChange={handleEditTxtResize}
                                onInput={handleEditTxtResize}
                                style={{
                                    resize: 'none',
                                    width: '100%',
                                    minWidth: '200px',
                                    maxWidth: '400px',
                                    height: 'auto',
                                    overflow: 'hidden',
                                    fontSize: '1rem',
                                    lineHeight: '1.4',
                                    border: 'none',
                                    background: 'transparent',
                                    outline: 'none'
                                }}
                            />
                        )}

                        <div style={{ display: 'flex', gap: '6px', marginTop: '12px', flexWrap: 'wrap' }}>
                            <button
                                type="button"
                                onClick={() => setShowLabelPicker(prev => !prev)}
                                style={iconBtnStyle}
                                className="note-action"
                                title="Change Label"
                            >
                                <span className="material-symbols-outlined">label</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setShowColorPicker(prev => !prev)}
                                style={iconBtnStyle}
                                className="note-action"
                                title="Change Color"
                            >
                                <span className="material-symbols-outlined">palette</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => onDelete(note.id)}
                                style={iconBtnStyle}
                                className="note-action"
                                title="Delete"
                            >
                                <span className="material-symbols-outlined">delete</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => fileInputRef.current.click()}
                                style={iconBtnStyle}
                                className="note-action"
                                title="Add Image"
                            >
                                <span className="material-symbols-outlined">photo</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => onDuplicate(note)}
                                style={iconBtnStyle}
                                className="note-action"
                                title="Duplicate"
                            >
                                <span className="material-symbols-outlined">content_copy</span>
                            </button>

                            {showLabelPicker && (
                                <select
                                    value={label}
                                    onChange={(e) => setLabel(e.target.value)}
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
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                    {colorOptions.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setBgColor(color)}
                                            style={{
                                                backgroundColor: color,
                                                border: bgColor === color ? '2px solid black' : '1px solid #ccc',
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
                        </div>

                    </div>
                </div>
            )}
        </React.Fragment>
    )
}

export { NoteList }
