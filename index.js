const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background  = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background-game.png'
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 114
    },
    imageSrc: './img/shop_anim.png',
    scale: 2.75,
    framesMax: 6
})


const player = new Fighter({
    position: {
    x: 0,
    y: 0
  },
  velocity: {
    x:0,
    y:10
  },
  offset:{
    x: 0,
    y: 0
  },
  imageSrc: './img/Ronin/Sprites/idle.png',
  framesMax: 8,
  scale: 2.5,
  offset: {
    x:215,
    y:157
  },
  sprites: {
    idle: {
        imageSrc: './img/Ronin/Sprites/idle.png',
        framesMax: 8 
    },
    run: {
        imageSrc: './img/Ronin/Sprites/Run.png',
        framesMax: 8 
  },
  jump: {
    imageSrc: './img/Ronin/Sprites/Jump.png',
    framesMax: 2
},
  fall: {
    imageSrc: './img/Ronin/Sprites/Fall.png',
    framesMax: 2
  },
  attack1: {
    imageSrc: './img/Ronin/Sprites/Attack1.png',
    framesMax: 6
  },
  takeHit: {
    imageSrc: './img/Ronin/Take Hit.png',
    framesMax: 4
}
  
},
attackBox: {
    offset:{
        x: 100,
        y: 50
    },
    width: 160,
    height: 50

}
})



const enemy = new Fighter({
    position: {
    x: 400,
    y: 100
  },
    velocity: {
    x:0,
    y:0
  },
    color: 'blue',
    offset:{
    x: -50,
    y: 0
  },
  imageSrc: './img/Onigirii/Sprites/idle.png',
  framesMax: 4,
  scale: 2.5,
  offset: {
    x:215,
    y:167
  },
  
  sprites: {
    idle: {
        imageSrc: './img/Onigirii/Sprites/idle.png',
        framesMax: 4 
    },
    run: {
        imageSrc: './img/Onigirii/Sprites/Run.png',
        framesMax: 8
    },
    jump: {
        imageSrc: './img/Onigirii/Sprites/Jump.png',
        framesMax: 2
    },
    fall: {
        imageSrc: './img/Onigirii/Sprites/Fall.png',
        framesMax: 2
    },
    attack1: {
        imageSrc: './img/Onigirii/Sprites/Attack1.png',
        framesMax: 4
    },
    takeHit: {
        imageSrc: './img/Onigirii/Take hit.png',
        framesMax: 3
    }
  },
  attackBox: {
    offset:{
        x: -170,
        y: 50
    },
    width: 170,
    height: 50

}
})

console.log(player);

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    //player movement
    
    if (keys.a.pressed && player.lastKey === 'a') {
      player.velocity.x = -5
      player.switchSprites('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
     player.velocity.x = 5
     player.switchSprites('run')   
    } else{
        player.switchSprites('idle')
    }
    //jumping
    if (player.velocity.y < 0 ){
        player.switchSprites('jump')
    }else if (player.velocity.y > 0){
        player.switchSprites('fall')
    }

    //enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprites('run')
      } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
       enemy.velocity.x = 5 
       enemy.switchSprites('run')
      }else {
        enemy.switchSprites('idle')
      }
      if (enemy.velocity.y < 0 ){
        enemy.switchSprites('jump')
    }else if (enemy.velocity.y > 0){
        enemy.switchSprites('fall')
    }

      // detect for collision & and enemy gets hit
      if(
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking && player.framCurrent === 4
        ) {
            enemy.takeHit()
        player.isAttacking = false
   
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
      }

      // if player misses 
      if (player.isAttacking && player.framCurrent === 4) {
        player.isAttacking = false
      }

       //this is where player gets
      if(
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking && enemy.framCurrent === 2
        ) {
        enemy.isAttacking = false
        player.health -= 20
        document.querySelector('#playerHealth').style.width = player.health + '%'
      }

      // if player misses 
      if (enemy.isAttacking && enemy.framCurrent === 2) {
        enemy.isAttacking = false
      }

      // end game based on health
      if(enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId})


      }
}
animate()

window.addEventListener('keydown', (event) => {
    console.log(event.key);
    switch (event.key) {
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break;
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break;
        case 'w':
            player.velocity.y = -20
            break;
        case ' ':
            player.attack()
            break;

        case 'ArrowDown':
             enemy.attack()
            break;
            
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey ='ArrowRight'
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break;
        case 'ArrowUp':
            enemy.velocity.y = -20
            break;    
    
    }
    console.log(event.key);
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break;
        case 'a':
            keys.a.pressed = false
            break;
        case 'w':
            keys.w.pressed = false
            lastKey = 'w'
            break;
            
    }
    //enemy keys
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break;
       
    }
    console.log(event.key); 

})