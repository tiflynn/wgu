// ─────────────────────────────────────────────────────────────
//  quiz.js  —  Shared engine for C213 quizzes
//  Each quiz page defines a `questions` array then calls:
//    initQuiz(questions, sectionLabel)
// ─────────────────────────────────────────────────────────────

// ── SHUFFLE ──────────────────────────────────────────────────
function shuffle(arr){
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

function buildDeck(questions){
  return shuffle(questions).map(q=>{
    if(q.type==='mc'){
      const correctText=q.opts[q.correct];
      const shuffled=shuffle(q.opts);
      return {...q,opts:shuffled,correct:shuffled.indexOf(correctText)};
    }
    if(q.type==='ms'){
      const correctTexts=q.correctSet.map(i=>q.opts[i]);
      const shuffled=shuffle(q.opts);
      return {...q,opts:shuffled,correctSet:correctTexts.map(t=>shuffled.indexOf(t))};
    }
    if(q.type==='dd'){
      return {...q,items:shuffle(q.items)};
    }
    return q;
  });
}

// ── STATE ────────────────────────────────────────────────────
let deck=[],current=0,score=0,wrong=0,answered=0,sectionLabel='';

// ── INIT ─────────────────────────────────────────────────────
function initQuiz(questions, label){
  sectionLabel = label || '';
  deck = buildDeck(questions);
  render();

  document.getElementById('btnNext').onclick=()=>{
    current++;
    if(current>=deck.length) showResults();
    else render();
  };
}

// ── RENDER DISPATCHER ────────────────────────────────────────
function render(){
  const q=deck[current];
  const total=deck.length;
  document.getElementById('qLabel').textContent=`Question ${current+1} of ${total}`;
  document.getElementById('qCounter').textContent=`Question ${current+1} of ${total}`;
  document.getElementById('qText').textContent=q.q;
  const pct=Math.round((current/total)*100);
  document.getElementById('barFill').style.width=pct+'%';
  document.getElementById('pctLabel').textContent=pct+'%';
  document.getElementById('feedback').className='feedback';
  document.getElementById('btnWrap').className='btn-wrap';

  const hintEl=document.getElementById('qHint');
  const badge=document.getElementById('typeBadge');
  hintEl.style.display='none';

  if(q.type==='mc'){
    badge.textContent='Multiple Choice';badge.className='type-badge type-mc';
    renderMC(q);
  } else if(q.type==='ms'){
    badge.textContent='Select All That Apply';badge.className='type-badge type-ms';
    hintEl.textContent='Click all correct answers, then press Submit.';
    hintEl.style.display='block';
    renderMS(q);
  } else if(q.type==='dd'){
    badge.textContent='Drag & Drop';badge.className='type-badge type-dd';
    hintEl.textContent='Drag each item from the bank into the correct column, then press Check.';
    hintEl.style.display='block';
    renderDD(q);
  }
}

// ── MULTIPLE CHOICE ──────────────────────────────────────────
function renderMC(q){
  const wrap=document.getElementById('interactionZone');
  wrap.innerHTML='<div class="options" id="optList"></div>';
  const list=document.getElementById('optList');
  const letters=['A','B','C','D','E','F','G','H'];
  q.opts.forEach((opt,i)=>{
    const btn=document.createElement('button');
    btn.className='opt';
    btn.innerHTML=`<span class="letter">${letters[i]}</span><span>${opt}</span>`;
    btn.onclick=()=>handleMC(i,q);
    list.appendChild(btn);
  });
}

function handleMC(chosen,q){
  const opts=document.querySelectorAll('.opt');
  opts.forEach(o=>{o.classList.add('disabled');o.onclick=null;});
  answered++;
  if(chosen===q.correct){
    score++;
    opts[chosen].classList.add('correct');
    showFeedback(true,q.explanation,q.mnemonic,'');
  } else {
    wrong++;
    opts[chosen].classList.add('wrong');
    opts[q.correct].classList.add('correct');
    showFeedback(false,q.explanation,q.mnemonic,`<strong>Correct answer:</strong> ${q.opts[q.correct]}<br><br>`);
  }
  updateChips();showNextBtn();
}

// ── MULTI-SELECT ─────────────────────────────────────────────
function renderMS(q){
  const wrap=document.getElementById('interactionZone');
  wrap.innerHTML='<div class="options" id="optList"></div><button class="ms-submit" id="msBtn" disabled>Submit Answers</button>';
  const list=document.getElementById('optList');
  const letters=['A','B','C','D','E','F','G','H'];
  const selected=new Set();
  q.opts.forEach((opt,i)=>{
    const btn=document.createElement('button');
    btn.className='opt';
    btn.innerHTML=`<span class="letter">${letters[i]}</span><span>${opt}</span>`;
    btn.onclick=()=>{
      if(selected.has(i)){selected.delete(i);btn.classList.remove('selected');}
      else{selected.add(i);btn.classList.add('selected');}
      document.getElementById('msBtn').disabled=selected.size===0;
    };
    list.appendChild(btn);
  });
  document.getElementById('msBtn').onclick=()=>handleMS(selected,q);
}

function handleMS(selected,q){
  const opts=document.querySelectorAll('.opt');
  opts.forEach(o=>{o.classList.add('disabled');o.onclick=null;});
  document.getElementById('msBtn').disabled=true;
  const correctSet=new Set(q.correctSet);
  const isCorrect=[...selected].every(i=>correctSet.has(i))&&selected.size===correctSet.size;
  q.correctSet.forEach(i=>opts[i].classList.add('correct'));
  [...selected].forEach(i=>{if(!correctSet.has(i))opts[i].classList.add('wrong');});
  answered++;
  if(isCorrect){score++;}else{wrong++;}
  const missed=q.correctSet.filter(i=>!selected.has(i));
  const extra=missed.length>0?`<br><strong>You missed:</strong> ${missed.map(i=>q.opts[i]).join(', ')}`:'';
  showFeedback(isCorrect,q.explanation,q.mnemonic,isCorrect?'':extra);
  updateChips();showNextBtn();
}

// ── DRAG & DROP ──────────────────────────────────────────────
function renderDD(q){
  const wrap=document.getElementById('interactionZone');
  wrap.innerHTML='';

  const bankLabel=document.createElement('p');
  bankLabel.className='dd-col-label';bankLabel.textContent='Item Bank — drag from here';
  wrap.appendChild(bankLabel);

  const bank=document.createElement('div');
  bank.className='dd-zone';bank.id='dd-bank';bank.dataset.col='__bank__';
  q.items.forEach((item,idx)=>bank.appendChild(makeDDItem(item.text,idx)));
  wrap.appendChild(bank);

  const colWrap=document.createElement('div');
  colWrap.className='dd-wrap';colWrap.style.marginTop='1rem';
  q.cols.forEach(col=>{
    const colDiv=document.createElement('div');colDiv.className='dd-col';
    const lbl=document.createElement('p');lbl.className='dd-col-label';lbl.textContent=col;
    const zone=document.createElement('div');zone.className='dd-zone';zone.dataset.col=col;
    colDiv.appendChild(lbl);colDiv.appendChild(zone);
    colWrap.appendChild(colDiv);
  });
  wrap.appendChild(colWrap);

  const sub=document.createElement('button');
  sub.className='dd-submit';sub.textContent='Check Answers';
  sub.onclick=()=>handleDD(q);
  wrap.appendChild(sub);

  setupDDListeners();
}

function makeDDItem(text,idx){
  const el=document.createElement('div');
  el.className='dd-item';
  el.draggable=true;
  el.dataset.idx=idx;
  el.innerHTML=`<span class="drag-handle">⠿</span><span>${text}</span>`;
  el.addEventListener('dragstart',e=>{
    e.dataTransfer.setData('text/plain',idx);
    el.style.opacity='0.4';
  });
  el.addEventListener('dragend',()=>{el.style.opacity='1';});
  makeTouchDraggable(el);
  return el;
}

function setupDDListeners(){
  document.querySelectorAll('.dd-zone').forEach(zone=>{
    zone.addEventListener('dragover',e=>{e.preventDefault();zone.classList.add('drag-over');});
    zone.addEventListener('dragleave',()=>zone.classList.remove('drag-over'));
    zone.addEventListener('drop',e=>{
      e.preventDefault();zone.classList.remove('drag-over');
      const idx=e.dataTransfer.getData('text/plain');
      const item=document.querySelector(`.dd-item[data-idx="${idx}"]`);
      if(item)zone.appendChild(item);
    });
  });
}

function handleDD(q){
  document.querySelectorAll('.dd-submit,.ms-submit').forEach(b=>b.disabled=true);
  const allPlaced=document.querySelectorAll('.dd-zone:not(#dd-bank) .dd-item');
  let allCorrect=true;
  allPlaced.forEach(item=>{
    const idx=parseInt(item.dataset.idx);
    const colName=item.parentElement.dataset.col;
    const correctCol=q.items[idx].answer;
    item.classList.add('disabled-item');
    if(colName===correctCol){item.classList.add('correct-item');}
    else{item.classList.add('wrong-item');allCorrect=false;}
  });
  const inBank=document.querySelectorAll('#dd-bank .dd-item');
  if(inBank.length>0){allCorrect=false;inBank.forEach(i=>i.classList.add('wrong-item','disabled-item'));}
  answered++;
  if(allCorrect){score++;}else{wrong++;}
  showFeedback(allCorrect,q.explanation,q.mnemonic,'');
  updateChips();showNextBtn();
}

// ── TOUCH DRAG ───────────────────────────────────────────────
function makeTouchDraggable(el){
  let clone=null;
  el.addEventListener('touchstart',e=>{
    const t=e.touches[0];
    clone=el.cloneNode(true);
    clone.style.cssText=`position:fixed;opacity:0.85;pointer-events:none;z-index:9999;width:${el.offsetWidth}px;left:${t.clientX-el.offsetWidth/2}px;top:${t.clientY-el.offsetHeight/2}px;box-shadow:0 8px 24px rgba(0,0,0,.4);`;
    document.body.appendChild(clone);
    el.style.opacity='0.3';
    document.querySelectorAll('.dd-zone').forEach(z=>z.classList.add('drag-over'));
  },{passive:true});
  el.addEventListener('touchmove',e=>{
    e.preventDefault();
    const t=e.touches[0];
    if(clone){clone.style.left=t.clientX-el.offsetWidth/2+'px';clone.style.top=t.clientY-el.offsetHeight/2+'px';}
  },{passive:false});
  el.addEventListener('touchend',e=>{
    el.style.opacity='1';
    if(clone){document.body.removeChild(clone);clone=null;}
    document.querySelectorAll('.dd-zone').forEach(z=>z.classList.remove('drag-over'));
    const t=e.changedTouches[0];
    const target=document.elementFromPoint(t.clientX,t.clientY);
    let zone=target?target.closest('.dd-zone'):null;

    // Fallback: if the finger didn't land exactly on a zone (easy to
    // happen on a glass screen), snap to whichever zone's box is
    // closest to the touch point instead of doing nothing.
    if(!zone){
      let closest=null,closestDist=Infinity;
      document.querySelectorAll('.dd-zone').forEach(z=>{
        const r=z.getBoundingClientRect();
        const cx=Math.max(r.left,Math.min(t.clientX,r.right));
        const cy=Math.max(r.top,Math.min(t.clientY,r.bottom));
        const dist=Math.hypot(t.clientX-cx,t.clientY-cy);
        if(dist<closestDist){closestDist=dist;closest=z;}
      });
      if(closest && closestDist<120) zone=closest;
    }
    if(zone) zone.appendChild(el);
  });
}

// ── FEEDBACK & HELPERS ───────────────────────────────────────
function showFeedback(isCorrect,explanation,mnemonic,extra){
  const fb=document.getElementById('feedback');
  fb.className=`feedback ${isCorrect?'correct-fb':'wrong-fb'} show`;
  document.getElementById('fbHead').innerHTML=isCorrect?'✓ Correct!':"✗ Not quite — here's the breakdown:";
  document.getElementById('fbBody').innerHTML=extra+explanation;
  document.getElementById('fbMnemonic').innerHTML=mnemonic;
}

function updateChips(){
  document.getElementById('chipTotal').textContent=`Score: ${score} / ${answered}`;
  document.getElementById('chipCorrect').textContent=`✓ ${score} correct`;
  document.getElementById('chipWrong').textContent=`✗ ${wrong} wrong`;
}

function showNextBtn(){
  document.getElementById('btnWrap').className='btn-wrap show';
  const isLast=current===deck.length-1;
  document.getElementById('btnNext').textContent=isLast?'See Results →':'Next Question →';
}

function showResults(){
  document.getElementById('quizCard').style.display='none';
  document.getElementById('barFill').style.width='100%';
  document.getElementById('pctLabel').textContent='100%';
  const pct=Math.round((score/deck.length)*100);
  const res=document.getElementById('results');
  res.style.display='block';
  document.getElementById('bigScore').textContent=pct+'%';
  let grade,color;
  if(pct>=90){grade='🎉 Excellent — you know this section cold!';color='var(--correct)';}
  else if(pct>=75){grade='👍 Good work — review the ones you missed';color='var(--accent)';}
  else if(pct>=60){grade='📚 Keep studying — you\'re getting there';color='var(--accent2)';}
  else{grade='🔄 Review this section and try again';color='var(--wrong)';}
  document.getElementById('bigScore').style.color=color;
  document.getElementById('gradeMsg').textContent=grade;
  document.getElementById('rcCorrect').textContent=score;
  document.getElementById('rcWrong').textContent=wrong;
  document.getElementById('rcTotal').textContent=deck.length;
}

function restart(){
  deck=buildDeck(deck);
  current=0;score=0;wrong=0;answered=0;
  updateChips();
  document.getElementById('results').style.display='none';
  document.getElementById('quizCard').style.display='block';
  render();
}
