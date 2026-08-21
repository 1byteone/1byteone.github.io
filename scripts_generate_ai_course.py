from pathlib import Path
import shutil, json, re, textwrap
import cairosvg

ROOT = Path(r'D:\1byteone.github.io')
ASSET = ROOT / 'assets' / 'media' / 'ai-engineering'
BLOG_ASSET = ROOT / 'assets' / 'media' / 'blog'
ASSET.mkdir(parents=True, exist_ok=True)
BLOG_ASSET.mkdir(parents=True, exist_ok=True)

FONT = 'Arial, sans-serif'
MONO = 'Cascadia Mono, Consolas, monospace'

courses = [
('01','langchain-core-architecture','LangChain','Core Architecture','LLM + Prompt + Chain + Tool + Agent + Memory',['User','Prompt','LLM','Chain','Tool','Agent','Answer'],['Prompt Template','Output Parser','Retriever','Reasoning Loop'],'blue'),
('02','langchain-prompt-chain','LangChain','Prompt & Chain','Prompt variables, parser contracts, and sequential chains',['Input','Prompt','LLM','Parser','Output'],['{topic}','{language}','{difficulty}','Chain A → B → C'],'orange'),
('03','langchain-tool-calling-agent','LangChain','Tool Calling & Agent','Reason → Select → Execute → Observe → Reason again',['Question','Think / Plan','Select Tool','Execute','Observe','Final Answer'],['Search Tool','Calculator','Database','Weather API','Retry'],'blue'),
('04','langchain-memory-multiturn','LangChain','Memory + Multi-turn Agent','Conversation state makes the next turn meaningful',['Turn 1','Memory','Turn 2','Retrieve Context','Agent','Answer'],['Short-term history','Summary memory','Vector memory','session_id'],'purple'),
('05','fastapi-project-architecture','FastAPI','Project Architecture','A maintainable AI backend starts with clear boundaries',['Client','Router','Service','Repository','Model API','Response'],['routers/','services/','schemas/','tests/','config/'],'cyan'),
('06','fastapi-request-response-pydantic','FastAPI','Request / Response / Pydantic','Typed contracts protect the boundary of your API',['JSON Request','Pydantic Model','Validation','Service','Response Model'],['Field types','Constraints','Error 422','OpenAPI schema'],'cyan'),
('07','fastapi-async-dependency-injection','FastAPI','Async + Dependency Injection','Non-blocking I/O and explicit dependencies improve reliability',['Request','Depends()','Async Service','Await I/O','Response'],['DB session','Auth user','Settings','Connection pool'],'blue'),
('08','fastapi-ai-streaming-api','FastAPI','AI Streaming API','Token streaming shortens perceived latency without hiding failures',['Client','POST /chat','LLM Stream','SSE / Chunks','UI Render'],['Event: token','Event: error','[DONE]','Backpressure'],'green'),
('09','rag-basic-pipeline','RAG','Basic Pipeline','Ground answers in a controlled retrieval pipeline',['Documents','Chunk','Embed','Retrieve','Prompt','Answer'],['Ingestion','Knowledge base','Top-K context','Grounded output'],'purple'),
('10','rag-embedding-vector-database','RAG','Embedding + Vector Database','Semantic search maps meaning into a searchable index',['Text Chunk','Embedding','Vector DB','Similarity Search','Context'],['dimension','cosine distance','metadata filter','index'],'purple'),
('11','rag-retriever-optimization','RAG','Retriever Optimization','Better recall and precision come from measuring every stage',['Query','Rewrite','Hybrid Search','Rerank','Context'],['BM25 + vector','Top-K','score threshold','Recall / Precision'],'orange'),
('12','rag-production-architecture','RAG','Production RAG','Production retrieval needs observability, safety, and a feedback loop',['Ingest','Index','Retrieve','Generate','Evaluate'],['Cache','ACL filter','Tracing','Citation','Fallback'],'red'),
('13','openai-api-fundamentals','OpenAI','API Fundamentals','A reliable model call has explicit inputs, budgets, and errors',['Client','Request','Model','Response','Application'],['model','messages','temperature','tokens','retry'],'green'),
('14','openai-structured-output','OpenAI','Structured Output','Schema-constrained responses make LLM output usable by software',['Prompt','JSON Schema','Model','Validate','Typed Result'],['required fields','enum','parse error','fallback'],'green'),
('15','openai-tool-calling','OpenAI','Tool Calling','The model decides; your application executes and validates',['User','LLM','Tool Decision','Application','Tool Result','LLM'],['name','description','parameters','execute','observe'],'orange'),
('16','openai-multimodal-ai','OpenAI','Multimodal AI','Text, images, documents, and audio become one application input',['Text','Image','PDF','Audio','Video'],['Vision','Language','Audio','Structured Output','Privacy'],'purple'),
]

