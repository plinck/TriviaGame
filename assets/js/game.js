/* **********************************************************************************
 * Main Program - game
 * main is the "view controller" that interacts with web page which is the view
 ********************************************************************************** */
// Use strict to keep things sane and not crapp code
"use strict";
/*global $:false, jQuery:false */
/*global document:false */
/*global console:false */
/*global alert:false */


$(document).ready(function () {

    // HTML Elements for display
    let currentQuestion = $("#currentQuestion");
    let possibleAnswers = $("#possibleAnswers");

    let lastQuestion = $("#lastQuestion");
    let lastCorrectAnswer = $("#lastCorrectAnswer");
    let lastAnswer = $("#lastAnswer");
    let lastResult = $("#lastResult");

    const timeoutTime = 5000; // Amount of time to make a choice
    let myTimer; // myTimer variable to allow cancelling timer
    let totalScore = 0; // Total correct answers for the user

    // Set current question undefined so we know to *start* at the first question (item[0])
    let currentQuestionIdx;

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

        if (currentQuestionIdx >= myQuestions.length) {
            endCurrentGame(totalScore, myQuestions.length);
            currentQuestionIdx = 0;
            totalScore = 0;
        }
        currentQuestion.html(myQuestions[currentQuestionIdx].question);
    }

    function displayAnswerChoices() {
        possibleAnswers.empty();

        for (var i in myQuestions[currentQuestionIdx].answers) {
            var btnChoice = $('<button class="answer-btn" data-value="' + i + '">' + myQuestions[currentQuestionIdx].answers[i] + '</button>');
            possibleAnswers.append(btnChoice);
        }
    }

    // After answer is given, check to see if user was correct
    function checkAnswer(answer) {
        // Wait for Answer
        if (answer == myQuestions[currentQuestionIdx].correctAnswer) {
            lastResult.html("Correct!");
            alert("Correct!");
            totalScore += 1;
        } else {
            lastResult.html("Wrong!");
            alert("Wrong!");
        }
 
        let correctAnswerIdx = myQuestions[currentQuestionIdx].correctAnswer;

        lastQuestion.html(myQuestions[currentQuestionIdx].question);
        lastCorrectAnswer.html(myQuestions[currentQuestionIdx].answers[correctAnswerIdx]);
        lastAnswer.html(myQuestions[currentQuestionIdx].answers[answer]);
    }

    // End the game - display totals
    function endCurrentGame(totalScore, nbr) {
        alert("Game Over - you answered " + totalScore + " correctly, out of " + nbr + " total");
    }

    // must chain to parent to get all even on reset
    $("#possibleAnswers").on("click", ".answer-btn", function () {
        // get value
        let currentAnswerIdx = $(this).attr("data-value");

        // clear timer since thet did answer - need to start new timer
        // when you ask the next question
        clearTimeout(myTimer);

        // Check to see if the user answered correctly
        checkAnswer(currentAnswerIdx);

        // Check to see if the user answered correctly
        askAQuestion();
    });

    // If they dont answer within the timer, they get it wrong by default
    // Send results to display and go to next question
    function didntAnswerOnTime() {
        alert("ran out of time, sorry, you lose");
        let currentQuestion = $("#currentQuestion");
        let lastQuestion = $("#lastQuestion");
        let lastCorrectAnswer = $("#lastCorrectAnswer");
        let lastAnswer = $("lastAnswer");

        let possibleAnswers = $("#possibleAnswers");

        lastQuestion.html(myQuestions[currentQuestionIdx].question);
        lastCorrectAnswer.html(myQuestions[currentQuestionIdx].answer);
        lastAnswer.html("No Answer - timeout");
        lastResult.html("Wrong!");

        askAQuestion();
    }

    // Aak the next question and set a timer so the must answer in a certain amount of time
    // If they dont answer within the timer, they get it wrong by default
    function askAQuestion() {
        displayNextQuestion();
        displayAnswerChoices();
        // myTimer = setTimeout(didntAnswerOnTime, timeoutTime);
    }

    /****************************************************************************************
     * MAIN
     * The whole tyhing starts by displaying a question.  Then, we just sit there and wait
     * until the user gives an answer of t or f.  Afgter that, lwe go to next question.
     * Adding a timeout for each question would be a nice addition
     * I have two alternative method for doing this.
     * 1) Use text input field tyo get user input
     * 2) Use onkeyup global event to get user input
     * The rest of the code is the same but these two alternatives control the flow
     **************************************************************************************** */

    askAQuestion();

});