const COLORS = {
  error: "#dc3545",
  success: "#28a745",
};

function MessageBox({ message }) {
  if (!message) {
    return null;
  }

  const textStyle = {
    color: COLORS[message.type] ?? COLORS.error,
    display: "inline",
  };

  return (
    <span className="error-message" style={textStyle}>
      {message.text}
    </span>
  );
}

export default MessageBox;