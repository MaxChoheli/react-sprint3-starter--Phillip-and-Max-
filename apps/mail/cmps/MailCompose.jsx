const { useState, useEffect } = React
import { utilService } from '../../../services/util.service.js'

export function MailCompose({ mail, onClose, onSend, onSaveDraft }) {
  // Initialize empty state to avoid errors
  const [to, setTo] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')

  // When mail prop changes (new mail or draft), populate form fields
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
    const mailToSend = { ...mail, to, subject, body, status: 'sent' }
    onSend(mailToSend)
  }

  function handleSaveDraft() {
    const draftMail = {
      ...mail,
      id: mail && mail.id ? mail.id : utilService.makeId(),
      to,
      subject,
      body,
      status: 'draft',
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

