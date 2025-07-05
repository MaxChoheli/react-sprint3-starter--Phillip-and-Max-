const { useState, useEffect } = React

import { MailFilter } from '../cmps/MailFilter.jsx'
import { MailList } from '../cmps/MailList.jsx'
import { MailFolderList } from '../cmps/MailFolderList.jsx'
import { mailService } from '../services/mail.service.js'

export function MailIndex() {
  const [filterBy, setFilterBy] = useState({ status: 'inbox', txt: '', isRead: null })
  const [mails, setMails] = useState([])

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

  // Handler to toggle read/unread and update immediately
  function onToggleRead(updatedMail) {
    return mailService.save(updatedMail).then(() => {
      setMails(prevMails =>
        prevMails.map(mail => (mail.id === updatedMail.id ? updatedMail : mail))
      )
    })
  }

  // Handler to remove mail and update immediately
  function onRemoveMail(mailId) {
    mailService.remove(mailId).then(() => {
      setMails(prevMails => prevMails.filter(mail => mail.id !== mailId))
    })
  }

  return (
    <section className="mail-index">
      <aside className="mail-sidebar">
        <MailFolderList currentStatus={filterBy.status} onSetFolder={onSetFolder} />
      </aside>

      <main className="mail-main">
        <MailFilter onSetFilter={onSetFilter} />
        {/* Pass mails and handlers to MailList */}
        <MailList
          mails={mails}
          onToggleRead={onToggleRead}
          onRemoveMail={onRemoveMail}
        />
      </main>
    </section>
  )
}
