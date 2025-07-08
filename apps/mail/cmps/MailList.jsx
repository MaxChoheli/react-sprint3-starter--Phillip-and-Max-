import { MailPreview } from './MailPreview.jsx'

export function MailList({ mails, onMailClick, onToggleStarred, onToggleRead, onRemoveMail }) {
  return (
    <ul className="mail-list">
      {mails.map(mail => (
        <MailPreview
          key={mail.id}
          mail={mail}
          onMailClick={onMailClick} 
          onToggleStarred={onToggleStarred}
          onToggleRead={onToggleRead}
          onRemoveMail={onRemoveMail}
        />
      ))}
    </ul>
  )
}
