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

const demoMails = [
  {
    id: 'e101',
    subject: 'Miss you!',
    body: 'Would love to catch up sometimes',
    isRead: false,
    isStarred: false,     // <- add this
    sentAt: Date.now() - 100000,
    removedAt: null,
    from: 'momo@momo.com',
    to: 'user@appsus.com',
    status: 'inbox',
  },
  {
    id: 'e102',
    subject: 'Project Update',
    body: 'Call me',
    isRead: true,
    isStarred: false,     // <- add this
    sentAt: Date.now() - 50000,
    removedAt: null,
    from: 'user@appsus.com',
    to: '123a@domain.com',
    status: 'sent',
  },
]

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

    if (filterBy.status === 'inbox') {
      filteredMails = filteredMails.filter(
        mail =>
          mail.to === loggedinUser.email &&
          !mail.removedAt &&
          mail.status !== 'draft'
      )
    } else if (filterBy.status === 'sent') {
      filteredMails = filteredMails.filter(
        mail =>
          mail.from === loggedinUser.email &&
          !mail.removedAt &&
          mail.status === 'sent'
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
      filteredMails = filteredMails.filter(
        mail => !mail.removedAt && mail.status !== 'draft'
      )
    }

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
  return storageService.put(MAIL_KEY, mail).catch(() => storageService.post(MAIL_KEY, mail))
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
