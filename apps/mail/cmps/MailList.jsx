
import { MailPreview } from './MailPreview.jsx'

export function MailList({ mails, onToggleRead, onRemoveMail }) {
  if (!mails.length) return <div>No mail to show</div>

  return (
    <ul className="mail-list">
      {mails.map(mail => (
        <MailPreview
          key={mail.id}
          mail={mail}
          onToggleRead={onToggleRead}
          onRemoveMail={onRemoveMail}
        />
      ))}
    </ul>
  )
}
