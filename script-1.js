// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    
    // 移动端导航菜单切换
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // 点击导航链接时关闭移动端菜单
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 主题切换（持久化）
    const themeToggle = document.querySelector('.theme-toggle');
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    themeToggle && themeToggle.addEventListener('click', function() {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        this.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });

    // 作品分类筛选功能
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有按钮的active类
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // 为当前点击的按钮添加active类
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.classList.remove('hidden');
                    // 添加淡入动画
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    item.classList.add('hidden');
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                }
            });
        });
    });

    // 精选前后对比滑块
    const beforeAfter = document.querySelector('.before-after');
    if (beforeAfter) {
        const afterImg = beforeAfter.querySelector('.after');
        const handle = beforeAfter.querySelector('.handle');
        const move = (clientX) => {
            const rect = beforeAfter.getBoundingClientRect();
            const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
            const percent = (x / rect.width) * 100;
            afterImg.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
            handle.style.left = `${percent}%`;
        };
        beforeAfter.addEventListener('mousemove', (e) => move(e.clientX));
        beforeAfter.addEventListener('touchmove', (e) => move(e.touches[0].clientX), { passive: true });
        beforeAfter.addEventListener('mousedown', (e) => move(e.clientX));
    }

    // 图片模态框功能
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeBtn = document.querySelector('.close');

    // 为所有作品图片添加点击事件
    portfolioItems.forEach(item => {
        const img = item.querySelector('img');
        const overlay = item.querySelector('.portfolio-overlay');
        const title = overlay.querySelector('h3').textContent;
        const category = overlay.querySelector('p').textContent;

        img.addEventListener('click', function() {
            modal.style.display = 'flex';
            modalImg.src = this.src;
            modalCaption.textContent = `${title} - ${category}`;
            document.body.style.overflow = 'hidden'; // 防止背景滚动
        });

        // 点击overlay中的放大镜图标
        overlay.querySelector('i').addEventListener('click', function() {
            modal.style.display = 'flex';
            modalImg.src = img.src;
            modalCaption.textContent = `${title} - ${category}`;
            document.body.style.overflow = 'hidden';
        });
    });

    // 关闭模态框
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // 点击模态框背景关闭
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // ESC键关闭模态框
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // 统计数字动画
    const counters = document.querySelectorAll('.counter');
    const runCounter = (el) => {
        const target = +el.getAttribute('data-target');
        const duration = 1200;
        const startTime = performance.now();
        const step = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            el.textContent = Math.floor(progress * target);
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                runCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));

    // 订阅表单
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = this.querySelector('button');
            const email = this.querySelector('input').value.trim();
            if (!email) return;
            btn.disabled = true; btn.textContent = '已订阅';
            setTimeout(() => { btn.disabled = false; btn.textContent = '立即订阅'; this.reset(); }, 1500);
        });
    }

    // 联系表单提交处理
    const contactForm = document.querySelector('.contact-form');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 获取表单数据
        const formData = new FormData(this);
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const message = this.querySelector('textarea').value;

        // 简单的表单验证
        if (!name || !email || !message) {
            alert('请填写所有必填字段');
            return;
        }

        // 模拟发送邮件（实际项目中需要后端支持）
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = '发送中...';
        submitBtn.disabled = true;

        setTimeout(() => {
            alert('消息发送成功！我会尽快回复您。');
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });

    // 导航栏滚动效果
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.85)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.65)';
            navbar.style.boxShadow = 'none';
        }
    });

    // 技能条动画
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBars = entry.target.querySelectorAll('.skill-progress');
                skillBars.forEach(bar => {
                    const width = bar.style.width;
                    bar.style.width = '0%';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 200);
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const aboutSection = document.querySelector('.about');
    if (aboutSection) {
        observer.observe(aboutSection);
    }

    // 作品项进入视口动画
    const portfolioObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // 为所有作品项添加初始样式和观察
    portfolioItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        portfolioObserver.observe(item);
    });

    // 图片懒加载
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        if (img.dataset.src) {
            imageObserver.observe(img);
        }
    });

    // 添加页面加载动画
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // 为hero区域的元素添加动画
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const ctaButton = document.querySelector('.cta-button');
        
        if (heroTitle) {
            setTimeout(() => heroTitle.style.opacity = '1', 500);
        }
        if (heroSubtitle) {
            setTimeout(() => heroSubtitle.style.opacity = '1', 700);
        }
        if (ctaButton) {
            setTimeout(() => ctaButton.style.opacity = '1', 900);
        }
    });

    // 添加鼠标跟随效果（可选）
    let mouseX = 0, mouseY = 0;
    let ballX = 0, ballY = 0;
    const speed = 0.1;

    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        ballX += (mouseX - ballX) * speed;
        ballY += (mouseY - ballY) * speed;
        
        // 这里可以添加鼠标跟随效果的元素
        // 例如：cursor.style.left = ballX + 'px';
        // cursor.style.top = ballY + 'px';
        
        requestAnimationFrame(animate);
    }
    animate();

    // 添加键盘导航支持
    document.addEventListener('keydown', function(e) {
        // 左右箭头键切换作品
        if (modal.style.display === 'block') {
            const currentImg = modalImg.src;
            let currentIndex = -1;
            
            portfolioItems.forEach((item, index) => {
                if (item.querySelector('img').src === currentImg) {
                    currentIndex = index;
                }
            });

            if (e.key === 'ArrowLeft' && currentIndex > 0) {
                const prevItem = portfolioItems[currentIndex - 1];
                const prevImg = prevItem.querySelector('img');
                const prevOverlay = prevItem.querySelector('.portfolio-overlay');
                modalImg.src = prevImg.src;
                modalCaption.textContent = `${prevOverlay.querySelector('h3').textContent} - ${prevOverlay.querySelector('p').textContent}`;
            } else if (e.key === 'ArrowRight' && currentIndex < portfolioItems.length - 1) {
                const nextItem = portfolioItems[currentIndex + 1];
                const nextImg = nextItem.querySelector('img');
                const nextOverlay = nextItem.querySelector('.portfolio-overlay');
                modalImg.src = nextImg.src;
                modalCaption.textContent = `${nextOverlay.querySelector('h3').textContent} - ${nextOverlay.querySelector('p').textContent}`;
            }
        }
    });

    // 分享面板逻辑
    const shareFab = document.querySelector('.share-fab');
    const shareSheet = document.getElementById('shareSheet');
    const shareClose = document.querySelector('.share-close');
    const btnShareSystem = document.querySelector('.btn-share-system');
    const btnShareCopy = document.querySelector('.btn-share-copy');

    const pageTitle = document.title;
    const pageUrl = window.location.href;
    const pageText = '我的摄影作品集｜自然、人像、街拍与商业拍摄';

    function openShare() {
        if (!shareSheet) return;
        shareSheet.classList.add('active');
        shareSheet.setAttribute('aria-hidden', 'false');
        // 生成二维码
        const qrWrap = document.getElementById('qrcode');
        if (qrWrap && !qrWrap.dataset.inited && window.QRCode) {
            new QRCode(qrWrap, { text: pageUrl, width: 180, height: 180 });
            qrWrap.dataset.inited = '1';
        }
    }

    function closeShare() {
        if (!shareSheet) return;
        shareSheet.classList.remove('active');
        shareSheet.setAttribute('aria-hidden', 'true');
    }

    shareFab && shareFab.addEventListener('click', openShare);
    shareClose && shareClose.addEventListener('click', closeShare);
    shareSheet && shareSheet.addEventListener('click', (e) => { if (e.target === shareSheet) closeShare(); });

    btnShareSystem && btnShareSystem.addEventListener('click', async function() {
        if (navigator.share) {
            try {
                await navigator.share({ title: pageTitle, text: pageText, url: pageUrl });
                closeShare();
            } catch (err) {
                console.warn('系统分享被取消或失败', err);
            }
        } else {
            alert('您的浏览器暂不支持系统分享，请使用复制链接或二维码');
        }
    });

    btnShareCopy && btnShareCopy.addEventListener('click', async function() {
        try {
            await navigator.clipboard.writeText(pageUrl);
            this.textContent = '已复制链接';
            setTimeout(() => this.textContent = '复制链接', 1500);
        } catch {
            alert('复制失败，请手动复制地址：' + pageUrl);
        }
    });

    console.log('摄影作品集网站已加载完成！');
});

