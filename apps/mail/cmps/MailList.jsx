export function MailList({ mails }) {
  return (
    <section className="mail-list">
      {mails.length === 0 && <p>No mails to show</p>}
      {mails.map(mail => (
        <MailPreview key={mail.id} mail={mail} />
      ))}
    </section>
  )
}
