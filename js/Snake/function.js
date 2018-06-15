//Snake Game
//Midare Kanade
//2013.12

//CATALOG (use Ctrl/Command + F to locate)
//Definition of Main ($('document').ready())
//Definition of Snake
//Definition of Food
//Definition of Stage
//Definition of Welcome
//Definition of Pause
//Definition of Dead
//Definition of HighScore
//Definition of Difficulty
//Definition of Game

//Definition of Main
$(document).ready(function(){
  //Declaration of Stage
  var stage = new Stage(32, 18)

  //Default gameSpeed is normal (100)
  var game = new Game(stage,100)
  var gameSpeed = game.gameSpeed

  //Declaration of Stage
  var highScore = 0

  //Declaration of Level which is not needed in the beginning
  var lWelcome
  var lPause
  var lDead
  var lDifficulty
  var lHighScore

  //Read Cookie
  if($.cookie('highScore')){
    highestScore = $.cookie('highScore')
  }else{
    $.cookie('highScore', highScore, {expires: 7});
  }

  //Stage Init
  stage.init()

  //Welcome Init
  welcome = new Welcome(stage)
  welcome.init()

  //Level Controller
  //When the level event is triggered
  //1. stage.clearStage()
  //2. LEVEL = null
  //3. LEVEL = new LEVEL()
  //4. LEVEL.init()
  //5. some codes else
  $('#container').bind('lWelcome',function(){
    stage.clearStage()
    lWelcome = null
    lWelcome = new Welcome(stage)
    lWelcome.init()
  })

  $('#container').bind('lStart',function(){
    //Load Game Speed
    gameSpeed = game.gameSpeed

    stage.clearStage()
    game = null
    game = new Game(stage,gameSpeed)
    game.init()
  })

  $('#container').bind('lPause',function(){
    //Save HighScore when pause
    if(game.score > highScore){
      highScore = game.score
      $.cookie('highScore', highScore, {expires: 7});
    }

    game.isPause  = true
    game.pause()
    lPause = null
    lPause = new Pause(stage, game)
    lPause.init()
  })

  $('#container').bind('lDead',function(){
    //Save HighScore when dead
    if(game.score > highScore){
      highScore = game.score
      $.cookie('highScore', highScore, {expires: 7});
    }

    game.isPause  = true
    game.pause()
    lDead = null
    lDead = new Dead(stage, game)
    lDead.init()
  })

  $('#container').bind('lDifficulty',function(){
    stage.clearStage()
    lDifficulty = null
    lDifficulty = new Difficulty(stage, game)
    lDifficulty.init()
  })

  $('#container').bind('lHighScore',function(){
    stage.clearStage()
    lHighScore = null
    lHighScore = new HighScore(stage, game, highScore)
    lHighScore.init()
  })

  $('#container').bind('lResume',function(){
    game.isPause  = false
    $('.button').remove()
    $('#scoreboard').remove()
    game.resume()
  })

  $('#container').bind('lResetHighScore',function(){
    highScore = 0
    $.cookie('highScore', highScore, {expires: 7});
    $('#container').trigger('lWelcome')
  })

})

//Definition of Snake
function Snake(body, direction){
  this.body = body
  this.direction = direction
  this.realDirection
}

Snake.prototype.draw = function(){
  //Draw new Snake head
  $('#d'+this.body[0]).addClass('head')
  $('#d'+this.body[1]).removeClass('head')

  //Draw Snake body
  for (var i = 0; i < this.body.length; i++) {
    $('#d'+this.body[i]).addClass('body')

    //Draw the connection of Snake
    if(i < (this.body.length - 1)){
      var bodyGap = this.body[i+1] - this.body[i]
      if(bodyGap < -1){
        $('#d'+this.body[i]).addClass('tb')
        $('#d'+this.body[i+1]).addClass('bb')
      }else if(bodyGap == -1){
        $('#d'+this.body[i]).addClass('lb')
        $('#d'+this.body[i+1]).addClass('rb')
      }else if(bodyGap == 1){
        $('#d'+this.body[i]).addClass('rb')
        $('#d'+this.body[i+1]).addClass('lb')
      }else if(bodyGap > 1){
        $('#d'+this.body[i]).addClass('bb')
        $('#d'+this.body[i+1]).addClass('tb')
      }
    }
  }
}

Snake.prototype.clearSnake = function(){
  //Only clear the tail of Snake
  $('#d'+this.body[this.body.length - 1]).removeClass('body').removeClass('head').removeClass('tb').removeClass('rb').removeClass('bb').removeClass('lb')
}

