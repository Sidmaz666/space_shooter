let player;
let enemies = [];
let bullets = [];
let enemyBullets = [];
let playerBulletInterval = 12;
let playerLives = 3;
let enemiesKilled = 0;
let playerScore = 0;
let boss;
let bossBulletInterval = 50;
let bossHealth = 25;
let isBoss = false;
let lifePotion;
let isPotion = false;
let potionInterval = 500;
let level = 1;
let lastkillShot = 0;
let enemySpeed = 2;
let enemyFollowSpeed = 0.3;
let enemyBulletSpeed = 3.3;
let bossSpeed = 2;
let bossMovingRight = true;
let riseDifficulty = 0.1;
let playerBulletSpeed = 8;
let playerSpeed = 5;
let playerImage;
let playerBulletImage;
let enemyBulletImage;
let enemyImage;
let bossBulletImage;
let backgroundImage;
let backgroundX = 0;
let scrollSpeed = 1;
let controlPanelDiameter = 150;
let controlPanelCenterX;
let controlPanelCenterY;
let isTouchingControl = false;
let touchVector;
let isMobileDevice;
let gameStarted = false;
let gameOver = false;
let startButton;
let bossImages = [];
let skyImages = [];
let bgMusic;
let enemyKilledSound;
let playerHitSound;
let gameOverSound;
let potionSound;
let bgMusicButton;
let isSoundEffect = false;
let soundEffectButton;
let link;
const isMobileByScreenWidth = () => window.innerWidth <= 768;
const isMobileByUserAgent = () =>
  /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
const isMobileByTouch = () =>
  "ontouchstart" in window || navigator.maxTouchPoints;
const isMobileByMediaQuery = () =>
  window.matchMedia("(max-width: 768px)").matches;
const isMobileBySpecificBrowsers = () => {
  const mobileBrowsers = [
    "Android",
    "webOS",
    "iPhone",
    "iPad",
    "iPod",
    "BlackBerry",
    "IEMobile",
    "Opera Mini",
  ];
  return mobileBrowsers.some((browser) =>
    navigator.userAgent.includes(browser)
  );
};
const MAX_ENEMIES = 5;

