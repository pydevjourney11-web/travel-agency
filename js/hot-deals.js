(function(){
  const ROOT_ID = 'hot-deals-list';
  const LOCAL_KEY = 'hotDealsData';
  const PATH = 'data/hot-deals.json';

  async function load(){
    try{
      const local = localStorage.getItem(LOCAL_KEY);
      if(local) return JSON.parse(local);
    }catch(e){}
    try{
      const res = await fetch(PATH, {cache:'no-cache'});
      if(!res.ok) throw new Error('HTTP '+res.status);
      return await res.json();
    }catch(e){
      return [
        {id:'deal-1', title:'Турция · Анталья', subtitle:'-70%', image:'', link:'https://tourcart.ru/#tvofferid=2921696&tvclid=174005'},
        {id:'deal-2', title:'ОАЭ · Рас-эль-Хайма', subtitle:'-67%', image:'', link:'#'},
        {id:'deal-3', title:'Египет · Хургада', subtitle:'Скидка', image:'', link:'#'},
        {id:'deal-4', title:'Таиланд · Пхукет', subtitle:'Выгодно', image:'', link:'#'},
        {id:'deal-5', title:'Вьетнам · Нячанг', subtitle:'Супер цена', image:'', link:'#'}
      ];
    }
  }

  function render(items){
    const root = document.getElementById(ROOT_ID);
    if(!root) return;
    root.innerHTML = '';
    items.forEach(it => {
      const a = document.createElement('a');
      a.className = 'hot-card';
      a.href = it.link || '#';
      a.target = (it.link||'').startsWith('http') ? '_blank' : '_self';
      a.rel = a.target === '_blank' ? 'noopener' : '';

      if(it.image){
        const img = document.createElement('img');
        img.className = 'hot-card__img';
        img.src = it.image;
        img.alt = it.title || '';
        img.loading = 'lazy';
        a.appendChild(img);
      }

      const badge = document.createElement('div');
      badge.className = 'hot-card__badge';
      badge.textContent = it.subtitle || '';

      const title = document.createElement('div');
      title.className = 'hot-card__title';
      title.textContent = it.title || '';

      a.appendChild(badge);
      a.appendChild(title);
      root.appendChild(a);
    });
  }

  document.addEventListener('DOMContentLoaded', async ()=>{
    const items = await load();
    render(items);
  });
})();
