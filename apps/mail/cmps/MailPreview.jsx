export function MailPreview({ mail }) {
  const isUnread = !mail.isRead

  return (
    <li className={`mail-item ${isUnread ? 'unread' : ''}`}>
      <div className="mail-left">
        <input type="checkbox" className="mail-checkbox" />
        <button className="star-btn material-icons">star_border</button>
      </div>

      <div className="mail-center">
        <span className="mail-from">{mail.from}</span>
        <div className="mail-info">
          <span className="mail-subject">{mail.subject}</span>
          <span className="mail-snippet"> - {mail.body}</span>
        </div>
      </div>

      <div className="mail-right">
        <div className="mail-actions">
          <button className="action-btn material-icons">archive</button>
          <button className="action-btn material-icons">delete</button>
          <button className="action-btn material-icons">
            {isUnread ? 'mark_email_read' : 'mark_email_unread'}
          </button>
          <button className="action-btn material-icons">snooze</button>
        </div>
      </div>
    </li>
  )
}

