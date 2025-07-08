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
    onToggleRead({ ...mail, isRead: !mail.isRead })
  }

  function onStarClick(ev) {
    ev.stopPropagation()
    onToggleStarred(mail)
  }

  return (
    <li className={`mail-item ${isUnread ? 'unread' : ''}`} onClick={onPreviewClick}>
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

      <div className="mail-center">
        <span className="mail-from">{mail.from}</span>
        <div className="mail-info">
          <span className="mail-subject">{mail.subject}</span>
          <span className="mail-snippet"> - {mail.body}</span>
        </div>
      </div>

      <div className="mail-right">
        <div className="mail-actions">
          <button className="action-btn material-symbols-outlined">archive</button>
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