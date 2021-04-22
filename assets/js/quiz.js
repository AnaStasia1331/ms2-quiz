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
                    question.answer = triviaDbQuestion.correct_answer;
                    questions.push(question);

                }
            },
            function (errorResponse) {
                console.log(errorResponse);
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
            return window.location.assign("/finish-quiz.html");
        }
        currentQuestion = questions[questionIndex];
        questionIndex++;
        question.innerText = currentQuestion.question;

        for (let option of options) {
            const number = option.dataset["number"];
            option.innerText = currentQuestion.options[number];
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


    startQuiz();
});