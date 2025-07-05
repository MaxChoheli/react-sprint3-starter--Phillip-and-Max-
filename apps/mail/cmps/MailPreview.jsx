const { useNavigate } = ReactRouterDOM

export function MailPreview({ mail, onToggleRead, onRemoveMail }) {
  const navigate = useNavigate()
  const isUnread = !mail.isRead

  function onPreviewClick(ev) {
    if (
      ev.target.closest('.action-btn') ||
      ev.target.closest('.star-btn') ||
      ev.target.closest('.mail-checkbox')
    )
      return

    if (isUnread) {
      onToggleRead({ ...mail, isRead: true }).then(() => {
        navigate(`/mail/${mail.id}`)
      })
    } else {
      navigate(`/mail/${mail.id}`)
    }
  }

  function onDelete(ev) {
    ev.stopPropagation()
    onRemoveMail(mail.id)
  }

  function onToggleReadIcon(ev) {
    ev.stopPropagation()
    onToggleRead({ ...mail, isRead: !mail.isRead })
  }

  return (
    <li className={`mail-item ${isUnread ? 'unread' : ''}`} onClick={onPreviewClick}>
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
          <button className="action-btn material-icons" onClick={onDelete} title="Delete mail">
            delete
          </button>
          <button
            className="action-btn material-icons"
            onClick={onToggleReadIcon}
            title={isUnread ? 'Mark as Read' : 'Mark as Unread'}
          >
            {isUnread ? 'mark_email_read' : 'mark_email_unread'}
          </button>
          <button className="action-btn material-icons">snooze</button>
        </div>
      </div>
    </li>
  )
}
