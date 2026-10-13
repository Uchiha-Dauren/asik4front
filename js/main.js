const done=(form,msg)=>{
  document.querySelector('.result')?.remove();
  const name=form.elements.fn?form.elements.fn.value:'';
  form.insertAdjacentHTML('afterend','<div class="alert alert-success result mt-3" role="status">'+msg.replace('{n}',name)+'</div>');
};
document.querySelectorAll('form[data-demo]').forEach(f=>f.addEventListener('submit',e=>{
  e.preventDefault();done(f,f.dataset.demo);f.reset();
}));
const msgOf=el=>el.validity.valueMissing?el.dataset.req:el.dataset.bad;
function mark(el,form){
  if(el.id==='pw2')el.setCustomValidity(el.value===form.elements.pw.value?'':'mismatch');
  const ok=el.checkValidity();
  el.classList.toggle('is-valid',ok);el.classList.toggle('is-invalid',!ok);
  const fb=el.closest('.f').querySelector('.invalid-feedback');
  if(!ok&&fb)fb.textContent=msgOf(el)||'Please check this field.';
  return ok;
}
function markGroup(g){
  const ins=[...g.querySelectorAll('input')],ok=ins.some(i=>i.checked);
  ins.forEach(i=>i.classList.toggle('is-invalid',!ok));
  g.querySelector('.invalid-feedback').style.display=ok?'none':'block';
  return ok;
}
document.querySelectorAll('form[data-bs-val]').forEach(form=>{
  form.noValidate=true;
  const sel='.form-control,.form-select';
  form.addEventListener('input',e=>{
    if(e.target.matches(sel)){
      mark(e.target,form);
      if(e.target.id==='pw'&&form.elements.pw2.value)mark(form.elements.pw2,form);
    }
    const g=e.target.closest('[data-group]');if(g)markGroup(g);
  });
  form.addEventListener('focusout',e=>{if(e.target.matches(sel))mark(e.target,form)});
  form.addEventListener('submit',e=>{
    e.preventDefault();let ok=true;
    form.querySelectorAll(sel).forEach(el=>{ok=mark(el,form)&&ok});
    form.querySelectorAll('[data-group]').forEach(g=>{ok=markGroup(g)&&ok});
    document.querySelector('.result')?.remove();
    if(ok)done(form,form.dataset.ok);else form.querySelector('.is-invalid')?.focus();
  });
  form.addEventListener('reset',()=>setTimeout(()=>{
    form.querySelectorAll('.is-valid,.is-invalid').forEach(x=>x.classList.remove('is-valid','is-invalid'));
    form.querySelectorAll('[data-group] .invalid-feedback').forEach(x=>x.style.display='none');
    if(form.elements.pw2)form.elements.pw2.setCustomValidity('');
    document.querySelector('.result')?.remove();
  }));
});
document.querySelectorAll('[data-toggle-pw]').forEach(b=>b.addEventListener('click',()=>{
  const ids=b.dataset.togglePw.split(','),show=document.getElementById(ids[0]).type==='password';
  ids.forEach(id=>document.getElementById(id).type=show?'text':'password');
  b.textContent=show?'Hide':'Show';
}));