//Definition of Food
function Food(position){
  this.position = position
  this.eaten = false
}

Food.prototype.draw = function(){
  $('#d'+this.position).addClass('food')
}

Food.prototype.vanish = function(){
  $('#d'+this.position).removeClass('food')
}

//Definition of Stage
function Stage(stageWidth, stageHeight){

  //Get Window Information
  var windowHeight = $(window).height()
  var windowWidth = $(window).width()

  //Set blockSize
  if((windowWidth / windowHeight) > 1.6){
    var blockSize = Math.floor(windowHeight / 20)
  }else{
    blockSize = Math.floor(windowWidth / 34)
  }

  this.stageWidth = stageWidth
  this.stageHeight = stageHeight
  this.blockNumber = stageWidth * stageHeight
  this.blockSize = blockSize
}

Stage.prototype.init = function(){

  //Stage Initial
  var stageWidth = this.stageWidth
  var stageHeight = this.stageHeight
  var blockNumber = this.blockNumber
  var blockSize = this.blockSize

  //Set #container
  $('#container').height(stageHeight * blockSize).width(stageWidth * blockSize).css('marginTop',blockSize)

  //Draw small blocks
  for (var i = 1; i <= blockNumber; i++) {
    $('<div id="d'+i+'"/>').appendTo('#container')
  }
  $('#container div').height(blockSize-2).width(blockSize-2)

  //Set fontsize
  $('body').css('fontSize', Math.floor(blockSize * 0.75))
}

Stage.prototype.clearStage = function(){
  $('#container').empty()
  this.init()
}

//Definition of Welcome
function Welcome(stage){
  this.stage = stage

  //the Snake Game Title displayed in the beginning
  this.snakeWord = [[137, 136, 135, 167, 199, 200, 201, 233, 265, 264, 263], [139, 171, 203, 235, 267, 140, 141, 173, 205, 237, 269], [143, 175, 207, 239, 271, 144, 145, 177, 209, 241, 273, 208], [147, 179, 211, 243, 275, 149, 180, 212, 245, 277], [151, 152, 153, 183, 215, 247, 279, 216, 217, 280, 281]]
}

Welcome.prototype.init = function(){
  var _this = this
  var _stage = this.stage
  var _snakeWord = this.snakeWord

  //draw the Snake Game Title
  for (var i = 0; i < _snakeWord.length; i++) {
    for (var j = 0; j < _snakeWord[i].length; j++) {
      $('#d' + _snakeWord[i][j]).addClass('body').addClass('title')
    }
  }

  //draw the Snake Game Title's Head
  $('#d137, #d269, #d273, #d149, #d282').addClass('head').addClass('title')

  //Draw Button
  var start = new Button(_stage,'START', 6, 12)
  start.init()
  start.focusOn()

  var difficulty = new Button(_stage,'DIFFICULTY', 13, 12)
  difficulty.init()

  var highScore = new Button(_stage,'HIGHSCORE', 20, 12)
  highScore.init()

  //Keyboard event
  $(document).keydown(function(event){
    //Event trigger
    if(event.keyCode == 13){
      $(document).unbind('keydown')
      if($('.focus').is('#START')){
        $('#container div').animate({'opacity': 1})
        $('#container').trigger('lStart')
      }else if($('.focus').is('#DIFFICULTY')){
        $('#container').trigger('lDifficulty')
      }else if($('.focus').is('#HIGHSCORE')){
        $('#container').trigger('lHighScore')
      }
    }

    //Focus switch
    if(event.keyCode == 39){
      if($('.focus').is('#START')){
        difficulty.focusOn()
      }else if($('.focus').is('#DIFFICULTY')){
        highScore.focusOn()
      }
    }
    if(event.keyCode == 37){
      if($('.focus').is('#HIGHSCORE')){
        difficulty.focusOn()
      }else if($('.focus').is('#DIFFICULTY')){
        start.focusOn()
      }
    }
  })

  //Click event
  $('.button').click(function(){
    if($(this).is('#START')){
      $('#container').trigger('lStart')
    }else if($(this).is('#DIFFICULTY')){
      $('#container').trigger('lDifficulty')
    }else if($(this).is('#HIGHSCORE')){
      $('#container').trigger('lHighScore')
    }
  })
}

//Definition of Pause
function Pause(stage, game){
  this.stage = stage
  this.game = game
}

