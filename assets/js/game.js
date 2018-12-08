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
    let myQuestion = document.getElementById("question");
    let myLastQuestion = document.getElementById("lastQuestion");
    let myAnswer = document.getElementById("answer");
    let myCorrectAnswer = document.getElementById("correctAnswer");
    let myResult = document.getElementById("result");
    let myTextInputAnswer = document.getElementById("textInputAnswer");

    const timeoutTime = 3000; // Amount of time to make a choice
    let myTimer; // myTimer variable to allow cancelling timer
    let totalScore = 0; // Total correct answers for the user

    // Set current question undefined so we know to *start* at the first question (item[0])
    // This is primarily due to that displayNextQuestion alway goes to the next question
    // and when we start the program from scratch, we want to start at 0
    let currentQuestion = undefined;

    let myQuestions = [{
            "question": "Is the Sky Blue?",
            "answer": true
        },
        {
            "question": "Is your hair blonde?",
            "answer": false
        },
        {
            "question": "Is the capital of Georgia, Milledgeville?",
            "answer": false
        }
    ];

    // Go to the next question in the list - wrap around if no more
    function displayNextQuestion() {
        if (currentQuestion == undefined) {
            currentQuestion = 0;
        } else {
            currentQuestion++;
        }

        if (currentQuestion >= myQuestions.length) {
            endCurrentGame(totalScore, myQuestions.length);
            currentQuestion = 0;
            totalScore = 0;
        }
        myQuestion.innerHTML = myQuestions[currentQuestion].question;
    }

    // After answer is given, check to see if user was correct
    function checkAnswer(answer) {
        // Wait for Answer
        if (answer == myQuestions[currentQuestion].answer) {
            myResult.innerHTML = "Correct!";
            alert("Correct!");
            totalScore += 1;
        } else {
            myResult.innerHTML = "Wrong!";
            alert("Wrong!");
        }
        myLastQuestion.innerHTML = myQuestions[currentQuestion].question;
        myCorrectAnswer.innerHTML = myQuestions[currentQuestion].answer;
        myAnswer.innerHTML = answer;
    }

    // End the game - display totals
    function endCurrentGame(totalScore, nbr) {
        alert("Game Over - you answered " + totalScore + " correctly, out of " + nbr + " total");
    }

    // This option is used if using an input field to get the users keystroke entered
    // Wait for a key event from a specific input field
    function waitForInputField() {
        let answer = false; // true or false

        let myAnswer = myTextInputAnswer;
        myAnswer.value = myAnswer.value.toLowerCase();

        // Only bother checking id true or false entered
        if (myAnswer.value == 't' || myAnswer.value == 'f') {
            if (myAnswer.value == 't') {
                console.log("You picked true");
                answer = true;
            }
            if (myAnswer.value == 'f') {
                console.log("You picked false");
                answer = false;
            }

            // clear answer and timer since thet did aswer - need to start new timer
            // when you ask the next question
            clearTimeout(myTimer);
            myTextInputAnswer.value = "";

            // Check to see if the user answered correctly
            checkAnswer(answer);

            // Check to see if the user answered correctly
            askAQuestion();
        } else {
            // clear what user typed since it was bogus - ie. not 't' or 'f'
            myTextInputAnswer.value = "";
        }
    }

    // This option is used if using any key event in the window to get user's answer
    // Wait for a key event on the window of the browser
    document.onkeyup = function (event) {
        let answer;

        if (event.key == 't' || event.key == 'f') {
            if (event.key == 't') {
                console.log("You picked true");
                answer = true;
            }
            if (event.key == 'f') {
                console.log("You picked false");
                answer = false;
            }

            // clear timer since thet did answer - need to start new timer
            // when you ask the next question
            clearTimeout(myTimer);

            // Check to see if the user answered correctly
            checkAnswer(answer);

            // Check to see if the user answered correctly
            askAQuestion();
        }
    }

    // If they dont answer within the timer, they get it wrong by default
    // Send results to display and go to next question
    function didntAnswerOnTime() {
        alert("ran out of time, sorry, you lose");
        myLastQuestion.innerHTML = myQuestions[currentQuestion].question;
        myCorrectAnswer.innerHTML = myQuestions[currentQuestion].answer;
        myAnswer.innerHTML = "No Answer - timeout";
        myResult.innerHTML = "Wrong!";

        askAQuestion();
    }

    // Aak the next question and set a timer so the must answer in a certain amount of time
    // If they dont answer within the timer, they get it wrong by default
    function askAQuestion() {
        displayNextQuestion();
        myTimer = setTimeout(didntAnswerOnTime, timeoutTime);
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