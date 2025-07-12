const { useState, useEffect, useRef } = React
const { useParams, useNavigate, useLocation } = ReactRouterDOM
import { mailService } from '../services/mail.service.js'
import { MailFolderList } from '../cmps/MailFolderList.jsx'

export function MailDetails() {
  const [mail, setMail] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const sidebarRef = useRef()
  const { mailId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    mailService.get(mailId).then(mail => {
      setMail(mail)
      if (!mail.isRead) {
        mail.isRead = true
        mailService.save(mail)
      }
    })
  }, [mailId])

  useEffect(() => {
    function onClickOutside(event) {
      if (isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false)
      }
    }
    window.addEventListener('click', onClickOutside)
    return () => window.removeEventListener('click', onClickOutside)
  }, [isSidebarOpen])

  function onBack() {
    const folder = (location.state && location.state.folder) || 'inbox'
    navigate(`/mail?status=${folder}`)
  }

  function toggleSidebar() {
    setIsSidebarOpen(prev => !prev)
  }

  if (!mail) return <div>Loading...</div>

  return (
    <section className="mail-details-page">
      <aside
        ref={sidebarRef}
        className={`mail-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}
      >
        <MailFolderList
          currentStatus={(location.state && location.state.folder) || 'inbox'}
          onSetFolder={(folder) => navigate(`/mail?status=${folder}`)}
        />
      </aside>

      <main className="mail-details">
        <header className="mail-details-header">
          <button className="material-symbols-outlined" onClick={onBack}>arrow_back</button>
          <button className="material-symbols-outlined" onClick={() => mailService.remove(mail.id).then(() => navigate('/mail'))}>delete</button>
        </header>

        <div className="mail-details-content">
          <h1 className="mail-subject">{mail.subject}</h1>
          <div className="mail-meta">
            <span className="mail-from">{mail.from}</span>
            <span className="mail-date">{mail.sentAt ? new Date(mail.sentAt).toLocaleString() : ''}</span>
          </div>
          <p className="mail-body">{mail.body}</p>
        </div>
      </main>
    </section>
  )
}
