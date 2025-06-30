const { useState, useEffect } = React

import { MailFilter } from '../cmps/MailFilter.jsx'
import { MailList } from '../cmps/MailList.jsx'
import { mailService } from '../services/mail.service.js'

export function MailIndex() {
  const [filterBy, setFilterBy] = useState({ status: '', txt: '', isRead: null })
  const [mails, setMails] = useState([])

  // Initialize demo mails
  useEffect(() => {
    mailService.initDemoData().then(() => {
      loadMails(filterBy)
    })
  }, [])

  // When filter changes, load mails
  useEffect(() => {
    loadMails(filterBy)
  }, [filterBy])

  function loadMails(filter) {
    mailService.query(filter).then(setMails)
  }

  function onSetFilter(newFilter) {
    setFilterBy(newFilter)
  }

  return (
    <section className="container">
      <h2>Mail app</h2>
      <MailFilter onSetFilter={onSetFilter} />
      <MailList mails={mails} />
    </section>
  )
}
