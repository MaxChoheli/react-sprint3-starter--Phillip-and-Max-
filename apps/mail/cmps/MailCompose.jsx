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
      const params = new URLSearchParams(window.location.hash.split('?')[1])
      setTo('')
      setSubject(params.get('subject') || '')
      setBody(params.get('body') || '')
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
        <h2>New Email</h2>
        <button className="close-btn material-symbols-outlined" onClick={onClose}>
          close
        </button>
      </div>

      <div className="form-group">
        <label htmlFor="to">To:</label>
        <input
          id="to"
          type="email"
          value={to}
          onChange={e => setTo(e.target.value)}
          placeholder="Recipient"
        />
      </div>

      <div className="form-group">
        <label htmlFor="subject">Subject:</label>
        <input
          id="subject"
          type="text"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          placeholder="Subject"
        />
      </div>

      <div className="form-group">
        <label htmlFor="body">Body:</label>
        <textarea
          id="body"
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Write your message..."
        />
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

