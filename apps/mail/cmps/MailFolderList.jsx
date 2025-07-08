export function MailFolderList({ currentStatus, onSetFolder }) {
  const folders = [
    { key: 'inbox', label: 'Inbox', icon: 'inbox' },
    { key: 'sent', label: 'Sent', icon: 'send' },
    { key: 'trash', label: 'Trash', icon: 'delete' },
    { key: 'draft', label: 'Drafts', icon: 'draft' },
  ]

  return (
    <nav className="mail-folder-list">
      {folders.map(folder => (
        <button
          key={folder.key}
          className={`folder-btn ${folder.key === currentStatus ? 'active' : ''}`}
          onClick={() => onSetFolder(folder.key)}
        >
          <span className="material-symbols-outlined">{folder.icon}</span>
          <span>{folder.label}</span>
        </button>
      ))}
    </nav>
  )
}
