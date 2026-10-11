from pathlib import Path
import json, shutil, textwrap
import cairosvg

ROOT = Path(r'D:\1byteone.github.io')
ASSET = ROOT / 'assets' / 'media' / 'backend-engineering'
BACKUP = ROOT / 'assets' / 'media' / 'blog'
ASSET.mkdir(parents=True, exist_ok=True)
BACKUP.mkdir(parents=True, exist_ok=True)

COLORS = {
    'java': ('#2563eb', '#dbeafe'),
    'spring': ('#16a34a', '#dcfce7'),
    'python': ('#eab308', '#fef9c3'),
    'mysql': ('#ea580c', '#ffedd5'),
}

def esc(s):
    return str(s).replace('&','&amp;').replace('<','&lt;').replace('>','&gt;').replace('"','&quot;')

def text(x,y,s,size=14,fill='#111827',weight='400',anchor='start',family='Arial, sans-serif',extra=''):
    return f'<text x="{x}" y="{y}" font-family="{family}" font-size="{size}px" font-weight="{weight}" fill="{fill}" text-anchor="{anchor}" {extra}>{esc(s)}</text>'

def arrow(x1,y1,x2,y2,color):
    return f'<path d="M{x1} {y1} L{x2} {y2}" stroke="{color}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M{x2-8} {y2-5} L{x2} {y2} L{x2-8} {y2+5}" stroke="{color}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'