Pause.prototype.init = function(){
  _stage = this.stage
  _game = this.game

  //Game fade when pause
  $('#container div').animate({'opacity': 0.3})

  //Draw Button
  var resume = new Button(_stage,'RESUME', 8, 12)
  resume.init()
  resume.focusOn()

  var menu = new Button(_stage,'MENU', 18, 12)
  menu.init()

  var scoreBoard = new Scoreboard(_stage, _game, 'Game Pause')
  scoreBoard.init()

  var _this = this

  //Keyboard event
  $(document).keydown(function(event){
    //Event trigger
    if(event.keyCode == 13){
      if($('.focus').is('#RESUME')){
        //Game not fade when resume
        $('#container div').animate({'opacity': 1})

        $('#container').trigger('lResume')
      }else if($('.focus').is('#MENU')){
        $(document).unbind('keydown')
        $('#container').trigger('lWelcome')
      }
    }

    //Focus switch
    if(event.keyCode == 39 && $('.focus').is('#RESUME')){
      menu.focusOn()
    }
    if(event.keyCode == 37 && $('.focus').is('#MENU')){
      resume.focusOn()
    }
  })

  //Click event
  $('.button').click(function(){
    if($(this).is('#RESUME')){
      //Game not fade when resume
      $('#container div').animate({'opacity': 1})

      $('#container').trigger('lResume')
    }else if($(this).is('#MENU')){
      $('#container').trigger('lWelcome')
    }
  })

}

//Definition of Dead
function Dead(stage, game){
  this.stage = stage
  this.game = game
}

Dead.prototype.init = function(){
  _stage = this.stage
  _game = this.game

  //Game fade when dead
  $('#container div').animate({'opacity': 0.3})

  //Draw Button
  var restart = new Button(_stage,'RESTART', 8, 12)
  restart.init()
  restart.focusOn()

  var menu = new Button(_stage,'MENU', 18, 12)
  menu.init()

  var scoreBoard = new Scoreboard(_stage, _game, 'Game Over')
  scoreBoard.init()

  var _this = this

  //Keyboard event
  $(document).keydown(function(event){
    //Event trigger
    if(event.keyCode == 13){
      if($('.focus').is('#RESTART')){
        //Game not fade when restart
        $('#container div').animate({'opacity': 1})

        $('#container').trigger('lStart')
      }else if($('.focus').is('#MENU')){
        $(document).unbind('keydown')
        $('#container').trigger('lWelcome')
      }
    }
    //Focus switch

    if(event.keyCode == 39 && $('.focus').is('#RESTART')){
      menu.focusOn()
    }
    if(event.keyCode == 37 && $('.focus').is('#MENU')){
      restart.focusOn()
    }
  })

  //Click event
  $('.button').click(function(){
    if($(this).is('#RESTART')){
      //Game not fade when restart
      $('#container div').animate({'opacity': 1})

      $('#container').trigger('lStart')
    }else if($(this).is('#MENU')){
      $('#container').trigger('lWelcome')
    }
  })

}

//Definition of HighScore
function HighScore(stage, game, highScore){
  this.stage = stage
  this.game = game
  this.highScore = highScore
}

HighScore.prototype.init = function(){
  _stage = this.stage

  //Make a fake game object which will not be initialed and game.score is highScore
  //The fake game object is delivered to Scoreboard
  _game = new Game(_stage,80)
  _game.score = this.highScore

  //draw Button
  var menu = new Button(_stage,'MENU', 8, 12)
  menu.init()
  menu.focusOn()

  var reset = new Button(_stage,'RESET', 18, 12)
  reset.init()

  var scoreBoard = new Scoreboard(_stage, _game, 'High Score')
  scoreBoard.init()

  //Keyboard event
  $(document).keydown(function(event){
    //Event trigger
    if(event.keyCode == 13){
      if($('.focus').is('#MENU')){
        $('#container').trigger('lWelcome')
      }else if($('.focus').is('#RESET')){
        $('#container').trigger('lResetHighScore')
      }
    }
    //Focus switch

    if(event.keyCode == 39 && $('.focus').is('#MENU')){
      reset.focusOn()
    }
    if(event.keyCode == 37 && $('.focus').is('#RESET')){
      menu.focusOn()
    }
  })

  //Click event
  $('.button').click(function(){
    if($(this).is('#MENU')){
      $('#container').trigger('lWelcome')
    }else if($(this).is('#RESET')){
      $('#container').trigger('lResetHighScore')
    }
  })

}

