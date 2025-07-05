const { useState, useEffect } = React
const { useParams, useNavigate } = ReactRouterDOM

import { mailService } from '../services/mail.service.js'

export function MailDetails() {
  const [mail, setMail] = useState(null)
  const { mailId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    mailService.get(mailId).then(setMail)
  }, [mailId])

  function onBack() {
    navigate('/mail')
  }

  function onDelete() {
    mailService.remove(mailId).then(() => navigate('/mail'))
  }

  if (!mail) return <div className="mail-details">Loading...</div>

  return (
    <section className="mail-details">
      <header className="mail-details-header">
        <button className="material-icons" onClick={onBack}>arrow_back</button>
        <button className="material-icons" onClick={onDelete}>delete</button>
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