colors = {'blue':'#2563eb','orange':'#ea580c','purple':'#7c3aed','cyan':'#0891b2','green':'#16a34a','red':'#dc2626'}
soft = {'blue':'#dbeafe','orange':'#ffedd5','purple':'#ede9fe','cyan':'#cffafe','green':'#dcfce7','red':'#fee2e2'}

def esc(s):
    return (str(s).replace('&','&amp;').replace('<','&lt;').replace('>','&gt;').replace('"','&quot;'))

def wrap(text, width=27):
    words = text.split()
    lines=[]; cur=''
    for w in words:
        if len(cur)+len(w)+1 > width and cur:
            lines.append(cur); cur=w
        else: cur=(cur+' '+w).strip()
    if cur: lines.append(cur)
    return lines

def svg_text(x,y,text,size=16,fill='#111827',weight='400',anchor='start',family=FONT,style=''):
    return f'<text x="{x}" y="{y}" font-family="{family}" font-size="{size}px" fill="{fill}" font-weight="{weight}" text-anchor="{anchor}" style="{style}">{esc(text)}</text>'

def box(x,y,w,h,label,color,sub=None,fill='#ffffff',rotate=0):
    tr=f' transform="rotate({rotate} {x+w/2} {y+h/2})"' if rotate else ''
    out=f'<g{tr}><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="{fill}" stroke="#111827" stroke-width="2.5"/>'
    out += f'<path d="M {x+10} {y+h-7} Q {x+w*.35} {y+h-3} {x+w-10} {y+h-8}" fill="none" stroke="{color}" stroke-width="3" opacity=".8"/>'
    lines=wrap(label, 17 if w<150 else 24)
    yy=y+27-(len(lines)-1)*4
    for line in lines[:3]: out+=svg_text(x+w/2,yy,line,15,'#111827','700','middle'); yy+=18
    if sub: out+=svg_text(x+w/2,y+h-17,sub,10,color,'700','middle',MONO)
    return out+'</g>'

def arrow(x1,y1,x2,y2,color='#111827',dash=False):
    mid=(x1+x2)/2
    d=f'M {x1} {y1} C {mid} {y1-4} {mid} {y2+4} {x2-10} {y2}'
    dashattr=' stroke-dasharray="8 6"' if dash else ''
    return f'<path d="{d}" fill="none" stroke="{color}" stroke-width="3" stroke-linecap="round"{dashattr}/><path d="M {x2-12} {y2-7} L {x2} {y2} L {x2-12} {y2+7}" fill="none" stroke="{color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'

