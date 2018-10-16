document.body.addEventListener('touchstart', jumpHero, false)
document.body.addEventListener('mousedown', jumpHero, false)
document.body.addEventListener('keyup', jumpHero, false)

var game = {
  board: document.getElementById('theBoard'),
  isRunning: false,
  loop: false,
  letterLoop: false,
  word: 'COLU',
  score: '',
  baseY: 200,
  letters: [],
  hero: {
    width: 50,
    height: 50,
    currentLocation: [100, 150],
    isJumping: false,
    jumpHeight: 100,
    jumpInterval: false,
    jumpStep: 2,
    jumpDir: 1
  }
}

function createLetter () {
  var y = game.baseY - Math.floor(game.hero.height / 2)
  if (Math.random() > 0.5) {
    y = game.baseY - game.hero.jumpHeight
  }
  game.letters.push({
    currentLocation: [game.board.scrollWidth, y],
    character: game.word[Math.floor(Math.random() * game.word.length)],
    interval: 2
  })
  console.log(game.letters)
}

function letterCaptured (letter) {
  // check if letter is in the same coordinates as the hero
  if (
    (letter.currentLocation[0] > game.hero.currentLocation[0]) &&
    (letter.currentLocation[0] < game.hero.currentLocation[0] + game.hero.width) &&
    (letter.currentLocation[1] > game.hero.currentLocation[1]) &&
    (letter.currentLocation[1] < game.hero.currentLocation[1] + game.hero.height)
  ) {
    game.score += letter.character
    // check if captured letter is good
    if (game.word.indexOf(game.score) !== 0) {
      game.score = ''
    }
    return true
  }
  return false
}

function clear () {
  const context = game.board.getContext('2d')
  context.clearRect(0, 0, game.board.width, game.board.height)
}

function drawHero () {
  var ctx = game.board.getContext('2d')
  ctx.beginPath()
  ctx.rect(game.hero.currentLocation[0], game.hero.currentLocation[1], game.hero.width, game.hero.height)
  ctx.stroke()
}

function jumpHero () {
  if (game.hero.isJumping) return false
  console.log('jumping!')
  game.hero.jumpInterval = setInterval(doJumpStep, 10)
}

function doJumpStep () {
  // mark hero as jumping
  game.hero.isJumping = true

  // move hero jump step
  game.hero.currentLocation[1] -= game.hero.jumpStep * game.hero.jumpDir

  // check if hero is at the top of the jump
  if (game.hero.currentLocation[1] <= game.baseY - game.hero.jumpHeight - game.hero.height) {
    game.hero.jumpDir *= -1
  }

  // check for end of jump
  if (game.hero.jumpDir === -1 && game.hero.currentLocation[1] === game.baseY - game.hero.height) {
    clearInterval(game.hero.jumpInterval)
    game.hero.jumpDir = 1
    game.hero.isJumping = false
  }

  return true
}

function drawLetters () {
  game.letters.forEach(function (letter) {
    letter.currentLocation[0] -= letter.interval
  })

  game.letters = game.letters.filter(function (letter) {
    return (letter.currentLocation[0] > 0 && !letterCaptured(letter))
  })

  game.letters.forEach(function (letter) {
    var ctx = game.board.getContext('2d')
    ctx.font = '30px Arial'
    ctx.fillText(letter.character, letter.currentLocation[0], letter.currentLocation[1])
  })
}

function drawScore () {
  var ctx = game.board.getContext('2d')
  ctx.font = '50px Arial'
  ctx.strokeText(game.score, game.board.width / 2, game.board.height / 2)
}

function checkWin () {
  if (game.score === game.word) {
    clear()
    // clear intervals
    clearInterval(game.loop)
    clearInterval(game.letterLoop)
    // draw win
    var ctx = game.board.getContext('2d')
    ctx.font = '30px Arial'
    ctx.fillText('WELL DONE!!', 100, 50)
  }
}

function gameLoop () {
  clear()
  drawLetters()
  drawHero()
  drawScore()
  checkWin()
}

function startGame () {
  if (!game.isRunning) {
    game.board.width = document.body.scrollWidth
    game.board.height = 200
    game.loop = setInterval(gameLoop, 10)
    game.letterLoop = setInterval(createLetter, 1000)
  }
}
