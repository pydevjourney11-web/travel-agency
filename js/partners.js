(function(){
  const ROOT_ID = 'partners-strip';
  const SPEED_PX_SEC = 40; // скорость автопрокрутки
  let paused = false;

  async function load(){
    try{
      const res = await fetch('data/partners.json', {cache:'no-cache'});
      if(!res.ok) throw new Error('HTTP '+res.status);
      return await res.json();
    }catch(e){ return []; }
  }

  async function loadPriority(){
    try{
      const res = await fetch('data/partners-priority.json', {cache:'no-cache'});
      if(!res.ok) throw new Error('HTTP '+res.status);
      const data = await res.json();
      if(Array.isArray(data)) return {labels: data, srcs: []};
      return {
        labels: Array.isArray(data.labels) ? data.labels : [],
        srcs: Array.isArray(data.srcs) ? data.srcs : []
      };
    }catch(e){ return {labels: [], srcs: []}; }
  }

  function normalizeLabel(s){
    if(!s) return '';
    const x = (''+s).toLowerCase().replace(/&/g,'and').replace(/\s+/g,' ').trim();
    return x;
  }

  function priorityIndex(item, priority){
    // 1) Явный порядок через item.order
    if(typeof item.order === 'number') return item.order;
    // 2) Явный порядок через srcs
    if(priority.srcs && priority.srcs.length){
      const idx = priority.srcs.findIndex(s=> (item.src||'').includes(s));
      if(idx !== -1) return idx;
    }
    // 3) По метке label/name/src (текстовый поиск по labels)
    const labs = [];
    if(item.label) labs.push(item.label);
    if(item.name) labs.push(item.name);
    if(item.src) labs.push(item.src);
    const normLabels = labs.map(normalizeLabel);
    // сопоставление с приоритетными
    let best = Infinity;
    normLabels.forEach(lab=>{
      (priority.labels || []).forEach((p, idx)=>{
        const pnorm = normalizeLabel(p);
        if(lab.includes(pnorm)){
          best = Math.min(best, idx);
        }
      });
    });
    return best;
  }

  function makeItem(it){
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
    return a;
  }

  function render(items){
    const root = document.getElementById(ROOT_ID);
    if(!root) return null;
    root.innerHTML = '';
    items.forEach(it=> root.appendChild(makeItem(it)));
    // Дублируем набор для бесшовного зацикливания
    items.forEach(it=> root.appendChild(makeItem(it)));
    return root;
  }

  function setupPause(el){
    el.addEventListener('mouseenter', ()=> paused = true);
    el.addEventListener('mouseleave', ()=> paused = false);
    el.addEventListener('touchstart', ()=> paused = true, {passive:true});
    el.addEventListener('touchend', ()=> paused = false);
  }

  function autoplay(container){
    let lastTs = 0;
    const halfWidth = () => Math.floor(container.scrollWidth / 2);
    function step(ts){
      if(!lastTs) lastTs = ts;
      const dt = (ts - lastTs) / 1000; // сек
      lastTs = ts;
      if(!paused){
        const dx = SPEED_PX_SEC * dt;
        container.scrollLeft += dx;
        const max = halfWidth();
        if(container.scrollLeft >= max){
          container.scrollLeft -= max; // плавный цикл
        }
      }
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  document.addEventListener('DOMContentLoaded', async ()=>{
    let items = await load();
    const priority = await loadPriority();
    if((priority.labels && priority.labels.length) || (priority.srcs && priority.srcs.length)){
      items = items
        .map((it, i)=> ({...it, __i:i}))
        .sort((a,b)=>{
          const pa = priorityIndex(a, priority);
          const pb = priorityIndex(b, priority);
          if(pa !== pb) return pa - pb;
          return a.__i - b.__i;
        })
        .map(({__i, ...rest})=> rest);
    }

    const root = render(items);
    if(root && items.length){
      setupPause(root);
      autoplay(root);
    }
  });
})();
