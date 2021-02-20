/* 
  @Title:     Exploding ToDos Animation with JavaScript
  @Filename:  TODO_Exploding.js
  @Summary:   This will animate an "Explosion" whenever you complete a TODO in Roam Research.
  @Setup:     Copy this JavaScript code into [[roam/js]] undeneath a {{[[roam/js]]}} block.  For Example...
    - {{[[roam/js]]}
      - Your Code Here
  
  --- CONTRIBUTOR ---
    @Author:    @ErikPlachta
    @Updated:   02202021
    @Source:    https://github.com/ErikPlachta/RoamResearch_CSS-and-JS/

  --- ORIGINAL AUTHOR ---
    @Author:    @artpi
    @Created:   02192021
    @Source:    https://gist.github.com/artpi/1eed7ac11eb980d9f7837041d054ef3f
  ----
  
*/

const observer = new MutationObserver( function callback (mutationsList, observer) {
    if(
        mutationsList.length === 2 &&
        mutationsList[0].removedNodes &&
        mutationsList[0].removedNodes[0] &&
        mutationsList[0].removedNodes[0].firstChild &&
        mutationsList[0].removedNodes[0].firstChild.className === 'check-container' &&
        mutationsList[0].removedNodes[0].firstChild.firstChild &&
        mutationsList[0].removedNodes[0].firstChild.firstChild.checked === false &&
        mutationsList[1].addedNodes &&
        mutationsList[1].addedNodes[0] &&
        mutationsList[1].addedNodes[0].firstChild &&
        mutationsList[1].addedNodes[0].firstChild.className === 'check-container' &&
        mutationsList[1].addedNodes[0].firstChild.firstChild &&
        mutationsList[1].addedNodes[0].firstChild.firstChild.checked === true
    ) {
        const position = mutationsList[1].addedNodes[0].firstChild.firstChild.getBoundingClientRect();
        explode( position.x, position.y );
    }
} );
observer.observe(document, { childList: true, subtree: true });


// The animatino code below is adapted from https://codepen.io/explosion/pen/zKEovE

const explode = (x, y) => {
    const colors = [ '#ffc000', '#ff3b3b', '#ff8400' ];
    const bubbles = 25;
    let particles = [];
    let ratio = window.devicePixelRatio;
    let c = document.createElement('canvas');
    let ctx = c.getContext('2d');

    c.style.position = 'absolute';
    c.style.left = (x - 100) + 'px';
    c.style.top = (y - 100) + 'px';
    c.style.pointerEvents = 'none';
    c.style.width = 200 + 'px';
    c.style.height = 200 + 'px';
    c.style.zIndex = 10000;
    c.width = 200 * ratio;
    c.height = 200 * ratio;
    document.body.appendChild(c);

    for(var i = 0; i < bubbles; i++) {
        particles.push({
            x: c.width / 2,
            y: c.height / 2,
            radius: r(20, 30),
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: r(0, 360, true),
            speed: r(8, 12),
            friction: 0.9,
            opacity: r(0, 0.5, true),
            yVel: 0,
            gravity: 0.1
        });
    }

    render(particles, ctx, c.width, c.height);
    setTimeout(() => document.body.removeChild(c), 1000);
}

const render = (particles, ctx, width, height) => {
    requestAnimationFrame(() => render(particles, ctx, width, height));
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p, i) => {
        p.x += p.speed * Math.cos(p.rotation * Math.PI / 180);
        p.y += p.speed * Math.sin(p.rotation * Math.PI / 180);

        p.opacity -= 0.01;
        p.speed *= p.friction;
        p.radius *= p.friction;
        p.yVel += p.gravity;
        p.y += p.yVel;

        if(p.opacity < 0 || p.radius < 0) return;

        ctx.beginPath();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, false);
        ctx.fill();
    });

    return ctx;
}

const r = (a, b, c) => parseFloat((Math.random() * ((a ? a : 1) - (b ? b : 0)) + (b ? b : 0)).toFixed(c ? c : 0));
