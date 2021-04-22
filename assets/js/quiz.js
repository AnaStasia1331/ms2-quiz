$(document).ready(function () {

    let question = document.getElementById('question-text');
    let options = document.getElementsByClassName('option-text');
    let currentQuestion = {};
    let questions = []
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

                if (errorResponse.status === 404) {
                    console.log(errorResponse);
                }
            }).then(function () {
            loadNewQuestion();

        });
    };

    function startQuiz() {
        fetchTriviaDbQuestions();
    }

    function loadNewQuestion() {
        currentQuestion = questions[questionIndex];
        questionIndex++;
        question.innerText = currentQuestion.question;

        for (let option of options) {
            const number = option.dataset["number"];
            option.innerText = currentQuestion.options[number];
        }
    }

    startQuiz();
});