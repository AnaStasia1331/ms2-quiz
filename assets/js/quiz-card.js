$(document).ready(function () {

    let question = document.getElementById('question-text');
    let options = document.getElementsByClassName('option-text');
    let optionLines = document.getElementsByClassName('list-group-item');
    let currentQuestion = {};
    let questions = [];
    let questionIndex = 0;
    const MAX_QUESTIONS_NUM = 9;
    const OPENTDB_URL = "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple";

    // external API https://opentdb.com/ is used to retrieve questions and answers for the quiz
    function fetchTriviaDbQuestions() {
        // first make sure the response from API is completed loaded, then continue the code execution on the response 
        $.when($.getJSON(OPENTDB_URL)).
        then(function (data) {
                let triviaDbQuestions = data.results;
                for (let triviaDbQuestion of triviaDbQuestions) {
                    // the object 'question' is created 
                    let question = {};
                    // the object includes the question, options (all suggested answers), answer (correct answer)
                    question.question = triviaDbQuestion.question;
                    // used the spread operator to make a copy of the incorrect_answers array; source: https://www.educative.io/edpresso/what-is-the-spread-operator-in-javascript
                    question.options = [...triviaDbQuestion.incorrect_answers];
                    question.options.push(triviaDbQuestion.correct_answer);
                    // answers are shuffled, so that correct answer will take different places in the list
                    shuffle(question.options);
                    question.answer = triviaDbQuestion.correct_answer;
                    questions.push(question);

                }
            },
            function (errorResponse) {
                if (errorResponse.status === 404) {
                    console.log(errorResponse);
                    // the respective error page will be displayed to user on 404 status
                    $(".container").html(`
                    <div class="row">
                <div class="col-md-12">
                    <div>
                        <h1>Oops!</h1>
                        <h1>404 Not Found</h1>
                        <p style="font-size: larger;">Sorry, an error has occured, requested page not found :(</p>
                    </div>
                </div>
            </div>`);
                } else {
                    console.log(errorResponse);
                    // error page will be shown on any other error status
                    $(".container").html(`
                    <div class="row">
                <div class="col-md-12">
                    <div>
                        <h2>Oops!</h2>
                        <h2>Sorry, an error has occured :(</h2>
                    </div>
                </div>
            </div>`);
                }
            }).then(function () {
            loadNewQuestion();
        });
    }

    function startQuiz() {
        fetchTriviaDbQuestions();
        addOptionEventListeners();
    }

    function loadNewQuestion() {
        if (questionIndex === MAX_QUESTIONS_NUM) {
            // get the final number of correct answers 
            let score = document.getElementById('score').innerText;
            // create the sessionStorage 'score' variable to pass it to the next page via url 
            // source: https://lage.us/Javascript-Pass-variables-to-Another-Page.html
            sessionStorage.setItem("score", score);
            // redirect to the Finish quiz page with 'score' parameter and value
            return window.location.assign("finish-quiz.html?score=" + score);
        }
        //load question in the Question Card 
        currentQuestion = questions[questionIndex];
        questionIndex++;
        question.innerHTML = currentQuestion.question;
        //load suggested answers in the Question Card 
        for (let option of options) {
            const number = option.dataset.number;
            option.innerHTML = currentQuestion.options[number];
        }
    }

    function addOptionEventListeners() {
        for (let optionLine of optionLines) {
            optionLine.addEventListener("click", function (event) {
                let optionText = this.children[1];
                let selectedAnswer = optionText.innerText;

                if (checkAnswer(selectedAnswer)) {
                    increaseCorrectAnswersNum();
                    displayAnswerIsCorrect(optionLine);
                } else {
                    displayAnswerIsIncorrect(optionLine);
                }
            });
        }
    }

    function checkAnswer(selectedAnswer) {
        return selectedAnswer === currentQuestion.answer;
    }

    // source: Code Institute, JavaScript Essentials module, JavaScript Walkthrough Project
    function increaseCorrectAnswersNum() {
        let oldNum = parseInt(document.getElementById('score').innerText);
        document.getElementById('score').innerText = ++oldNum;
    }

    function increaseQuestionCounter() {
        document.getElementById('question-counter').innerText = questionIndex + '/10';
    }

    // source: https://javascript.info/task/shuffle
    function shuffle(array) {
        array.sort(() => Math.random() - 0.5);
    }

    function displayAnswerIsCorrect(optionLine) {
        // highlight the answer in green and remove the hover color
        optionLine.classList.add("correctAnswer");
        optionLine.classList.remove("hover-option");
        // after 700ms remove the green marking and add the hover class back
        setTimeout(function () {
            optionLine.classList.remove("correctAnswer");
            optionLine.classList.add("hover-option");
            loadNewQuestion();
            increaseQuestionCounter();
        }, 700);
    }

    function displayAnswerIsIncorrect(optionLine) {
        // highlight the answer in red and remove the hover color
        optionLine.classList.add("incorrectAnswer");
        optionLine.classList.remove("hover-option");
        // after 700ms remove the red marking and add the hover class back
        setTimeout(function () {
            optionLine.classList.remove("incorrectAnswer");
            optionLine.classList.add("hover-option");
            loadNewQuestion();
            increaseQuestionCounter();
        }, 700);
    }

    startQuiz();
});