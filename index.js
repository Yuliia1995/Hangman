const categories = {
    bus: {
        name: "Words from BUS 101 and 102",
        words: ["leverage", "stipulate", "resilient", "constrain", "ubiquitous", "commodity", "reciprocal", "liability", "surreptitious"]},
        cis: {
            name: "Words from BUS 101 and 102",
            words: ["array", "object", "exponentiation", "operator", "condition", "function"]
        }
    };
const youWon = "<p>You Won! SLAVA UKRAINI!</p>";
const youLost = "<p>You Lost! SPA-SEE-BO for your help</p>";
    
    


let game;
let catBtn = document.getElementsByClassName("catBtn");
for (let btn of catBtn) {
    btn.addEventListener('click', function(e){
        document.getElementById("game-container").classList.remove("d-none");
        let game = Game(e.currentTarget.value);
        document.getElementById("guessBox").innerHTML = `<p>You've chosen "${e.currentTarget.textContent}" category</p>`
        render(game);
        listenForInput(game);
        document.getElementById("btn-container").classList.add("d-none");
        return game;
        })
        function Game(el) {
            let word = categories[el].words[Math.floor(Math.random()*categories[el].words.length)];
            word = word.toUpperCase();
            let guessedLetters = [];
            let maskedWord = "";
            let incorrectGuesses = 0;
            let possibleGuesses = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            let won = false;
            let lost = false;
            const maxGuesses = 7;
        
            for ( let i = 0; i < word.length; i++ ) {
                let space = " ";
                let nextCharacter = word.charAt(i) === space ? space : "_";
                maskedWord += nextCharacter;
            }
            
            let guess = function(letter) 
            {
                letter = letter.toUpperCase();
                if( !guessedLetters.includes(letter)) {	
                    guessedLetters.push(letter);
                    possibleGuesses = possibleGuesses.replace(letter,"");
                    if (word.includes(letter)) {
                        let matchingIndexes = [];
                        for ( let i = 0; i < word.length; i++ ) {
                            if( word.charAt(i) === letter )
                            {
                                matchingIndexes.push(i);
                            }
                        }
                        matchingIndexes.forEach( function(index) {
                            maskedWord = replace( maskedWord, index, letter );
                        });	
                        if( !lost ) {
                            won = maskedWord === word;	
                        }		
                    }
                    else {
                        handleIncorrectGuess();
                    }
                }
            }
        
            let handleIncorrectGuess = function()
            {
                incorrectGuesses++;
                lost = incorrectGuesses >= maxGuesses;
                if( lost )
                {
                    document.getElementById("guessBox").innerHTML = youLost;
                }
            }
        
            return {
                "getWord": function(){ return word; },
                "getMaskedWord": function(){ return maskedWord; },
                "guess": guess,
                "getPossibleGuesses": function(){ return [... possibleGuesses]; },
                "getIncorrectGuesses": function(){ return incorrectGuesses; },
                "guessWord": guessWord,
                "isWon": function(){ return won; },
                "isLost": function(){ return lost; },
            };
        }
        
        function replace( value, index, replacement ) {
            return value.substr(0, index) + replacement + value.substr(index + replacement.length);
        }
        
        function listenForInput(game) {
            let guessLetter = function( letter )
            {
                if (letter) {
                    let gameStillGoing = !game.isWon() && 
                                         !game.isLost();
                    if (gameStillGoing) {
                        game.guess(letter);
                        render(game);
                    }
                }
            };
        
            let handleClick = function(event)	{
                if (event.target.classList.contains('guess')) {
                    guessLetter(event.target.innerHTML);
                }
            }
        
            let handleKeyPress = function(event) {
                let letter = null;
                const A = 65;
                const Z = 90;
                const ENTER = 13;
                let isLetter = event.keyCode >= A && event.keyCode <= Z;
                let guessWordButton = document.getElementById("guessWordButton");
                let newGameButton = document.getElementById("newGameButton");
                let guessBox = document.getElementById("guessBox");
                let gameOver = guessBox.value === youWon || guessBox.value === youLost;
        
                if( event.target.id !== "guessBox" && isLetter) {
                    letter = String.fromCharCode( event.keyCode );
                }
                else if( event.keyCode === ENTER && gameOver) {
                    newGameButton.click();
                }
                else if( event.keyCode === ENTER && guessBox.value !== "" )	{
                    guessWordButton.click();
                }
                guessLetter( letter );
            }
        
            document.addEventListener('keydown', handleKeyPress );
            document.body.addEventListener('click', handleClick );
        }
        function guessWord( game )
        {
            let gameStillGoing = !game.isWon() && 
                                 !game.isLost();
        }
        
        function render(game) {
            document.getElementById("word").innerHTML = game.getMaskedWord(); 
            document.getElementById("guesses").innerHTML = "";
            game.getPossibleGuesses().forEach( function(guess) {
                let innerHtml = "<span class='guess'>" + guess + "</span>";
                document.getElementById("guesses").innerHTML += innerHtml;
            });
            
            document.getElementById("hangmanImage").src = "img/hangman" + game.getIncorrectGuesses() + ".png";
        
            let guessBox = document.getElementById('guessBox');
            if( game.isWon() )
            {
                let gallows = document.getElementById('gallows')
                gallows.style.cssText = "background-image: url('img/ukrainewon.jpeg'); background-size:contain; background-repeat:none;"
                let hangman = document.getElementById("hangmanImage")
                hangman.style.display = "none";
                guessBox.innerHTML = youWon;
                guessBox.classList = "win";
                
            }
            else if( game.isLost() )
            {
                guessBox.innerHTML = youLost;
                guessBox.classList = "loss";
            }
            else
            {
                guessBox.value = "";
                guessBox.classList = "";
            }
        }
        
        
        function newGame()
        {
            history.go(0)
        }
        
    }
