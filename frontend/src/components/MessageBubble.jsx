import MarkdownRenderer from './MarkdownRenderer';

/**
 * A single chat message bubble.
 * User messages: right-aligned, violet gradient.
 * Assistant messages: left-aligned, dark surface with markdown.
 */
export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div
      className="animate-fade-in"
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: '1rem',
        paddingLeft: isUser ? '3rem' : '0',
        paddingRight: isUser ? '0' : '3rem',
      }}
    >
      <div
        style={{
          maxWidth: '80%',
          padding: '0.875rem 1.125rem',
          borderRadius: isUser
            ? 'var(--radius-lg) var(--radius-lg) 4px var(--radius-lg)'
            : 'var(--radius-lg) var(--radius-lg) var(--radius-lg) 4px',
          background: isUser
            ? 'linear-gradient(135deg, #7c3aed, #6d28d9)'
            : 'var(--bg-ai-bubble)',
          color: isUser ? '#fff' : 'var(--text-primary)',
          border: isUser ? 'none' : '1px solid var(--border-subtle)',
          boxShadow: isUser ? 'var(--shadow-glow)' : 'var(--shadow-card)',
          fontSize: '0.9375rem',
          lineHeight: '1.6',
          wordBreak: 'break-word',
        }}
      >
        {/* Role label */}
        <div
          style={{
            fontSize: '0.7rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '0.375rem',
            color: isUser ? 'rgba(255,255,255,0.7)' : 'var(--accent-cyan)',
          }}
        >
          {isUser ? 'You' : 'Dendrite AI'}
        </div>

        {isUser ? (
          <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{message.content}</p>
        ) : (
          <MarkdownRenderer content={message.content} />
        )}
      </div>
    </div>
  );
}
