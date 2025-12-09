(function(){
  const PASSWORD = 'admin123'; // измените перед публикацией
  const LOCAL_KEY = 'blogData';
  const defaultPath = 'data/blog.json';

  let posts = [];
  let selectedId = null;

  function $(id){ return document.getElementById(id); }

  function uid(){ return 'post-' + Math.random().toString(36).slice(2, 9); }

  function renderList(){
    const list = $('posts-list');
    list.innerHTML = '';
    posts
      .slice()
      .sort((a,b)=> new Date(b.date) - new Date(a.date))
      .forEach(p => {
        const div = document.createElement('div');
        div.className = 'item';
        const h4 = document.createElement('h4');
        h4.textContent = p.title;
        const meta = document.createElement('div');
        meta.className = 'muted';
        meta.textContent = p.date;
        div.appendChild(h4);
        div.appendChild(meta);
        div.addEventListener('click', ()=> select(p.id));
        list.appendChild(div);
      });
  }

  function select(id){
    selectedId = id;
    const p = posts.find(x=>x.id===id);
    if(!p) return;
    $('post-id').value = p.id;
    $('post-date').value = p.date;
    $('post-title').value = p.title;
    $('post-excerpt').value = p.excerpt || '';
    $('post-image').value = p.image || '';
    $('post-url').value = p.url || '';
  }

  function clearForm(){
    $('post-id').value = '';
    $('post-date').value = '';
    $('post-title').value = '';
    $('post-excerpt').value = '';
    $('post-image').value = '';
    $('post-url').value = '';
    selectedId = null;
  }

  function exportJSON(){
    const blob = new Blob([JSON.stringify(posts, null, 2)], {type: 'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'blog.json';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function loadInitial(){
    try{
      const res = await fetch(defaultPath, {cache:'no-cache'});
      if(res.ok){ posts = await res.json(); }
    }catch(e){ posts = []; }
    if(!Array.isArray(posts)) posts = [];
    renderList();
  }

  function savePreview(){
    localStorage.setItem(LOCAL_KEY, JSON.stringify(posts));
    alert('Сохранено для предпросмотра. Откройте главную страницу и обновите её.');
  }

  function clearPreview(){
    localStorage.removeItem(LOCAL_KEY);
    alert('Предпросмотр сброшен. Главная будет читать data/blog.json.');
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    const loginSec = $('login-section');
    const editorSec = $('editor-section');

    $('login-form').addEventListener('submit', (e)=>{
      e.preventDefault();
      const pass = $('admin-pass').value;
      if(pass === PASSWORD){
        loginSec.classList.add('hidden');
        editorSec.classList.remove('hidden');
        loadInitial();
      }else{
        alert('Неверный пароль');
      }
    });

    $('add-post').addEventListener('click', ()=>{
      const p = {id: uid(), date: new Date().toISOString().slice(0,10), title: 'Новая запись', excerpt: '', image:'', url:'#'};
      posts.push(p);
      renderList();
      select(p.id);
    });

    $('post-form').addEventListener('submit', (e)=>{
      e.preventDefault();
      const id = $('post-id').value || uid();
      const item = {
        id,
        date: $('post-date').value,
        title: $('post-title').value,
        excerpt: $('post-excerpt').value,
        image: $('post-image').value,
        url: $('post-url').value
      };
      const idx = posts.findIndex(x=>x.id===id);
      if(idx>=0) posts[idx] = item; else posts.push(item);
      renderList();
      select(id);
    });

    $('delete-post').addEventListener('click', ()=>{
      if(!selectedId) return;
      if(confirm('Удалить запись?')){
        posts = posts.filter(x=>x.id!==selectedId);
        clearForm();
        renderList();
      }
    });

    $('export-json').addEventListener('click', exportJSON);

    $('save-preview').addEventListener('click', savePreview);
    $('clear-preview').addEventListener('click', clearPreview);

    $('import-file').addEventListener('change', async (e)=>{
      const file = e.target.files && e.target.files[0];
      if(!file) return;
      try{
        const text = await file.text();
        const arr = JSON.parse(text);
        if(Array.isArray(arr)){
          posts = arr;
          renderList();
          clearForm();
        }else{
          alert('Некорректный JSON');
        }
      }catch(err){
        alert('Ошибка чтения файла');
      }
    });
  });
})();
