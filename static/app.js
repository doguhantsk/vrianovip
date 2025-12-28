document.addEventListener("DOMContentLoaded", () => {
    
    // --- INTRO VE SCROLL ANİMASYONLARI ---
    const introOverlay = document.querySelector('.intro-overlay');
    if (introOverlay) {
        setTimeout(() => introOverlay.classList.add('hide'), 2000);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.product-card, .reveal-text').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'opacity 1s ease, transform 1s ease';
        observer.observe(el);
    });

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        document.querySelectorAll('.parallax-card').forEach((card, index) => {
            const speed = (index + 1) * 0.05;
            card.style.transform = `translateY(${scrolled * speed * -0.2}px)`;
        });
    });

    // --- MENÜ KONTROLÜ ---
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuBtn.textContent = navLinks.classList.contains('active') ? 'KAPAT' : 'MENU';
        });
    }


    // Keep only the first-used menu visible on mobile: top vs bottom
    document.addEventListener('DOMContentLoaded', () => {
        const menuBtn = document.querySelector('.menu-btn');
        const navLinks = document.querySelector('.nav-links');
        const bottomNav = document.querySelector('.mobile-bottom-nav');
        let firstMenuUsed = null;

        // Load persisted preference so the other navbar is hidden immediately on load
        const persisted = localStorage.getItem('vriano_first_menu');
        if (persisted === 'top') {
            firstMenuUsed = 'top';
            document.body.classList.add('hide-bottom-nav');
        } else if (persisted === 'bottom') {
            firstMenuUsed = 'bottom';
            document.body.classList.add('hide-top-nav');
        }

        function setFirstUsed(kind) {
            if (firstMenuUsed) return;
            firstMenuUsed = kind;
            try { localStorage.setItem('vriano_first_menu', kind); } catch (e) {}
            if (kind === 'top') document.body.classList.add('hide-bottom-nav');
            if (kind === 'bottom') document.body.classList.add('hide-top-nav');
        }

        if (menuBtn) {
            menuBtn.addEventListener('click', () => setFirstUsed('top'), { once: true });
        }

        if (bottomNav) {
            bottomNav.querySelectorAll('a').forEach(a => {
                a.addEventListener('click', () => setFirstUsed('bottom'), { once: true });
            });
        }

        // If nav-links gets activated by other scripts, treat it as top used
        if (navLinks) {
            const mo = new MutationObserver(muts => {
                muts.forEach(m => {
                    if (m.attributeName === 'class' && navLinks.classList.contains('active')) {
                        setFirstUsed('top');
                    }
                });
            });
            mo.observe(navLinks, { attributes: true });
        }

        // Reset behavior on desktop resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 900) {
                document.body.classList.remove('hide-bottom-nav', 'hide-top-nav');
                firstMenuUsed = null;
            }
        });
    });
    // --- SITE NAV TOGGLE (new navbar) ---
    (function(){
        const toggle = document.querySelector('.nav-toggle');
        const panel = document.querySelector('.nav-panel');
        if (!toggle || !panel) return;
        toggle.addEventListener('click', () => {
            const open = panel.classList.toggle('open');
            panel.setAttribute('aria-hidden', String(!open));
            toggle.setAttribute('aria-expanded', String(open));
        });
        // close when a panel link clicked
        panel.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
            panel.classList.remove('open');
            panel.setAttribute('aria-hidden', 'true');
            toggle.setAttribute('aria-expanded', 'false');
        }));
        // close on escape
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { panel.classList.remove('open'); panel.setAttribute('aria-hidden','true'); toggle.setAttribute('aria-expanded','false'); } });
    })();
    // --- WHATSAPP SİPARİŞ MODALI ---
    const modal = document.getElementById('productModal');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalPrice = document.getElementById('modalPrice');
    const whatsappBtn = document.getElementById('whatsappBtn'); // Yeni butonumuz
    const closeModalBtn = document.querySelector('.close-modal');
    
    // Sitenizin WhatsApp Numarası (Başında + olmadan, ülke kodu ile: 905xxxxxxxxx)
    const PHONE_NUMBER = "+905531566448"; 

    const detailButtons = document.querySelectorAll('.open-modal-btn');

    if (modal) {
        detailButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Verileri al
                const title = btn.getAttribute('data-title');
                const desc = btn.getAttribute('data-desc');
                const price = btn.getAttribute('data-price');
                const img = btn.getAttribute('data-image');

                // Modal içeriğini doldur
                modalTitle.textContent = title;
                modalDesc.textContent = desc;
                modalPrice.textContent = price + ' ₺';
                modalImg.src = img;

                // --- WHATSAPP LİNKİNİ OLUŞTUR ---
                // Mesaj: "Merhaba, [Ürün Adı] (000 ₺) hakkında bilgi almak/sipariş vermek istiyorum."
                const message = `Merhaba, VRIANO vitrinindeki "${title}" (${price} ₺) ürünü için sipariş oluşturmak istiyorum.`;
                const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
                
                if (whatsappBtn) {
                    whatsappBtn.href = whatsappUrl;
                }

                // Modalı aç
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        if(closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
        
    }
});

