$(document).ready(function () {
    // get the 'score' value from the url 
    let score = sessionStorage.getItem('score');
    // and write it into html span with 'score' id
    $("#score").text(score);

    if (score >= 7) {
        $("#results-display").html(`
        <img class="d-block mx-auto" src="https://media.giphy.com/media/g9582DNuQppxC/giphy.gif"
        alt="super winner gif" />
        <h3>Congratulations and BRAVO! You are a walking encyclopaedia!</h3>
        `);

    } else if (score > 2) {
        $("#results-display").html(`
        <img class="d-block mx-auto" src="https://media.giphy.com/media/mgqefqwSbToPe/giphy.gif"
        alt="winner gif" />
        <h3>Well done! You are a smart cookie!</h3>
        `);

    } else {
        $("#results-display").html(`
        <img class="d-block mx-auto" src="https://media.giphy.com/media/IoP0PvbbSWGAM/giphy.gif"
        alt="keep learning gif" />
        <h3>As Henry Ford once said, "Failure is only the opportunity to begin again more intelligently."</h3>
        `);
    }
});