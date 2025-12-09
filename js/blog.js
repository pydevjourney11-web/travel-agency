(function(){
  const LIST_ID = 'blog-list';
  const LOCAL_KEY = 'blogData';

  async function loadData(){
    try{
      const local = localStorage.getItem(LOCAL_KEY);
      if(local){
        return JSON.parse(local);
      }
    }catch(e){}
    try{
      const res = await fetch('data/blog.json', {cache: 'no-cache'});
      if(!res.ok) throw new Error('HTTP '+res.status);
      return await res.json();
    }catch(err){
      return [
        {id:'fallback-1', date:'2025-11-20', title:'5 идей для зимнего отдыха у моря', excerpt:'Куда отправиться зимой за солнцем и тёплым морем из Нижнего Новгорода.', image:'', url:'#'},
        {id:'fallback-2', date:'2025-10-12', title:'Как выбрать отель для семейного отдыха', excerpt:'Критерии выбора отеля с комфортными условиями для всей семьи.', image:'', url:'#'},
        {id:'fallback-3', date:'2025-09-05', title:'Раннее бронирование: как экономить на турах', excerpt:'Почему выгодно планировать путешествие заранее и как экономить.', image:'', url:'#'}
      ];
    }
  }

  function formatMonth(dateStr){
    try{
      const d = new Date(dateStr);
      return d.toLocaleDateString('ru-RU', {year:'numeric', month:'long'});
    }catch(e){ return dateStr; }
  }

  function render(list){
    const root = document.getElementById(LIST_ID);
    if(!root) return;
    root.innerHTML = '';
    list.forEach(item => {
      const art = document.createElement('article');
      art.className = 'card card--blog';
      const meta = document.createElement('div');
      meta.className = 'card__meta';
      meta.textContent = formatMonth(item.date);
      const h3 = document.createElement('h3');
      h3.className = 'card__title';
      h3.textContent = item.title;
      const p = document.createElement('p');
      p.className = 'card__text';
      p.textContent = item.excerpt;
      art.appendChild(meta);
      art.appendChild(h3);
      art.appendChild(p);
      root.appendChild(art);
    });
  }

  document.addEventListener('DOMContentLoaded', async ()=>{
    const data = await loadData();
    render(data);
  });
})();
