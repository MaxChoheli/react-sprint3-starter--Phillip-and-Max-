const { useState } = React
import { mailService } from '../services/mail.service.js'

export function MailCompose({ onSend, onClose }) {
  const [mailToSend, setMailToSend] = useState({
    to: '',
    subject: '',
    body: '',
  })

  function handleChange(ev) {
    const { name, value } = ev.target
    setMailToSend(prev => ({ ...prev, [name]: value }))
  }

  function onSubmit(ev) {
    ev.preventDefault()
    const newMail = mailService.createMailToSend(mailToSend.to, mailToSend.subject, mailToSend.body)
    mailService.send(newMail).then(() => {
      if (onSend) onSend()
      setMailToSend({ to: '', subject: '', body: '' })
    })
  }

  return (
    <section className="mail-compose">
      <div className="compose-header">
        <h2>New Message</h2>
        <button className="close-btn" onClick={onClose}>
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <form onSubmit={onSubmit}>
        <input
          type="email"
          name="to"
          placeholder="To"
          value={mailToSend.to}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={mailToSend.subject}
          onChange={handleChange}
        />
        <textarea
          name="body"
          placeholder="Body"
          value={mailToSend.body}
          onChange={handleChange}
        ></textarea>

        <button className="send-btn" type="submit">
          <span className="material-symbols-outlined">send</span>
          Send
        </button>
      </form>
    </section>
  )
}

