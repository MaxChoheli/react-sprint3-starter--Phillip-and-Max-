const { useState, useEffect } = React
import { MailFilter } from '../cmps/MailFilter.jsx'
import { MailList } from '../cmps/MailList.jsx'
import { MailFolderList } from '../cmps/MailFolderList.jsx'
import { MailCompose } from '../cmps/MailCompose.jsx'
import { mailService } from '../services/mail.service.js'
const { useNavigate } = ReactRouterDOM

export function MailIndex() {
  const navigate = useNavigate()

  const [mails, setMails] = useState([])
  const [filterBy, setFilterBy] = useState({ status: 'inbox', txt: '', isRead: null })
  const [isComposing, setIsComposing] = useState(false)
  const [draftToEdit, setDraftToEdit] = useState(null)
  const [sortBy, setSortBy] = useState({ field: 'date', direction: 'desc' })

  useEffect(() => {
    mailService.initDemoData().then(loadAndSortMails)
  }, [filterBy, sortBy])

  function loadAndSortMails() {
    mailService.query(filterBy).then(mails => {
      const sortedMails = [...mails].sort((a, b) => {
        if (sortBy.field === 'date') {
          return sortBy.direction === 'asc' ? a.sentAt - b.sentAt : b.sentAt - a.sentAt
        } else if (sortBy.field === 'title') {
          return sortBy.direction === 'asc'
            ? a.subject.localeCompare(b.subject)
            : b.subject.localeCompare(a.subject)
        }
      })
      setMails(sortedMails)
    })
  }

  function onSetFolder(status) {
    setFilterBy(prev => ({ ...prev, status }))
  }

  function onToggleStarred(mail) {
    mailService.toggleStarred(mail).then(loadAndSortMails)
  }

  function onToggleRead(mail) {
    mail.isRead = !mail.isRead
    mailService.save(mail).then(loadAndSortMails)
  }

  function onRemoveMail(mailId) {
    mailService.remove(mailId).then(loadAndSortMails)
  }

  function onMailClick(mail) {
    if (mail.status === 'draft') {
      setDraftToEdit(mail)
      setIsComposing(true)
    } else {
      navigate(`/mail/${mail.id}`)
    }
  }

  function onSend(mail) {
    mailService.send(mail).then(() => {
      setIsComposing(false)
      setDraftToEdit(null)
      loadAndSortMails()
    })
  }

  function onSaveDraft(mail) {
    mail.status = 'draft'
    mailService.saveDraft(mail).then(() => {
      setIsComposing(false)
      setDraftToEdit(null)
      loadAndSortMails()
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
        <MailFilter
          filterBy={filterBy}
          onSetFilter={setFilterBy}
          sortBy={sortBy}
          onSetSort={setSortBy}
        />

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
          onMailClick={onMailClick}
        />
      </main>
    </section>
  )
}
