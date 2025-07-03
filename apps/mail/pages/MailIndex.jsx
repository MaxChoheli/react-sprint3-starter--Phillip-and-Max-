const { useState, useEffect } = React
import { MailFilter } from '../cmps/MailFilter.jsx'
import { MailList } from '../cmps/MailList.jsx'
import { MailFolderList } from '../cmps/MailFolderList.jsx'
import { mailService } from '../services/mail.service.js'

export function MailIndex() {
  const [filterBy, setFilterBy] = useState({ status: '', txt: '', isRead: null })
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

  return (
    <section className="container">
      <h2>Mail app</h2>
      <MailFolderList currentStatus={filterBy.status} onSetStatus={onSetFolder} />
      <MailFilter onSetFilter={onSetFilter} />
      <MailList mails={mails} />
    </section>
  )
}
