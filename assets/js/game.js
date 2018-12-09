/* **********************************************************************************
 * Main Program - game
 * main is the "view controller" that interacts with web page which is the view
 ********************************************************************************** */
// I put strict in .jshintrc settings
// Use strict to keep things sane and not crap code
"use strict";
/*global $:false, jQuery:false */
/*global alert:false */


$(document).ready(function () {

    // HTML Elements for display
    // ====================================================
    let timeRemaining = $("#timeRemaining");
    let nextQuestionIn = $("#nextQuestionIn");

    let currentQuestion = $("#currentQuestion");
    let possibleAnswers = $("#possibleAnswers");

    let lastQuestion = $("#lastQuestion");
    let lastCorrectAnswer = $("#lastCorrectAnswer");
    let lastAnswer = $("#lastAnswer");
    let lastResult = $("#lastResult");

    // Timers and counters
    // ====================================================
    const nextQuestionTimeoutTime = 2000; // Amount of time to display next question
    let nextQuestionTimeoutTimer; // imer variable to allow cancelling timer
    let nextQuestionCountdown; // Countdown to next Question

    const answerTimeoutTime = 1000; // Amount of time to make a choice
    let answerIntervalTimer; // answerIntervalTimer variable to allow cancelling timer
    let answerCountdown; // to show how much left

    // Game tracking
    // ====================================================
    let totalScore = 0; // Total correct answers for the user
    let currentQuestionIdx; // the index of question being asking

    // Array of Questio Objects - move this to JSON File
    // ====================================================
    let myQuestions = [{
            question: "Who was the 41st President?",
            answers: ["George W Bush", "Bill Clinton", "George HW Bush", "Gerald Ford"],
            correctAnswer: 2,
            correctImage: ""
        },
        {
            question: "Who was the 42nd President?",
            answers: ["Bill Clinton", "George HW Bush", "Gerald Ford", "George W Bush"],
            correctAnswer: 0,
            correctImage: ""
        }
    ];

    // Go to the next question in the list - wrap around if no more
    function displayNextQuestion() {
        if (currentQuestionIdx == undefined) {
            currentQuestionIdx = 0;
        } else {
            currentQuestionIdx++;
        }

        currentQuestion.html(myQuestions[currentQuestionIdx].question);
    }

    // display the answer choices for the current question
    function displayAnswerChoices() {
        possibleAnswers.empty();

        for (var i in myQuestions[currentQuestionIdx].answers) {
            var btnChoice = $('<div class="answer-btn" data-value="' + i + '">' + myQuestions[currentQuestionIdx].answers[i] + '</div>');
            possibleAnswers.append(btnChoice);
        }
    }

    // get next question ready to display in a certain amount of time
    function setupNextQuestion() {
        // Clear the previous question
        currentQuestion.empty();
        possibleAnswers.html("Waiting for next question ...");

        // The end
        console.log("currentQuestionIdx", currentQuestionIdx);

        if (currentQuestionIdx >= (myQuestions.length - 1)) {
            endCurrentGame(totalScore, myQuestions.length);
        } else { // continue game
            // clear the timeout
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

    // After answer is given, check to see if user was correct
    function checkAnswer(answer) {
        // Wait for Answer
        if (answer == myQuestions[currentQuestionIdx].correctAnswer) {
            displayLastResult(lastAnswer.html(myQuestions[currentQuestionIdx].answers[answer]), "Correct!");
            alert("Correct!");
            totalScore += 1;
        } else {
            displayLastResult(lastAnswer.html(myQuestions[currentQuestionIdx].answers[answer]), "Wrong!");
            alert("Wrong!");
        }

        // Queue Up Next Question
        setupNextQuestion();
    }

    // If they dont answer within the timer, they get it wrong by default
    // Send results to display and go to next question
    function didntAnswerOnTime() {

        displayLastResult("No Answer - timeout", "Wrong!");
        alert("Ran out of time, sorry, you lose");

        // Queue Up Next Question
        setupNextQuestion();
    }

    // Display the previous question, asnwer and result
    function displayLastResult(lastAnswerText, lastResultText) {
        let correctAnswerIdx = myQuestions[currentQuestionIdx].correctAnswer;

        lastQuestion.html(myQuestions[currentQuestionIdx].question);
        lastCorrectAnswer.html(myQuestions[currentQuestionIdx].answers[correctAnswerIdx]);
        lastAnswer.html(lastAnswerText);
        lastResult.html(lastResultText);
    }

    // End the game - display totals
    function endCurrentGame(totalScore, nbr) {
        clearTimeout(nextQuestionTimeoutTimer);

        if (confirm("Game Over - you answered " + totalScore + " correctly, out of " + nbr + " total.  Would you like to play again?")) {
            newGame();
        } else {
            possibleAnswers.html("Game over.  You answerd " + totalScore + " correctly, out of " + nbr + " total.");
        }
    }

    // If the user wants to, start a new game
    function newGame() {
        totalScore = 0; // Total correct answers for the game
        // Set current question undefined so we know to *start* at the first question (item[0])
        currentQuestionIdx = undefined;
        askAQuestion();
    }

    // Aak the next question and set a timer so the must answer in a certain amount of time
    // If they dont answer within the timer, they get it wrong by default
    function askAQuestion() {
        displayNextQuestion();
        displayAnswerChoices();

        answerCountdown = Math.round(answerTimeoutTime / 100); // Number of seconds left

        timeRemaining.html(answerCountdown);

        answerIntervalTimer = setInterval(decrementAnswerCountown, answerTimeoutTime);
    }

    /****************************************************************************************
     * MAIN
     * The whole thing starts by displaying a question.  Then, we just sit there and wait
     * until the user gives an answer or it times out.  After that, lwe go to next question.
     **************************************************************************************** */

    askAQuestion();

    // must chain to parent to get all even on reset
    $("#possibleAnswers").on("click", ".answer-btn", function () {
        // get value
        let currentAnswerIdx = $(this).attr("data-value");

        // clear timer since thet did answer - need to start new timer
        // when you ask the next question
        clearInterval(answerIntervalTimer);

        // Check to see if the user answered correctly
        checkAnswer(currentAnswerIdx);
    });


});