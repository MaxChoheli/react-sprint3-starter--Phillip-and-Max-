const { useState, useEffect } = React

import { MailFilter } from '../cmps/MailFilter.jsx'
import { MailList } from '../cmps/MailList.jsx'
import { MailFolderList } from '../cmps/MailFolderList.jsx'
import { MailCompose } from '../cmps/MailCompose.jsx'
console.log('MailCompose =', MailCompose)
import { mailService } from '../services/mail.service.js'

export function MailIndex() {
  const [filterBy, setFilterBy] = useState({ status: 'inbox', txt: '', isRead: null })
  const [mails, setMails] = useState([])
  const [isComposing, setIsComposing] = useState(false)

  useEffect(() => {
    mailService.initDemoData().then(() => {
      loadMails(filterBy)
    })
  }, [])

  useEffect(() => {
    loadMails(filterBy)
  }, [filterBy])

  function loadMails(filter) {
    mailService.query(filter).then(setMails)
  }

  function onSetFilter(newFilter) {
    setFilterBy(prev => ({ ...prev, ...newFilter }))
  }

  function onSetFolder(folder) {
    setFilterBy(prev => ({ ...prev, status: folder }))
  }

  function onToggleRead(updatedMail) {
    return mailService.save(updatedMail).then(() => {
      setMails(prevMails =>
        prevMails.map(mail => (mail.id === updatedMail.id ? updatedMail : mail))
      )
    })
  }

  function onRemoveMail(mailId) {
    mailService.remove(mailId).then(() => {
      setMails(prevMails => prevMails.filter(mail => mail.id !== mailId))
    })
  }

  // toggle mail compose form from visible to invisible
  function onToggleCompose() {
    setIsComposing(prev => !prev)
  }

  // When mail is sent, close compose and reload mails
  function onSend() {
    setIsComposing(false)
    loadMails(filterBy)
  }

  return (
    <section className="mail-index">
      <aside className="mail-sidebar">
        <button className="compose-btn" onClick={onToggleCompose}>
          <span className="material-icons">edit</span>
          Compose
        </button>
        <MailFolderList currentStatus={filterBy.status} onSetFolder={onSetFolder} />
      </aside>

      <main className="mail-main">
        <MailFilter onSetFilter={onSetFilter} />

        {isComposing && <MailCompose onSend={onSend} onClose={onToggleCompose} />}

        <MailList
          mails={mails}
          onToggleRead={onToggleRead}
          onRemoveMail={onRemoveMail}
        />
      </main>
    </section>
  )
}