const { useState, useEffect } = React
const { useParams, useNavigate, useLocation } = ReactRouterDOM
import { mailService } from '../services/mail.service.js'

export function MailDetails() {
  const [mail, setMail] = useState(null)
  const { mailId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    mailService.get(mailId).then(mail => {
      setMail(mail)
      // Mark as read if not already
      if (!mail.isRead) {
        mail.isRead = true
        mailService.save(mail) // save update so it persists
      }
    })
  }, [mailId])

    function onBack() {
    const folder = (location.state && location.state.folder) || 'inbox'
    navigate(`/mail?status=${folder}`)
  }

  function onDelete() {
    mailService.remove(mailId).then(() => navigate('/mail'))
  }

  if (!mail) return <div className="mail-details">Loading...</div>

  return (
    <section className="mail-details">
      <header className="mail-details-header">
        <button className="material-symbols-outlined" onClick={onBack}>arrow_back</button>
        <button className="material-symbols-outlined" onClick={onDelete}>delete</button>
      </header>

      <div className="mail-details-content">
        <h1 className="mail-subject">{mail.subject}</h1>
        <div className="mail-meta">
          <span className="mail-from">{mail.from}</span>
          <span className="mail-date">
            {new Date(mail.sentAt).toLocaleString()}
          </span>
        </div>
        <p className="mail-body">{mail.body}</p>
      </div>
    </section>
  )
}
