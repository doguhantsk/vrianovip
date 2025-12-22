async function fetchData(path){
  const res = await fetch(path);
  return res.json();
}

function renderCard(p){
  return `<div class="card"><h3>${p.name}</h3><p>${p.description||''}</p><p><strong>${p.price} TL</strong></p></div>`
}

async function load(){
  const products = await fetchData('/api/products');
  const offers = products.filter(p=>p.is_offer==1 || p.is_offer==true);
  document.getElementById('offers-list').innerHTML = offers.map(renderCard).join('')||'<p>Fırsat yok</p>'
  document.getElementById('shoes-list').innerHTML = products.filter(p=>p.category_id==1).map(renderCard).join('')||'<p>Yok</p>'
  document.getElementById('bags-list').innerHTML = products.filter(p=>p.category_id==2).map(renderCard).join('')||'<p>Yok</p>'
}

window.addEventListener('DOMContentLoaded', load)
