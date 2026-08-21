
window.__awReady=false;
(function(){
  function mark(){if(window.Appwrite){window.__awReady=true;}}
  mark();
  if(!window.Appwrite){
    var s=document.createElement('script');
    s.src='https://unpkg.com/appwrite@15.0.0';
    s.onload=mark;
    document.head.appendChild(s);
  }
})();
