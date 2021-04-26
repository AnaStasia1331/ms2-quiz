$(document).ready(function () {
    let emailField = $('input[type="email"]');
    let checkbox = $('#subscribe');
    let form = document.getElementById("subscribe-form");
    let errorMsg = document.getElementById("error-msg");

    // get the 'score' value from the url 
    let score = sessionStorage.getItem('score');
    // and write it into html span with 'score' id
    $("#score").text(score);

    if (score >= 7) {
        $("#results-display").html(`
        <img class="d-block mx-auto" src="https://media.giphy.com/media/g9582DNuQppxC/giphy.gif"
        alt="super winner gif" />
        <h3 class="text-center header-padding">Congratulations and BRAVO! You are a walking encyclopaedia!</h3>
        `);

    } else if (score > 3) {
        $("#results-display").html(`
        <img class="d-block mx-auto" src="https://media.giphy.com/media/mgqefqwSbToPe/giphy.gif"
        alt="winner gif" />
        <h3 class="text-center header-padding">Well done! You are a smart cookie!</h3>
        `);

    } else {
        $("#results-display").html(`
        <img class="d-block mx-auto" src="https://media.giphy.com/media/IoP0PvbbSWGAM/giphy.gif"
        alt="keep learning gif" />
        <h3 class="text-center header-padding">As Henry Ford once said, "Failure is only the opportunity to begin again more intelligently."</h3>
        `);
    }

    checkbox.click(function () {
        if (emailField.attr("disabled")) {
            emailField.prop("disabled", false);
        } else {
            emailField.val("");
            emailField.prop("disabled", true);
        }
    });

    form.addEventListener('submit', handleSubmit);

    function handleSubmit(event) {
        event.preventDefault();

        if (checkbox.is(":checked")) {
            var enteredValue = document.getElementById("emailField").value;

            // similar to https://www.javatpoint.com/javascript-form-validation JavaScript email validation
            var atPosition = enteredValue.indexOf("@");
            var dotPosition = enteredValue.indexOf(".");

            // Email id must contain the @ and . character
            // There must be at least one character before and after the @.
            // And the last dot must at least be one character after the @.
            if (atPosition < 1 || dotPosition - atPosition < 2) {
                errorMsg.innerHTML = `Please enter valid email address`;
                setTimeout(function () {
                    errorMsg.innerHTML = ""
                }, 2000);
            } else if (enteredValue == "") {
                errorMsg.innerHTML = `Please provide your email address!`;
                setTimeout(function () {
                    errorMsg.innerHTML = ""
                }, 2000);
            } else {
                $.when(sendMail(form)).then(function () {
                    form.action = "/index.html"
                    form.submit();
                }, function (error) {
                    console.log("FAILED", error);
                });
            }

        } else {
            form.action = "/index.html"
            form.submit();
        }

    }
    // source: https://www.emailjs.com/docs/sdk/send/
    function sendMail(subscribeForm) {
        return emailjs.send("service_na1mfol", "template_mdnli8f", {
            "from_email": subscribeForm.emailField.value,
        })
    }

});