import {findByCode,findByLink} from './student-entry-data.mjs';
const form=document.querySelector('#bee-entry'),input=document.querySelector('#bee-code'),error=document.querySelector('#entry-error');
const welcome=document.querySelector('#bee-welcome'),heading=document.querySelector('#welcome-heading');
function showBee(bee,focus=false){
  form.hidden=true;welcome.hidden=false;
  heading.textContent=`Welcome, S’Pling ${bee.surname}!`;
  document.title=`S’Pling ${bee.surname} · Planet Ten`;
  if(focus)heading.focus();
}
function showError(message){error.textContent=message;input.setAttribute('aria-invalid','true');input.focus();}
function route(){
  const query=new URLSearchParams(location.search);
  form.hidden=false;welcome.hidden=true;
  if(query.has('bee')){const bee=findByLink(query.get('bee'));if(bee)showBee(bee);else showError('That bee link was not found. Try the code your teacher gave you.');}
  else if(query.has('code')){const bee=findByCode(query.get('code'));if(bee){history.replaceState(null,'','?bee='+encodeURIComponent(bee.linkId));showBee(bee);}else showError('That code was not found. Check the letters and trailing z’s, then try again.');}
}
form.addEventListener('submit',event=>{event.preventDefault();const bee=findByCode(input.value);if(!bee){showError('That code was not found. Check the letters and trailing z’s, then try again.');return;}const target=new URL(location.href);target.search='?bee='+encodeURIComponent(bee.linkId);target.hash='';history.pushState(null,'',target);showBee(bee,true);});
input.addEventListener('input',()=>{error.textContent='';input.removeAttribute('aria-invalid');});
window.addEventListener('popstate',route);
route();