function preload() {
  document.body.style.background = "#212326";
  document.body.style.overflow = "hidden";
  document.getElementById("p5_loading").textContent = "";
  document.getElementById("p5_loading").insertAdjacentHTML(
    "beforeend",
    `
    <div style="height:100vh;width:100vw;
    display:flex; justify-content:center;
    align-items:center;">
	 <style>
    .spinner {
      border: 4px solid #90CAF9;
      border-top: 4px solid #333;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    </style>
    <div class="spinner"></div>
    </div>
    `
  );
  playerImage = loadImage("./assets/img/player.png");
  playerBulletImage = loadImage("./assets/img/playerBullet.png");
  enemyBulletImage = loadImage("./assets/img/enemyBullet.png");
  enemyImage = loadImage("./assets/img/enemy.png");
  potionImage = loadImage("./assets/img/life.png");
  bossBulletImage = loadImage("./assets/img/bossBullet.png");
  isMobileDevice = (function () {
    return (
      isMobileByScreenWidth() ||
      isMobileByUserAgent() ||
      isMobileByTouch() ||
      isMobileByMediaQuery() ||
      isMobileBySpecificBrowsers()
    );
  })();

  for (let i = 1; i <= 10; i++) {
    const bossImage = loadImage(`./assets/img/boss_${i}.png`);
    bossImages.push(bossImage);
  }
  for (let i = 1; i <= 8; i++) {
    const skyImage = loadImage(`./assets/img/sky_${i}.png`);
    skyImages.push(skyImage);
  }
  bgMusic = loadSound("./assets/audio/bg.mp3");
  gameOverSound = loadSound("./assets/audio/gameOver.wav");
  potionSound = loadSound("./assets/audio/potion.wav");
  enemyKilledSound = loadSound("./assets/audio/enemyKilled.wav");
  playerHitSound = loadSound("./assets/audio/playerHit.wav");
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  backgroundImage =
    skyImages[Math.floor(Math.random() * skyImages.length - 1) + 1];
  player = createSprite(50, height / 2, 40, 40);
  player.addImage(playerImage);
  startButton = createButton(
    `Start <i class="fa-solid fa-play fa-2xs" style="transform:translateY(2px); padding-left:5px"></i>`
  );
  startButton.position(width / 2 - 100, height / 2 - 20);
  startButton.size(200, 40);
  startButton.style("font-size", "30px");
  startButton.style("font-style", "italic");
  startButton.style("font-weight", "bold");
  startButton.style("border-radius", "50px");
  startButton.style("border", "none");
  startButton.style("background", "#304FFE95");
  startButton.style("cursor", "pointer");
  startButton.style("color", "#FFF");
  startButton.mousePressed(startGame);
  bgMusicButton = createButton(
    `<i class="fa-solid fa-volume-${
      bgMusic.isPlaying() ? "high" : "xmark"
    } fa-2xs" style="transform:translateY(2px); padding-left:5px"></i>`
  );
  bgMusicButton.position(width / 2 - 60, height / 2 + 40);
  bgMusicButton.size(40, 40);
  bgMusicButton.style("font-size", "30px");
  bgMusicButton.style("font-style", "italic");
  bgMusicButton.style("font-weight", "bold");
  bgMusicButton.style("border-radius", "50px");
  bgMusicButton.style("border", "none");
  bgMusicButton.style("background", "#304FFE95");
  bgMusicButton.style("cursor", "pointer");
  bgMusicButton.style("color", "#FFF");
  bgMusicButton.mousePressed(bgMusicPlay);

  soundEffectButton = createButton(
    `
    <div style="display:flex;justify-content:center;align-items:center">
    <i class="fa-solid fa-music fa-2xs" style="transform:translateY(2px); padding-left:5px"></i> 
<span style="font-size:15px">
    ${isSoundEffect ? "" : "x"}
</span>
    </div>
    `
  );
  soundEffectButton.position(width / 2 + 10, height / 2 + 40);
  soundEffectButton.size(40, 40);
  soundEffectButton.style("font-size", "30px");
  soundEffectButton.style("font-style", "italic");
  soundEffectButton.style("font-weight", "bold");
  soundEffectButton.style("border-radius", "50px");
  soundEffectButton.style("border", "none");
  soundEffectButton.style("background", "#304FFE95");
  soundEffectButton.style("cursor", "pointer");
  soundEffectButton.style("color", "#FFF");
  soundEffectButton.mousePressed(soundEffectToggle);

  if (isMobileDevice) {
    startButton.touchStarted(startGame);
    bgMusicButton.touchStarted(bgMusicPlay);
    soundEffectButton.touchStarted(soundEffectToggle);
    disableDoubleTapZoom();
    controlPanelCenterX = controlPanelDiameter / 2 + 20;
    controlPanelCenterY = height - controlPanelDiameter / 2 - 10;
  }
  bgMusic.setVolume(0.15);
  link = createA("https://github.com/sidmaz666", "Developed By Sidmaz666");
  link.position(width / 2 - 100, height - 50);
  link.style("font-size", "20px");
  link.style("color", "white");
  link.style("text-decoration", "none");
}

