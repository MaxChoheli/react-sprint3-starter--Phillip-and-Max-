import { storageService } from '../../../services/async-storage.service.js'

export const mailService = {
  query,
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
  },
]

// Call once at app startup to seed demo mails if storage is empty
function initDemoData() {
  return storageService.query(MAIL_KEY).then(mails => {
    if (!mails || !mails.length) {
      return Promise.all(demoMails.map(mail => storageService.post(MAIL_KEY, mail)))
    }
    return mails
  })
}

function query(filterBy = { status: '', txt: '', isRead: null }) {
  return storageService.query(MAIL_KEY).then(mails => {

    console.log('Before filtering:', mails)

    // Filter by inbox/sent/etc.
    if (filterBy.status === 'inbox') {
      mails = mails.filter(mail => mail.to === loggedinUser.email && !mail.removedAt)
    } else if (filterBy.status === 'sent') {
      mails = mails.filter(mail => mail.from === loggedinUser.email && !mail.removedAt)
    } else {
      // no status or unknown: return all mails not removed
      mails = mails.filter(mail => !mail.removedAt)
    }

    // Filter by search text
    if (filterBy.txt) {
      const regex = new RegExp(filterBy.txt, 'i')
      mails = mails.filter(mail => regex.test(mail.subject) || regex.test(mail.body))
    }

    // Filter by read/unread
    if (filterBy.isRead !== null) {
      mails = mails.filter(mail => mail.isRead === filterBy.isRead)
    }

    console.log('After filtering:', mails)
    return mails
  })
}

function get(mailId) {
  return storageService.get(MAIL_KEY, mailId)
}

function remove(mailId) {
  return storageService.remove(MAIL_KEY, mailId)
}

function save(mail) {
  return mail.id
    ? storageService.put(MAIL_KEY, mail)
    : storageService.post(MAIL_KEY, mail)
}

function getLoggedinUser() {
  return loggedinUser
}