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
// Mobilde daha erken tetiklenen animasyonlar
const observerOptions = {
    root: null,
    threshold: 0.05, // Öğenin %5'i görünse bile animasyon başlasın
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            // Dokunmatik cihazlarda kart belirdiğinde hafif bir parlama efekti
            entry.target.classList.add('mobile-reveal');
        }
    });
}, observerOptions);

document.querySelectorAll('.product-card').forEach(card => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.transition = "all 0.6s ease-out";
    observer.observe(card);
});
