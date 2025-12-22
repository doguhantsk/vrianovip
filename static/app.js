async function fetchData(path){
  const res = await fetch(path);
  return res.json();
}

function renderCard(p){
  return `<div class="card"><h3>${p.name}</h3><p>${p.description||''}</p><p><strong>${p.price} TL</strong></p></div>`
}

async function load(){
  const products = await fetchData('/api/products');

  const offersEl = document.getElementById('offers-list')
  if (offersEl){
    const offers = products.filter(p=>p.is_offer==1 || p.is_offer==true)
    offersEl.innerHTML = offers.map(renderCard).join('')||'<p>Fırsat yok</p>'
  }

  const shoesEl = document.getElementById('shoes-list')
  if (shoesEl){
    shoesEl.innerHTML = products.filter(p=>p.category_id==1).map(renderCard).join('')||'<p>Yok</p>'
  }

  const bagsEl = document.getElementById('bags-list')
  if (bagsEl){
    bagsEl.innerHTML = products.filter(p=>p.category_id==2).map(renderCard).join('')||'<p>Yok</p>'
  }

  const featuredEl = document.getElementById('featured-list')
  if (featuredEl){
    const featured = products.slice(0,4)
    featuredEl.innerHTML = featured.map(renderCard).join('')||'<p>Henüz ürün yok</p>'
  }
}

window.addEventListener('DOMContentLoaded', load)
