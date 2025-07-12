const { useState, useRef, useEffect } = React
import { MailFolderList } from '../cmps/MailFolderList.jsx'
import { MailFilter } from '../cmps/MailFilter.jsx'
import { MailCompose } from '../cmps/MailCompose.jsx'
import { MailList } from '../cmps/MailList.jsx'
import { mailService } from '../services/mail.service.js'

const { useNavigate, useLocation } = ReactRouterDOM

export function MailIndex() {
  console.log('MailIndex rendered')
  const [mails, setMails] = useState([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isComposing, setIsComposing] = useState(false)
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const isComposeRoute = location.pathname === '/mail/compose'
  const initialStatus = queryParams.get('status') || 'inbox'
  const [filterBy, setFilterBy] = useState({ txt: '', isRead: null, status: initialStatus })
  const [sortBy, setSortBy] = useState({ field: 'date', direction: 'desc' })
  const sidebarRef = useRef()
  const navigate = useNavigate()
  const [draftToEdit, setDraftToEdit] = useState(null)

  useEffect(() => {
    mailService.initDemoData().then(() => {
      mailService.query(filterBy, sortBy).then(setMails)
    })
  }, [])

  // reload mails when filters or sorting changes
  useEffect(() => {
    mailService.query(filterBy, sortBy).then(setMails)
  }, [filterBy, sortBy])

  function toggleSidebar() {
    console.log('Hamburger clicked, toggling sidebar')
    setIsSidebarOpen(prev => !prev)
  }

  function onSetFolder(status) {
    setFilterBy(prev => ({ ...prev, status }))
    setIsSidebarOpen(false)
  }

  function onToggleCompose() {
    setIsComposing(prev => !prev)
  }

  function onMailClick(mail) {
    if (mail.status === 'draft') {
      setDraftToEdit(mail)
      setIsComposing(true)
    } else {
      navigate(`/mail/${mail.id}`, { state: { folder: filterBy.status } })
    }
  }

  function onToggleStarred(mail) {
    const updated = { ...mail, isStarred: !mail.isStarred }
    mailService.save(updated).then(() =>
      setMails(prev => prev.map(m => (m.id === mail.id ? updated : m)))
    )
  }

  function onToggleRead(mail) {
    const updated = { ...mail, isRead: !mail.isRead }
    mailService.save(updated).then(() =>
      setMails(prev => prev.map(m => (m.id === mail.id ? updated : m)))
    )
  }

  function onRemoveMail(mailId) {
    mailService.remove(mailId).then(() =>
      setMails(prev => prev.filter(m => m.id !== mailId))
    )
  }

  function onSend(mailToSend) {
    const updatedMail = { ...mailToSend, status: 'sent', sentAt: Date.now() }

    mailService.save(updatedMail).then(savedMail => {
      setIsComposing(false)
      setDraftToEdit(null)
      setFilterBy(prev => ({ ...prev, status: 'sent' }))
    })
  }

  function onSaveDraft(draftMail) {
    mailService.save(draftMail).then(() => {
      setIsComposing(false)
      setMails(prev => [draftMail, ...prev])
    })
  }

  useEffect(() => {
    function onClickOutside(event) {
      if (isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false)
      }
    }
    window.addEventListener('click', onClickOutside)
    return () => window.removeEventListener('click', onClickOutside)
  }, [isSidebarOpen])

  return (
    <section className="mail-index">

      <aside
        ref={sidebarRef}
        className={`mail-sidebar ${isSidebarOpen ? 'open' : ''}`}
      >
        <button className="compose-btn" onClick={onToggleCompose}>
          <span className="material-icons">edit</span> Compose
        </button>
        <MailFolderList currentStatus={filterBy.status} onSetFolder={onSetFolder} />
      </aside>

      <main className="mail-main">
        <div className="mail-filter-wrapper">
          <MailFilter
            filterBy={filterBy}
            onSetFilter={setFilterBy}
            sortBy={sortBy}
            onSetSort={setSortBy}
            onToggleSidebar={toggleSidebar}
          />
        </div>

        {(isComposing || isComposeRoute) && (
          <MailCompose
            mail={draftToEdit}
            onClose={() => {
              setIsComposing(false)
              setDraftToEdit(null)
              navigate('/mail')
            }}
            onSend={onSend}
            onSaveDraft={onSaveDraft}
          />
        )}

        <MailList
          mails={mails}
          onMailClick={onMailClick}
          onToggleStarred={onToggleStarred}
          onToggleRead={onToggleRead}
          onRemoveMail={onRemoveMail}
        />
      </main>
    </section>
  )
}
