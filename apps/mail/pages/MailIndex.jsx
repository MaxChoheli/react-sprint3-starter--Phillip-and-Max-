const { useState, useEffect } = React

import { MailFilter } from '../cmps/MailFilter.jsx'
import { MailList } from '../cmps/MailList.jsx'
import { mailService } from '../services/mail.service.js'

export function MailIndex() {
  const [filterBy, setFilterBy] = useState({ status: '', txt: '', isRead: null })
  const [mails, setMails] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // On mount, seed demo mails and load mails
  useEffect(() => {
    mailService.initDemoData().then(() => {
      loadMails(filterBy)
      setIsLoading(false)
    })
  }, [])

  // Reload mails whenever filter changes
  useEffect(() => {
    loadMails(filterBy)
  }, [filterBy])

  function loadMails(filter) {
    mailService.query(filter).then(setMails)
  }

  function onSetFilter(newFilter) {
    setFilterBy(newFilter)
  }

  if (isLoading) return <div>Loading mails...</div>

  return (
    <section className="container mail-index">
      <h2>Mail app</h2>
      <MailFilter filterBy={filterBy} onSetFilter={onSetFilter} />
      <MailList mails={mails} />
    </section>
  )
}

