document.addEventListener('DOMContentLoaded',function(){
  // ── Scroll Reveal ──
  var reveals=document.querySelectorAll('.reveal,.stagger');
  if('IntersectionObserver'in window){
    var obs=new IntersectionObserver(function(entries){
      entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}});
    },{threshold:.1,rootMargin:'0px 0px -40px 0px'});
    reveals.forEach(function(el){obs.observe(el)});
  }else{reveals.forEach(function(el){el.classList.add('visible')})}

  // ── Nav ──
  var nav=document.getElementById('nav');
  var toggle=document.getElementById('navToggle');
  var links=document.getElementById('navLinks');
  var navItems=links.querySelectorAll('a');
  var sections=document.querySelectorAll('section[id]');

  toggle.addEventListener('click',function(){
    var open=links.classList.contains('nav__links--open');
    links.classList.toggle('nav__links--open',!open);
    toggle.classList.toggle('nav__toggle--open',!open);
  });
  navItems.forEach(function(a){a.addEventListener('click',function(){links.classList.remove('nav__links--open');toggle.classList.remove('nav__toggle--open')})});

  function scrollNav(){
    if(window.scrollY>50)nav.classList.add('nav--scrolled');else nav.classList.remove('nav--scrolled');
    var cur='',y=window.pageYOffset;
    sections.forEach(function(s){if(y>=s.offsetTop-120&&y<s.offsetTop+s.offsetHeight)cur=s.id});
    navItems.forEach(function(a){a.classList.toggle('active',a.getAttribute('href')==='#'+cur)});
  }
  window.addEventListener('scroll',scrollNav,{passive:true});scrollNav();

  // ── Candle Chart ──
  var canvas=document.getElementById('candleChart');
  if(canvas){
    var ctx=canvas.getContext('2d');
    var data=[
      {o:142,h:155,l:138,c:148},{o:148,h:158,l:144,c:152},{o:152,h:160,l:148,c:145},
      {o:145,h:153,l:140,c:150},{o:150,h:168,l:147,c:165},{o:165,h:172,l:160,c:158},
      {o:158,h:166,l:152,c:162},{o:162,h:175,l:158,c:170},{o:170,h:178,l:165,c:173},
      {o:173,h:180,l:168,c:168},{o:168,h:176,l:162,c:175},{o:175,h:185,l:172,c:182},
      {o:182,h:190,l:178,c:185},{o:185,h:192,l:180,c:178},{o:178,h:186,l:173,c:183},
      {o:183,h:196,l:180,c:192},{o:192,h:200,l:188,c:195},{o:195,h:205,l:190,c:198},
    ];
    function draw(){
      var dpr=window.devicePixelRatio||1;
      var w=canvas.parentElement.clientWidth;
      var h=360;
      canvas.width=w*dpr;canvas.height=h*dpr;
      canvas.style.width=w+'px';canvas.style.height=h+'px';
      ctx.scale(dpr,dpr);
      ctx.clearRect(0,0,w,h);
      var pad={t:30,r:20,b:40,l:60};
      var cw=w-pad.l-pad.r;
      var ch=h-pad.t-pad.b;
      var allH=data.map(function(d){return d.h});
      var allL=data.map(function(d){return d.l});
      var minP=Math.min.apply(null,allL)-5;
      var maxP=Math.max.apply(null,allH)+5;
      var range=maxP-minP;
      function py(v){return pad.t+ch*(1-(v-minP)/range)}
      // grid
      ctx.strokeStyle='rgba(255,255,255,.04)';ctx.lineWidth=1;
      for(var i=0;i<5;i++){var yv=minP+range*(i/4);var yp=py(yv);ctx.beginPath();ctx.moveTo(pad.l,yp);ctx.lineTo(w-pad.r,yp);ctx.stroke();ctx.fillStyle='#4a5568';ctx.font='11px Inter,sans-serif';ctx.textAlign='right';ctx.fillText(Math.round(yv),pad.l-8,yp+4)}
      // candles
      var bw=Math.max(6,cw/data.length*.7);
      var gap=(cw-bw*data.length)/(data.length+1);
      data.forEach(function(d,i){
        var x=pad.l+gap+(bw+gap)*i+bw/2;
        var bull=d.c>=d.o;
        var col=bull?'#00e676':'#ff1744';
        // wick
        ctx.strokeStyle=col;ctx.lineWidth=1.5;
        ctx.beginPath();ctx.moveTo(x,py(d.h));ctx.lineTo(x,py(d.l));ctx.stroke();
        // body
        var top=py(Math.max(d.o,d.c));
        var bot=py(Math.min(d.o,d.c));
        var bh=Math.max(2,bot-top);
        if(bull){ctx.fillStyle='rgba(0,230,118,.2)';ctx.strokeStyle=col}
        else{ctx.fillStyle='rgba(255,23,68,.2)';ctx.strokeStyle=col}
        ctx.lineWidth=1.5;
        ctx.fillRect(x-bw/2,top,bw,bh);ctx.strokeRect(x-bw/2,top,bw,bh);
      });
      // bottom labels
      ctx.fillStyle='#4a5568';ctx.font='11px Inter,sans-serif';ctx.textAlign='center';
      var days=['Mon','Tue','Wed','Thu','Fri','Mon','Tue','Wed','Thu','Fri','Mon','Tue','Wed','Thu','Fri','Mon','Tue','Wed'];
      data.forEach(function(_,i){if(i%3===0){var x=pad.l+gap+(bw+gap)*i+bw/2;ctx.fillText(days[i%days.length],x,h-pad.b+20)}});
      // volume bars (decorative)
      data.forEach(function(d,i){
        var x=pad.l+gap+(bw+gap)*i+bw/2;
        var bull=d.c>=d.o;
        var vh=Math.random()*30+10;
        ctx.fillStyle=bull?'rgba(0,230,118,.15)':'rgba(255,23,68,.15)';
        ctx.fillRect(x-bw/2,h-pad.b-vh,bw,vh);
      });
    }
    draw();
    window.addEventListener('resize',draw);
  }

  // ── FAQ Accordion ──
  document.querySelectorAll('.faq-item__question').forEach(function(btn){
    btn.addEventListener('click',function(){
      var item=btn.parentElement;
      var wasOpen=item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(function(i){i.classList.remove('open');i.querySelector('.faq-item__answer').style.maxHeight='0'});
      if(!wasOpen){item.classList.add('open');item.querySelector('.faq-item__answer').style.maxHeight=item.querySelector('.faq-item__answer p').scrollHeight+24+'px'}
    });
  });

  // ── Payment Modal ──
  var overlay=document.getElementById('paymentModal');
  var modalPlan=document.getElementById('modalPlan');
  var modalPrice=document.getElementById('modalPrice');
  var methods=document.querySelectorAll('.modal__method');
  var upiSection=document.getElementById('upiSection');
  var cardSection=document.getElementById('cardSection');

  window.openPayment=function(plan,price){
    modalPlan.textContent=plan;
    modalPrice.innerHTML=price;
    overlay.classList.add('active');
    document.body.style.overflow='hidden';
    methods.forEach(function(m){m.classList.remove('selected')});
    upiSection.style.display='none';
    cardSection.style.display='none';
  };
  window.closePayment=function(){
    overlay.classList.remove('active');
    document.body.style.overflow='';
  };
  overlay.addEventListener('click',function(e){if(e.target===overlay)closePayment()});

  methods.forEach(function(m){
    m.addEventListener('click',function(){
      methods.forEach(function(mm){mm.classList.remove('selected')});
      m.classList.add('selected');
      var type=m.dataset.type;
      upiSection.style.display=type==='upi'?'block':'none';
      cardSection.style.display=type==='card'?'block':'none';
    });
  });

  // ── Simulate Payment Confirmation ──
  window.confirmPayment=function(){
    var modal=overlay.querySelector('.modal');
    modal.innerHTML='<div style="text-align:center;padding:20px 0">'
      +'<div style="font-size:60px;margin-bottom:20px">✓</div>'
      +'<h2 style="font-size:24px;font-weight:800;margin-bottom:12px">Payment Submitted!</h2>'
      +'<p style="color:var(--ink-muted);line-height:1.7;margin-bottom:24px">Our team will verify your payment within 2-3 minutes. You\'ll receive a confirmation email with your access link shortly.</p>'
      +'<p style="font-size:13px;color:var(--ink-dim)">Check your inbox (and spam folder) for: <strong style="color:var(--accent)">welcome@tradingmentor.pro</strong></p>'
      +'<button onclick="closePayment()" style="margin-top:28px;background:var(--accent);color:var(--bg);font-weight:700;padding:14px 32px;border:none;border-radius:9999px;font-size:15px;cursor:pointer;transition:transform .12s cubic-bezier(.23,1,.32,1)" onmousedown="this.style.transform=\'scale(.97)\'" onmouseup="this.style.transform=\'none\'">Got It</button>'
      +'</div>';
  };

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click',function(e){
      var target=document.querySelector(a.getAttribute('href'));
      if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth'})}
    });
  });
});