//Definition of Difficulty
function Difficulty(stage, game){
  this.stage = stage
  this.game = game
}

Difficulty.prototype.init = function(){
  _stage = this.stage
  _game = this.game

  //draw Button
  var easy = new Button(_stage,'EASY', 13, 4)
  easy.init()

  var normal = new Button(_stage,'NORMAL', 13, 8)
  normal.init()

  var hard = new Button(_stage,'HARD', 13, 12)
  hard.init()

  //load saved game speed
  switch(_game.gameSpeed){
    case 500:
      easy.focusOn()
      break
    case 100:
      normal.focusOn()
      break
    case 50:
      hard.focusOn()
      break
  }

  //Keyboard event
  $(document).keydown(function(event){
    //Event trigger
    if(event.keyCode == 13){
      if($('.focus').is('#EASY')){
        $('#container div').animate({'opacity': 1})
        _game.gameSpeed = 500
        $('#container').trigger('lWelcome')
      }else if($('.focus').is('#NORMAL')){
        _game.gameSpeed = 100
        $('#container').trigger('lWelcome')
      }else if($('.focus').is('#HARD')){
        _game.gameSpeed = 50
        $('#container').trigger('lWelcome')
      }
    }

    //Focus switch
    if(event.keyCode == 38){
      if($('.focus').is('#NORMAL')){
        easy.focusOn()
      }else if($('.focus').is('#HARD')){
        normal.focusOn()
      }
    }
    if(event.keyCode == 40){
      if($('.focus').is('#NORMAL')){
        hard.focusOn()
      }else if($('.focus').is('#EASY')){
        normal.focusOn()
      }
    }
  })

  //Click event
  $('.button').click(function(){
    if($(this).is('#EASY')){
      _game.gameSpeed = 500
      $('#container').trigger('lWelcome')
    }else if($(this).is('#NORMAL')){
      _game.gameSpeed = 100
      $('#container').trigger('lWelcome')
    }else if($(this).is('#HARD')){
      _game.gameSpeed = 50
      $('#container').trigger('lWelcome')
    }
  })

}

//Defnition of Scoreboard
function Scoreboard(stage, game, boardText){
  this.stage = stage
  this.game = game
  this.boardText = boardText
  this.boardX = 6
  this.boardY = 4
  this.boardHeight = 5
  this.boardWidth = 20
}

Scoreboard.prototype.init = function(){
  _stage = this.stage
  _game =  this.game

  //Draw scoreboard
  $('<div id="scoreboard" />').appendTo('#container')

  //Draw scoreboard title
  $('<p id="boardtext" >' + this.boardText + '</p>').appendTo('#scoreboard')

  //When scoreboard is used to display high score, it has different content
  if(this.boardText == 'High Score'){
    $('<p id="score" >' + _game.score + '</p>').appendTo('#scoreboard')
  }else{
    $('<p id="score" >' + _game.score +' scores with ' + _game.hitTime + ' bugs eaten</p>').appendTo('#scoreboard')
  }

  //Set scoreboard size and position
  $('#scoreboard').css({
    'marginLeft': this.boardX * _stage.blockSize,
    'marginTop': this.boardY * _stage.blockSize,
    'height': _stage.blockSize * this.boardHeight - 2,
    'width': _stage.blockSize * this.boardWidth - 2
  })

  //Set scoreborad text line height
  $('#scoreboard p').css('lineHeight', (_stage.blockSize * this.boardHeight - 2) / 2 + 'px')

  //Scoreboard fadeIn when loaded
  $('#scoreboard').hide(0,function(){
    $('#scoreboard').fadeIn()
  })
}

//Defnition of Button
function Button(stage, buttonText, buttonX, buttonY){
  this.stage = stage
  this.buttonText = buttonText
  this.buttonX = buttonX
  this.buttonY = buttonY
  this.buttonHeight = 2
  this.buttonWidth = 6
  this.focus = false
}

Button.prototype.init = function(){
  var _this = this

  //Draw button
  $('<div class="button" id="' + this.buttonText + '">' + this.buttonText + '</div>').appendTo('#container')

  //Set button postion
  $('#' + this.buttonText).css({
    'marginTop': this.buttonY * this.stage.blockSize,
    'marginLeft': this.buttonX * this.stage.blockSize
  })

  //Set all button size
  $('.button').css({
    'lineHeight': this.stage.blockSize * this.buttonHeight - 2 + 'px',
    'height': this.stage.blockSize * this.buttonHeight - 2,
    'width': this.stage.blockSize * this.buttonWidth - 2
  })

  //Button fadeIn when loaded
  $('#' + this.buttonText).hide(0,function(){
    $('#' + _this.buttonText).fadeIn()
  })
}

