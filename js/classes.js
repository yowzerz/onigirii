class Sprite {
    constructor({
        position, 
        imageSrc, 
        scale = 1, 
        framesMax = 1, 
        offset = {x: 0, y:0} 
    }) {
        this.position = position
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.framCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.offset = offset
    }
 
    draw() {
        c.drawImage(
            this.image,
            this.framCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.offset.x, 
            this.position.y - this.offset.y, 
            (this.image.width / this.framesMax)* this.scale,
            this.image.height * this.scale
        )
    }

    animateFrames() {
        this.framesElapsed++

        if (this.framesElapsed % this.framesHold === 0 ) {

      if(this.framCurrent < this.framesMax - 1){
        this.framCurrent++
      } else {
        this.framCurrent = 0
       }  
     }
    }

    update() {
        this.draw()
        this.animateFrames()
    }
}

class Fighter extends Sprite {
    constructor({
        position, 
        velocity, 
        color = 'red',
        imageSrc, 
        scale = 1, 
        framesMax = 1,
        offset = {x: 0, y:0},
        sprites,
        attackBox = { offset: {}, width: undefined, height: undefined}

    }) {
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset
        })
        this.velocity = velocity
        this.width = 50 
        this.height = 150
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height, 
        }
        this.color = color
        this.isAttacking
        this.health = 100
        this.framCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.sprites = sprites
        
        for (const sprite in this.sprites){
            sprites[sprite].image = new Image ()
            sprites[sprite].image.src = sprites [sprite].imageSrc
        }
        
    }
    update() {
        this.draw()
        this.animateFrames()

       //attack boxes
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y
       // draw attack box
        //c.fillRect(
            // this.attackBox.position.x, 
           // this.attackBox.position.y,
          //  this.attackBox.width, 
         //this.attackBox.height
        // )

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        //gravity
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 110) {
            this.velocity.y = 0
            this.position.y = 316
        } else this.velocity.y += gravity

      
    }

    attack() {
        this.switchSprites('attack1')
        this.isAttacking = true 
    }
    
    takeHit(){
        this.switchSprites('tekaHit')
        this.health-= 20
    }

    switchSprites(sprite) {
        //overwriting all other animations with attack animation
        if(
            this.image === this.sprites.attack1.image && 
            this.framCurrent < this.sprites.attack1.framesMax - 1
        ) 
            return

            //overwrite when fighter gets hit
            if(
                this.image === this.sprites.takeHit.image && 
                this.framCurrent < this.sprites.takeHit.framesMax - 1
                ) 
                return

        switch (sprite) {
            case 'idle': 
                if (this.image !== this.sprites.idle.image) {
                this.image = this.sprites.idle.image
                this.framesMax = this.sprites.idle.framesMax
                this.framCurrent = 0
            }
                break;
            case 'run':
                if(this.image !== this.sprites.run.image) {
                this.image = this.sprites.run.image
                this.framesMax = this.sprites.run.framesMax
                this.framCurrent = 0
            }   
                break;
            case 'jump':
                if(this.image !== this.sprites.jump.image){
                this.image = this.sprites.jump.image
                this.framesMax = this.sprites.jump.framesMax
                this.framCurrent = 0
            }   
                break;    
            case 'fall':
                if(this.image !== this.sprites.fall.image){
                this.image = this.sprites.fall.image
                this.framesMax = this.sprites.fall.framesMax
                this.framCurrent = 0
            }   
                break;
             case 'attack1':
                if(this.image !== this.sprites.attack1.image){
                this.image = this.sprites.attack1.image
                this.framesMax = this.sprites.attack1.framesMax
                this.framCurrent = 0
            }   
                break;
                case 'takeHit':
                    if(this.image !== this.sprites.takeHit.image){
                    this.image = this.sprites.takeHit.image
                    this.framesMax = this.sprites.takeHit.framesMax
                    this.framCurrent = 0
                }           
        }
       
    }
}