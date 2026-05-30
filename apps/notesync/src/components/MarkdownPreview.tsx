import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type MarkdownPreviewProps = {
  content: string
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <div className="prose prose-sm max-w-none p-8 h-full overflow-y-auto">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content || '*Nothing to preview*'}
      </ReactMarkdown>
    </div>
  )
}