export default function CommentList({ comments }) {
  if (!comments || comments.length === 0) {
    return <p style={{ color: 'var(--color-ink-muted)', fontSize: '0.88rem' }}>No comments yet.</p>;
  }

  return (
    <div>
      {comments.map((c) => (
        <div className="comment-item" key={c.id}>
          <div className="comment-meta">
            <strong>{c.author_name}</strong>
            <span className="comment-author-role">{c.author_role}</span>
            <span>{new Date(c.created_at).toLocaleString()}</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>{c.comment}</p>
        </div>
      ))}
    </div>
  );
}
