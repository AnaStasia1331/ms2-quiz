$(document).ready(function () {
    const questionCardPage = document.getElementById('question-card-page');
    const questionCardContainer = document.getElementById('question-card-container');
    const questionCard = document.getElementById('question-card');
    const loader = document.getElementById('loader');
    const question = document.getElementById('question-text');
    const options = document.getElementsByClassName('option-text');
    const optionLines = document.getElementsByClassName('list-group-item');
    let currentQuestion = {};
    let questions = [];
    let questionIndex = 0;
    const MAX_QUESTIONS_NUM = 9;
    let score = 0;
    const OPENTDB_URL = "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple";

    /**
     * external API https://opentdb.com/ is used to retrieve questions and answers for the quiz
     */
    function fetchTriviaDbQuestions() {
        // first make sure the response from API is completely loaded, then continue the code execution on the response 
        $.when($.getJSON(OPENTDB_URL)).
        then(function (data) {
                const triviaDbQuestions = data.results;
                for (const triviaDbQuestion of triviaDbQuestions) {
                    // the object 'question' is created 
                    let question = {};
                    // the object includes the question, options (all suggested answers), answer (correct answer)
                    question.question = triviaDbQuestion.question;
                    // used the spread operator to make a copy of the incorrect_answers array; source: https://www.educative.io/edpresso/what-is-the-spread-operator-in-javascript
                    question.options = [...triviaDbQuestion.incorrect_answers];
                    question.options.push(triviaDbQuestion.correct_answer);
                    // answers are shuffled, so that correct answer will take different places in the list
                    shuffle(question.options);
                    // get the index of the correct answer for later comparison with the selected answer index
                    question.answerIndex = question.options.indexOf(triviaDbQuestion.correct_answer);
                    questions.push(question);

                }
            },
            /**
             * handle error statuses
             * @param {*} errorResponse 
             */
            function (errorResponse) {
                if (errorResponse.status === 404) {
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
            // show loader until question is fully loaded
            hideLoader();
        });
    }

    /**
     * start quiz by fetching questions from Open Trivia DB API and trigger the event listener on option click
     */
    function startQuiz() {
        fetchTriviaDbQuestions();
        addOptionEventListeners();
    }

    /**
     * load new question and options and if all questions are answered, then pass the score value to the session storage
     */
    function loadNewQuestion() {
        if (questionIndex === MAX_QUESTIONS_NUM) {
            // set the sessionStorage 'score' variable to pass it to the next page 
            // source: https://lage.us/Javascript-Pass-Variables-to-Another-Page.html#:~:text=There%20are%20two%20ways%20to,query%20string%20with%20the%20URL.
            sessionStorage.setItem("score", score);
            // redirect to the Finish quiz page
            return window.location.assign("finish-quiz.html");
        } else {
            //load question in the Question Card 
            currentQuestion = questions[questionIndex];
            questionIndex++;
            question.innerHTML = currentQuestion.question;
            // load suggested answers in the Question Card 
            for (const option of options) {
                // get the value of the data-number attribute from html that will be also used as an index in currentQuestion.options array
                const number = option.dataset.number;
                option.innerHTML = currentQuestion.options[number];
            }
        }
    }

    /**
     * add event listener on option click; validate if the selected option is (in)correct; increase the Correct Answers counter if the answer was correct
     */
    function addOptionEventListeners() {
        for (const optionLine of optionLines) {
            optionLine.addEventListener("click", function (event) {
                const optionText = this.children[1];
                // get the value of the data-number attribute for the selected option and convert it from string into number 
                const selectedAnswerIndex = parseInt(optionText.dataset.number);

                if (checkAnswer(selectedAnswerIndex)) {
                    increaseCorrectAnswersNum();
                    displayAnswerIsCorrect(optionLine);
                } else {
                    displayAnswerIsIncorrect(optionLine);
                }
            });
        }
    }

    /**
     * compare the selected option index with the correct answer index
     * @param {*} selectedAnswerIndex equals to data-number attr. value of the selected option 
     */
    function checkAnswer(selectedAnswerIndex) {
        return selectedAnswerIndex === currentQuestion.answerIndex;
    }

    /**
     * increase the Correct Answers counter by 1 
     */
    function increaseCorrectAnswersNum() {
        document.getElementById('score').innerText = ++score;
    }

    /**
     * update the Questions counter  
     */
    function updateQuestionCounter() {
        document.getElementById('question-counter').innerText = questionIndex + '/10';
    }

    /**
     * this function will be called to randomly shuffle question options  
     * source: https://javascript.info/task/shuffle
     */
    function shuffle(array) {
        array.sort(() => Math.random() - 0.5);
    }

    /**
     * if selected answer is correct, it will be shown in green; after 700ms the highlighting disappears, the new question is loaded and the Question counter is updated
     * @param {*} optionLine 
     */
    function displayAnswerIsCorrect(optionLine) {
        // highlight the answer in green and remove the hover color
        optionLine.classList.add("correct-answer");
        optionLine.classList.remove("hover-option");
        // after 700ms remove the green marking and add the hover class back
        setTimeout(function () {
            optionLine.classList.remove("correct-answer");
            optionLine.classList.add("hover-option");
            loadNewQuestion();
            updateQuestionCounter();
        }, 700);
    }

    /**
     * if selected answer is wrong, it will be shown in red; after 700ms the highlighting disappears, the new question is loaded and the Question counter is updated
     * @param {*} optionLine 
     */
    function displayAnswerIsIncorrect(optionLine) {
        // highlight the answer in red and remove the hover color
        optionLine.classList.add("incorrect-answer");
        optionLine.classList.remove("hover-option");
        // after 700ms remove the red marking and add the hover class back
        setTimeout(function () {
            optionLine.classList.remove("incorrect-answer");
            optionLine.classList.add("hover-option");
            loadNewQuestion();
            updateQuestionCounter();
        }, 700);
    }

    /**
     * remove the loader from the Question Card page and show a Question Card instead
     */
    function hideLoader() {
        // classes .loader-full-screen and .loader-centered were used to center the loader and must be removed when the question card is displayed   
        questionCardPage.classList.remove('loader-full-screen');
        questionCardContainer.classList.remove('loader-centered');
        // removing .d-none will display the question card
        questionCard.classList.remove('d-none');
        // adding .d-none will hide the loader
        loader.classList.add('d-none');
    }

    startQuiz();
});