import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { CalloutBox } from './CalloutBox';
import { ScriptBox } from './ScriptBox';
import { TableBlock } from './TableBlock';
import { ChapterDecorator } from './ChapterDecorator';
import { OptimizedImage } from '../common/OptimizedImage';
import { cn } from '@/lib/utils';

interface MarkdownChapterContentProps {
  markdown: string;
}

export const MarkdownChapterContent = ({ markdown }: MarkdownChapterContentProps) => {
  return (
    <div className="space-y-6 reading-content">
      <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[
        rehypeRaw,
        rehypeSanitize,
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: 'wrap' }]
      ]}
      components={{
        // Headings
        h1: ({ children, ...props }) => (
          <div>
            <ChapterDecorator />
            <h1 
              className="text-4xl md:text-5xl font-bold leading-tight mb-6 mt-8" 
              {...props}
            >
              {children}
            </h1>
            <div className="flex items-center gap-2 mb-6">
              <div className="h-1.5 w-20 bg-primary rounded-full" />
              <div className="h-1.5 w-1.5 bg-primary rounded-full" />
            </div>
          </div>
        ),
        h2: ({ children, ...props }) => (
          <h2 
            className="text-3xl md:text-4xl font-bold leading-tight mb-4 mt-8" 
            {...props}
          >
            {children}
          </h2>
        ),
        h3: ({ children, ...props }) => (
          <h3 
            className="text-2xl md:text-3xl font-bold leading-tight mb-3 mt-6" 
            {...props}
          >
            {children}
          </h3>
        ),
        h4: ({ children, ...props }) => (
          <h4 
            className="text-xl md:text-2xl font-bold leading-tight mb-2 mt-4" 
            {...props}
          >
            {children}
          </h4>
        ),

        // Paragraphs
        p: ({ children, ...props }) => (
          <p 
            className="text-foreground leading-relaxed whitespace-pre-line mb-4" 
            {...props}
          >
            {children}
          </p>
        ),

        // Links
        a: ({ href, children, ...props }) => (
          <a
            href={href}
            className="text-primary hover:text-primary/80 underline underline-offset-2 smooth-transition"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          >
            {children}
          </a>
        ),

        // Lists
        ul: ({ children, ...props }) => (
          <ul className="space-y-3 ml-2 mb-4" {...props}>
            {children}
          </ul>
        ),
        ol: ({ children, ...props }) => (
          <ol className="space-y-3 ml-6 mb-4 list-decimal" {...props}>
            {children}
          </ol>
        ),
        li: ({ children, ...props }) => {
          const parent = (props as any).node?.parent;
          const isUnordered = parent?.tagName === 'ul';
          
          if (isUnordered) {
            return (
              <li className="flex items-start gap-3" {...props}>
                <div className="w-2 h-2 bg-primary rounded-full mt-2.5 flex-shrink-0" />
                <span className="text-foreground">{children}</span>
              </li>
            );
          }
          
          return (
            <li className="text-foreground" {...props}>
              {children}
            </li>
          );
        },

        // Inline code
        code: ({ inline, className, children, ...props }: any) => {
          const match = /language-(\w+)/.exec(className || '');
          const language = match ? match[1] : '';

          // Script blocks
          if (!inline && language === 'script') {
            const content = String(children).replace(/\n$/, '');
            return <ScriptBox content={content.split('\n')} />;
          }

          // Inline code
          if (inline) {
            return (
              <code 
                className="px-1.5 py-0.5 bg-muted text-foreground rounded text-sm font-mono" 
                {...props}
              >
                {children}
              </code>
            );
          }

          // Regular code blocks
          return (
            <pre className="bg-secondary border border-border rounded-lg p-4 overflow-x-auto my-4">
              <code className="text-sm font-mono text-foreground" {...props}>
                {children}
              </code>
            </pre>
          );
        },

        // Blockquotes (Callouts)
        blockquote: ({ children, ...props }: any) => {
          const childText = String(children);
          
          // Detect callout type
          const noteMatch = childText.match(/\[!(NOTE|TRY|REMEMBER|WARNING|SCIENCE)\]/i);
          if (noteMatch) {
            const type = noteMatch[1].toLowerCase() as 'note' | 'try' | 'remember' | 'warning' | 'science';
            const content = childText.replace(/\[!(NOTE|TRY|REMEMBER|WARNING|SCIENCE)\]/i, '').trim();
            
            const typeMap: Record<string, 'science' | 'try' | 'remember' | 'warning'> = {
              'note': 'remember',
              'try': 'try',
              'remember': 'remember',
              'warning': 'warning',
              'science': 'science'
            };
            
            return <CalloutBox type={typeMap[type] || 'remember'} content={content} />;
          }

          // Regular blockquote
          return (
            <blockquote 
              className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4" 
              {...props}
            >
              {children}
            </blockquote>
          );
        },

        // Tables
        table: ({ children, ...props }: any) => {
          // Extract headers and rows
          const thead = (props as any).node?.children?.find((child: any) => child.tagName === 'thead');
          const tbody = (props as any).node?.children?.find((child: any) => child.tagName === 'tbody');
          
          if (thead && tbody) {
            const headers: string[] = [];
            const rows: string[][] = [];

            // Extract headers
            thead.children?.forEach((tr: any) => {
              tr.children?.forEach((th: any) => {
                if (th.children && th.children[0]) {
                  headers.push(String(th.children[0].value || ''));
                }
              });
            });

            // Extract rows
            tbody.children?.forEach((tr: any) => {
              const row: string[] = [];
              tr.children?.forEach((td: any) => {
                if (td.children && td.children[0]) {
                  row.push(String(td.children[0].value || ''));
                }
              });
              if (row.length > 0) rows.push(row);
            });

            if (headers.length > 0 && rows.length > 0) {
              return <TableBlock data={{ headers, rows }} />;
            }
          }

          // Fallback to default table rendering
          return (
            <div className="my-8 overflow-x-auto">
              <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm">
                {children}
              </table>
            </div>
          );
        },

        // Images
        img: ({ src, alt, ...props }) => (
          <div className="my-8">
            <OptimizedImage
              src={src || ''}
              alt={alt || 'Content image'}
              className="w-full rounded-2xl shadow-lg"
            />
          </div>
        ),

        // Strong and emphasis
        strong: ({ children, ...props }) => (
          <strong className="font-bold" {...props}>{children}</strong>
        ),
        em: ({ children, ...props }) => (
          <em className="italic" {...props}>{children}</em>
        ),

        // Horizontal rule
        hr: ({ ...props }) => (
          <hr className="my-8 border-border" {...props} />
        ),
      }}
    >
      {markdown}
    </ReactMarkdown>
    </div>
  );
};
