import { storageService } from '../../../services/async-storage.service.js'
import { utilService } from '../../../services/util.service.js'
console.log('UTIL SERVICE:', utilService)

export const mailService = {
  query,
  createMailToSend,
  send,
  get,
  remove,
  save,
  getLoggedinUser,
  initDemoData,
  toggleStarred,
  saveDraft,
}

const MAIL_KEY = 'mailDB'

const loggedinUser = {
  email: 'user@appsus.com',
  fullname: 'Mahatma Appsus',
}

const demoMails = []
const senders = [
  'alice@example.com',
  'bob@example.com',
  'carol@example.com',
  'dan@example.com',
  'eve@example.com',
]
const statuses = ['inbox', 'sent', 'draft', 'trash']

function randomDateWithinLastMonth() {
  const now = Date.now()
  const monthAgo = now - 30 * 24 * 60 * 60 * 1000
  return utilService.getRandomIntInclusive(monthAgo, now)
}

for (let i = 0; i < 15; i++) {
  // Pick random folder status
  let status = statuses[utilService.getRandomIntInclusive(0, statuses.length - 1)]

  let mail = {
    id: utilService.makeId(),
    subject: utilService.makeLorem(5).trim(),
    body: utilService.makeLorem(20).trim(),
    isRead: Math.random() > 0.5,
    isStarred: false,
    sentAt: randomDateWithinLastMonth(),
    removedAt: null,
    from: '',
    to: 'user@appsus.com',
    status,
  }

  if (status === 'inbox') {
    mail.from = senders[utilService.getRandomIntInclusive(0, senders.length - 1)]
  } else if (status === 'sent') {
    mail.from = 'user@appsus.com'
    mail.isRead = true
  } else if (status === 'draft') {
    mail.from = 'user@appsus.com'
    mail.sentAt = null
    mail.isRead = true
  } else if (status === 'trash') {
    // For trash, can be from or to user, mark removedAt
    const fromIsUser = Math.random() > 0.5
    mail.from = fromIsUser ? 'user@appsus.com' : senders[utilService.getRandomIntInclusive(0, senders.length - 1)]
    mail.removedAt = Date.now() - utilService.getRandomIntInclusive(0, 5) * 24 * 60 * 60 * 1000 // removed recently
  }

  demoMails.push(mail)
}

function initDemoData() {
  return storageService.query(MAIL_KEY).then(mails => {
    if (mails.length) return mails

    _save(MAIL_KEY, demoMails)
    return demoMails
  })
}

function _save(entityType, entities) {
  localStorage.setItem(entityType, JSON.stringify(entities))
}

function query(filterBy = { status: 'inbox', txt: '', isRead: null }) {
  return storageService.query(MAIL_KEY).then(mails => {
    let filteredMails = [...mails]

    // Filter by folder/status
    if (filterBy.status === 'inbox') {
      filteredMails = filteredMails.filter(
        mail =>
          mail.to === loggedinUser.email &&
          mail.status === 'inbox' &&
          !mail.removedAt
      )
    } else if (filterBy.status === 'sent') {
      filteredMails = filteredMails.filter(
        mail =>
          mail.from === loggedinUser.email &&
          mail.status === 'sent' &&
          !mail.removedAt
      )
    } else if (filterBy.status === 'trash') {
      filteredMails = filteredMails.filter(mail => mail.removedAt)
    } else if (filterBy.status === 'draft') {
      filteredMails = filteredMails.filter(
        mail => mail.status === 'draft' && !mail.removedAt
      )
    } else if (filterBy.status === 'starred') {
      filteredMails = filteredMails.filter(
        mail => mail.isStarred && !mail.removedAt
      )
    } else {
      // Default fallback: any non-draft, non-removed mail
      filteredMails = filteredMails.filter(
        mail => !mail.removedAt && mail.status !== 'draft'
      )
    }

    // Filter by text
    if (filterBy.txt) {
      const regex = new RegExp(filterBy.txt, 'i')
      filteredMails = filteredMails.filter(
        mail =>
          regex.test(mail.subject) ||
          regex.test(mail.body) ||
          regex.test(mail.to) ||
          regex.test(mail.from)
      )
    }

    // Filter by read/unread
    if (filterBy.isRead !== null) {
      filteredMails = filteredMails.filter(
        mail => mail.isRead === filterBy.isRead
      )
    }

    return filteredMails
  })
}


function createMailToSend(to, subject, body) {
  return {
    id: utilService.makeId(),
    subject,
    body,
    isRead: false,
    isStarred: false,      // <- add this
    sentAt: Date.now(),
    from: loggedinUser.email,
    to,
    status: 'sent',
  }
}

function send(mail) {
  mail.status = 'sent'
  mail.sentAt = Date.now()
  if (!mail.id) mail.id = utilService.makeId()
  return save(mail) 
}

function get(mailId) {
  return storageService.get(MAIL_KEY, mailId)
}

function remove(mailId) {
  return get(mailId).then(mail => {
    if (!mail) return Promise.reject('Mail not found')
    if (mail.removedAt) {
      // Already in trash = permanently delete
      return storageService.remove(MAIL_KEY, mailId)
    } else {
      // Move to trash
      mail.removedAt = Date.now()
      return save(mail)
    }
  })
}

function save(mail) {
  if (!mail.id) mail.id = utilService.makeId()

  // Try to update existing mail first
  return storageService.get(MAIL_KEY, mail.id)
    .then(() => storageService.put(MAIL_KEY, mail))  // If found, update
    .catch(() => storageService.post(MAIL_KEY, mail)) // If not found, add new
}

function getLoggedinUser() {
  return loggedinUser
}

function toggleStarred(mail) {
  mail.isStarred = !mail.isStarred
  return save(mail)
}

function saveDraft(mail) {
  mail.status = 'draft'
  mail.sentAt = null
  if (!mail.id) mail.id = utilService.makeId()
  return save(mail)
}