Button.prototype.focusOn = function(){
  $('.button').removeClass('focus')
  $('#' + this.buttonText).addClass('focus')
}

//Definition of Game
function Game(stage, gameSpeed){
  this.stage = stage
  this.gameSpeed = gameSpeed
  this.INTERVAL_ID = 0
  this.snake
  this.food
  this.hitTime = 0
  this.isPause = false
  this.score = 0
}

Game.prototype.init = function(){
  var _this = this
  var stageWidth = this.stage.stageWidth
  var stageHeight = this.stage.stageHeight
  var blockNumber = this.stage.blockNumber
  
  //Make Snake
  var firstSnakeHead = Math.floor(blockNumber / 2) - Math.floor(stageWidth / 2)
  this.snake = new Snake([firstSnakeHead, firstSnakeHead - 1 , firstSnakeHead - 2], 1)
  var s = this.snake
  s.draw()

  //Make First Food
  this.food = new Food(1)
  var f = this.food
  this.makeFood()

  //Keyboard event
  $(document).keydown(function(event){
    if(event.keyCode == 38 && s.realDirection != 2){
      s.direction = 0
    }
    if(event.keyCode == 39 && s.realDirection != 3){
      s.direction = 1
    }
    if(event.keyCode == 40 && s.realDirection != 0){
      s.direction = 2
    }
    if(event.keyCode == 37 && s.realDirection != 1){
      s.direction = 3
    }
    if((event.keyCode == 80 || event.keyCode == 27) && !_this.isPause){
      $('#container').trigger('lPause')
    }
  })

  //Game Start
  this.timer(s,f)
}

Game.prototype.timer = function(snake, food){
  var s = snake
  var f = food

  var _this = this
  var stageWidth = this.stage.stageWidth
  var stageHeight = this.stage.stageHeight
  var blockNumber = this.stage.blockNumber
  
  //Main interval
  this.INTERVAL_ID = setInterval(function(){
    var eatenThisRound = false

    //Realdirection won't change in every interval
    //if there isn't real direction, snake will change direction two times or more and make the snake moving backward, eating itself and dead.
    s.realDirection = s.direction

    s.clearSnake()
    s.head = s.body[0]

    switch(s.direction){
      case 0:
        s.head -= stageWidth
        break
      case 1:
        s.head += 1
        break
      case 2:
        s.head += stageWidth
        break
      case 3:
        s.head -= 1
        break
    }
    s.body.unshift(s.head)

    //Eat Food
    if(s.head == f.position){
      f.vanish()
      eatenThisRound = true
      _this.hitTime += 1

      switch(_this.gameSpeed){
      case 500:
        _this.score = _this.hitTime * 5
        break
      case 100:
        _this.score = _this.hitTime * 10
        break
      case 50:
        _this.score = _this.hitTime * 20
        break
      }

      _this.makeFood()
    };

    //Eat Snake Itself
    for (var i = 1; i < s.body.length; i++){
      if(s.head == s.body[i] && !eatenThisRound){
        $('#container').trigger('lDead')
        return
      }
    }

    //Touch the Wall
    if(s.head < 1 || s.head > blockNumber || (((s.head-1) % stageWidth == 0) && s.direction == 1) || ((s.head % stageWidth == 0) && s.direction == 3)){
        $('#container').trigger('lDead')
        return
    }

    //if food is eaten, the snake will not shorten
    if(!eatenThisRound){
      s.body.pop()
    }

    s.draw()
  }, this.gameSpeed);
}

Game.prototype.makeFood = function(){
  var s = this.snake
  var f = this.food
  var blockNumber = this.stage.blockNumber

  //Make new food which position not as same as snake's body
  do{
      var position = Math.floor(Math.random()*blockNumber+1)
      var concide = false
      for (var i = 0; i < s.body.length; i++) {
        if(position == s.body[i]){
          concide = true
        }
      }
    }while(concide)
  f.position = position
  f.draw()
}

Game.prototype.pause = function(){
  clearInterval(this.INTERVAL_ID)
}

Game.prototype.resume = function(){
  this.timer(this.snake, this.food)
}