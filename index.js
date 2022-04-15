const gameBoard = (() => {
	//  Initialises the board to Array of length 9
	const initialiseBoard = () => {
		let board = []
		for (let i = 0; i < 9; i++) {
			board.push(" ")
		}
		return board
	}

	// Private Variables
	let board
	let players
	let turn

	// Private Methods
	// Checks for win
	const checkWin = () => {
		// Defines the lines to check in Tic-Tac-Toe board
		const winPatterns = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6],
		]

		for (const pattern of winPatterns) {
			let a = board[pattern[0]]
			let b = board[pattern[1]]
			let c = board[pattern[2]]
			// If cell is empty, continue
			if (a === " " || b === " " || c === " ") {
				continue
			}

			// Win if all 3 cells contain the same value
			if (a === b && a === c && b === c) {
				return true
			}
		}
		return false
	}

	// Public Methods
	// Starts the game
	const startGame = (playersArr) => {
		players = playersArr ? playersArr : players.reverse()
		board = initialiseBoard()
		turn = 0
	}
	// Get copy of the board's current state
	const getBoard = () => {
		return board ? [...board] : board
	}
	// Plays a move at the specified position
	const playMove = (pos) => {
		if (checkWin()) {
			startGame()
		} else {
			let cell = board[pos]
			if (cell === " ") {
				let player = players[turn % 2]
				board[pos] = player.move
				turn++
			}
		}
	}
	// Gets the result of the board (Player X wins, draw etc.)
	const getResult = () => {
		if (!board.includes(" ")) {
			return "It's a draw!"
		}
		if (checkWin()) {
			let winningPlayer = players[(turn - 1) % 2]
			return `${winningPlayer.name} wins!`
		}
	}
	// Returns the current player
	const currentPlayer = () => {
		return players[turn % 2]
	}

	return { startGame, getBoard, playMove, getResult, currentPlayer }
})()

// Controls the display of Tic-Tac-Toe board
const displayController = (() => {
	const cellList = document.querySelectorAll(".cell")

	// Updates gameBoard when a specific cell is clicked
	function updateBoard() {
		const cellIndex = parseInt(this.getAttribute("data-board-index"))
		gameBoard.playMove(cellIndex)
        display()
	}

	cellList.forEach((cell) => {
		cell.addEventListener("click", updateBoard)
	})

	// Displays the current gameBoard
	const display = () => {
		let board = gameBoard.getBoard()
		for (let i = 0; i < cellList.length; i++) {
			const cell = cellList[i]
			cell.textContent = board[i]
		}

		const message = document.querySelector(".message")
		let playerName = gameBoard.currentPlayer().name
		let result = gameBoard.getResult()
		message.textContent = result ? result : `Current Player: ${playerName}`
	}

    // Hides the form and unhides the board
    const startGame = () => {
        const container = document.querySelector(".container")
        container.style.display = "grid"
        const modal = document.querySelector(".modal")
        modal.style.display = "none"
        display()
    }
	return { startGame, display }
})()

// Creates players
const playerFactory = (name, move) => {
	return { name, move }
}

const startButton = document.querySelector(".start-button")
startButton.addEventListener("click", () => {
	const playerOneName = document.querySelector("#player-one").value
	const playerTwoName = document.querySelector("#player-two").value

	if (playerOneName !== "" && playerTwoName !== "") {
		const playerOne = playerFactory(playerOneName, "X")
		const playerTwo = playerFactory(playerTwoName, "O")

		gameBoard.startGame([playerOne, playerTwo])
        displayController.startGame()
	} else {
		alert("Please input a name for both players!")
	}
})

const restartButton = document.querySelector(".restart-button")
restartButton.addEventListener("click", () => {
    gameBoard.startGame()
    displayController.display()
})