function draw() {
  background(0);

  image(backgroundImage, backgroundX, 0, width, height);
  image(backgroundImage, backgroundX + width, 0, width, height);

  backgroundX -= scrollSpeed;
  if (backgroundX <= -width) {
    backgroundX = 0;
  }

  if (!gameStarted) {
    startButton.show();
    bgMusicButton.show();
    soundEffectButton.show();
  } else {
    startButton.hide();
    bgMusicButton.hide();
    soundEffectButton.hide();
    link.hide();
    player.position.x = constrain(player.position.x, 20, width - 50);
    player.position.y = constrain(player.position.y, 20, height - 20);

    if (isMobileDevice) {
      if (width < height) {
        textAlign(CENTER, CENTER);
        fill(255);
        textSize(20);
        text("Please Rotate your Device", width / 2, height / 2 - 150);
        text("Turn On Landscape Mode", width / 2, height / 2 - 100);
        text("Refresh the Page!", width / 2, height / 2 - 50);
      }
      noFill();
      stroke(255, 100);
      strokeWeight(2);
      ellipse(controlPanelCenterX, controlPanelCenterY, controlPanelDiameter);

      if (isTouchingControl) {
        fill(255, 50);
        noStroke();
        ellipse(touchVector.x, touchVector.y, 40);
      }

      if (isTouchingControl) {
        let playerDirection = createVector(
          touchVector.x - controlPanelCenterX,
          touchVector.y - controlPanelCenterY
        );
        playerDirection.normalize();
        player.velocity.x = playerDirection.x * 5;
        player.velocity.y = playerDirection.y * 5;
      } else {
        player.velocity.x = 0;
        player.velocity.y = 0;
      }
    }

    if (frameCount % playerBulletInterval === 0) {
      shootBullet();
    }

    if (keyIsDown(UP_ARROW)) {
      player.position.y -= playerSpeed;
    }
    if (keyIsDown(DOWN_ARROW)) {
      player.position.y += playerSpeed;
    }

    if (keyIsDown(LEFT_ARROW)) {
      player.position.x -= playerSpeed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      player.position.x += playerSpeed;
    }

    for (let i = bullets.length - 1; i >= 0; i--) {
      bullets[i].position.x += playerBulletSpeed;
      if (bullets[i].position.x > width) {
        bullets[i].remove();
        bullets.splice(i, 1);
      }
    }

    if (frameCount % 60 === 0 && enemies.length < MAX_ENEMIES && !isBoss) {
      createEnemy();
    }

    if (enemiesKilled == level * 10 + lastkillShot) {
      createBoss();
      lastkillShot = enemiesKilled;
    }

    if (isBoss) {
      if (boss.position.y < player.position.y) {
        boss.position.y += bossSpeed;
      } else if (boss.position.y > player.position.y) {
        boss.position.y -= bossSpeed;
      }

      if (bossMovingRight) {
        boss.position.x += bossSpeed;
      } else {
        boss.position.x -= bossSpeed;
      }

      if (boss.position.x >= width - 30 || boss.position.x <= width / 2) {
        bossMovingRight = !bossMovingRight;
      }

      if (player.collide(boss)) {
        playerLives = 0;
        playerHit(player, player);
      }

      for (let bullet of bullets) {
        if (isBoss && bullet.collide(boss)) {
          bossHealth--;
          bullet.remove();
          if (bossHealth <= 0) {
            playerScore += 25;
            if (isSoundEffect) {
              enemyKilledSound.play();
            }
            boss.remove();
            isBoss = false;
            boss = undefined;
            level++;
            bossHealth = 25 * level;
            enemySpeed += riseDifficulty;
            enemyBulletSpeed += riseDifficulty;
            enemyFollowSpeed += riseDifficulty;
            bossSpeed += riseDifficulty;
            playerSpeed += riseDifficulty / 2;
            playerBulletSpeed += riseDifficulty / 2;
            if (level % 5 === 0) {
              backgroundImage = loadImage(
                `./assets/img/sky_${Math.floor(Math.random() * 8) + 1}.png`
              );
            }
          }
        }
      }

      if (frameCount % bossBulletInterval === 0) {
        bossShoot();
      }
    }

    if (frameCount % potionInterval === 0 && !isPotion) {
      createLifePotion();
    }

    if (isPotion) {
      lifePotion.position.x -= 3;
      if (lifePotion.position.x < 0) {
        lifePotion.remove();
        isPotion = false;
        lifePotion = undefined;
      }
      if (isPotion == true && lifePotion.collide(player)) {
        playerLives++;
        if (isSoundEffect) {
          potionSound.play();
        }
        playerScore += 20;
        lifePotion.remove();
        isPotion = false;
        lifePotion = undefined;
      }
    }

    for (let enemy of enemies) {
      enemy.position.x -= enemySpeed;

      if (enemy.position.y < player.position.y) {
        enemy.position.y += enemyFollowSpeed;
      } else if (enemy.position.y > player.position.y) {
        enemy.position.y -= enemyFollowSpeed;
      }

      if (enemy.position.x < 0) {
        enemy.remove();
        enemies.shift();
      }
      for (let bullet of bullets) {
        if (enemy.collide(bullet)) {
          enemiesKilled++;
          if (isSoundEffect) {
            enemyKilledSound.play();
          }
          playerScore += 10;
          enemy.remove();
          bullets.splice(bullets.indexOf(bullet), 1);
          enemies.splice(enemies.indexOf(enemy), 1);
          bullet.remove();
        }
      }
      if (frameCount % 90 === 0) {
        enemyShoot(enemy.position.x, enemy.position.y);
      }
    }

    for (let bullet of enemyBullets) {
      bullet.position.x -= enemyBulletSpeed;
      if (bullet.position.x < 0) {
        bullet.remove();
        enemyBullets.splice(enemyBullets.indexOf(bullet), 1);
      }

      if (bullet.overlap(player)) {
        playerHit(player, bullet);
      }
    }

    player.collide(enemies, playerHit);
  }

  drawSprites();

  if (gameStarted) {
    textSize(20);
    fill(255);
    textAlign(LEFT);
    text(`Level: ${level}`, 10, 30);

    textSize(20);
    fill(255);
    textAlign(RIGHT);
    text(`Lives: ${playerLives}`, width - 20, 30);

    textSize(20);
    fill(255);
    textAlign(RIGHT);
    text(`Score: ${playerScore}`, width - 20, 60);

    textSize(20);
    fill(255);
    textAlign(RIGHT);
    text(`Kills: ${enemiesKilled}`, width - 20, 90);
  }

  if (gameOver) {
    if (bgMusic.isPlaying()) {
      bgMusic.stop();
      bgMusicButton.html(
        `
	<i class="fa-solid fa-volume-xmark fa-2xs" style="transform:translateY(2px); padding-left:5px"></i>`
      );
    }
    if (isSoundEffect) {
      gameOverSound.play();
    }
    textSize(25);
    fill(255);
    textAlign(CENTER, CENTER);
    textStyle(BOLDITALIC);
    stroke("#00000030");
    strokeWeight(4);
    text(`Score: ${playerScore}`, width / 2, height / 2 + 50);
    startButton.show();
    startButton.html(
      `Restart <i class="fa-solid fa-repeat fa-2xs" style="transform:translateY(2px); padding-left:5px"></i>`
    );
    bgMusicButton.position(width / 2 - 60, height / 2 + 80);
    bgMusicButton.show();
    soundEffectButton.position(width / 2 + 10, height / 2 + 80);
    soundEffectButton.show();
  }
}

