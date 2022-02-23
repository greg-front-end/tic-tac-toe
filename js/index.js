window.addEventListener('DOMContentLoaded', () => {

  const greetPopup = document.querySelector('.greet'),
        greetStartBtn = document.querySelector('.greet__start-btn'),
        greetSinglePlayerBtn = document.querySelector('.greet__single-btn'),
        greetPlayerSettings = document.querySelector('.greet__players'),
        board = document.querySelector('.board__inner'),
        sqrs = document.querySelectorAll('.board__sqr'),
        score = document.querySelector('.score__inner'),
        winnerPopup = document.querySelector('.winner'),
        winnerTitle = document.querySelector('.winner__title'),
        winnerText = document.querySelector('.winner__text'),
        startNewGameBtn = document.querySelector('.winner__btn'),
        audio = document.querySelector('.draw-sound');
  
  // Data for game
  let turn = 'x'
  let isMultiplay = false
  let playerStepsX = 0
  let playerStepsY = 0
  let keyForDataScore = (localStorage.getItem('keyCount') || 1)
  const winnerTable = [
    // Vertical
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Horizontal
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Diagonal
    [0, 4, 8],
    [2, 4, 6],
  ]
  const dataForScore = {}
  const dataValues = [null, null, null, null, null, null, null, null, null]
  // ====================== FUNCTIONS ====================== //

  // Get random move if single game
  const getRandomMove = (min, max) => { 
    let move = 0;
    move = Math.floor(Math.random() * (max - min + 1)) + min

    while(sqrs[move].hasChildNodes()) {
      move = Math.floor(Math.random() * (max - min + 1)) + min
      if (dataValues.every(item => item !== null)) return false
    }

    drwaO(sqrs[move])
    getFigure(move)
    turnMove()
    playerStepsY++
    getWinner(dataValues, 'o')
    sqrs[move].classList.add('o')
  }

  // Init winner popup values
  const initWinnerPopupText = (figure, end) => {
    if (end === 'win') {
      if (figure === 'x') {
        winnerTitle.textContent = `
        Congratulations, "${figure.toUpperCase()}" won!
        `
        winnerText.textContent = `
        Player "${figure.toUpperCase()}" won the game for ${playerStepsX} steps
       `
      } else {
        winnerTitle.textContent = `
        Congratulations, "${figure.toUpperCase()}" won!
        `
        winnerText.textContent = `
        Player "${figure.toUpperCase()}" won the game for ${playerStepsY} steps
       `
      }
    } else {
      winnerTitle.textContent = `
      Nobody won..
      `
      winnerText.textContent = `
      The game ended in a draw
     `
    }
  }
  // Add current game in data for score
  const addCurrentGameDataScore = (key) => {
    if (key > 10 && dataForScore['10'] !== '') {
      keyForDataScore = 1
      dataForScore[keyForDataScore] = winnerText.textContent.trim()
      keyForDataScore++
    } else {
      dataForScore[key] = winnerText.textContent.trim()
      keyForDataScore++
    }
  }
  // Add last ten games in the localStorage
  const setLastTenGameLocalStorge = () => {
    for (let key in dataForScore) {
      localStorage.setItem(key, dataForScore[key])
      localStorage.setItem('keyCount', +key + 1)
    }
  }
  // Get object from local storage
  const getLastTenGameLocalStorage = () => {
    let data = {}
    for (let i = 1; i <= 10; i++) {
      if (localStorage.getItem(`${i}`)) {
        data[i] = localStorage.getItem(i)
      }
    }
    return data
  }
  // Add last ten game in score section
  const addLastTenGameInScore = () => {
    let data = getLastTenGameLocalStorage()
    if (Object.keys(data).length > 0) {
      for (let key in data) {
        const span = document.createElement('span')
        span.textContent = `${key}. ${data[key]}`
        score.appendChild(span)
      }
    } else {
      for (let k in dataForScore) {
        const span = document.createElement('span')
        span.textContent = `${k}. ${dataForScore[k]}`
        score.appendChild(span)
      }
    }
  }
  // Get winnter if it has 
  const getWinner = (data, figure) => {
    for (let arr of winnerTable) {
      if (arr.every(idx => data[idx] === figure)) {
        winnerPopup.classList.add('winner--show')
        initWinnerPopupText(figure, 'win')
        setLastTenGameLocalStorge()
        return 
      } 
      if (data.every(item => item !== null)) {
        winnerPopup.classList.add('winner--show')
        initWinnerPopupText(figure, 'nobody')
        setLastTenGameLocalStorge()
      }
    }
  }
  // Reset board after game
  const resetBoard = () => {
    sqrs.forEach(sqr => {
      if (sqr.hasChildNodes()) {
        sqr.innerHTML = ''
        sqr.classList.remove('x')
        sqr.classList.remove('o')
      }
    })
    for (let i = 0; i < dataValues.length; i++) {
      dataValues[i] = null
    }
    score.innerHTML = ''
    playerStepsX = 0
    playerStepsY = 0
    isMultiplay = false
    turn = 'x'
    if (board.classList.contains('o')) {
      board.classList.remove('o')
      board.classList.add('x')
    }
  }
  // Open new game popup
  const openGreetPopup = () => {
    greetPopup.classList.remove('greet--hide')
  }
  // DRAW X
  const drawX = (place) => {
    const svgns = "http://www.w3.org/2000/svg"

    // Make svg tag
    const svg = document.createElementNS(svgns, "svg");
    svg.setAttribute('xmlns', svgns)
    svg.setAttribute('viewBox', '0 0 120 120')
    svg.classList.add('svg-x')

    // Make group tag
    const g = document.createElementNS(svgns, 'g')
    
    // Make rectangles one
    let newRect = document.createElementNS(svgns, "rect");
    let newRect2 = document.createElementNS(svgns, "rect");
    // Set attribute for rectangles
    newRect.setAttribute("class", 'cross cross-1');
    newRect2.setAttribute("class", 'cross cross-2');
    
    // Add rectangles into svg tag
    g.appendChild(newRect)
    g.appendChild(newRect2)
    // Add group of rectangles into svg tag
    svg.appendChild(g)
    // Add svg tage into current sqr element
    place.setAttribute('data-figure', 'x')
    place.appendChild(svg)
  }
  // DRAW ZERO
  const drwaO = (place) => {
    // Make svg tag
    const svg = document.createElementNS('http://www.w3.org/2000/svg', "svg");
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    svg.setAttribute('viewBox', '0 0 120 120')
    svg.classList.add('svg-o')
    // Make circle
    const cir = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    cir.setAttribute("r", 50);
    cir.setAttribute("class", 'circle');
    // Add circle into svg
    svg.appendChild(cir)
    // Add svg into sqr element
    place.appendChild(svg)
    // Set for the current element data circle 
    place.setAttribute('data-figure', 'o')
  }
  // Get data value of grid and push it in dataPlayer array
  const getFigure = (grid) => {
    if (isNaN(grid)) {
      let getFirstClass = grid.getAttribute('class').split(' ')[0]
      let getFigureIcon = grid.dataset.figure
      let getPosition = getFirstClass[getFirstClass.length -1]
      dataValues[getPosition] = getFigureIcon
    } else {
      dataValues[grid] = 'o'
    }
  }
  // Turn move figure
  const turnMove = () => {
    if (turn === 'x') {
      turn = 'o'
    } else {
      turn = 'x'
    }
  }

  // Add class for hover icons
  const addXOtoBoard = () => {
    if (board.classList.contains('x')) {
      board.classList.add('o')
      board.classList.remove('x')
    } else {
      board.classList.add('x')
      board.classList.remove('o')
    }
  }
  // ====================== LISTENERS ====================== //   

  // Hide start button and show settings for start game
  greetStartBtn.addEventListener('click', (e) => {
    const parent = e.target.closest('.greet__start')
    parent.classList.add('greet__start--hide')
    setTimeout(() => {
      greetPlayerSettings.classList.add('greet__players--show')
    },200)
  })

  // Single play or with computer choice
  greetPlayerSettings.addEventListener('click', (e) => {
    let btn = e.target

    if (btn.classList.contains('greet__single-btn')) {
      isMultiplay = true
      greetPopup.classList.add('greet--hide')
    } else if (btn.classList.contains('greet__multiplay-btn')) {
      isMultiplay = false
      greetPopup.classList.add('greet--hide')
    }
  })

  // Draw figure on every sqrs when user click on it
  sqrs.forEach(sqr => {
    sqr.addEventListener('click', (e) => {
      let place = e.target
      if (!place.hasChildNodes()) {
        if (turn === 'x') {
          if (isMultiplay === true) {
            setTimeout(() => getRandomMove(0,8), 300)
            addXOtoBoard()
          }
          drawX(place)
          audio.play()
          getFigure(place)
          playerStepsX++
          getWinner(dataValues, 'x')          
          turnMove()
          addXOtoBoard()
          sqr.classList.add('x')
        } else {
          drwaO(place)
          audio.play()
          getFigure(place)
          turnMove()
          playerStepsY++
          getWinner(dataValues, 'o')
          addXOtoBoard()
          sqr.classList.add('o')
        }
      }
    })
  })
  // Reset board after finish the game
  startNewGameBtn.addEventListener('click', () => {
    resetBoard()
    openGreetPopup()
    winnerPopup.classList.remove('winner--show')
    addCurrentGameDataScore(keyForDataScore)
    setLastTenGameLocalStorge()
    addLastTenGameInScore()
  })
  addLastTenGameInScore()

})
