// Global değişkenler
let currentCategory = 'shoes'; // Varsayılan kategori
const apiEndpoints = {
    'shoes': { get: '/api/shoes', delete: '/delete_shoe', add: '/add_shoe' },
    'bags': { get: '/api/bags', delete: '/delete_bag', add: '/add_bag' },
    'offers': { get: '/api/offers', delete: '/delete_offer', add: '/add_offer' }
};

document.addEventListener('DOMContentLoaded', () => {
    loadData(); // Sayfa açılınca verileri çek
});

// Kategori Değiştirme
function setCategory(category) {
    currentCategory = category;
    
    // Buton stillerini güncelle
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Başlığı güncelle
    const titles = { 'shoes': 'Ayakkabı Listesi', 'bags': 'Çanta Listesi', 'offers': 'Fırsat Listesi' };
    document.getElementById('list-title').innerText = titles[category];

    // Formu temizle
    document.getElementById('adminForm').reset();

    loadData();
}

// Verileri Listeleme
async function loadData() {
    const listBody = document.getElementById('product-list');
    listBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Yükleniyor...</td></tr>';

    try {
        // Backend'de bu API endpoint'lerinin olması lazım.
        // Eğer yoksa, template render edilen sayfadan veri çekmek yerine, 
        // Backend'e basit bir JSON endpoint'i eklemen gerekebilir.
        // Şimdilik varsayım: /api/shoes gibi bir endpoint var.
        // EĞER YOKSA: Bu kısım çalışmaz, backend'e endpoint eklememiz gerekir.
        // Ancak senin projende bu endpointler yoksa, HTML parse etmek zor olur.
        // *Alternatif:* Senin mevcut yapında muhtemelen sayfa refresh ile çalışıyor.
        // Biz burada modern fetch yapısı kuruyoruz.
        
        // Simüle edilmiş veri çekme (Backend endpointleri eklenene kadar HTML'den okuma yapılabilir ama zordur)
        // Doğrusu: Flask tarafına basit bir API route eklemektir.
        
        const response = await fetch(apiEndpoints[currentCategory].get); 
        if (!response.ok) throw new Error('Veri çekilemedi');
        
        const data = await response.json();
        renderTable(data);

    } catch (error) {
        console.error(error);
        // Hata durumunda (API yoksa) manuel bir şeyler göster veya uyarı ver
        listBody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:#e24a4a;">Veri yüklenemedi. Backend API gerekli.</td></tr>';
    }
}

function renderTable(items) {
    const listBody = document.getElementById('product-list');
    listBody.innerHTML = '';

    if (items.length === 0) {
        listBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Kayıt bulunamadı.</td></tr>';
        return;
    }

    items.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${item.image || 'https://via.placeholder.com/50'}" alt="img"></td>
            <td>${item.name || item.title}</td>
            <td>${item.price ? item.price + ' ₺' : '-'}</td>
            <td>
                <button class="action-btn delete" onclick="deleteItem(${item.id})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        listBody.appendChild(tr);
    });
}

// Silme İşlemi
async function deleteItem(id) {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;

    try {
        const formData = new FormData();
        formData.append('id', id);

        const response = await fetch(apiEndpoints[currentCategory].delete, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            loadData(); // Tabloyu yenile
        } else {
            alert('Silme işlemi başarısız.');
        }
    } catch (error) {
        console.error('Hata:', error);
    }
}

// Ekleme İşlemi (Form Submit)
document.getElementById('adminForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.innerText = 'Kaydediliyor...';

    const formData = new FormData();
    formData.append('name', document.getElementById('name').value);
    formData.append('price', document.getElementById('price').value);
    formData.append('image', document.getElementById('image').value);
    formData.append('description', document.getElementById('description').value);
    // Offers için 'title' alanı gerekebilir, backend yapına göre ayarlanmalı.
    if (currentCategory === 'offers') {
        formData.append('title', document.getElementById('name').value);
    }

    try {
        const response = await fetch(apiEndpoints[currentCategory].add, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            document.getElementById('adminForm').reset();
            loadData(); // Listeyi güncelle
        } else {
            alert('Ekleme başarısız!');
        }
    } catch (error) {
        console.error('Hata:', error);
    } finally {
        saveBtn.innerText = 'Kaydet';
    }
});