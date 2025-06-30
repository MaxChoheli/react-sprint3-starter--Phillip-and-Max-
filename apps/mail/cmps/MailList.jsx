export function MailList({ mails }) {
  if (!mails.length) return <div>No mail to show</div>

  return (
    <ul className="mail-list">
      {mails.map(mail => (
        <li key={mail.id} className={mail.isRead ? 'read' : 'unread'}>
          <h4>{mail.subject}</h4>
          <p>{mail.body}</p>
        </li>
      ))}
    </ul>
  )
}