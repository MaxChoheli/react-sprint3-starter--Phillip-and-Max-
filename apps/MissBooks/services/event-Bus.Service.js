export const eventBusService = {
    on(eventName, listener) {
        document.addEventListener(eventName, listener)
    },
    off(eventName, listener) {
        document.removeEventListener(eventName, listener)
    },
    emit(eventName, detail) {
        document.dispatchEvent(new CustomEvent(eventName, { detail }))
    }
}

export function showUserMsg(txt, type = 'success') {
    eventBusService.emit('show-user-msg', { txt, type })
}
