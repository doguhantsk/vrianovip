document.addEventListener("DOMContentLoaded", () => {
    
    // 1. İntro Animasyon Kontrolü
    const introOverlay = document.querySelector('.intro-overlay');
    setTimeout(() => {
        introOverlay.classList.add('hide');
    }, 2500); // 2.5 saniye sonra perde kalkar

    // 2. Mouse Spot Işığı & İmleç Takibi
    const glow = document.querySelector('.cursor-glow');
    
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        
        // Glow efekti (biraz gecikmeli takip eder)
        glow.style.left = x + 'px';
        glow.style.top = y + 'px';

        // CSS değişkenlerini güncelle (özel cursor için)
        document.body.style.setProperty('--cursor-x', x + 'px');
        document.body.style.setProperty('--cursor-y', y + 'px');
    });

    // 3. Scroll Animasyonları (Reveal)
    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Animasyon uygulanacak elementleri seç
    const animatedElements = document.querySelectorAll('.product-card, .reveal-text');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'opacity 1s ease, transform 1s ease';
        observer.observe(el);
    });

    // 4. Parallax Etkisi (Kartlar kaydırıldıkça farklı hızda hareket eder)
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const cards = document.querySelectorAll('.parallax-card');
        
        cards.forEach((card, index) => {
            // Her kart biraz farklı hızda hareket etsin
            const speed = (index + 1) * 0.05;
            card.style.transform = `translateY(${scrolled * speed * -0.2}px)`;
        });
    });
});
// 5. MOBİL MENÜ KONTROLÜ (YENİ EKLENDİ)
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const brandLogo = document.querySelector('.brand');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            // Menüyü aç/kapat
            navLinks.classList.toggle('active');
            
            // Buton yazısını değiştir
            if (navLinks.classList.contains('active')) {
                menuBtn.textContent = 'KAPAT';
                menuBtn.style.color = '#fff'; // Açıkken beyaz olsun
                if(brandLogo) brandLogo.style.color = '#fff';
            } else {
                menuBtn.textContent = 'MENU';
                menuBtn.style.color = ''; // Varsayılan renge dön
                if(brandLogo) brandLogo.style.color = '';
            }
        });

        // Menüdeki bir linke tıklanırsa menüyü kapat (Sayfa içi linkler için)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuBtn.textContent = 'MENU';
            });
        });
    }