function shootBullet() {
  let bullet = createSprite(player.position.x + 20, player.position.y, 10, 5);
  bullet.addImage(playerBulletImage);
  bullets.push(bullet);
}

function enemyShoot(x, y) {
  let enemyBullet = createSprite(x - 20, y, 10, 5);
  enemyBullet.addImage(enemyBulletImage);
  enemyBullets.push(enemyBullet);
}

function createEnemy() {
  if (enemies.length < MAX_ENEMIES) {
    let enemy = createSprite(width, random(20, height - 20), 30, 30);
    enemy.addImage(enemyImage);
    enemies.push(enemy);
  }
}

function createBoss() {
  if (!boss) {
    boss = createSprite(width - 40, height / 2, 60, 60);
    boss.addImage(
      bossImages[Math.floor(Math.random() * bossImages.length - 1) + 1]
    );
    isBoss = true;
  }
}

function bossShoot() {
  if (boss) {
    let bullet1 = createSprite(
      boss.position.x - 20,
      boss.position.y - 15,
      10,
      5
    );
    bullet1.addImage(bossBulletImage);
    enemyBullets.push(bullet1);
    let bullet2 = createSprite(
      boss.position.x - 20,
      boss.position.y + 15,
      10,
      5
    );
    bullet2.addImage(bossBulletImage);
    enemyBullets.push(bullet2);
  }
}

