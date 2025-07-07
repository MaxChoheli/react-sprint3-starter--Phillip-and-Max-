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

function query(filterBy = { status: '', txt: '', isRead: null }) {
  return storageService.query(MAIL_KEY).then(mails => {
    if (filterBy.status === 'inbox') {
      mails = mails.filter(mail => mail.to === loggedinUser.email && !mail.removedAt)
    } else if (filterBy.status === 'sent') {
      mails = mails.filter(mail => mail.from === loggedinUser.email && !mail.removedAt)
    } else if (filterBy.status === 'trash') {
      mails = mails.filter(mail => mail.removedAt)
    } else if (filterBy.status === 'draft') {
      mails = mails.filter(mail => mail.isDraft)
    } else {
      mails = mails.filter(mail => !mail.removedAt && !mail.isDraft)
    }

    if (filterBy.txt) {
      const regex = new RegExp(filterBy.txt, 'i')
      mails = mails.filter(mail => regex.test(mail.subject) || regex.test(mail.body) || regex.test(mail.to))
    }

    if (filterBy.isRead !== null) {
      mails = mails.filter(mail => mail.isRead === filterBy.isRead)
    }

    return mails
  })
}

function createMailToSend(to, subject, body) {
  return {
    id: utilService.makeId(),
    subject,
    body,
    isRead: false,
    sentAt: Date.now(),
    from: loggedinUser.email,
    to,
    status: 'sent', // mark as sent by default
  }
}

function send(mail) {
  mail.status = 'sent'
  mail.sentAt = Date.now()
  return storageService.post(MAIL_KEY, mail)
}

function get(mailId) {
  return storageService.get(MAIL_KEY, mailId)
}

function remove(mailId) {
  return storageService.remove(MAIL_KEY, mailId)
}

function save(mail) {
  if (mail.id) return storageService.put(MAIL_KEY, mail)
  else return storageService.post(MAIL_KEY, mail)
}

function getLoggedinUser() {
  return loggedinUser
}
