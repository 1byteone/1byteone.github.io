import type React from "react"

// Paragraph component
export const Paragraph: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ children, className, ...props }) => {
  return (
    <p className={`my-4 text-term-white ${className || ""}`} {...props}>
      {children}
    </p>
  )
}

// Span component
interface SpanProps extends React.HTMLAttributes<HTMLSpanElement> {
  annotations?: {
    bold?: boolean
    italic?: boolean
    strikethrough?: boolean
    underline?: boolean
    code?: boolean
    color?: string
  }
}

export const Span: React.FC<SpanProps> = ({ children, annotations = {}, className, ...props }) => {
  let classes = className || ""

  if (annotations.bold) classes += " font-bold"
  if (annotations.italic) classes += " italic"
  if (annotations.strikethrough) classes += " line-through"
  if (annotations.underline) classes += " underline"
  if (annotations.code) classes += " font-mono bg-term-darker px-1 py-0.5 rounded"

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  )
}

// Heading component
interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  type: string
  id: string
}

export const Heading: React.FC<HeadingProps> = ({ children, type, id, className, ...props }) => {
  const classes = `font-bold text-term-cyan ${className || ""}`

  switch (type) {
    case "heading_1":
      return (
        <h1 id={id} className={`text-3xl mt-8 mb-4 ${classes}`} {...props}>
          {children}
        </h1>
      )
    case "heading_2":
      return (
        <h2 id={id} className={`text-2xl mt-6 mb-3 ${classes}`} {...props}>
          {children}
        </h2>
      )
    case "heading_3":
      return (
        <h3 id={id} className={`text-xl mt-5 mb-2 ${classes}`} {...props}>
          {children}
        </h3>
      )
    default:
      return (
        <h3 id={id} className={`text-lg mt-4 mb-2 ${classes}`} {...props}>
          {children}
        </h3>
      )
  }
}

// Blockquote component
export const Blockquote: React.FC<React.HTMLAttributes<HTMLQuoteElement>> = ({ children, className, ...props }) => {
  return (
    <blockquote
      className={`
        relative p-6 my-6 
        bg-term-darker/50 
        border border-term-cyan/30
        rounded-lg
        text-term-white
        ${className || ""}
      `}
      {...props}
    >
      {children}
    </blockquote>
  )
}

// Callout component
interface CalloutProps extends React.HTMLAttributes<HTMLDivElement> {
  emoji?: string
}

export const Callout: React.FC<CalloutProps> = ({ children, emoji, className, ...props }) => {
  return (
    <div className={`flex p-4 my-4 bg-term-darker border border-term-cyan/20 rounded-lg ${className || ""}`} {...props}>
      {emoji && <div className="mr-2">{emoji}</div>}
      <div>{children}</div>
    </div>
  )
}

// Image component
interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  caption?: React.ReactNode
}