def card(x,y,w,h,label,color,fill='#fff',small=None,tilt=0):
    tag = f'<g transform="rotate({tilt} {x+w/2} {y+h/2})">' if tilt else '<g>'
    out=[tag, f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="{fill}" stroke="#172033" stroke-width="2"/>']
    if small: out.append(text(x+12,y+20,small,10,color,'700','start','Consolas, monospace'))
    # simple line wrapping
    words=str(label).split(); lines=[]; cur=''
    maxchars=max(10,int(w/9))
    for word in words:
        if len(cur)+len(word)+1 > maxchars and cur:
            lines.append(cur); cur=word
        else: cur=(cur+' '+word).strip()
    if cur: lines.append(cur)
    start=y+h/2 - (len(lines)-1)*8 + (8 if small else 0)
    for i,line in enumerate(lines[:3]):
        out.append(text(x+w/2,start+i*18,line,14 if not small else 13,'#111827','700','middle'))
    out.append('</g>')
    return ''.join(out)

def data():
    return [
    dict(no='01',slug='java-core-architecture',domain='JAVA',theme='java',title='Java Core Architecture',zh='Java 核心架构：从源码到 JVM 执行',sub='Source → Bytecode → JVM → Machine Code',zhsub='从 Java 源码、字节码到 JVM 执行引擎的完整路径',flow=['Java Source','.java','javac','Bytecode','.class','JVM'],detail='JVM RUNTIME DATA AREA',detail_lines=['Class Loader → load / link / initialize','Heap → objects + GC managed memory','Stack → frames + local variables','Method Area → class metadata','PC Register + Native Method Stack','Execution Engine → Interpreter + JIT'],scenario='SERVICE SCENARIO',scenario_lines=['Java Application → JVM → OS','JIT warms hot request paths','ClassNotFound → fail fast + alert','OutOfMemory → dump + capacity review'],risk='Write Once, Run Anywhere',use='A payment service starts slowly, then becomes faster as JIT compiles its hot methods.',tags=['Java','JVM','Backend','教程']),
    dict(no='02',slug='java-collections-hashmap',domain='JAVA',theme='java',title='Java Collections & HashMap Internals',zh='Java 集合与 HashMap：从 key 到 bucket',sub='Collection hierarchy + hash spreading + collision handling',zhsub='从集合选型到 HashMap 冲突、扩容与树化',flow=['Collection','List / Set','Map','hash(key)','index','Bucket'],detail='HASHMAP LOOKUP PATH',detail_lines=['key → hash() → hash spreading','index = (n - 1) & hash','Bucket: Node → Node → Node','Collision → Linked List / Tree Bin','Capacity × Load Factor → Resize','Average lookup O(1) when distribution is healthy'],scenario='ORDER SERVICE SCENARIO',scenario_lines=['Use HashMap for idempotency keys','Pre-size capacity for batch imports','Never mutate a key after insertion','Collision spike → inspect hash quality','Concurrent writes → ConcurrentHashMap'],risk='Array + Nodes + Tree Bin',use='An order API deduplicates request IDs before writing to MySQL.',tags=['Java','Collections','HashMap','面试']),
    dict(no='03',slug='java-concurrency',domain='JAVA',theme='java',title='Java Concurrency Model',zh='Java 并发模型：线程池、锁与可见性',sub='Shared state → synchronization → safe result',zhsub='从线程、共享状态到线程安全的工程闭环',flow=['Process','Thread','Runnable','Thread Pool','Shared State','Safe Result'],detail='THREADPOOLEXECUTOR',detail_lines=['Core Pool Size + Maximum Pool Size','Work Queue → backpressure boundary','Keep Alive Time → idle worker policy','Rejected Handler → explicit overload path','CAS: expected → compare → swap','volatile / lock → memory visibility'],scenario='NOTIFICATION SCENARIO',scenario_lines=['Queue email tasks instead of spawning threads','Bound pool size to downstream capacity','Race Condition → lock or atomic state','Timeout → cancel / retry with idempotency','Metrics: active, queue, rejected, latency'],risk='Thread + Shared State + Visibility',use='A notification service absorbs bursts with a bounded pool and a visible rejection policy.',tags=['Java','Concurrency','Thread Pool','生产实践']),
    dict(no='04',slug='jvm-memory-gc',domain='JAVA',theme='java',title='JVM Memory & Garbage Collection',zh='JVM 内存与 GC：对象从 Eden 到回收',sub='Allocation → promotion → reachability → collection',zhsub='对象分配、晋升、可达性分析与 GC 选择',flow=['new Object()','Eden','Minor GC','Survivor','Old Gen','Full GC'],detail='OBJECT LIFECYCLE',detail_lines=['GC Root → Reachability Analysis','Young Gen: Eden + Survivor From / To','Minor GC → copy live objects','Promotion → long-lived objects enter Old Gen','Mark → Sweep / Compact','G1 / ZGC → choose for latency goals'],scenario='LATENCY SCENARIO',scenario_lines=['Track pause time, allocation rate, heap use','Promotion failure → inspect object lifetime','Leak path → heap dump + dominator tree','Do not “fix” every alert by enlarging heap','Test collector choice with production-like load'],risk='Pause Time Is A Product Metric',use='A recommendation API protects p99 latency by measuring allocation bursts rather than guessing GC flags.',tags=['Java','JVM','GC','性能']),
    dict(no='05',slug='spring-boot-application-architecture',domain='SPRING BOOT',theme='spring',title='Spring Boot Application Architecture',zh='Spring Boot 应用架构：Controller 到 Database',sub='Client → Controller → Service → Repository → Database',zhsub='用分层边界组织可测试、可演进的业务服务',flow=['Client','Controller','Service','Repository','Database'],detail='SPRING CONTAINER',detail_lines=['BeanDefinition → BeanFactory → ApplicationContext','@Controller → transport boundary','@Service → domain orchestration','@Repository → persistence boundary','Auto Configuration + Starter','Embedded Server + externalized config'],scenario='ORDER API SCENARIO',scenario_lines=['HTTP request enters Controller','Service checks rules + transaction boundary','Repository performs parameterized SQL','Response DTO hides persistence fields','Health endpoint proves dependency status'],risk='Spring + Auto Configuration + Starter',use='An order endpoint keeps HTTP, business rules, and SQL separate so each layer can be tested independently.',tags=['Spring Boot','Java','Architecture','教程']),
    dict(no='06',slug='spring-boot-ioc-dependency-injection',domain='SPRING BOOT',theme='spring',title='Spring Boot IoC & Dependency Injection',zh='Spring Boot IoC 与依赖注入：让对象可替换',sub='Container owns construction; application owns behavior',zhsub='容器负责组装，对象专注行为，测试替换依赖',flow=['Class','Bean Definition','Container','Inject','Service','Test Double'],detail='BEAN LIFECYCLE',detail_lines=['Scan / Register → BeanDefinition','Instantiate → constructor injection','Populate → dependencies are resolved','Initialize → @PostConstruct / proxy','Ready → request can use the Bean','Destroy → cleanup resources'],scenario='PAYMENT SCENARIO',scenario_lines=['PaymentService depends on PaymentGateway','Production: RealGateway','Test: FakeGateway / Stub','Qualifier resolves multiple implementations','Circular dependency → redesign boundary'],risk='Explicit Dependencies Beat Hidden Globals',use='The same payment use case runs with a sandbox gateway in tests and a real gateway in production.',tags=['Spring Boot','IoC','Dependency Injection','测试']),
    dict(no='07',slug='spring-boot-request-lifecycle',domain='SPRING BOOT',theme='spring',title='Spring Boot Request Lifecycle',zh='Spring Boot 请求生命周期：从 HTTP 到响应',sub='Filter → DispatcherServlet → Controller → Response',zhsub='拆解一次请求如何经过过滤器、参数绑定和异常处理',flow=['HTTP Request','Filter','DispatcherServlet','Controller','Service','HTTP Response'],detail='REQUEST LIFECYCLE',detail_lines=['Filter → trace id / auth / CORS','Handler Mapping → select endpoint','Argument Resolver → bind + validate DTO','Interceptor → timing / policy checks','Exception Handler → stable error schema','Message Converter → JSON response'],scenario='PUBLIC API SCENARIO',scenario_lines=['401 at auth boundary; 422 at schema boundary','Trace ID follows request to downstream calls','Timeout becomes consistent 504 response','Global handler avoids leaking stack traces','Access log includes route, status, latency'],risk='Make Every Boundary Observable',use='A public API distinguishes authentication errors, validation errors, and downstream timeouts.',tags=['Spring Boot','HTTP','Web','可观测性']),
    dict(no='08',slug='spring-boot-production-architecture',domain='SPRING BOOT',theme='spring',title='Production Spring Boot Architecture',zh='生产级 Spring Boot 架构：可观测的服务边界',sub='Gateway → Service → Cache / DB / MQ → Observability',zhsub='把网关、服务、缓存、消息、数据库和观测闭环串起来',flow=['Gateway','Spring Service','Redis','MySQL','MQ','Metrics / Trace'],detail='PRODUCTION BOUNDARIES',detail_lines=['Nginx / Gateway → auth + rate limit','Service → idempotency + transaction','Redis → cache-aside with TTL','MySQL → source of truth','RocketMQ → async side effects','Metrics + Logs + Traces → feedback loop'],scenario='FLASH SALE SCENARIO',scenario_lines=['Read path: cache → replica → fallback','Write path: idempotency → DB → event','Timeout / retry must not duplicate orders','Circuit breaker protects dependencies','Deploy: health check → canary → rollback'],risk='Reliability Is A Chain Property',use='A flash-sale service protects the database with cache, bounded writes, idempotency, and asynchronous inventory events.',tags=['Spring Boot','Microservices','Production','系统设计']),
    dict(no='09',slug='python-runtime-architecture',domain='PYTHON',theme='python',title='Python Runtime & Basics',zh='Python 运行时：源码、字节码与对象模型',sub='Python Code → Parser → AST → Bytecode → Interpreter',zhsub='理解 CPython 如何解析代码并执行对象操作',flow=['Python Code','.py','Parser','AST','Bytecode','CPython VM'],detail='CPYTHON EXECUTION',detail_lines=['Source → tokens → AST','AST → bytecode instructions','Interpreter loop executes bytecode','int / str / list / dict are objects','Dynamic typing resolves at runtime','Reference counting + cyclic GC reclaim objects'],scenario='DATA PIPELINE SCENARIO',scenario_lines=['Validate input before dynamic operations','Profile CPU before adding concurrency','Virtualenv pins interpreter dependencies','Type hints document contracts; runtime checks still matter','Exception boundary returns actionable errors'],risk='Everything Is An Object',use='A data pipeline validates records at its boundary and uses profiling to find the real CPU hotspot.',tags=['Python','CPython','Runtime','教程']),
    dict(no='10',slug='python-data-structures-decorators',domain='PYTHON',theme='python',title='Python Data Structures & Decorators',zh='Python 数据结构与装饰器：复用行为而不隐藏边界',sub='Choose the right container; wrap behavior explicitly',zhsub='从 list、dict 选型到装饰器、生成器和可维护复用',flow=['Input','list / tuple','dict / set','Function','Decorator','Reusable API'],detail='PYTHON PRODUCTIVITY',detail_lines=['list → ordered mutable sequence','tuple → immutable record-like value','dict → keyed lookup + explicit schema','set → membership / deduplication','Decorator → wrapper preserves contract','Generator → lazy iteration + bounded memory'],scenario='ETL SCENARIO',scenario_lines=['Use set for duplicate IDs, dict for joins','Generator streams large files without loading all rows','@retry must cap attempts and preserve exceptions','functools.wraps keeps metadata and trace names','Avoid decorators that silently change return types'],risk='Data Structure Is A Performance Decision',use='An ETL job streams a large CSV, deduplicates IDs with a set, and wraps retries without hiding failures.',tags=['Python','Data Structures','Decorator','工程实践']),
    dict(no='11',slug='python-asyncio-concurrency',domain='PYTHON',theme='python',title='Python asyncio & Concurrency',zh='Python asyncio 并发：事件循环与非阻塞 I/O',sub='Coroutine → Event Loop → Await I/O → Gather Results',zhsub='用协程处理 I/O 等待，并明确取消、超时和背压',flow=['Request','Coroutine','Event Loop','Await I/O','Task Group','Response'],detail='ASYNCIO MODEL',detail_lines=['async def → coroutine object','create_task → scheduled work','await → yield while I/O is pending','gather / TaskGroup → coordinate tasks','Semaphore → bound downstream concurrency','Cancellation + timeout → cleanup path'],scenario='AGGREGATION SCENARIO',scenario_lines=['Fan out to three APIs with a concurrency limit','One timeout should not hang the whole request','Use async DB / HTTP clients in async routes','CPU-bound work → process pool, not await','Measure event-loop lag and downstream latency'],risk='Non-blocking Is Not Unlimited',use='A profile page fans out to several services while a semaphore protects the slowest dependency.',tags=['Python','Asyncio','Concurrency','性能']),
    dict(no='12',slug='python-ai-engineering',domain='PYTHON',theme='python',title='AI Engineering with Python',zh='Python AI 工程：把模型调用接入可靠应用',sub='Application → Prompt / RAG / Tool → Model → Validated Result',zhsub='将 Python、RAG、Agent 与模型调用组织成可测试服务',flow=['Python App','Prompt / RAG','Tool','Model API','Schema','User Result'],detail='AI SERVICE BOUNDARY',detail_lines=['FastAPI → typed request / response','Retriever → evidence + ACL filter','Model call → timeout + retry budget','Tool → allowlist + argument validation','Structured output → schema parse','Trace → prompt version + cost + quality'],scenario='SUPPORT COPILOT SCENARIO',scenario_lines=['User asks → retrieve policy → model drafts answer','No evidence → abstain instead of guessing','Tool failure → fallback status, not fake success','PII redaction before logs and prompts','Offline eval catches regressions before deploy'],risk='Model Output Is Untrusted Input',use='A support copilot answers only from authorized policy passages and returns a review state when evidence is weak.',tags=['Python','AI Engineering','RAG','FastAPI']),
    dict(no='13',slug='mysql-architecture',domain='MYSQL',theme='mysql',title='MySQL Architecture',zh='MySQL 内部架构：SQL 层到 InnoDB',sub='Connection → Parser → Optimizer → Executor → Storage Engine',zhsub='理解一条 SQL 如何经过解析、优化和 InnoDB 存储',flow=['Application','Connection','Parser','Optimizer','Executor','InnoDB'],detail='MYSQL SERVER LAYERS',detail_lines=['Connection Layer → sessions + auth','SQL Layer → parse / optimize / execute','Cost model chooses access path','InnoDB → Buffer Pool + B+Tree','Redo Log → crash recovery durability','Undo Log → rollback + consistent reads'],scenario='READ API SCENARIO',scenario_lines=['Pool connections; do not connect per request','EXPLAIN verifies chosen access path','Buffer Pool reduces disk reads','Slow Query Log finds real bottlenecks','Transactions define the write boundary'],risk='SQL Plan Meets Storage Reality',use='A read API uses a pool and EXPLAIN to ensure its query reaches an index instead of scanning the table.',tags=['MySQL','InnoDB','Database','原理']),
    dict(no='14',slug='mysql-index-btree',domain='MYSQL',theme='mysql',title='MySQL Index & B+Tree',zh='MySQL 索引与 B+Tree：让查询走 Fast Path',sub='SQL → Index → B+Tree search → Leaf → Row',zhsub='从索引结构、回表到范围查询与全表扫描对比',flow=['SELECT','Index','B+Tree','Leaf Node','Row Pointer','Result'],detail='B+TREE ACCESS PATH',detail_lines=['Root → Internal Node → Leaf Node','Leaf: key → primary key / row pointer','Clustered Index → primary key + data','Secondary Index → key + primary key','Range scan keeps ordered leaf traversal','Full Table Scan × when selectivity is poor'],scenario='USER LOOKUP SCENARIO',scenario_lines=['WHERE id = 1001 → primary-key lookup','WHERE status + created_at → composite index','EXPLAIN: type / key / rows / Extra','Avoid functions on indexed columns','Write cost: every index needs maintenance'],risk='Fast Search + Ordered Data + Range Query',use='A user-search endpoint compares its EXPLAIN plan before and after adding a composite index.',tags=['MySQL','Index','B+Tree','性能优化']),
    dict(no='15',slug='mysql-transaction-mvcc',domain='MYSQL',theme='mysql',title='MySQL Transaction & MVCC',zh='MySQL 事务与 MVCC：一致性读如何成立',sub='BEGIN → SQL → Undo Log / Read View → COMMIT',zhsub='用 ACID、隔离级别、Undo Log 和 Read View 解释并发读写',flow=['BEGIN','Transaction A','Read View','Undo Log','Transaction B','COMMIT'],detail='MVCC CONSISTENT READ',detail_lines=['Atomicity → all or rollback','Consistency → constraints + invariants','Isolation → visibility policy','Durability → redo log + flush','Undo Log → older row versions','Read View → choose visible snapshot'],scenario='INVENTORY SCENARIO',scenario_lines=['READ COMMITTED sees committed versions','REPEATABLE READ keeps a stable snapshot','Lock current rows for decrement operations','Deadlock → detect, rollback, retry safely','Keep transactions short and observable'],risk='Undo Log + Read View + Snapshot',use='Inventory deduction uses a short transaction and row locking; a deadlock retry is idempotent.',tags=['MySQL','Transaction','MVCC','面试']),
    dict(no='16',slug='mysql-high-concurrency-architecture',domain='MYSQL',theme='mysql',title='Production MySQL High-Concurrency Architecture',zh='生产级 MySQL 高并发架构：缓存、读写分离与分片',sub='Client → Pool → Cache / Master / Replicas → Backup',zhsub='从连接池、Redis、主从复制到分片与恢复策略',flow=['Client','Connection Pool','Redis','Master','Replica 1 / 2','Backup'],detail='HIGH CONCURRENCY PATH',detail_lines=['Cache-aside → read cache, write source','Master → writes + binlog','Replicas → read scaling with lag awareness','Sharding → user_0 … user_N','Slow Query → EXPLAIN → index tuning','Backup → restore drill, not just backup files'],scenario='FEED SCENARIO',scenario_lines=['Hot key → TTL jitter + single-flight','Replica lag → route critical reads to master','Pool exhaustion → queue / shed load','Shard key must preserve query locality','Recovery objective: RPO + RTO are tested'],risk='Cache + Replica + Index + Sharding + Pool',use='A feed service handles a hot tenant by caching reads, routing writes to the master, and testing restore before launch.',tags=['MySQL','High Concurrency','Redis','系统设计']),
    ]


def make_svg(c):
    color,pale=COLORS[c['theme']]
    out=[f'<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">',
         '<rect width="1200" height="630" fill="#fcfdfb"/>',
         '<path d="M32 112 Q250 106 480 112 T1168 110" fill="none" stroke="#d1d5db" stroke-width="2" stroke-dasharray="4 9"/>',
         text(52,35,'BACKEND ENGINEERING / WHITEBOARD SERIES',12,color,'700','start','Consolas, monospace'),
         text(52,72,c['title'],29,'#111827','700'),
         text(52,99,c['sub'],14,'#4b5563','400'),
         text(1148,48,'#'+c['no'],20,color,'700','end','Consolas, monospace')]
    flow=c['flow']; n=len(flow); left=52; top=130; gap=10; bw=min(164,(1096-gap*(n-1))//n); bh=75
    for i,label in enumerate(flow):
        x=left+i*(bw+gap)
        fill=pale if i in (0,n-1) else '#ffffff'
        out.append(card(x,top,bw,bh,label,color,fill,f'{i+1:02d}', -1 if i%2 else 0))
        if i<n-1: out.append(arrow(x+bw+3,top+bh/2,x+bw+gap-3,top+bh/2,color))
    # Lower panels
    out += [f'<rect x="52" y="252" width="690" height="325" rx="18" fill="#ffffff" stroke="#172033" stroke-width="2" stroke-dasharray="9 6"/>',
            text(76,282,c['detail'],12,color,'700','start','Consolas, monospace')]
    rows=c['detail_lines']
    for i,line in enumerate(rows):
        col=i%2; row=i//2; x=76+col*326; y=304+row*64
        out.append(f'<rect x="{x}" y="{y}" width="298" height="43" rx="10" fill="{pale if i in (0,3) else "#fbfbfa"}" stroke="#cbd5e1" stroke-width="1.5"/>')
        out.append(f'<circle cx="{x+18}" cy="{y+21}" r="6" fill="{color}"/>')
        # wrap only if long
        words=line.split(); lines=[]; cur=''
        for w in words:
            if len(cur)+len(w)+1>30 and cur: lines.append(cur); cur=w
            else: cur=(cur+' '+w).strip()
        if cur: lines.append(cur)
        for j,l in enumerate(lines[:2]): out.append(text(x+34,y+18+j*15,l,12,'#172033','600'))
    out.append(text(76,556,c['risk'],13,color,'700','start','Arial, sans-serif', 'font-style="italic"'))
    # Scenario
    out += [f'<rect x="770" y="252" width="378" height="325" rx="18" fill="{pale}" stroke="#172033" stroke-width="2"/>',
            text(794,282,c['scenario'],12,color,'700','start','Consolas, monospace')]
    for i,line in enumerate(c['scenario_lines']):
        y=317+i*45
        ok=i in (0,1,4)
        mark='✓' if ok else '!' 
        mc='#15803d' if ok else '#b91c1c'
        out.append(f'<circle cx="804" cy="{y-5}" r="10" fill="#fff" stroke="{mc}" stroke-width="2"/>')
        out.append(text(804,y-1,mark,13,mc,'700','middle'))
        words=line.split(); lines=[]; cur=''
        for w in words:
            if len(cur)+len(w)+1>35 and cur: lines.append(cur); cur=w
            else: cur=(cur+' '+w).strip()
        if cur: lines.append(cur)
        for j,l in enumerate(lines[:2]): out.append(text(825,y+j*14,l,12,'#172033','600'))
    out.append(f'<path d="M794 548 Q930 538 1122 548" fill="none" stroke="{color}" stroke-width="3" opacity=".65"/>')
    out.append(text(794,566,c['use'],11,'#374151','400','start','Arial, sans-serif','font-style="italic"'))
    out.append('</svg>')
    return ''.join(out)


def article_zh(c):
    tags='\n'.join('  - '+x for x in c['tags'])
    code = {
      'java-core-architecture': '```java\npublic final class OrderService {\n    public Order create(CreateOrder cmd) {\n        return repository.save(validator.check(cmd));\n    }\n}\n```',
      'java-collections-hashmap': '```java\nMap<String, Long> seen = new HashMap<>(1024);\nseen.putIfAbsent(requestId, System.nanoTime());\n```',
      'java-concurrency': '```java\nvar pool = new ThreadPoolExecutor(8, 32, 30,\n    TimeUnit.SECONDS, new ArrayBlockingQueue<>(500),\n    new ThreadPoolExecutor.CallerRunsPolicy());\n```',
      'jvm-memory-gc': '```text\nGC Root → reachable objects → mark → reclaim / compact\nEden → Survivor → Old Generation\n```',
      'spring-boot-application-architecture': '```java\n@RestController\nclass OrderController {\n  private final OrderService service;\n  OrderController(OrderService service) { this.service = service; }\n}\n```',
      'spring-boot-ioc-dependency-injection': '```java\n@Service\nclass PaymentService {\n  PaymentService(PaymentGateway gateway) { ... }\n}\n```',
      'spring-boot-request-lifecycle': '```text\nFilter → HandlerMapping → Controller → Service\n      → ExceptionHandler / MessageConverter\n```',
      'spring-boot-production-architecture': '```text\nrequest → idempotency → transaction → outbox event\n        → Redis / MySQL / MQ → trace + metrics\n```',
      'python-runtime-architecture': '```python\ndef total(items: list[int]) -> int:\n    return sum(items)\n```',
      'python-data-structures-decorators': '```python\nfrom functools import wraps\ndef traced(fn):\n    @wraps(fn)\n    def wrapper(*args, **kwargs):\n        return fn(*args, **kwargs)\n    return wrapper\n```',
      'python-asyncio-concurrency': '```python\nasync with asyncio.TaskGroup() as group:\n    for url in urls:\n        group.create_task(fetch(url))\n```',
      'python-ai-engineering': '```python\nresult = await model.ainvoke(prompt)\nanswer = Answer.model_validate_json(result.content)\n```',
      'mysql-architecture': '```sql\nEXPLAIN SELECT id, name FROM user\nWHERE tenant_id = 7 AND status = \'active\';\n```',
      'mysql-index-btree': '```sql\nCREATE INDEX idx_user_status_created\nON user(status, created_at);\n```',
      'mysql-transaction-mvcc': '```sql\nSTART TRANSACTION;\nSELECT stock FROM inventory WHERE sku = ? FOR UPDATE;\nUPDATE inventory SET stock = stock - 1 WHERE sku = ?;\nCOMMIT;\n```',
      'mysql-high-concurrency-architecture': '```text\nread: Redis → Replica → Master fallback\nwrite: idempotency → Master → binlog / event\n```',
    }[c['slug']]
    return f'''---\ntitle: "{c['zh']}"\ndate: 2026-08-21\nsummary: "{c['zhsub']}。结合真实后端场景拆解 {c['title']} 的边界、失败路径与生产实践。"\ntags:\n{tags}\nauthors:\n  - me\nfeatured: true\n---\n\n![{c['title']} — {c['zh']}](featured.png)\n\n*上图：{c['title']} 白板图；重点不是罗列名词，而是把一次真实请求如何穿过系统、在哪些边界失败画清楚。*\n\n## 为什么要从场景理解这张图\n\n这张图围绕“{c['use']}”展开。学习 {c['title']} 时，不能只记住组件名称：要能说明输入从哪里来、状态由谁持有、哪个组件承担失败、以及如何用指标证明系统仍然健康。白板中的箭头对应代码边界，红色感叹号对应需要显式处理的风险。\n\n## 逐层拆解\n\n主流程是：**{c['sub']}**。前半段是请求或数据的进入路径，后半段是运行时、存储或执行结果。\n\n- **边界契约**：先确定输入、输出和错误结构；不要让隐式类型、未校验参数或共享可变状态穿透多层。\n- **核心机制**：{c['detail_lines'][0]}；{c['detail_lines'][1]}。这些机制决定延迟、吞吐和可测试性。\n- **资源与状态**：{c['detail_lines'][2]}；{c['detail_lines'][3]}。生产系统必须说明资源何时创建、何时释放，以及状态是否可恢复。\n- **失败路径**：{c['detail_lines'][4]}；必要时再结合 **{c['detail_lines'][5]}** 做降级、重试或回滚。\n\n## 一个可落地的最小实现\n\n下面的片段只展示边界，不代表完整业务。它的价值在于把“可以替换、可以测试、可以观测”的位置固定下来。\n\n{code}\n\n在真实项目中，应把外部依赖封装在 adapter 或 repository 中；业务层只依赖稳定接口。这样本地测试可以使用 fake，压测可以替换慢依赖，线上故障也更容易定位。\n\n## 场景中的工程决策\n\n以白板右侧的生产场景为例：\n\n1. **先保护依赖**：连接池、线程池、并发信号量或缓存都要有上限，不能用无限队列掩盖下游过载。\n2. **再保证正确性**：幂等键、事务边界、版本号、锁或 schema 校验至少要有一种明确机制，避免重试带来重复写入。\n3. **最后优化性能**：先用 trace、慢查询、GC pause、队列长度、p99 延迟等数据定位，再选择索引、缓存、批处理或并发策略。\n4. **让故障可恢复**：超时、重试、限流、熔断、回滚和告警必须能在演练中被验证，而不是只写在文档里。\n\n## 常见误区\n\n- 只画成功路径，没有画超时、空数据、拒绝、回滚或副本延迟。\n- 把框架默认行为当成业务契约，升级依赖后才发现边界改变。\n- 用“加机器”替代测量，忽略连接池、锁竞争、慢 SQL、对象分配或事件循环阻塞。\n- 将日志当作唯一观测手段，缺少指标、trace、采样和敏感数据脱敏。\n\n## 生产检查清单\n\n- [ ] 输入、输出和错误响应有明确 schema\n- [ ] 外部调用设置 timeout、retry 上限、rate limit 和 fallback\n- [ ] 资源池有容量、排队和拒绝指标\n- [ ] 关键状态有幂等、事务或恢复策略\n- [ ] 日志、metrics、trace 可关联同一个 request id\n- [ ] 用接近生产的数据做回归、压测和故障演练\n\n## 总结\n\n真正掌握这张白板图，不是能背出每个框的定义，而是能从一次具体请求出发，解释每个箭头的输入输出、每个风险的处置方式，以及上线后用什么信号判断系统需要改进。\n'''

def article_en(c):
    tags='\n'.join('  - '+x for x in c['tags'])
    code='''```text\nrequest → bounded resource → validated boundary → observable result\n```'''
    return f'''---\ntitle: "{c['title']}"\ndate: 2026-08-21\nsummary: "A scenario-driven guide to {c['title']}, including boundaries, failure paths, and production trade-offs."\ntags:\n{tags}\nauthors:\n  - me\nfeatured: true\n---\n\n![{c['title']} — Backend Engineering](featured.png)\n\n*Whiteboard note: the goal is not to memorize boxes, but to connect each arrow to a request, a contract, and an operational signal.*\n\n## Start with a real scenario\n\nUse this situation as the mental model: **{c['use']}**. A useful backend diagram answers four questions: where does input enter, who owns state, which boundary can fail, and how do we know the system is healthy? The flow is **{c['sub']}**.\n\n## Deconstructing the architecture\n\n- **Contract**: define input, output, and error shape before adding implementation detail.\n- **Mechanism**: {c['detail_lines'][0]}; {c['detail_lines'][1]}. This is the part that determines latency, throughput, and testability.\n- **State and resources**: {c['detail_lines'][2]}; {c['detail_lines'][3]}. Explain creation, ownership, cleanup, and recovery.\n- **Failure path**: {c['detail_lines'][4]}; combine it with **{c['detail_lines'][5]}** when choosing a fallback, retry, or rollback.\n\n## A small implementation boundary\n\nThe following sketch is intentionally small. It shows where a production implementation should place validation and ownership rather than pretending that a happy path is enough.\n\n{code}\n\nKeep external systems behind an adapter, repository, client, or gateway. The domain layer should depend on a stable contract so tests can use fakes and incidents can be isolated to one boundary.\n\n## Engineering decisions for the scenario\n\n1. **Protect dependencies first.** Pools, queues, semaphores, caches, and worker counts need explicit limits. An unbounded queue only hides overload.\n2. **Preserve correctness.** Use an idempotency key, transaction boundary, lock, version check, or schema validation where retries or concurrency can duplicate work.\n3. **Optimize with evidence.** Use traces, slow-query data, GC pauses, queue depth, or p99 latency before choosing a cache, index, batch size, or concurrency setting.\n4. **Make recovery testable.** Timeout, retry, rate limit, circuit breaking, rollback, and alerting should be exercised in a drill.\n\n## Common mistakes\n\n- Drawing only the happy path while omitting timeout, empty data, rejection, rollback, or replica lag.\n- Treating framework defaults as business contracts and discovering their limits after an upgrade.\n- Scaling machines before measuring pool exhaustion, lock contention, slow SQL, allocation, or event-loop blocking.\n- Treating logs as the only observability tool; metrics, traces, sampling, and redaction are also required.\n\n## Production checklist\n\n- [ ] Input, output, and error responses have explicit schemas\n- [ ] Dependencies have timeout, retry budgets, rate limits, and fallback behavior\n- [ ] Pools and queues expose capacity, waiting, and rejected-work metrics\n- [ ] Important state has idempotency, transaction, or recovery semantics\n- [ ] Logs, metrics, and traces share a request or correlation ID\n- [ ] Regression tests, load tests, and failure drills use production-like data\n\n## Summary\n\nYou understand this whiteboard when you can start from one request, explain every arrow's contract, state how each risk is handled, and name the signal that would tell you to change the design.\n'''

records=data()
manifest=[]
for c in records:
    svg=make_svg(c)
    out=ASSET/f"{c['no']}-{c['slug']}.png"
    cairosvg.svg2png(bytestring=svg.encode(),write_to=str(out),output_width=1200,output_height=630)
    shutil.copy2(out, BACKUP/f"backend-{c['no']}-{c['slug']}.png")
    for lang,fn in [('zh',article_zh),('en',article_en)]:
        d=ROOT/'content'/lang/'blog'/c['slug']
        d.mkdir(parents=True,exist_ok=True)
        shutil.copy2(out,d/'featured.png')
        (d/'index.md').write_text(fn(c),encoding='utf-8')
    manifest.append({'number':int(c['no']),'slug':c['slug'],'domain':c['domain'],'title':c['title'],'title_zh':c['zh'],'image':f"/media/backend-engineering/{c['no']}-{c['slug']}.png",'license':'Original locally rendered SVG whiteboard diagram; no external assets'})
(ROOT/'assets'/'media'/'backend-engineering-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
print(f'generated {len(records)} backend diagrams and bilingual articles')
