$(document).ready(function () {
    const emailField = $('input[type="email"]');
    const checkbox = $('#subscribe');
    const form = document.getElementById("subscribe-form");
    const errorMsg = document.getElementById("error-msg");

    // get the 'score' value from the url 
    const score = sessionStorage.getItem('score');
    // and write it into html span with 'score' id
    $("#score").text(score);

    // depending on score result, display different messages and gifs
    if (score >= 7) {
        $("#results-display").html(`
        <img class="d-block mx-auto img-fluid" src="https://media.giphy.com/media/g9582DNuQppxC/giphy.gif"
        alt="super winner gif" />
        <h3 class="text-center header-margin">Congratulations and BRAVO! You are a walking encyclopaedia!</h3>
        `);
    } else if (score > 3) {
        $("#results-display").html(`
        <img class="d-block mx-auto img-fluid" src="https://media.giphy.com/media/mgqefqwSbToPe/giphy.gif"
        alt="winner gif" />
        <h3 class="text-center header-margin">Well done! You are a smart cookie!</h3>
        `);
    } else {
        $("#results-display").html(`
        <img class="d-block mx-auto img-fluid" src="https://media.giphy.com/media/IoP0PvbbSWGAM/giphy.gif"
        alt="keep learning gif" />
        <h3 class="text-center header-margin">As Henry Ford once said, "Failure is only the opportunity to begin again more intelligently."</h3>
        `);
    }

    checkbox.click(function () {
        if (emailField.attr("disabled")) {
            // if the checkbox is clicked, the email field becomes enabled
            emailField.prop("disabled", false);
        } else {
            // if the checkbox is unchecked, the email field becomes disabled
            emailField.val("");
            emailField.prop("disabled", true);
        }
    });

    form.addEventListener('submit', handleSubmit);

    /**
     * this function prevents the default form submit. If the Subscribe checkbox is selected, the user must enter valid email and after submitting it, the auto-reply will be sent out to that address and the user will be redirected to the Home page. If the Subscribe checkbox stays unselected, the user can finish the quiz and will be redirected to the Home page.
     * @param {*} event 
     */
    function handleSubmit(event) {
        // to disable the default submit behavior
        event.preventDefault();

        if (checkbox.is(":checked")) {
            const enteredValue = document.getElementById("emailField").value;

            // source: implementation similar to https://www.javatpoint.com/javascript-form-validation JavaScript email validation
            const atPosition = enteredValue.indexOf("@");
            const dotPosition = enteredValue.lastIndexOf(".");

            // Email id must contain the @ and . character
            // There must be at least one character before and after the @.
            // And the last dot must at least be one character after the @.
            if (enteredValue == "") {
                errorMsg.innerHTML = "Please provide your email address.";
                setTimeout(function () {
                    errorMsg.innerHTML = "";
                }, 2000);
            } else if (atPosition < 1 || dotPosition - atPosition < 2) {
                errorMsg.innerHTML = "Please enter valid email address.";
                setTimeout(function () {
                    errorMsg.innerHTML = "";
                }, 2000);
            } else {
                // to avoid the asynchronous behaviour (emails may not be sent out), wait for sendMail(form) to complete and then perform the form submit and redirect to the Home page or log the failure  
                $.when(sendMail(form)).then(function () {
                    form.action = "index.html";
                    form.submit();
                }, function (error) {
                    alert(error.text);
                });
            }
        } else {
            form.action = "index.html";
            form.submit();
        }

    }

    /**
     * source: external API https://www.emailjs.com/docs/sdk/send/; this function will send out 2 emails: to the site owner to notify about the new subscribe request and the auto-reply to the email address entered in the form
     * @param {*} subscribeForm 
     */
    function sendMail(subscribeForm) {
        return emailjs.send("service_na1mfol", "template_mdnli8f", {
            "from_email": subscribeForm.emailField.value,
        });
    }

});