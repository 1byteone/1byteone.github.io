/* ============================================
   李知旺 — AI Agent 工程师 / 作品档案
   Vanilla JS · No frameworks
   ============================================ */

(() => {
    'use strict';

    // ==================== 工具函数 ====================

    /** 节流（用于 scroll/resize） */
    const throttle = (fn, delay) => {
        let last = 0;
        return (...args) => {
            const now = Date.now();
            if (now - last >= delay) {
                last = now;
                fn(...args);
            }
        };
    };

    /** DOM 就绪 */
    const ready = (fn) => {
        if (document.readyState !== 'loading') fn();
        else document.addEventListener('DOMContentLoaded', fn);
    };

    // ==================== 1. 实时时钟 ====================

    const initClock = () => {
        const clockEls = document.querySelectorAll('#liveClock');
        if (!clockEls.length) return;

        const pad = (n) => String(n).padStart(2, '0');

        const update = () => {
            const d = new Date();
            const time = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
            clockEls.forEach((el) => (el.textContent = time));
        };

        update();
        setInterval(update, 1000);
    };

    // ==================== 2. 打字机效果 ====================

    const initTypewriter = () => {
        const el = document.getElementById('typewriter');
        if (!el) return;

        // 待打字的多句（循环）
        let configuredPhrases = window.LZW_ARCHIVE_PHRASES;
        if (typeof configuredPhrases === 'string') {
            try { configuredPhrases = JSON.parse(configuredPhrases); } catch (_) { configuredPhrases = []; }
        }
        const phrases = Array.isArray(configuredPhrases) && configuredPhrases.length
            ? configuredPhrases
            : ['构建可靠的 AI 应用。'];

        let phraseIdx = 0;
        let charIdx = 0;
        let isDeleting = false;
        let pauseTime = 0;

        const typeSpeed = 70;     // 打字速度
        const deleteSpeed = 35;   // 删除速度
        const pauseDuration = 1800; // 完整句子停留时间

        const tick = () => {
            const current = phrases[phraseIdx];

            if (pauseTime > 0) {
                pauseTime -= 30;
                return setTimeout(tick, 30);
            }

            if (isDeleting) {
                // 删除中
                el.textContent = current.substring(0, charIdx - 1);
                charIdx--;

                if (charIdx === 0) {
                    isDeleting = false;
                    phraseIdx = (phraseIdx + 1) % phrases.length;
                    pauseTime = 400;
                }
                setTimeout(tick, deleteSpeed);
            } else {
                // 打字中
                el.textContent = current.substring(0, charIdx + 1);
                charIdx++;

                if (charIdx === current.length) {
                    isDeleting = true;
                    pauseTime = pauseDuration;
                }
                setTimeout(tick, typeSpeed);
            }
        };

        // 启动
        setTimeout(tick, 600);
    };

    // ==================== 3. 数字滚动统计 ====================

    const initCounters = () => {
        const counters = document.querySelectorAll('[data-count]');
        if (!counters.length) return;

        // 立即处理无穷大标记 —— 避免从 0 闪烁到 ∞
        counters.forEach((el) => {
            if (el.getAttribute('data-count') === '∞') {
                el.textContent = '∞';
            }
        });

        const animate = (el) => {
            const target = el.getAttribute('data-count');
            const isInfinity = target === '∞';
            if (isInfinity) return; // 已在初始化时设置，跳过

            const targetNum = parseInt(target, 10);
            const duration = 1400;
            const startTime = performance.now();

            const step = (now) => {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // easeOutCubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const value = Math.floor(eased * targetNum);
                el.textContent = value.toLocaleString();

                if (progress < 1) requestAnimationFrame(step);
                else el.textContent = targetNum.toLocaleString();
            };

            requestAnimationFrame(step);
        };

        // 进入视口才启动
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animate(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.4 }
        );

        // 只观察数字型计数器（∞ 已在初始化时处理）
        counters.forEach((c) => {
            if (c.getAttribute('data-count') !== '∞') observer.observe(c);
        });
    };

    // ==================== 4. 滚动渐入动画 ====================

    const initScrollReveal = () => {
        // 给作品卡片、时间线项、能力条添加渐入
        const targets = document.querySelectorAll(
            '.work-card, .shard, .timeline-item, .skill, .prose, .stat, .section-header'
        );

        if (!targets.length || !('IntersectionObserver' in window)) {
            // 不支持则直接显示
            targets.forEach((el) => el.classList.add('is-visible'));
            return;
        }

        // 初始隐藏（CSS 配合）
        targets.forEach((el) => el.classList.add('reveal-target'));

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, i) => {
                    if (entry.isIntersecting) {
                        // 错开 50ms 形成层叠
                        setTimeout(() => {
                            entry.target.classList.add('is-visible');
                        }, i * 50);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
        );

        targets.forEach((el) => observer.observe(el));
    };

    // ==================== 5. 随机文件编号 ====================

    const initRandomFileId = () => {
        const el = document.getElementById('fileId');
        if (!el) return;

        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // 去掉易混的 I O
        const gen = () => {
            const num = Math.floor(Math.random() * 9000) + 1000;
            const a = chars[Math.floor(Math.random() * chars.length)];
            const b = chars[Math.floor(Math.random() * chars.length)];
            return `STN-${num}-${a}${b}`;
        };

        el.textContent = gen();
    };

    // ==================== 6. Konami 彩蛋 ====================

    const initKonami = () => {
        const code = [
            'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
            'b', 'a'
        ];
        let cursor = 0;

        const trigger = () => {
            // 全屏 overlay
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed; inset: 0; z-index: 9999;
                background: #0a0908; color: #ebe3d2;
                display: flex; align-items: center; justify-content: center;
                font-family: 'Special Elite', monospace;
                flex-direction: column; gap: 1.5rem;
                cursor: pointer;
                animation: fadeIn 0.3s ease;
            `;

            overlay.innerHTML = `
                <div style="font-size: clamp(3rem, 8vw, 6rem); font-weight: 900; line-height: 1; color: #ff6b1a;">
                    ∞
                </div>
                <div style="font-size: 1.5rem; letter-spacing: 0.3em;">
                    KEEP BUILDING
                </div>
                <div style="font-size: 0.9rem; opacity: 0.5; max-width: 500px; text-align: center; padding: 0 2rem; line-height: 1.7;">
                    你找到了隐藏档案。<br>
                    工程是慢慢沉淀出来的 — 但如果你真的读到这里，<br>
                    欢迎发邮件告诉我。
                </div>
                <div style="font-size: 0.8rem; opacity: 0.4; margin-top: 2rem;">
                    [ 点击任意处关闭 ]
                </div>
            `;

            overlay.addEventListener('click', () => {
                overlay.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => overlay.remove(), 300);
            });

            document.body.appendChild(overlay);
        };

        document.addEventListener('keydown', (e) => {
            const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
            if (key === code[cursor]) {
                cursor++;
                if (cursor === code.length) {
                    cursor = 0;
                    trigger();
                }
            } else {
                cursor = 0;
            }
        });
    };

    // ==================== 7. 鼠标视差（作品卡片倾斜） ====================

    const initCardTilt = () => {
        const cards = document.querySelectorAll('.work-card');
        if (!cards.length) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        cards.forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const cx = rect.width / 2;
                const cy = rect.height / 2;
                // 反向：鼠标在上面 = 卡片上沿往后仰
                const rotateX = ((y - cy) / cy) * -1.5;
                const rotateY = (x - cx) / cx * 1.5;

                // 只更新 CSS 变量，CSS 负责合成最终 transform
                card.style.setProperty('--tilt-x', `${rotateX}deg`);
                card.style.setProperty('--tilt-y', `${rotateY}deg`);
            });

            card.addEventListener('mouseleave', () => {
                // 平滑回正到 0
                card.style.setProperty('--tilt-x', '0deg');
                card.style.setProperty('--tilt-y', '0deg');
            });
        });
    };

    // ==================== 8. 章节线段动画 ====================

    const initSectionLines = () => {
        const lines = document.querySelectorAll('.section-line');
        if (!lines.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.style.transform = 'scaleX(1)';
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        lines.forEach((line) => {
            line.style.transform = 'scaleX(0)';
            line.style.transformOrigin = 'left';
            line.style.transition = 'transform 0.6s cubic-bezier(0.65, 0, 0.35, 1)';
            observer.observe(line);
        });
    };

    // ==================== 9. 锚点平滑滚动偏移修正 ====================

    const initAnchorScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach((a) => {
            a.addEventListener('click', (e) => {
                const targetId = a.getAttribute('href').slice(1);
                if (!targetId) return;
                const target = document.getElementById(targetId);
                if (!target) return;

                e.preventDefault();
                const offset = 60; // 顶部 tag 高度
                const y = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            });
        });
    };

    // ==================== 10. 时间戳显示（footer） ====================

    const initTimestamp = () => {
        // 如果 footer 中没有特别显示，则什么都不做
        // 但可以在这里添加"上次更新"时间
    };

    // ==================== 启动 ====================

    ready(() => {
        initClock();
        initTypewriter();
        initCounters();
        initRandomFileId();
        initKonami();
        initCardTilt();
        initSectionLines();
        initAnchorScroll();
        initScrollReveal();

        // 控制台彩蛋
        console.log(
            '%c 李知旺 / AI Agent 工程师 ',
            'background: #0a0908; color: #ff6b1a; font-size: 16px; padding: 8px 16px; font-weight: 900; letter-spacing: 0.2em;'
        );
        console.log(
            '%c 你好，陌生人。 %c 这是一个用 %c Vanilla JS %c 制作的网站。',
            'color: #ebe3d2; font-size: 14px;',
            'color: #ebe3d2;',
            'color: #ff6b1a; font-weight: bold;',
            'color: #ebe3d2;'
        );
        console.log(
            '%c ↑↑↓↓←→←→BA ',
            'color: #c8412c; font-family: monospace; font-size: 12px;'
        );
    });
})();
