var _schedule = (typeof requestAnimationFrame === 'function') ? requestAnimationFrame : function(cb) { setTimeout(cb, 0); };
_schedule(function() {
  // TikTok Pixel initialization (stub is in index.html)
  ttq.load('D6I4NQRC77U4M1757710');
  ttq.page();
});
