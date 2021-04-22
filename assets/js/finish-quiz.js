$(document).ready(function () {
    // get the 'score' value from the url 
    let score = sessionStorage.getItem('score');
    // and write it into html span with 'score' id
    $("#score").text(score);
});