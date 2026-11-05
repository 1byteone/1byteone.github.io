#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');

const root = process.cwd();
const output = path.join(root, 'docs/audit/ai-lab-shared-article-audit.json');
const sharedPattern = /^ai-lab-(.+)$/;
const legacyPatterns = [
  ['legacy_agent_factory', /create_openai_tools_agent|AgentExecutor/],
  ['legacy_conversation_memory', /Conversation(Buffer|Summary)Memory|ConversationChain/],
  ['legacy_langchain_module', /from\s+langchain\.(agents|chains|memory|tools)\s+import/],
  ['legacy_openai_wrapper', /OpenAIEmbeddings|ChatOpenAI/],
];

function collect(directory) {
  const result = [];
  if (!fs.existsSync(directory)) return result;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...collect(filename));
    else if (entry.name.endsWith('.md') && !entry.name.startsWith('_')) result.push(filename);
  }
  return result;
}

function field(source, key) {
  return (source.match(new RegExp(`^${key}:\\s*["']?([^\\r\\n"']+)`, 'm')) || [])[1]?.trim() || '';
}

function sourcePath(language, slug) {
  const candidates = [
    path.join(root, 'content', language, 'blog', slug, 'index.md'),
    path.join(root, 'content', language, 'blog', `${slug}.md`),
  ];
  return candidates.find(fs.existsSync) || '';
}

function relative(filename) {
  return path.relative(root, filename).replaceAll('\\', '/');
}

const sections = ['engineering', 'experiments', 'research'];
const targetRoots = ['zh', 'en'].flatMap((language) => sections.map((section) => ({ language, root: path.join(root, 'content', language, 'ai-lab', section) })));
const targetPages = targetRoots.flatMap(({ language, root: directory }) => collect(directory)
  .map((filename) => ({ filename, language, source: fs.readFileSync(filename, 'utf8') }))
  .map((page) => ({ ...page, key: field(page.source, 'translationKey') }))
  .filter((page) => sharedPattern.test(page.key)));

const rows = new Map();
for (const page of targetPages) {
  const match = page.key.match(sharedPattern);
  const slug = match?.[1];
  const id = slug;
  if (!rows.has(id)) rows.set(id, { id, slug, languages: {} });
  const source = sourcePath(page.language, slug);
  const shared = source ? fs.readFileSync(source, 'utf8') : '';
  const code = [...shared.matchAll(/```(?:python|py)\s*\n([\s\S]*?)```/g)].map((match) => match[1]).join('\n');
  const syntax = code.trim()
    ? spawnSync(process.env.PYTHON_BIN || 'python', ['-X', 'utf8', '-c', 'import ast,sys; ast.parse(sys.stdin.read())'], { input: code, encoding: 'utf8' })
    : { status: 0, stderr: '' };
  const findings = legacyPatterns
    .filter(([, pattern]) => pattern.test(code))
    .map(([id]) => id);
  rows.get(id).languages[page.language] = {
    ai_lab_page: relative(page.filename),
    source_blog_page: source ? relative(source) : null,
    title: field(page.source, 'title'),
    source_date: field(shared, 'date'),
    code_sha256: crypto.createHash('sha256').update(code).digest('hex'),
    python_code_blocks: [...shared.matchAll(/```(?:python|py)\s*\n/g)].length,
    python_syntax_check: syntax.status === 0 ? 'pass' : 'fail',
    python_syntax_error: syntax.status === 0 ? null : (syntax.stderr || 'python parser failed').trim().slice(0, 500),
    static_findings: findings,
    reproduction_status: source ? 'not-run' : 'source-article-missing',
    reproduced_with_current_dependencies: false,
  };
}

const articles = [...rows.values()].sort((a, b) => a.id.localeCompare(b.id));
const missing = articles.filter((article) => !article.languages.zh || !article.languages.en
  || Object.values(article.languages).some((language) => !language.source_blog_page));
const report = {
  generated_at: new Date().toISOString(),
  scope: 'Only shared posts actually imported into content/{zh,en}/ai-lab/{engineering,experiments,research}; source files are matched by stable post slug.',
  shared_articles: articles.length,
  localized_ai_lab_pages: articles.reduce((count, article) => count + Object.keys(article.languages).length, 0),
  paired_bilingual_records: articles.filter((article) => article.languages.zh && article.languages.en).length,
  missing_source_or_locale: missing.map((article) => article.id),
  current_dependency_reproduction_complete: false,
  rule: 'Static source review is not runtime reproduction. Each translation is linked to its shared blog source, code-block digest, and detected compatibility risks; no row is marked reproduced.',
  dependency_baseline: { hugo: '0.162.0 Extended', review_date: '2026-11-05', langchain: 'not installed/pinned for article reproduction', openai_sdk: 'not installed/pinned for article reproduction', fastapi: 'not installed/pinned for article reproduction' },
  articles,
};
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
if (missing.length) {
  console.error(`Shared article audit found incomplete source/locale coverage: ${missing.map((article) => article.id).join(', ')}`);
  process.exit(1);
}
console.log(`Audited ${report.shared_articles} shared articles / ${report.localized_ai_lab_pages} localized AI Lab pages; ${articles.filter((article) => Object.values(article.languages).some((language) => language.static_findings.length)).length} articles have a legacy API marker. Runtime reproduction remains explicitly unclaimed.`);