export const Image: React.FC<ImageProps> = ({ src, alt, caption, className, ...props }) => {
  return (
    <figure className={`my-6 ${className || ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- Notion image URLs are dynamic and may be external/unoptimized */}
      <img
        src={src || "/placeholder.svg"}
        alt={alt || ""}
        className="w-full h-auto rounded-lg max-w-3xl mx-auto"
        {...props}
      />
      {caption && <figcaption className="text-center text-sm mt-2 text-term-white">{caption}</figcaption>}
    </figure>
  )
}

// CodeBlock component
interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  language?: string
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ children, language, className, ...props }) => {
  return (
    <pre
      className={`p-4 my-4 bg-term-darker border border-term-cyan/20 overflow-x-auto font-mono text-term-white rounded-lg ${className || ""}`}
      {...props}
    >
      {language && <div className="text-xs text-term-cyan mb-2">{language}</div>}
      <code>{children}</code>
    </pre>
  )
}

// UnorderedList component
export const UnorderedList: React.FC<React.HTMLAttributes<HTMLUListElement>> = ({ children, className, ...props }) => {
  return (
    <ul className={`list-disc pl-6 my-4 text-term-white ${className || ""}`} {...props}>
      {children}
    </ul>
  )
}

// OrderedList component
interface OrderedListProps extends React.HTMLAttributes<HTMLOListElement> {
  number: number
}

export const OrderedList: React.FC<OrderedListProps> = ({ children, number, className, ...props }) => {
  return (
    <ol start={number} className={`list-decimal pl-6 my-4 text-term-white ${className || ""}`} {...props}>
      {children}
    </ol>
  )
}

// Toggle component
interface ToggleProps extends Omit<React.HTMLAttributes<HTMLDetailsElement>, "title"> {
  title: React.ReactNode
}

export const Toggle: React.FC<ToggleProps> = ({ children, title, className, ...props }) => {
  return (
    <details className={`my-4 ${className || ""}`} {...props}>
      <summary className="cursor-pointer font-bold text-term-cyan">{title}</summary>
      <div className="pl-4 mt-2">{children}</div>
    </details>
  )
}

// Bookmark component
interface BookmarkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  url: string
}

export const Bookmark: React.FC<BookmarkProps> = ({ url, className, ...props }) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block p-4 my-4 border border-term-cyan/20 bg-term-darker hover:bg-term-dark transition-colors rounded-lg ${className || ""}`}
      {...props}
    >
      <div className="flex items-center">
        <div className="flex-1">
          <div className="text-term-cyan font-bold">{url}</div>
          <div className="text-sm text-term-gray truncate">{url}</div>
        </div>
        <div className="ml-4 text-term-cyan">↗</div>
      </div>
    </a>
  )
}

// Link component
export const Link: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>> = ({ children, className, ...props }) => {
  return (
    <a className={`text-term-cyan hover:underline ${className || ""}`} {...props}>
      {children}
    </a>
  )
}

// Embed component
interface EmbedProps extends React.IframeHTMLAttributes<HTMLIFrameElement> {
  url: string
}

export const Embed: React.FC<EmbedProps> = ({ url, className, ...props }) => {
  return <iframe src={url} className={`w-full border-0 rounded-lg ${className || ""}`} allowFullScreen {...props} />
}

// Video component
interface VideoProps extends React.HTMLAttributes<HTMLDivElement> {
  url: string
}

export const Video: React.FC<VideoProps> = ({ url, className, ...props }) => {
  // Extract video ID for YouTube or Vimeo
  let videoSrc = url

  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const videoId = url.includes("v=") ? url.split("v=")[1].split("&")[0] : url.split("/").pop()
    videoSrc = `https://www.youtube.com/embed/${videoId}`
  } else if (url.includes("vimeo.com")) {
    const videoId = url.split("/").pop()
    videoSrc = `https://player.vimeo.com/video/${videoId}`
  }

  return (
    <div className={`aspect-video my-4 rounded-lg overflow-hidden ${className || ""}`} {...props}>
      <iframe src={videoSrc} className="w-full h-full border-0" allowFullScreen />
    </div>
  )
}

// Table component
interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  data: any[][]
  options: {
    has_column_header?: boolean
    has_row_header?: boolean
  }
}

export const Table: React.FC<TableProps> = ({ data, options, className, ...props }) => {
  const { has_column_header, has_row_header } = options || {}

  return (
    <div className="overflow-x-auto my-4 rounded-lg">
      <table className={`w-full border-collapse text-term-white ${className || ""}`} {...props}>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-term-darker" : "bg-term-dark"}>
              {row.map((cell, cellIndex) => {
                const isHeader = (has_column_header && rowIndex === 0) || (has_row_header && cellIndex === 0)

                if (isHeader) {
                  return (
                    <th key={cellIndex} className="border border-term-cyan/20 p-2 text-term-cyan font-bold">
                      {cell}
                    </th>
                  )
                }

                return (
                  <td key={cellIndex} className="border border-term-cyan/20 p-2">
                    {cell}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

