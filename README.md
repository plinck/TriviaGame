# Trivia Game with timed questions

## Overview

This is a Trivia game using JavaScript for the logic and jQuery to manipulate HTML. This game shows only one question until the player answers it or their time runs out.  The questions are retreived from a public URL to keep it fresh [Open Trivia DB](https://opentdb.com).  It is responsive using media queries to work on smaller screens.

* If the player selects the correct answer, it shows a screen congratulating them for choosing the right option. After a few seconds, display the next question -- without user input.

* If the player selects the wrong answers and/or time-outs.

  * If the player runs out of time, tell the player that time's up and display the correct answer. Wait a few seconds, then show the next question.
  * If the player chooses the wrong answer, tell the player they selected the wrong option and then display the correct answer. Wait a few seconds, then show the next question.

* On the final screen, show the number of correct answers, incorrect answers, and an option to restart the game (without reloading the page).

- - -

## Linked my responsive portffolio and my bootstrap portfolio sites

I added a portfolio item to both my responsive and bootstrap portfolio.  Both of those have a portfolio item that links to this game.  Just click on the image to open up the game.  You can link to either of them by clicking the links below:

* [Responsvive Portfolio](https://plinck.github.io/Responsive-Portfolio/portfolio.html)
* [Bootstrap Portfolio](https://plinck.github.io/Bootstrap-Portfolio/portfolio.html)

- - -

## Bugs, known issues and TODOs

* Mix up correct answer in choices - i.e. dont just concatinate correct answer to end of incorrect answers
* Add an END GAME Button so stop the game in case you feel like quitting
* Make it look better - Colors and Design
* Get flex columns at larger size - check the iPhone X
* Increase the font size on smaller screens
* Put questions on JSON Database file
  * Update code that makes array of objects to new blank object to start vs my own question as first
* Refactor a little but I am not gonna waste my time putting in classes since it is so simple
* Fix VSCode use strict mode
  

- - -