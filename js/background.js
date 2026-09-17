// ===== Alien wallpaper: generate stars across the 1440x900 desktop =====
(function initAlienWallpaper(){
  const field = document.querySelector('#alien-wallpaper .aw-stars');
  if(!field) return;

  // Palet warna senada tema Catppuccin Mocha situs ini
  const COLORS = [
    '#f38ba8', // red
    '#eed49f', // yellow
    '#a6e3a1', // green
    '#8bd5ca', // teal
    '#89b4fa', // blue
    '#c6a0f6', // mauve
    '#f5a97f', // peach
    '#cdd6f4', // text (putih kebiruan, sebagai variasi netral)
  ];

  const frag = document.createDocumentFragment();
  const STAR_COUNT = 90;

  for(let i = 0; i < STAR_COUNT; i++){
    const s = document.createElement('div');
    const isBig = Math.random() < 0.18; // sekitar 1 dari 5 bintang lebih besar/terang
    s.className = isBig ? 'aw-star big' : 'aw-star';
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    s.style.left = (Math.random() * 1440) + 'px';
    s.style.top  = (Math.random() * 900) + 'px';
    s.style.animationDelay = (Math.random() * 3.5) + 's';
    s.style.animationDuration = (2.5 + Math.random() * 2) + 's';
    s.style.background = color;
    s.style.boxShadow = `0 0 ${isBig ? 6 : 4}px ${color}`;
    frag.appendChild(s);
  }

  field.appendChild(frag);

  // ===== Planet tata surya — posisi acak, hindari area UI =====
  const planetField = document.querySelector('#alien-wallpaper .aw-planets');
  if(!planetField) return;

  const PLANETS = [
    { cls:'mercury', size:12 },
    { cls:'venus',   size:16 },
    { cls:'earth',   size:18 },
    { cls:'mars',    size:14 },
    { cls:'jupiter', size:34 },
    { cls:'saturn',  size:28 },
    { cls:'uranus',  size:20 },
    { cls:'neptune', size:20 },
  ];

  // Kotak-kotak yang harus dihindari (koordinat pada kanvas 1440x900)
  const FORBIDDEN = [
    { x:0,    y:0,   w:1440, h:40  },  // topbar
    { x:0,    y:40,  w:100,  h:860 },  // kolom icons (kiri)
    { x:1245, y:40,  w:195,  h:860 },  // panel widgets (kanan)
    { x:340,  y:760, w:660,  h:140 },  // dock + alien (bawah-tengah)
  ];
  const MOON = { x:720, y:86, r:90 }; // jaga jarak dari bulan

  function overlapsForbidden(x, y, size){
    const r = size / 2;
    return FORBIDDEN.some(f =>
      x + r > f.x && x - r < f.x + f.w &&
      y + r > f.y && y - r < f.y + f.h
    );
  }
  function tooCloseToMoon(x, y){
    const dx = x - MOON.x, dy = y - MOON.y;
    return Math.sqrt(dx * dx + dy * dy) < MOON.r;
  }
  function tooCloseToOthers(x, y, size, placed){
    return placed.some(p => {
      const dx = x - p.x, dy = y - p.y;
      const minDist = (size + p.size) / 2 + 34;
      return Math.sqrt(dx * dx + dy * dy) < minDist;
    });
  }

  const placed = [];
  const planetFrag = document.createDocumentFragment();

  PLANETS.forEach(planet => {
    let x, y, tries = 0;
    do {
      x = 40 + Math.random() * (1440 - 80);
      y = 60 + Math.random() * (900 - 120);
      tries++;
    } while(
      tries < 60 &&
      (overlapsForbidden(x, y, planet.size) ||
       tooCloseToMoon(x, y) ||
       tooCloseToOthers(x, y, planet.size, placed))
    );
    if(tries >= 60) return; // area terlalu padat, lewati planet ini

    placed.push({ x, y, size: planet.size });

    const el = document.createElement('div');
    el.className = 'aw-planet ' + planet.cls;
    el.style.width = planet.size + 'px';
    el.style.height = planet.size + 'px';
    el.style.left = (x - planet.size / 2) + 'px';
    el.style.top = (y - planet.size / 2) + 'px';
    el.style.animationDuration = (9 + Math.random() * 6) + 's';
    el.style.animationDelay = (Math.random() * 4) + 's';
    planetFrag.appendChild(el);
  });

  planetField.appendChild(planetFrag);
})();
