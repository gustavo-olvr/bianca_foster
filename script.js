(function(){
  var WHATS='551193545232'; /* troque aqui o número do WhatsApp: 55 + DDD + número */
  var M='<rect class="d" style="--i:0" pathLength="1" x="0" y="0" width="100" height="100"/><line class="d" style="--i:1" pathLength="1" x1="22.4" y1="0" x2="22.4" y2="100"/><line class="d" style="--i:1" pathLength="1" x1="67.2" y1="0" x2="67.2" y2="100"/><path class="d" style="--i:2" pathLength="1" d="M25.5 13.8V86.2"/><path class="d" style="--i:3" pathLength="1" d="M25.5 13.8H38A18.1 18.1 0 0 1 38 50H25.5"/><path class="d" style="--i:4" pathLength="1" d="M38 50A18.1 18.1 0 0 1 38 86.2H25.5"/><line class="d" style="--i:5" pathLength="1" x1="0" y1="50" x2="22.4" y2="50"/><path class="d" style="--i:5" pathLength="1" d="M67.2 13.8H100M67.2 50H100M67.2 86.2H100"/>';
  var d=document,h=d.documentElement;
  function $(s){return d.querySelector(s)}
  function $$(s){return [].slice.call(d.querySelectorAll(s))}
  $$('svg.logo').forEach(function(v){v.innerHTML=M});
  h.classList.add('ready');
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* abertura: a logo se desenha e a tela sobe */
  var intro=$('#intro'),done=false;
  function start(){h.classList.add('go');$$('.hero .clip').forEach(function(e){e.classList.add('in')})}
  function close(){if(done)return;done=true;intro.classList.add('out');setTimeout(start,reduce?0:450);setTimeout(function(){intro.style.display='none'},1100)}
  intro.addEventListener('click',close);
  setTimeout(close,reduce?500:3900);

  /* revelação ao rolar */
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  $$('.rv,.fade,.clip').filter(function(e){return !e.closest('.hero')}).forEach(function(e){io.observe(e)});

  /* paralaxe leve nas fotos e cabeçalho que some ao descer */
  var px=$$('[data-px]'),hd=$('#top'),last=0,tick=false;
  function par(){var vh=innerHeight;px.forEach(function(img){var r=img.parentNode.getBoundingClientRect();var c=(r.top+r.height/2-vh/2)/vh;c=Math.max(-1,Math.min(1,c));img.style.translate='0 '+(-c*r.height*.05).toFixed(1)+'px'})}
  function bar(){var y=scrollY;if(!h.classList.contains('open')){if(y>last+6&&y>240)hd.classList.add('hide');else if(y<last-6||y<120)hd.classList.remove('hide')}last=y}
  addEventListener('scroll',function(){if(tick)return;tick=true;requestAnimationFrame(function(){tick=false;if(!reduce)par();bar()})},{passive:true});
  if(!reduce)par();

  /* menu em tela cheia */
  var btn=$('#menuBtn'),menu=$('#menu');
  function setMenu(o){h.classList.toggle('open',o);btn.setAttribute('aria-expanded',o);btn.textContent=o?'Fechar':'Menu';menu.setAttribute('aria-hidden',!o);hd.classList.remove('hide')}
  btn.addEventListener('click',function(){setMenu(!h.classList.contains('open'))});
  $$('#menu a').forEach(function(a){a.addEventListener('click',function(){setMenu(false)})});

  /* serviços: abre e fecha */
  $$('.row-h').forEach(function(b){b.addEventListener('click',function(){var r=b.closest('.row'),o=!r.classList.contains('open');r.classList.toggle('open',o);b.setAttribute('aria-expanded',o)})});

  /* projetos: foto ampliada */
  var lb=d.createElement('div');lb.id='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');
  lb.innerHTML='<button type="button">Fechar</button><img alt=""><p></p>';d.body.appendChild(lb);
  var li=lb.querySelector('img'),lp=lb.querySelector('p');
  function shut(){lb.classList.remove('on')}
  $$('.tile').forEach(function(t){t.addEventListener('click',function(){var i=t.querySelector('img');li.src=i.src;li.alt=i.alt;lp.textContent=t.getAttribute('data-cap')||'';lb.classList.add('on');lb.querySelector('button').focus()})});
  lb.addEventListener('click',function(e){if(e.target!==li)shut()});
  d.addEventListener('keydown',function(e){if(e.key==='Escape'){shut();if(h.classList.contains('open'))setMenu(false)}});

  /* contato: monta a mensagem e abre o WhatsApp */
  $('#form').addEventListener('submit',function(e){e.preventDefault();var f=e.target;var t='Olá! Meu nome é '+f.nome.value.trim()+'. '+f.msg.value.trim();window.open('https://wa.me/'+WHATS+'?text='+encodeURIComponent(t),'_blank','noopener')});
})();
