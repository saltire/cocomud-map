const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const w = 1920;
const h = 1080;
ctx.fillStyle = 'black';
ctx.fillRect(0, 0, w, h);

const paths = {};

// fetch('/data?char=bf007ff9-b636-4e77-a0ef-29b3511a3e6f')
fetch('/data')
  .then(resp => resp.json())
  .then(({ rooms, moves }) => {
    const xs = rooms.map(room => room[0]);
    const ys = rooms.map(room => room[1]);
    const xmin = Math.min(...xs);
    const xmax = Math.max(...xs);
    const ymin = Math.min(...ys);
    const ymax = Math.max(...ys);
    const xsize = xmax - xmin + 1;
    const ysize = ymax - ymin + 1;
    const rsize = Math.floor((Math.min(w / xsize, h / ysize) - 1) / 2) * 2 + 1;
    const roffset = Math.floor(rsize / 2);
    const xoffset = (w - (rsize * xsize)) / 2;
    const yoffset = (h - (rsize * ysize)) / 2;

    const pixel = (x, y) => [
      (x - xmin) * rsize + roffset + xoffset,
      (y - ymin) * rsize + roffset + yoffset,
    ];

    rooms.forEach(([rx, ry]) => {
      const [px, py] = pixel(rx, ry);

      ctx.fillStyle = '#9999ff';
      ctx.fillRect(px, py, 1, 1);
    });

    setInterval(() => {
      if (moves.length) {
        const [from, to] = moves.splice(0, 1).pop();
        const fx = Math.min(from[0], to[0]);
        const tx = Math.max(from[0], to[0]);
        const fy = Math.min(from[1], to[1]);
        const ty = Math.max(from[1], to[1]);
        const id = [fx, fy, tx, ty].join(',');
        paths[id] = Math.min((paths[id] ?? 0.5) + 0.05, 1);

        const [fpx, fpy] = pixel(fx, fy);
        const [tpx, tpy] = pixel(tx, ty);
        const w = tpx - fpx + 1;
        const h = tpy - fpy + 1;
        ctx.clearRect(fpx, fpy, w, h);
        ctx.fillStyle = `rgba(255, 255, 255, ${paths[id]})`;
        ctx.fillRect(fpx, fpy, w, h);
        ctx.fillStyle = 'white';
        ctx.fillRect(fpx, fpy, 1, 1);
        ctx.fillRect(tpx, tpy, 1, 1);
      }
    }, 33);
  });
