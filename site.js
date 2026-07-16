/* ===========================================================
   REGAL 홈페이지 공통 스크립트
   모든 페이지가 이 파일 하나를 함께 씁니다.
   - 푸터 연도 자동 표시
   - 한/영 전환 (페이지를 옮겨다녀도 선택이 유지됨)
   - 갤러리 사진 확대 (gallery.html 에서만 동작)
   =========================================================== */

/* ---------- 푸터 연도 ---------- */
(function(){
  var y = document.getElementById('year');
  if(y) y.textContent = new Date().getFullYear();
})();

/* ---------- 한/영 전환 ----------
   선택은 localStorage에 저장해 모든 페이지가 공유한다.
   저장이 막힌 환경(사생활 보호 모드 등)에서도 죽지 않도록 try/catch로 감싼다. */
function applyLang(l){
  document.documentElement.setAttribute('lang', l);
  var btn = document.getElementById('lang');
  if(btn) btn.textContent = (l === 'en') ? 'KO' : 'EN';
}
function toggleLang(){
  var l = (document.documentElement.getAttribute('lang') === 'en') ? 'ko' : 'en';
  try{ localStorage.setItem('regal-lang', l); }catch(e){}
  applyLang(l);
}
(function(){
  var l = 'ko';
  try{ l = localStorage.getItem('regal-lang') || 'ko'; }catch(e){}
  applyLang(l);
})();

/* ---------- 갤러리 사진 확대 ----------
   gallery.html 에만 #ggrid 가 있으므로, 없으면 아무것도 하지 않는다. */
(function(){
  var grid = document.getElementById('ggrid');
  if(!grid) return;

  var figs  = [].slice.call(grid.querySelectorAll('.gfig'));
  var lb    = document.getElementById('lb');
  var lbImg = document.getElementById('lbImg');
  var lbCap = document.getElementById('lbCap');
  if(!lb || !figs.length) return;
  var idx = 0;

  function show(i){
    idx = (i + figs.length) % figs.length;
    var f = figs[idx];
    var img = f.querySelector('img');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCap.innerHTML = f.querySelector('figcaption').innerHTML;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close(){
    lb.classList.remove('open');
    lbImg.src = '';
    document.body.style.overflow = '';
  }

  figs.forEach(function(f, i){
    f.querySelector('button').addEventListener('click', function(){ show(i); });
  });
  document.getElementById('lbClose').addEventListener('click', close);
  document.getElementById('lbPrev').addEventListener('click', function(e){ e.stopPropagation(); show(idx - 1); });
  document.getElementById('lbNext').addEventListener('click', function(e){ e.stopPropagation(); show(idx + 1); });
  lb.addEventListener('click', function(e){ if(e.target === lb || e.target === lbImg) close(); });
  document.addEventListener('keydown', function(e){
    if(!lb.classList.contains('open')) return;
    if(e.key === 'Escape')     close();
    if(e.key === 'ArrowLeft')  show(idx - 1);
    if(e.key === 'ArrowRight') show(idx + 1);
  });

  /* 다른 페이지에서 gallery.html#g3 처럼 들어오면 그 사진을 바로 연다 */
  (function(){
    var h = location.hash.replace('#','');
    if(!h) return;
    for(var i = 0; i < figs.length; i++){ if(figs[i].id === h){ show(i); return; } }
  })();
})();
