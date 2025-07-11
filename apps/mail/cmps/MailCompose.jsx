const { useState, useEffect } = React
import { utilService } from '../../../services/util.service.js'
import { mailService } from '../services/mail.service.js'

export function MailCompose({ mail, onClose, onSend, onSaveDraft }) {
 
  const [to, setTo] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')

  useEffect(() => {
    if (mail) {
      setTo(mail.to || '')
      setSubject(mail.subject || '')
      setBody(mail.body || '')
    } else {
      setTo('')
      setSubject('')
      setBody('')
    }
  }, [mail])

  function handleSend() {
  const mailToSend = {
    id: (mail && mail.id) ? mail.id : utilService.makeId(),
    to,
    from: mailService.getLoggedinUser().email,
    subject,
    body,
    status: 'sent',
    isRead: true,
    isStarred: false,
    sentAt: Date.now(),
    removedAt: null,
  }
  onSend(mailToSend)
}

  function handleSaveDraft() {
  const draftMail = {
    id: (mail && mail.id) ? mail.id : utilService.makeId(),
    to,
    from: mailService.getLoggedinUser().email,
    subject,
    body,
    status: 'draft',
    isRead: true,
    isStarred: false,
    sentAt: null,
    removedAt: null,
  }
  onSaveDraft(draftMail)
}

  return (
    <section className="mail-compose">
      <div className="compose-header">
        <h2>New Message</h2>
        <button className="close-btn material-symbols-outlined" onClick={onClose}>
          close
        </button>
      </div>

      <div className="compose-body">
        <label>
          To:
          <input
            type="email"
            value={to}
            onChange={e => setTo(e.target.value)}
            placeholder="Recipient"
          />
        </label>

        <label>
          Subject:
          <input
            type="text"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder="Subject"
          />
        </label>

        <label>
          Body:
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Write your message..."
          />
        </label>
      </div>

      <div className="compose-actions">
        <button className="send-btn" onClick={handleSend}>
          Send
        </button>
        <button className="draft-btn" onClick={handleSaveDraft}>
          <span className="material-symbols-outlined">save</span>
        </button>

        <button className="discard-btn" onClick={onClose}>
          <span className="material-symbols-outlined">delete</span>
        </button>
      </div>
    </section>
  )
}

