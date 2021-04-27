$(document).ready(function () {

    let question = document.getElementById('question-text');
    let options = document.getElementsByClassName('option-text');
    let optionLines = document.getElementsByClassName('list-group-item');
    let currentQuestion = {};
    let questions = []
    const MAX_QUESTIONS_NUM = 9;
    let questionIndex = 0;

    function fetchTriviaDbQuestions() {

        $.when($.getJSON("https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple")).
        then(function (data) {
                var triviaDbQuestions = data.results;
                for (let triviaDbQuestion of triviaDbQuestions) {
                    var question = {};
                    question.question = triviaDbQuestion.question;
                    question.options = [...triviaDbQuestion.incorrect_answers];
                    question.options.push(triviaDbQuestion.correct_answer);
                    shuffle(question.options);
                    question.answer = triviaDbQuestion.correct_answer;
                    questions.push(question);

                }
            },
            function (errorResponse) {
                if (errorResponse.status === 404) {
                    console.log(errorResponse);
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
    };

    function startQuiz() {
        fetchTriviaDbQuestions();
        addOptionEventListeners();
    }

    function loadNewQuestion() {
        if (questionIndex === MAX_QUESTIONS_NUM) {
            // get the final number of correct answers 
            var score = document.getElementById('score').innerText;
            // create the sessionStorage 'score' variable to pass it to the next page via url 
            // source: https://lage.us/Javascript-Pass-Variables-to-Another-Page.html
            sessionStorage.setItem("score", score);
            // redirect to the Finish quiz page with 'score' parameter and value
            return window.location.assign("finish-quiz.html?score=" + score);
        }
        currentQuestion = questions[questionIndex];
        questionIndex++;
        question.innerHTML = currentQuestion.question;

        for (let option of options) {
            const number = option.dataset["number"];
            option.innerHTML = currentQuestion.options[number];
        }
    }

    function addOptionEventListeners() {

        for (let optionLine of optionLines) {

            optionLine.addEventListener("click", function (event) {
                var optionText = this.children[1];
                var selectedAnswer = optionText.innerText;

                if (checkAnswer(selectedAnswer)) {
                    increaseCorrectAnswersNum();
                    // mark the correct answer green  
                    optionLine.classList.add("correctAnswer");
                    optionLine.classList.remove("hover-option");
                    setTimeout(function () {
                        optionLine.classList.remove("correctAnswer");
                        optionLine.classList.add("hover-option");
                        loadNewQuestion();
                        increaseQuestionCounter();
                    }, 700);



                } else {
                    // mark the correct answer red  
                    optionLine.classList.add("incorrectAnswer");
                    optionLine.classList.remove("hover-option");
                    setTimeout(function () {
                        optionLine.classList.remove("incorrectAnswer");
                        optionLine.classList.add("hover-option");
                        loadNewQuestion();
                        increaseQuestionCounter();
                    }, 700);

                }
            });

        }
    }

    function checkAnswer(selectedAnswer) {

        return selectedAnswer === currentQuestion.answer;
    }

    function increaseCorrectAnswersNum() {

        var oldNum = parseInt(document.getElementById('score').innerText);
        document.getElementById('score').innerText = ++oldNum;
    }

    function increaseQuestionCounter() {
        document.getElementById('question-counter').innerText = questionIndex + '/10';
    }
    // source: https://javascript.info/task/shuffle
    function shuffle(array) {
        array.sort(() => Math.random() - 0.5);
    }


    startQuiz();
});