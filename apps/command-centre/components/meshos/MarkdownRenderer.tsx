/**
 * MarkdownRenderer Component
 * Renders markdown content with Flow State styling
 */

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Simple markdown parsing (for production, use a library like react-markdown)
  const parseMarkdown = (text: string) => {
    // Bold
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Code
    text = text.replace(/`(.*?)`/g, '<code>$1</code>');
    // Line breaks
    text = text.replace(/\n/g, '<br/>');

    return text;
  };

  return (
    <div
      style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '0.875rem',
        lineHeight: '1.6',
        color: '#D1D5DB',
      }}
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
      className="markdown-renderer"
    >
      <style jsx global>{`
        .markdown-renderer strong {
          color: #F9FAFB;
          font-weight: 600;
        }
        .markdown-renderer em {
          color: #9CA3AF;
          font-style: italic;
        }
        .markdown-renderer code {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85em;
          padding: 0.15rem 0.4rem;
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          color: #3AA9BE;
        }
      `}</style>
    </div>
  );
}
