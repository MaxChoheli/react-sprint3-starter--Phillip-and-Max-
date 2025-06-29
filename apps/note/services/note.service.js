import { storageService } from '../../../services/async-storage.service.js'

const NOTE_KEY = 'missKeepNotes'
_createDemoNotes()

export const noteService = {
    query,
    save,
    remove,
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
