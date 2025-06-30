const { useState, useEffect } = React

import { MailFilter } from '../cmps/MailFilter.jsx'
import { MailList } from '../cmps/MailList.jsx'
import { mailService } from '../services/mail.service.js'

export function MailIndex() {
  const [filterBy, setFilterBy] = useState({ txt: '', isRead: null })
  const [mails, setMails] = useState([])

  // When filterBy changes, fetch mails from mailService
  useEffect(() => {
    mailService.query(filterBy).then(setMails)
  }, [filterBy])

  // Called when MailFilter changes filter
  function onSetFilter(newFilter) {
    setFilterBy(newFilter)
  }

  return (
    <section className="container">Mail app
      <MailFilter onSetFilter={onSetFilter} />
      <MailList mails={mails} />
    </section>
  )
}