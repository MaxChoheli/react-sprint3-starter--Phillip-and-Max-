export function MailFolderList({ currentStatus, onSetFolder }) {
  const folders = ['inbox', 'sent', 'trash', 'draft']

  return (
    <nav className="mail-folder-list">
      {folders.map(folder => (
        <button
          key={folder}
          className={folder === currentStatus ? 'active' : ''}
          onClick={() => onSetFolder(folder)}
        >
          {folder.charAt(0).toUpperCase() + folder.slice(1)}
        </button>
      ))}
    </nav>
  )
}
