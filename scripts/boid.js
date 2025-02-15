import { separationfactor, separationzone, alignmentfactor, 
    alignmentzone, cohesionfactor, cohesionzone, 
    leftmargin, rightmargin, topmargin, bottommargin, 
    turnfactor, maxspeed, minspeed } from './parameters.js';

export default class Boid {
    x;
    y;
    speedvector;

    constructor(x, y){
        this.x = x;
        this.y = y;
        let tempdir = [Math.random()-0.5, Math.random()-0.5];
        let len = Math.sqrt(tempdir[0] ** 2 + tempdir[1] ** 2);
        this.speedvector = [tempdir[0] / len, tempdir[1] / len];
    }
    /**
     * 
     * @param boids 
     * @returns the sum of the directions away from the other boids that are in range
     */
    calculateSerapationDirection(boids){
        let separation = [0, 0];
        for (let boid of boids){
            if (boid != this && Math.sqrt((this.x - boid.x) ** 2 + (this.y - boid.y) ** 2) < separationzone){
                separation[0] += this.x - boid.x;
                separation[1] += this.y - boid.y;
            }
        }
        return separation;
    }
    /**
     * 
     * @param boids 
     * @returns the difference between the speedvector of the boids and the speedvector of this boid
     */
    calculatealignmentDirection(boids){
        let averageSpeedVector = [0, 0];
        let count = 0;
        for (let boid of boids){
            if (boid != this && Math.sqrt((this.x - boid.x) ** 2 + (this.y - boid.y) ** 2) < alignmentzone){
                averageSpeedVector[0] += boid.speedvector[0];
                averageSpeedVector[1] += boid.speedvector[1];
                count++;
            }
        }
        if (count == 0){
            return this.speedvector;
        } else {
            averageSpeedVector = [(averageSpeedVector[0] / count)-this.speedvector[0], (averageSpeedVector[1]/count)-this.speedvector[1]];
            return averageSpeedVector;
        }
    }
    /**
     * 
     * @param boids 
     * @returns the direction to the center of mass of the boids
     */
    calculateCohesionDirection(boids){
        let averageX = 0;
        let averageY = 0;
        let count = 0;
        for (let boid of boids){
            if (boid != this && Math.sqrt((this.x - boid.x) ** 2 + (this.y - boid.y) ** 2) < separationzone){
                averageX += boid.x;
                averageY += boid.y;
                count++;
            }
        }
        if (count == 0){
            return [0, 0];
        } else {
            return [averageX/count - this.x, averageY/count - this.y];
        }
    }

    update(boids){
        let separation = this.calculateSerapationDirection(boids);
        let alignment = this.calculatealignmentDirection(boids);
        let cohesion = this.calculateCohesionDirection(boids);
        this.speedvector[0] += separationfactor * separation[0] + alignmentfactor * alignment[0] + cohesionfactor * cohesion[0];
        this.speedvector[1] += separationfactor * separation[1] + alignmentfactor * alignment[1] + cohesionfactor * cohesion[1];
        if (this.x < leftmargin){
            this.speedvector[0] += turnfactor;
        }
        if (this.x > rightmargin){
            this.speedvector[0] -= turnfactor;
        }
        if (this.y < topmargin){
            this.speedvector[1] += turnfactor;
        }
        if (this.y > bottommargin){
            this.speedvector[1] -= turnfactor;
        }
        let speed = Math.sqrt(this.speedvector[0] ** 2 + this.speedvector[1] ** 2);
        if (speed > maxspeed){
            this.speedvector[0] = (this.speedvector[0] / speed) * maxspeed;
            this.speedvector[1] = (this.speedvector[1] / speed) * maxspeed;
        }
        if (speed < minspeed){
            this.speedvector[0] = (this.speedvector[0] / speed) * minspeed;
            this.speedvector[1] = (this.speedvector[1] / speed) * minspeed;
        }
        this.x += this.speedvector[0];
        this.y += this.speedvector[1];
    }

    draw(ctx){
        // let angle = Math.atan2(this.speedvector[1], this.speedvector[0]);
        // ctx.beginPath();
        // ctx.moveTo(this.x, this.y);
        // ctx.lineTo(this.x + 20*Math.cos(angle+Math.PI/10+Math.PI), this.y + 20*Math.sin(angle+Math.PI/10+Math.PI));
        // ctx.lineTo(this.x + 20*Math.cos(angle-Math.PI/10+Math.PI), this.y + 20*Math.sin(angle-Math.PI/10+Math.PI));
        // ctx.lineTo(this.x, this.y);
        // ctx.fill();
        let angle = Math.atan2(this.speedvector[1], this.speedvector[0]) + Math.PI;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(angle);

        ctx.beginPath();
        // Smaller Body
        ctx.moveTo(0, 0);
        ctx.lineTo(20, 8);
        ctx.lineTo(30, 0);
        ctx.lineTo(20, -8);
        ctx.lineTo(0, 0);
        ctx.fillStyle = 'lightblue';
        ctx.fill();

        // Original Tail
        ctx.beginPath();
        ctx.moveTo(30, 0);
        ctx.lineTo(40, 10);
        ctx.lineTo(40, -10);
        ctx.lineTo(30, 0);
        ctx.fillStyle = 'orange';
        ctx.fill();

        ctx.restore();
    }
}