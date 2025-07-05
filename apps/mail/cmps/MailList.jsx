import { MailPreview } from './MailPreview.jsx'

export function MailList({ mails }) {
  if (!mails.length) return <div>No mail to show</div>

  return (
    <ul className="mail-list">
      {mails.map(mail => (
        <MailPreview key={mail.id} mail={mail} />
      ))}
    </ul>
  )
}
