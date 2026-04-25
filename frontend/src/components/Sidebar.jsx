import { useState } from 'react';

/**
 * Sidebar — lists conversations with create/delete actions.
 * Glassmorphism design with animated transitions.
 */
export default function Sidebar({
  conversations,
  activeId,
  onSelect,
  onCreate,
  onDelete,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      style={{
        width: isCollapsed ? '60px' : '280px',
        minWidth: isCollapsed ? '60px' : '280px',
        height: '100%',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(16px)',
        borderRight: '1px solid var(--glass-border)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width var(--transition-normal), min-width var(--transition-normal)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: isCollapsed ? '1rem 0.5rem' : '1.25rem 1rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          gap: '0.5rem',
        }}
      >
        {!isCollapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                fontSize: '1.25rem',
                background: 'var(--accent-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700,
              }}
            >
              🌿
            </span>
            <span
              style={{
                fontSize: '0.9375rem',
                fontWeight: 600,
                background: 'var(--accent-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Dendrite
            </span>
          </div>
        )}

        <button
          id="toggle-sidebar"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '0.375rem',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            transition: 'color var(--transition-fast)',
          }}
          onMouseEnter={(e) => (e.target.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {isCollapsed ? (
              <>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* New Chat button */}
      {!isCollapsed && (
        <div style={{ padding: '0.75rem 1rem' }}>
          <button
            id="new-chat-button"
            onClick={onCreate}
            style={{
              width: '100%',
              padding: '0.625rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed rgba(124, 58, 237, 0.4)',
              background: 'transparent',
              color: 'var(--accent-violet)',
              cursor: 'pointer',
              fontSize: '0.8125rem',
              fontWeight: 500,
              fontFamily: 'var(--font-sans)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(124, 58, 237, 0.1)';
              e.currentTarget.style.borderColor = 'var(--accent-violet)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.4)';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Chat
          </button>
        </div>
      )}

      {/* Collapsed new-chat icon */}
      {isCollapsed && (
        <div style={{ padding: '0.75rem', display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={onCreate}
            title="New Chat"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: 'rgba(124, 58, 237, 0.15)',
              color: 'var(--accent-violet)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
      )}

      {/* Conversation List */}
      {!isCollapsed && (
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '0 0.5rem 1rem',
          }}
        >
          {conversations.length === 0 && (
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.8125rem',
                textAlign: 'center',
                padding: '2rem 1rem',
              }}
            >
              No conversations yet.
              <br />
              Start a new chat!
            </p>
          )}

          {conversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isActive={conv.id === activeId}
              onSelect={() => onSelect(conv.id)}
              onDelete={() => onDelete(conv.id)}
            />
          ))}
        </div>
      )}
    </aside>
  );
}

/**
 * Single conversation list item.
 */
function ConversationItem({ conversation, isActive, onSelect, onDelete }) {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div
      className="animate-fade-in-left"
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0.625rem 0.75rem',
        marginBottom: '2px',
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        background: isActive ? 'var(--bg-surface-hover)' : 'transparent',
        borderLeft: isActive ? '3px solid var(--accent-violet)' : '3px solid transparent',
        transition: 'all var(--transition-fast)',
      }}
      onClick={onSelect}
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.background = 'var(--bg-surface)';
        setShowDelete(true);
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.background = 'transparent';
        setShowDelete(false);
      }}
    >
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <p
          style={{
            fontSize: '0.8125rem',
            fontWeight: isActive ? 500 : 400,
            color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            margin: 0,
          }}
        >
          {conversation.title}
        </p>
        <p
          style={{
            fontSize: '0.6875rem',
            color: 'var(--text-muted)',
            margin: 0,
            marginTop: '2px',
          }}
        >
          {new Date(conversation.created_at).toLocaleDateString()}
        </p>
      </div>

      {showDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title="Delete conversation"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            display: 'flex',
            flexShrink: 0,
            transition: 'color var(--transition-fast)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
            <path d="M9 6V4h6v2" />
          </svg>
        </button>
      )}
    </div>
  );
}
