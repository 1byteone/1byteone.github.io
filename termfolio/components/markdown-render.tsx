import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkGfm from "remark-gfm"
import remarkRehype from "remark-rehype"
import rehypeSlug from "rehype-slug"
import rehypeHighlight from "rehype-highlight"
import rehypeReact from "rehype-react"
import * as prod from "react/jsx-runtime"
import {
  Paragraph,
  Heading,
  Blockquote,
  CodeBlock,
  Image,
  Link,
  UnorderedList,
  OrderedList,
  Table,
} from "@/components/atoms"
import type { ReactNode } from "react"

const production = { Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs }

function MdHeading1({ id, children }: { id?: string; children?: ReactNode }) {
  return (
    <Heading type="heading_1" id={id || ""}>
      <a href={`#${id}`} className="text-term-cyan hover:text-term-cyan/80">
        {children}
      </a>
    </Heading>
  )
}

function MdHeading2({ id, children }: { id?: string; children?: ReactNode }) {
  return (
    <Heading type="heading_2" id={id || ""}>
      <a href={`#${id}`} className="text-term-cyan hover:text-term-cyan/80">
        {children}
      </a>
    </Heading>
  )
}

function MdHeading3({ id, children }: { id?: string; children?: ReactNode }) {
  return (
    <Heading type="heading_3" id={id || ""}>
      <a href={`#${id}`} className="text-term-cyan hover:text-term-cyan/80">
        {children}
      </a>
    </Heading>
  )
}

function MdParagraph({ children }: { children?: ReactNode }) {
  return <Paragraph>{children}</Paragraph>
}

function MdBlockquote({ children }: { children?: ReactNode }) {
  return (
    <Blockquote className="border border-term-cyan/20 pl-4 italic text-term-gray">
      {children}
    </Blockquote>
  )
}

function MdPre({ children }: { children?: ReactNode }) {
  return (
    <CodeBlock className="bg-term-darker border border-term-cyan/20 p-4 my-4 text-term-white font-mono rounded-lg">
      {children}
    </CodeBlock>
  )
}

function MdCode({ children, className }: { children?: ReactNode; className?: string }) {
  if (className?.startsWith("hljs")) {
    return <code className={className}>{children}</code>
  }
  return (
    <code className="font-mono bg-term-darker px-1.5 py-0.5 rounded text-term-cyan text-[0.9em]">
      {children}
    </code>
  )
}

function MdImage({ src, alt }: { src?: string; alt?: string }) {
  return (
    <div className="my-6 max-w-2xl mx-auto">
      <Image src={src || "/placeholder.svg"} alt={alt || ""} className="rounded-lg" />
    </div>
  )
}

function MdLink({ href, children }: { href?: string; children?: ReactNode }) {
  return (
    <Link
      href={href || "#"}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      className="text-term-cyan hover:underline"
    >
      {children}
    </Link>
  )
}

function MdUl({ children }: { children?: ReactNode }) {
  return (
    <UnorderedList className="list-disc pl-6 my-4 text-term-white">
      {children}
    </UnorderedList>
  )
}

function MdOl({ children }: { children?: ReactNode }) {
  return (
    <OrderedList number={1} className="list-decimal pl-6 my-4 text-term-white">
      {children}
    </OrderedList>
  )
}

function MdLi({ children }: { children?: ReactNode }) {
  return <li className="my-1">{children}</li>
}

function MdTable({ children }: { children?: ReactNode }) {
  return (
    <div className="overflow-x-auto my-4 rounded-lg">
      <table className="w-full border-collapse text-term-white border border-term-cyan/20 rounded-lg overflow-hidden">
        {children}
      </table>
    </div>
  )
}

function MdThead({ children }: { children?: ReactNode }) {
  return <thead className="bg-term-darker">{children}</thead>
}

function MdTh({ children }: { children?: ReactNode }) {
  return (
    <th className="border border-term-cyan/20 p-2 text-term-cyan font-bold text-left">
      {children}
    </th>
  )
}

function MdTd({ children }: { children?: ReactNode }) {
  return <td className="border border-term-cyan/20 p-2">{children}</td>
}

function MdTr({ children }: { children?: ReactNode }) {
  return <tr className="even:bg-term-darker odd:bg-term-dark">{children}</tr>
}

function MdHr() {
  return <hr className="w-48 h-1 mx-auto my-4 bg-term-cyan/30 border-0 rounded md:my-10" />
}

function MdStrong({ children }: { children?: ReactNode }) {
  return <strong className="font-bold text-term-white">{children}</strong>
}

function MdEm({ children }: { children?: ReactNode }) {
  return <em className="italic">{children}</em>
}

const components = {
  h1: MdHeading1,
  h2: MdHeading2,
  h3: MdHeading3,
  p: MdParagraph,
  blockquote: MdBlockquote,
  pre: MdPre,
  code: MdCode,
  img: MdImage,
  a: MdLink,
  ul: MdUl,
  ol: MdOl,
  li: MdLi,
  table: MdTable,
  thead: MdThead,
  th: MdTh,
  td: MdTd,
  tr: MdTr,
  hr: MdHr,
  strong: MdStrong,
  em: MdEm,
}

interface MarkdownRenderProps {
  content: string
}

export default async function MarkdownRender({ content }: MarkdownRenderProps) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: false })
    .use(rehypeSlug)
    .use(rehypeHighlight, { detect: true, ignoreMissing: true })
    .use(rehypeReact, { ...production, components: components as Record<string, unknown> })
    .process(content)

  return <>{file.result}</>

}
