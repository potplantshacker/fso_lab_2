export const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="notification">
      {message}
    </div>
  )
}

export const NotificationError = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="notification error">
      {message}
    </div>
  )
}