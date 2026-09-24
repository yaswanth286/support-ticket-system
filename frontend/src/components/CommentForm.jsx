import { useState } from 'react';

export default function CommentForm({ onSubmit, submitting }) {
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    setError('');
    onSubmit(comment.trim()).then(() => setComment(''));
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 12 }}>
      <div className="form-group">
        <textarea
          className="form-textarea"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a reply..."
        />
        {error && <div className="form-error">{error}</div>}
      </div>
      <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
        {submitting ? 'Posting...' : 'Post Comment'}
      </button>
    </form>
  );
}