def make_svg(c):
    no,slug,domain,title,subtitle,flow,notes,theme=c
    color=colors[theme]; pale=soft[theme]
    out=[f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="#fbfcfa"/>
    <path d="M 28 98 Q 290 94 560 98 T 1170 97" fill="none" stroke="#d1d5db" stroke-width="2" stroke-dasharray="3 8"/>
    {svg_text(52,42,'AI ENGINEERING / WHITEBOARD SERIES',12,color,'700','start',MONO)}
    {svg_text(52,78,f'{domain}  /  {title}',30,'#111827','700')}
    {svg_text(1160,52,f'#{no}',22,color,'700','end',MONO)}
    {svg_text(52,122,subtitle,14,'#4b5563','400')}
    ''']
    # main flow
    n=len(flow); left=52; top=162; gap=14; bw=min(168,(1120-gap*(n-1))//n); bh=74
    for i,label in enumerate(flow):
        x=left+i*(bw+gap)
        fill=pale if i in (0,n-1) or (domain=='RAG' and i==2) else '#ffffff'
        out.append(box(x,top,bw,bh,label,color,('step '+str(i+1)).upper(),fill,(-1 if i%3==0 else 1)))
        if i<n-1: out.append(arrow(x+bw+3,top+bh/2,x+bw+gap-3,top+bh/2,color))
    # a loop / secondary structure
    out.append(f'<rect x="52" y="272" width="690" height="290" rx="18" fill="#ffffff" stroke="#111827" stroke-width="2" stroke-dasharray="10 7"/>')
    out.append(svg_text(76,305,'SYSTEM NOTES',12,color,'700','start',MONO))
    # left notes as pills
    for i,note in enumerate(notes):
        col=i%2; row=i//2; x=76+col*322; y=328+row*54
        out.append(box(x,y,290,38,note,color,None,pale if i%3==0 else '#fff',(-1 if i%2 else 0)))
    # domain-specific mini diagram in notes
    if domain=='LangChain':
        out.append(arrow(160,514,160,545,color)); out.append(svg_text(184,526,'compose → inspect → iterate',12,'#374151','400',style='font-style:italic'))
        out.append(svg_text(76,548,'Composable primitives, explicit state, observable decisions.',11,'#4b5563'))
    elif domain=='FastAPI':
        out.append(arrow(160,514,160,545,color)); out.append(svg_text(184,526,'validate → execute → serialize',12,'#374151','400',style='font-style:italic'))
        out.append(svg_text(76,548,'Keep transport, domain logic, and infrastructure separate.',11,'#4b5563'))
    elif domain=='RAG':
        out.append(arrow(160,514,160,545,color)); out.append(svg_text(184,526,'measure recall → precision → faithfulness',12,'#374151','400',style='font-style:italic'))
        out.append(svg_text(76,548,'Every retrieved token should earn its place in the context.',11,'#4b5563'))
    else:
        out.append(arrow(160,514,160,545,color)); out.append(svg_text(184,526,'constrain → execute → validate',12,'#374151','400',style='font-style:italic'))
        out.append(svg_text(76,548,'Treat model output as an untrusted interface boundary.',11,'#4b5563'))
    # right checklist
    out.append(f'<rect x="774" y="272" width="374" height="290" rx="18" fill="{pale}" stroke="#111827" stroke-width="2"/>')
    out.append(svg_text(800,305,'ENGINEERING CHECK',12,color,'700','start',MONO))
    checks = {'LangChain':['Prompt contract','Tool timeout','Max iterations','Trace every run'], 'FastAPI':['Schema validation','Async boundaries','Auth + rate limit','Health + metrics'], 'RAG':['Chunk quality','Metadata ACL','Citation coverage','Fallback answer'], 'OpenAI':['Input budget','Retry policy','Output validation','Privacy boundary']}[domain]
    for i,check in enumerate(checks):
        y=346+i*43
        out.append(f'<circle cx="808" cy="{y-5}" r="9" fill="#fff" stroke="{color}" stroke-width="2"/>')
        out.append(svg_text(808,y-1,'✓',12,color,'700','middle'))
        out.append(svg_text(832,y,check,15,'#111827','600'))
    out.append(f'<path d="M 800 520 Q 926 510 1122 520" fill="none" stroke="{color}" stroke-width="3" opacity=".65"/>')
    out.append(svg_text(800,548,'WHITEBOARD NOTE',10,'#6b7280','700','start',MONO))
    out.append(svg_text(800,565,'Simple boundaries make complex AI easier to debug.',12,'#374151','400','start',FONT,'font-style:italic'))
    out.append('</svg>')
    return ''.join(out)

manifest=[]
for c in courses:
    no,slug,domain,title,subtitle,flow,notes,theme=c
    svg=make_svg(c)
    out=ASSET/f'{no}-{slug}.png'
    cairosvg.svg2png(bytestring=svg.encode(),write_to=str(out),output_width=1200,output_height=630)
    shutil.copy2(out, BLOG_ASSET/f'ai-course-{no}-{slug}.png')
    for lang in ('zh','en'):
        d=ROOT/'content'/lang/'blog'/slug
        d.mkdir(parents=True,exist_ok=True)
        shutil.copy2(out,d/'featured.png')
    manifest.append({'number':int(no),'slug':slug,'domain':domain,'title':title,'image':f'/media/ai-engineering/{no}-{slug}.png','license':'Original SVG whiteboard diagram rendered locally; no external assets'})
(ROOT/'assets'/'media'/'ai-engineering-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
print(f'generated {len(courses)} diagrams')


