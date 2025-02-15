import Boid from "./boid.js";
const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");
let boids = [];
for (let i = 0; i < 80; i++){
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    boids.push(new Boid(x, y));
}
while (true){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'blue';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let boid of boids){
        boid.draw(ctx);
        boid.update(boids);
    }
    await new Promise(r => setTimeout(r, 10));
}