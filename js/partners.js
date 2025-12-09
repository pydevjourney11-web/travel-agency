(function(){
  const ROOT_ID = 'partners-strip';
  async function load(){
    try{
      const res = await fetch('data/partners.json', {cache:'no-cache'});
      if(!res.ok) throw new Error('HTTP '+res.status);
      return await res.json();
    }catch(e){ return []; }
  }
  function render(items){
    const root = document.getElementById(ROOT_ID);
    if(!root) return;
    root.innerHTML = '';
    items.forEach(it=>{
      const a = document.createElement('a');
      a.className = 'partner';
      a.href = '#';
      a.title = it.name || '';
      a.tabIndex = 0;
      const img = document.createElement('img');
      img.loading = 'lazy';
      img.decoding = 'async';
      img.alt = it.name || 'partner';
      img.src = it.src;
      a.appendChild(img);
      root.appendChild(a);
    });
  }
  document.addEventListener('DOMContentLoaded', async ()=>{
    const items = await load();
    render(items);
  });
})();
