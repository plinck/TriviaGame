/* **********************************************************************************
 * Trivia Game
 ********************************************************************************** */
// Use strict to keep things sane and not crap code
"use strict";
/*global $:false, jQuery:false */
/*global alert:false */
/*global document:false */
/*global confirm:false */

// Wait for document to be ready
$(document).ready(function () {

    // Timers and counters
    // =============================================================================
    const nextQuestionTimeoutTime = 2000; // Amount of time to display next question
    let nextQuestionTimeoutTimer; // Timer variable to allow cancelling timer

    const answerIntervalTimeout = 1000; // Amount of time between each interval in milliseconds (so 1 second)
    const answerTimeout = 10; // How many intervals before expiring, so 10s
    let answerIntervalTimer; // answerIntervalTimer variable to allow cancelling timer
    let answerCountdown; // to show how much left

    // Game tracking
    // ==============================================================
    let totalCorrectScore = 0; // Total correct answers for the user
    let totalIncorrectScore = 0; // Total correct answers for the user
    let currentQuestionIdx; // the index of current question being asking

    // Array of Question / Answer Objects
    // ===============================================================
    let userQuestions = [];

    // Helper function to shuffle an array 
    // I may or may not use this but I like the code here for reference
    function shuffle(answers) {
        // go from last to first element
        for (let i = answers.length - 1; i > 0; i--) {
            const randomIdx = Math.floor(Math.random() * (i + 1));

            // ES6 - Swap the current element with the random element
            [answers[i], answers[randomIdx]] = [answers[randomIdx], answers[i]];

            // If this is the correct answer, change the index to match where it is being out
            if (randomIdx == userQuestions[currentQuestionIdx].correctAnswerIdx) {
                userQuestions[currentQuestionIdx].correctAnswerIdx = i;
            }
        }
        return answers;
    }

    // Move correct answer - I am using this vs shuffle for now
    // Move the correct answer in the array so it isnt always in the same position
    // This does not suffle the entire answer array 
    // it is more efficient to just randomly assign where the answer appears in the array
    function moveCorrectAnswer(currentCorrectAnswerIdx, answers) {
        // Using index so I dont have to compare strings with funky characters
        const randomAnswerIdx = Math.floor(Math.random() * userQuestions[currentQuestionIdx].answers.length);

        // Swap correct answer into new place
        [answers[randomAnswerIdx], answers[currentCorrectAnswerIdx]] = [answers[currentCorrectAnswerIdx], answers[randomAnswerIdx]];

        // Assign the corect answer index to the new place it was placed 
        userQuestions[currentQuestionIdx].correctAnswerIdx = randomAnswerIdx;

        return answers;
    }

    // Display the next question in the list - wrap around if no more
    function nextQuestionRender() {
        if (currentQuestionIdx == undefined) {
            currentQuestionIdx = 0;
        } else {
            currentQuestionIdx++;
        }

        $("#currentQuestion").html(userQuestions[currentQuestionIdx].question);
    }

    // Display the answer choices for the current question
    function answerChoicesRender(answers) {
        $("#possibleAnswers").empty();

        for (var i in answers) {
            var btnChoice = $(`<div class="answer-btn" data-value="${i}">${answers[i]}</div>`);
            $("#possibleAnswers").append(btnChoice);
        }
    }

    // Get next question ready to display in a certain amount of time
    function setupNextQuestion() {
        // Clear the previous question
        $("#currentQuestion").empty();
        $("#possibleAnswers").html("Waiting for next question ...");

        // The end
        if (currentQuestionIdx >= (userQuestions.length - 1)) {
            endCurrentGame(totalCorrectScore, totalIncorrectScore);
        } else { // continue game
            clearTimeout(nextQuestionTimeoutTimer);
            // Wait a few seconds and then display next question
            nextQuestionTimeoutTimer = setTimeout(askAQuestion, nextQuestionTimeoutTime);
        }
    }

    // This displays how many seconds are left to answer the current question
    function decrementAnswerCountown() {

        answerCountdown -= 1;

        $("#timeRemaining").html(answerCountdown);

        if (answerCountdown <= 0) {
            clearInterval(answerIntervalTimer);
            didntAnswerOnTime();
        }
    }

    // After answer is given, check to see if it was correct
    // NOTE: The answerIdx is the index of the correct answer in the array vs the text of the answer
    // It makes it easier to check for correct answer vs comparing strings with codes in them
    function checkAnswer(answerIdx) {
        let myAnswerIndex = parseInt(answerIdx, 10);
        let correctAnswerIndex = userQuestions[currentQuestionIdx].correctAnswerIdx;

        if (myAnswerIndex === correctAnswerIndex) {
            totalCorrectScore += 1;
            lastResultRender(userQuestions[currentQuestionIdx].answers[myAnswerIndex], "Correct!");
            alert(`${userQuestions[currentQuestionIdx].answers[correctAnswerIndex]} is Correct!`);
        } else {
            totalIncorrectScore += 1;
            lastResultRender(userQuestions[currentQuestionIdx].answers[myAnswerIndex], "Wrong!");
            alert(`Wrong! Correct answer is: ${userQuestions[currentQuestionIdx].answers[correctAnswerIndex]}`);
        }

        // Queue Up Next Question
        setupNextQuestion();
    }

    // If they dont answer within the timer, they get it wrong by default
    // Send results to display and go to next question
    function didntAnswerOnTime() {
        totalIncorrectScore += 1;

        lastResultRender("No Answer - timeout", "Wrong!");
        alert("Ran out of time, sorry, you lose");

        // Queue Up Next Question
        setupNextQuestion();
    }

    // Display the previous question, asnwer and result
    function lastResultRender(lastAnswerText, lastResultText) {

        $("#lastQuestion").html(userQuestions[currentQuestionIdx].question);
        $("#lastCorrectAnswer").html(userQuestions[currentQuestionIdx].correctAnswer);
        $("#lastAnswer").html(lastAnswerText);
        $("#lastResult").html(lastResultText);

        $("#totalCorrectAnswers").html(totalCorrectScore);
        $("#totalIncorrectAnswers").html(totalIncorrectScore);
    }

    // End the game - display totals
    function endCurrentGame(correct, incorrect) {
        clearTimeout(nextQuestionTimeoutTimer);

        let total = correct + incorrect;
        let messageResults = `Game Over. Correct Answers: ${correct}. Incorrect: ${incorrect}.  Total: ${total}`;

        if (confirm(`${messageResults} -- would you like to play again?`)) {
            startNewGame();
        } else {
            $("#currentQuestion").html(messageResults);
            $("#possibleAnswers").empty();
        }
    }

    // If the user wants to, start a new game
    function startNewGame() {
        totalCorrectScore = 0; // Total correct answers for the game
        totalIncorrectScore = 0; // Total correct answers for the game
        // Set current question undefined so we know to *start* at the first question (item[0])
        currentQuestionIdx = undefined;
        askAQuestion();
    }

    // Ask the next question and set a timer so the must answer in a certain amount of time
    // If they dont answer within the timer, they get it wrong by default
    function askAQuestion() {
        nextQuestionRender();

        // Move the correct answer in answer list so it isnt always at index 0
        let shuffledAnswers = moveCorrectAnswer(userQuestions[currentQuestionIdx].correctAnswerIdx, userQuestions[currentQuestionIdx].answers);
        answerChoicesRender(shuffledAnswers);

        answerCountdown = answerTimeout; // Number of intervals to timeout (in this case, in seconds)

        $("#timeRemaining").html(answerCountdown);

        answerIntervalTimer = setInterval(decrementAnswerCountown, answerIntervalTimeout);
    }

    // Helper HTTP Function for Async calls
    // ===================================================================================================
    function HttpClientAsync(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function () {
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        };

        anHttpRequest.open("GET", aUrl, true);
        anHttpRequest.send(null);
    }

    // Read from JSON URL and convert JSON to javascript list of objects
    // If error, use error handler to create custom questions. 
    // If OK, refactor list to simplify and match object structure I am using
    // ===================================================================================================
    function setupQuestions() {
        let jsonQuestions = {};
        let requestURL = 'https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple';
        // PUBLIC DOMAIN API TO GET QUESTIONS e.g.:
        // Computers - https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple
        // General - https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple

        HttpClientAsync(requestURL, function (response) {
            jsonQuestions = JSON.parse(response);

            // if error, handle it
            if (jsonQuestions.response_code != 0) {
                errorHandler(jsonQuestions.response_code);
            } else {
                refactorQuestions(jsonQuestions);
            }
            // Start game by asking a question - note this is async so dont ask until the response comes back
            askAQuestion();
        });
    }

    // Refactor external object structure list of questions since format is not exactly what I want
    // for exmaple, the possible answers need to include the correct and incorrect answers
    // this step can be eliminated later by changing the code inside slightly but I like it this way
    // ===========================================================================================
    function refactorQuestions(jsonQuestions) {
        userQuestions.length = 0;
        userQuestions = [];
        for (let i in jsonQuestions.results) {
            userQuestions[i] = {}; // Initiailize array value as empty object
            let currentQuestion = {}; // convenience temp variable for readability

            currentQuestion.question = jsonQuestions.results[i].question;
            currentQuestion.answers = [jsonQuestions.results[i].correct_answer].concat(jsonQuestions.results[i].incorrect_answers);

            currentQuestion.correctAnswer = jsonQuestions.results[i].correct_answer;
            currentQuestion.correctAnswerIdx = 0;
            currentQuestion.correctImage = "";

            userQuestions[i] = currentQuestion;
        }
    }

    // Handle errors from http request
    // Populate with some hard coded questions
    function errorHandler(error) {
        console.log(`failed to get questions, error is: ${error}.  Building backup set of questions`);

        userQuestions = [{
                question: "Who was the 41st President?",
                answers: ["George HW Bush", "George W Bush", "Bill Clinton", "Gerald Ford"],
                correctAnswer: "George HW Bush",
                correctAnswerIdx: 0,
                correctImage: ""
            },
            {
                question: "What is the real name of 'moot', founder of the imageboard 4chan?",
                correctAnswer: "Christopher Poole",
                answers: ["Christopher Poole", "Mark Zuckerberg", "Allison Harvard", "Catie Wayne"],
                correctAnswerIdx: 0,
                correctImage: ""
            }, {
                question: "What is the most preferred image format used for logos in the Wikimedia database?",
                correctAnswer: ".svg",
                answers: [".svg", ".png", ".jpeg", ".gif"],
                correctAnswerIdx: 0,
                correctImage: ""
            }, {
                question: "What is the primary addictive substance found in tobacco?",
                correctAnswer: "Nicotine",
                answers: ["Nicotine", "Cathinone", "Ephedrine", "Glaucine"],
                correctAnswerIdx: 0,
                correctImage: ""

            }, {
                question: "What is the Spanish word for &quot;donkey&quot;?",
                correctAnswer: "Burro",
                answers: ["Burro", "Caballo", "Toro", "Perro"],
                correctAnswerIdx: 0,
                correctImage: ""

            }, {
                question: "What is Grumpy Cat&#039;s real name?",
                correctAnswer: "Burro",
                answers: ["Burro", "Sauce", "Minnie", "Broccoli"],
                correctAnswerIdx: 0,
                correctImage: ""

            }, {
                question: "The book &quot;The Little Prince&quot; was written by...",
                correctAnswer: "Antoine de Saint-Exup&eacute;ry",
                answers: ["Antoine de Saint-Exup&eacute;ry", "Miguel de Cervantes Saavedra", "Jane Austen", "F. Scott Fitzgerald"],
                correctAnswerIdx: 0,
                correctImage: ""

            }, {
                question: "3 members of 2 Live Crew were arrested for playing songs from their album, As Nasty As They Wanna Be, live.",
                correctAnswer: "True",
                answers: ["True", "False"],
                correctAnswerIdx: 0,
                correctImage: ""

            }, {
                question: "Who was the leader of the Communist Party of Yugoslavia ?",
                correctAnswer: "Josip Broz Tito",
                answers: ["Josip Broz Tito", "Karadjordje Petrovic", "Milos Obilic", "Aleskandar Petrovic"],
                correctAnswerIdx: 0,
                correctImage: ""

            }, {
                question: "Which of these people was NOT a founder of Apple Inc?",
                correctAnswer: "Jonathan Ive",
                answers: ["Jonathan Ive", "Steve Jobs", "Ronald Wayne", "Steve Wozniak"],
                correctAnswerIdx: 0,
                correctImage: ""

            }, {
                question: "Alan Reed is known for providing the voice of which character?",
                correctAnswer: "Fred Flintstone",
                answers: ["Fred Flintstone", "Bugs Bunny", "Fangface", "G.I. Joe"],
                correctAnswerIdx: 0,
                correctImage: ""

            }
        ];
    }

    /****************************************************************************************
     * MAIN
     * The whole thing starts by setting up the questions and asking the first one.
     * Since I am getting the questions from a server, I am doing it async/non-blocking so
     * I ask the first question inside the callback that returns from the server.
     * That way, the game will only start when that is completed
     **************************************************************************************** */
    setupQuestions();

    // Wait for the user to click on an answer
    // must chain to parent to get all clicks of .answer-btn since created later - even on reset
    $("#possibleAnswers").on("click", ".answer-btn", function () {
        // get value
        let currentAnswer = $(this).attr("data-value");

        // clear timer since thet did answer - need to start new timer
        // when you ask the next question
        clearInterval(answerIntervalTimer);

        // Check to see if the user answered correctly
        checkAnswer(currentAnswer);
    });

    // Allow user to end the game early
    $("#endGameButton").on("click", function () {
        // clear timer since thet did answer - need to start new timer
        // when you ask the next question
        clearInterval(answerIntervalTimer);
        endCurrentGame(totalCorrectScore, totalIncorrectScore);

    });

}); // $(document).ready