function createLifePotion() {
  if (!lifePotion) {
    lifePotion = createSprite(width, random(20, height - 20), 30, 30);
    lifePotion.addImage(potionImage);
    isPotion = true;
  }
}

function playerHit(player, any) {
  playerLives--;
  any.remove();
  if (playerLives <= 0) {
    player.remove();
    gameOver = true;
    noLoop();
  } else {
    if (isSoundEffect) {
      playerHitSound.play();
    }
  }
}

function touchStarted() {
  if (isMobileDevice) {
    if (link && link.elt.contains(touches[0].x, touches[0].y)) {
      window.open(link.elt.href, "_blank");
    }
    let touchDistance = dist(
      controlPanelCenterX,
      controlPanelCenterY,
      touches[0].x,
      touches[0].y
    );
    if (touchDistance <= controlPanelDiameter / 2) {
      isTouchingControl = true;
      touchVector = createVector(touches[0].x, touches[0].y);
    }
    return false;
  }
}

function touchMoved() {
  if (isMobileDevice && isTouchingControl) {
    touchVector = createVector(touches[0].x, touches[0].y);
  }
  return false;
}

function touchEnded() {
  if (isMobileDevice && gameStarted) {
    isTouchingControl = false;
    player.velocity.x = 0;
    player.velocity.y = 0;
    return false;
  }
}

function startGame() {
  if (gameOver) {
    gameStarted = false;
    gameOver = false;
  }
  gameStarted = true;
  player.remove();
  player = createSprite(50, height / 2, 40, 40);
  player.addImage(playerImage);
  reset();
  loop();
}

function reset() {
  for (let enemy of enemies) {
    enemy.remove();
  }
  for (let bullet of bullets) {
    bullet.remove();
  }
  for (let enemyBullet of enemyBullets) {
    enemyBullet.remove();
  }
  if (lifePotion && isPotion) {
    lifePotion.remove();
    lifePotion = undefined;
  }
  if (boss && isBoss) {
    boss.remove();
    boss = undefined;
  }
  playerBulletInterval = 12;
  playerLives = 3;
  enemiesKilled = 0;
  playerScore = 0;
  bossBulletInterval = 50;
  bossHealth = 25;
  isBoss = false;
  isPotion = false;
  potionInterval = 500;
  level = 1;
  lastkillShot = 0;
  enemySpeed = 2;
  enemyFollowSpeed = 0.3;
  enemyBulletSpeed = 3.3;
  bossSpeed = 2;
  bossMovingRight = true;
  riseDifficulty = 0.1;
  playerBulletSpeed = 8;
  playerSpeed = 5;
  backgroundX = 0;
  scrollSpeed = 1;
  controlPanelDiameter = 150;
  isTouchingControl = false;
}

function bgMusicPlay() {
  if (bgMusic.isPlaying()) {
    bgMusic.stop();
    bgMusicButton.html(
      `
    <i class="fa-solid fa-volume-xmark fa-2xs" style="transform:translateY(2px); padding-left:5px"></i>`
    );
  } else {
    bgMusicButton.html(
      `
    <i class="fa-solid fa-volume-high fa-2xs" style="transform:translateY(2px); padding-left:5px"></i>`
    );
    bgMusic.play();
    bgMusic.loop();
  }
}

function soundEffectToggle() {
  isSoundEffect = !isSoundEffect;
  soundEffectButton.html(
    `
    <div style="display:flex;justify-content:center;align-items:center">
    <i class="fa-solid fa-music fa-2xs" style="transform:translateY(2px)"></i> 
  <span style="font-size:15px">
    ${isSoundEffect ? "" : "x"}
  </span>
    </div>
    `
  );
}

function disableDoubleTapZoom() {
  let lastTouchEnd = 0;
  const touchThreshold = 300;
  document.addEventListener(
    "touchend",
    function (event) {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= touchThreshold) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    },
    false
  );
}
