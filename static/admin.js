document.getElementById('add-form').addEventListener('submit', async (e)=>{
  e.preventDefault()
  const fd = new FormData(e.target)
  const body = {
    name: fd.get('name'),
    price: parseFloat(fd.get('price')),
    category_id: parseInt(fd.get('category_id')),
    is_offer: fd.get('is_offer')? true:false
  }
  const res = await fetch('/api/products', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)})
  if (res.ok) loadAdmin()
})

async function loadAdmin(){
  const products = await (await fetch('/api/products')).json()
  const el = document.getElementById('admin-products')
  el.innerHTML = products.map(p=>{
    return `<div class="card"><h3>${p.name}</h3><p>${p.category_name||''}</p><p>${p.price} TL</p><button data-id="${p.id}" class="del">Sil</button></div>`
  }).join('')
  el.querySelectorAll('.del').forEach(btn=>btn.addEventListener('click', async ()=>{
    const id = btn.getAttribute('data-id')
    const res = await fetch('/api/products/'+id, {method:'DELETE'})
    if (res.ok) loadAdmin()
  }))
}

window.addEventListener('DOMContentLoaded', loadAdmin)
