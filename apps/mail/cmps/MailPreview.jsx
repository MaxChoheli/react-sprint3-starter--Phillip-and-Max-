const { useNavigate } = ReactRouterDOM

export function MailPreview({ mail, onMailClick, onToggleRead, onRemoveMail, onToggleStarred }) {
  const navigate = useNavigate()
  const isUnread = !mail.isRead

  function onPreviewClick(ev) {
    if (
      ev.target.closest('.action-btn') ||
      ev.target.closest('.star-btn') ||
      ev.target.closest('.mail-checkbox')
    )
      return

    onMailClick(mail)
  }

  function onDelete(ev) {
    ev.stopPropagation()
    onRemoveMail(mail.id)
  }

  function onToggleReadIcon(ev) {
    ev.stopPropagation()
    onToggleRead(mail)
  }

  function onStarClick(ev) {
    ev.stopPropagation()
    onToggleStarred(mail)
  }

  function formatSentAt(timestamp) {
    if (!timestamp) return ''

    const sentDate = new Date(timestamp)
    const now = new Date()

    if (
      sentDate.getDate() === now.getDate() &&
      sentDate.getMonth() === now.getMonth() &&
      sentDate.getFullYear() === now.getFullYear()
    ) {
      return sentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    return sentDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }

  return (
    <li className={`mail-item ${!mail.isRead ? 'unread' : ''}`} onClick={onPreviewClick}>
      <div className="mail-left">
        <input type="checkbox" className="mail-checkbox" />
        <button
          className="star-btn material-icons"
          style={{ color: mail.isStarred ? 'gold' : 'grey' }}
          onClick={onStarClick}
        >
          {mail.isStarred ? 'star' : 'star_outline'}
        </button>
      </div>

      <span className="mail-from">{mail.from}</span>

      <div className="mail-center" title={`${mail.from} - ${mail.subject} - ${mail.body}`}>
        <div className="mail-info">
          <span className="mail-subject">{mail.subject}</span>
          <span className="mail-snippet">- {mail.body}</span>
        </div>
      </div>

      <div className="mail-right">
        <span className="mail-sent-at">{formatSentAt(mail.sentAt)}</span>
        <div className="mail-actions">
          <button
            className="action-btn material-symbols-outlined"
            onClick={(ev) => {
              ev.stopPropagation()
              window.location.href = `#/note?txt=${encodeURIComponent(mail.body)}&title=${encodeURIComponent(mail.subject)}&label=mail`
            }}
            title="Save as Note"
          >
            note_add
          </button>

          <button className="action-btn material-symbols-outlined" onClick={onDelete} title="Delete mail">
            delete
          </button>
          <button
            className="action-btn material-symbols-outlined"
            onClick={onToggleReadIcon}
            title={isUnread ? 'Mark as Read' : 'Mark as Unread'}
          >
            {isUnread ? 'mark_email_read' : 'mark_email_unread'}
          </button>
          <button className="action-btn material-symbols-outlined">snooze</button>
        </div>
      </div>
    </li>
  )
}
