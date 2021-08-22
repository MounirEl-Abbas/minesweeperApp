document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  let width = 20
  let bombAmount = 50
  let flags = 0
  let squares = []
  let isGameOver = false

  //create Board
  function createBoard() {
    // Placing random bombs
    const bombsArray = Array(bombAmount).fill('bomb')
    const emptyArray = Array(width*width - bombAmount).fill('valid')
    const gameArray = emptyArray.concat(bombsArray)
    const shuffledArray = gameArray.sort(() => Math.random() -0.5)
    console.log(shuffledArray)




    // Making 100 squares, with id of 0-99
    for (let i = 0; i < width*width; i++){        
      const square = document.createElement('div')  //Create div i
      square.setAttribute('id', i)                  //Give it an ID of i
      square.classList.add(shuffledArray[i])        //Give it an id of ShuffledArray[i] (80 class="valid" -- 20 class ="bomb")
      grid.appendChild(square)                      //Add the square to our grid div
      squares.push(square)                          //Push it into squares array [div#ID.class * 100]
      // square.textContent = i

      //normal click
      square.addEventListener('click', function(e) {
        click(square)
      })

      //ctrl and left click
      square.oncontextmenu = function(e) {
        e.preventDefault()
        addFlag(square)
      }
    }

    //Add numbers
    for (let i = 0; i < squares.length; i++){
      let total = 0
      const isLeftEdge = (i % width === 0)            //Left edge are 0,10,20,30...  so i % width = 0
      const isRightEdge = (i % width === width -1)    //Right edge are 9,19,29,39... so i % width = 9

    //Iterate every square, check each surrounding square, if contains bomb class, increase it's total value
      if (squares[i].classList.contains('valid')) {
        if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total ++          //Check left of square
        if (i > width - 1 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total ++ //Check top-right of square
        if (i > width - 1 && squares[i - width].classList.contains('bomb')) total ++                     //Check above square
        if (i > width && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) total++  //Check top-left of square
        if (i < (width * width) - 1 && !isRightEdge && squares[i + 1].classList.contains('bomb')) total ++        //Check right of square
        if (i < (width*width) - width && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total++  //Check bottom-left of square
        if (i < (width*width) - width - 1 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total++ //Check bottom-right of square
        if (i < (width*width) - width && squares[i + width].classList.contains('bomb')) total++                     //Check below of square



        squares[i].setAttribute('data', total)
        console.log(squares[i])
      }
    }




  }
  createBoard()

  // add flag with right click
  function addFlag(square) {
    if (isGameOver) return
    if (!square.classList.contains('checked')) {    
      if (!square.classList.contains('flag')) {
        square.classList.add('flag')
        square.innerHTML = '🚩'
        flags++
        checkForWin()
      }else {
        square.classList.remove('flag')
        square.innerHTML = ''
        flags--
      }
      checkForWin()
    }
  }

  //Click on square actions
  function click(square) {
    let currentId = square.id
    if (isGameOver) return
    if (square.classList.contains('checked') || square.classList.contains('flag')) return   //If Square clicked is already checked, or flagged > return
    if (square.classList.contains('bomb')){                                                 //If Clicked on bomb, game over
      gameOver(square)
    } else {                                                //If valid square is clicked
      let total = square.getAttribute('data')               //Get data, display it in the square (num of bombs adjacent)
      if(total !=0) {                                       //If not 0 bombs around
        square.classList.add('checked')                     //Check it and continue as normal
        square.innerHTML = total
        if (total == 1) square.style.color = 'blue'
        if (total == 2) square.style.color = 'green'
        if (total == 3) square.style.color = 'maroon'
        if (total == 4) square.style.color = 'goldenrod'
        if (total == 5) square.style.color = 'red'
        if (total == 6) square.style.color = 'blueviolet'
        if (total == 7) square.style.color = 'purple'
        if (total == 8) square.style.color = 'cyan'
        if (total == 9) square.style.color = 'gold'
        return
      }
      checkSquare(square, currentId)                        //If square clicked has no bombs around it, Do the minesweeper clear an area thing (recursion)
    }
    square.classList.add('checked')                 
  }

  /* First - check neighboring squares once square with 0 bombs adjacent is clicked
  Second - If THAT square's neighboring squares also adjacent to 0 bombs
          Check neighboring squares of THAT square. 
  Third - So on and so forth until Loop is broken with squares adjacent to bombs*/
  function checkSquare(square, currentId) {
    const isLeftEdge = (currentId % width === 0)
    const isRightEdge = (currentId % width === width -1)
    setTimeout(() => {
      if (currentId > 0 && !isLeftEdge) {                   //Check Left of square clicked
        const newId = squares[parseInt(currentId) - 1].id      //If That square also has 0 bombs adjacent
        const newSquare = document.getElementById(newId)    //Pass it into click()
        click(newSquare)                                    //And Rerun ALL checkSquare() Function on that Square
      }
      if (currentId > width - 1 && !isRightEdge) {
        const newId = squares[parseInt(currentId) +1 -width].id //Check Top-right of square
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId > width) {
        const newId = squares[parseInt(currentId - width)].id   //Check Above of square
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId > width && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1 - width].id  //Check top-left of square
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId < (width*width) -1 && !isRightEdge) {
        const newId = squares[parseInt(currentId) +1].id    //Check right of square
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId < (width*width) - width && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1 + width].id //Check bottom-left of square
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId < (width*width) - width - 1 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1 + width].id //check bottom-right
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId < (width*width) - width) {
        const newId = squares[parseInt(currentId) + width].id   //check below
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }

    }, 10);
  }

  //game over
  function gameOver(square) {
    console.log('boom')
    isGameOver = true

    //show all the boms
    squares.forEach(square => {
      if (square.classList.contains('bomb')) {
        square.innerHTML = '💣'
      }
    })
  }

  //check for win
  function checkForWin() {
    let matches = 0
    for (let i = 0; i < squares.length; i++) {
      if(squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
        matches ++
    }
    if (matches === bombAmount && flags === bombAmount) {
      console.log('win')
      isGameOver = true
    }
    }
  }







})

