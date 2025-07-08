const { useState, useEffect } = React

import { MailFilter } from '../cmps/MailFilter.jsx'
import { MailList } from '../cmps/MailList.jsx'
import { MailFolderList } from '../cmps/MailFolderList.jsx'
import { MailCompose } from '../cmps/MailCompose.jsx'
console.log('MailCompose =', MailCompose)
import { mailService } from '../services/mail.service.js'
const { useNavigate } = ReactRouterDOM

export function MailIndex() {

  const navigate = useNavigate()

  const [mails, setMails] = useState([])
  const [filterBy, setFilterBy] = useState({ status: 'inbox', txt: '', isRead: null })
  const [isComposing, setIsComposing] = useState(false)
  const [draftToEdit, setDraftToEdit] = useState(null)

  useEffect(() => {
    loadMails()
  }, [filterBy])

  function loadMails() {
    mailService.query(filterBy).then(setMails)
  }

  function onSetFolder(status) {
    setFilterBy(prev => ({ ...prev, status }))
  }

  function onToggleStarred(mail) {
    mailService.toggleStarred(mail).then(loadMails)
  }

  function onToggleRead(mail) {
    mail.isRead = !mail.isRead
    mailService.save(mail).then(loadMails)
  }

  function onRemoveMail(mailId) {
    mailService.remove(mailId).then(loadMails)
  }

  // When user clicks a mail item
  function onMailClick(mail) {
    if (mail.status === 'draft') {
      setDraftToEdit(mail)
      setIsComposing(true)
    } else {
      navigate(`/mail/${mail.id}`)
      console.log('Open mail details for:', mail.id)
    }
  }

  function onSend(mail) {
    mailService.send(mail).then(() => {
      setIsComposing(false)
      setDraftToEdit(null)
      loadMails()
    })
  }

  function onSaveDraft(mail) {
    mail.status = 'draft'
    mailService.saveDraft(mail).then(() => {
      setIsComposing(false)
      setDraftToEdit(null)
      loadMails()
    })
  }

  function onCloseCompose() {
    setIsComposing(false)
    setDraftToEdit(null)
  }

  function onToggleCompose() {
    setDraftToEdit(null)
    setIsComposing(prev => !prev)
  }

  return (
    <section className="mail-index">
      <aside className="mail-sidebar">
        <button className="compose-btn" onClick={onToggleCompose}>
          <span className="material-icons">edit</span> Compose
        </button>
        <MailFolderList currentStatus={filterBy.status} onSetFolder={onSetFolder} />
      </aside>

      <main className="mail-main">
        <MailFilter filterBy={filterBy} onSetFilter={setFilterBy} />

        {isComposing && (
          <MailCompose
            mail={draftToEdit}
            onSend={onSend}
            onSaveDraft={onSaveDraft}
            onClose={onCloseCompose}
          />
        )}

        <MailList
          mails={mails}
          onToggleStarred={onToggleStarred}
          onToggleRead={onToggleRead}
          onRemoveMail={onRemoveMail}
          onMailClick={onMailClick}  // pass this to detect draft clicks
        />
      </main>
    </section>
  )
}
