import { storageService } from '../../../services/async-storage.service.js'

const NOTE_KEY = 'missKeepNotes'
_createDemoNotes()

export const noteService = {
    query,
    save,
    remove,
    saveMany
}

function query() {
    return storageService.query(NOTE_KEY)
}

function save(note) {
    if (note.id) return storageService.put(NOTE_KEY, note)
    else return storageService.post(NOTE_KEY, note)
}

function remove(noteId) {
    return storageService.remove(NOTE_KEY, noteId)
}

function _createDemoNotes() {
    let notes = JSON.parse(localStorage.getItem(NOTE_KEY))
    if (!notes || !notes.length) {
        notes = [
            {
                id: 'n101',
                type: 'NoteTxt',
                info: { txt: 'Welcome to MissKeep!' },
                createdAt: Date.now()
            },
            {
                id: 'n102',
                type: 'NoteTxt',
                info: { txt: 'Click "Edit" to update a note.' },
                createdAt: Date.now()
            }
        ]
        localStorage.setItem(NOTE_KEY, JSON.stringify(notes))
    }
}

function handleUpdate(noteId, txt, color, style, title, label, pinned, image) {
    const noteToUpdate = notes.find(note => note.id === noteId)
    if (!noteToUpdate) return

    noteToUpdate.info.txt = txt
    noteToUpdate.style = style
    noteToUpdate.style.backgroundColor = color
    noteToUpdate.info.title = title
    noteToUpdate.info.label = label
    noteToUpdate.isPinned = pinned
    noteToUpdate.info.image = image

    noteService.save(noteToUpdate).then(savedNote => {
        setNotes(prevNotes =>
            prevNotes.map(note => (note.id === savedNote.id ? savedNote : note))
        )
    })
}

function saveMany(notes) {
    localStorage.setItem(NOTE_KEY, JSON.stringify(notes))
    return Promise.resolve(notes)
}


