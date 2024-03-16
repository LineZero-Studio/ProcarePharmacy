let currentTab = 0;

let locationElements = [];
let locations = [];

var formPages;
var nextBtn;
var prevBtn;
var form;

var addAnotherBtn;
var cancelInputBtn;

let filesToAppend = [];


var observer = new MutationObserver(function (mutations) {
    if($("#formContainer").length) {
        initializeFormVariables();
        observer.disconnect();
    }
});

observer.observe(document.querySelector(".order-online"), {
    childList: true,
    subtree: true
});



function initializeFormVariables() {
    console.log("form loaded, initializing javascript...");

    formPages = Array.from(document.querySelectorAll('form .page'));
    nextBtn = document.querySelectorAll('form .nextButton');
    prevBtn = document.querySelectorAll('form .prevButton');
    form = document.querySelector('form');

    addAnotherBtn = document.querySelectorAll('form .formInputListAddBtn');
    cancelInputBtn = document.querySelectorAll('.formInputCancelButton');

    // Event handlers for the next and previous buttons
    nextBtn.forEach(button => {
        button.addEventListener('click', (e) => {
            changePage('next');
        })
    });
    prevBtn.forEach(button => {
        button.addEventListener('click', (e) => {
            changePage('previous');
        })
    });

    addAnotherBtn.forEach(button => {
        button.addEventListener('click', (e) => {
            addInputBox(e.target.closest(".page"));
        })
    });

    cancelInputBtn.forEach(button => {
        button.addEventListener('click', (e) => {
            e.target.parentElement.getElementsByClassName("formTextInputClearBtn")[0].value = "";
        })
    })

    // Handler for div around radio button
    Array.from($(".buttonLabelPair")).forEach(button => {
        button.addEventListener('click', (e) => {
            e.target.getElementsByTagName('input')[0].checked = true;
        })
    })

    form.addEventListener('formdata', (e) => {

        const formData = e.formData;

        let emptyRecords = [];
        for(const pair of formData.entries()) { 
            if(pair[1] === '') { emptyRecords.push(pair[0]); }
        }

        emptyRecords.forEach(key => {
            formData.delete(key);
        });

        if(filesToAppend.length > 0) {
            filesToAppend.forEach(file => formData.append('file' + filesToAppend.indexOf(file), file))
        }
    })
}



// Change the form page after clicking a navigation button
function changePage(btn) {

    // Get current index value and active page
    let index = 0;
    const active = document.querySelector('form .page.active');
    index = formPages.indexOf(active);

    if(active.classList.contains('required') && btn === 'next') {
        if(validatePage()) { return; }
    }

    // Check if the page affects logic
    if(active.classList.contains('affectsLogic')) {

        // Get radio buttons to see which one is checked
        let options = document.getElementsByName(active.getElementsByClassName("formRadioButtons")[0].id);

        // Send the checked value as the modifier for changeVisiblePages (businessLogic.js)
        for (i = 0; i < options.length; i++) {
            if (options[i].checked) {
                changeVisiblePages(options[i].value)
                break;
            }
        }
    }

    // Remove active class from current active page
    formPages[index].classList.remove('active');

    do {
        if(btn === 'next' && index + 1 < formPages.length) {
            index++;
        } else if(btn === 'previous' && index > 0) {
            index--;
        }
    } while (formPages[index].classList.contains("outOfLogic"))

    formPages[index].classList.add('active');
    
}

// Check if the user's page input is valid
function validatePage() {
    const activePage = $(".page.active");

    const selectErrorText = "Please select an option";
    const radioErrorText = "Please select an option";
    const fileErrorText = "Please input at least 1 item";
    const dateErrorText = "Please type a date";
    const textInputErrorText = "Please type a response";
    const multiTextInputErrorText = "Please input at least 1 item";
    const textInputAddErrorText = "Please input at least 1 item";

    // Figure out the type of control on the page
    if(activePage[0].classList.contains('select')) {
        // Check if select tag is empty
        if(activePage[0].getElementsByTagName('select')[0].value === '') {
            // Check if error text is already displayed
            if(activePage[0].classList.contains('error')) { return true; }

            createErrorText(activePage, selectErrorText);
            return true;
        }
        else { activePage[0].classList.remove('error'); disableErrorText(activePage); return false; }
    }
    else if(activePage[0].classList.contains('radio')) {
        let flag = false;

        // Check if no radio button is selected
        Array.from(activePage[0].querySelectorAll("input")).forEach(input => { 
            if(input.checked) {
                activePage[0].classList.remove('error');
                disableErrorText(activePage);
                flag = true;
                return;
            }
        })

        // If an input was checked, return false
        if(flag) { return false; }

        // Check if error text is already displayed
        if(activePage[0].classList.contains('error')) { return true; }

        createErrorText(activePage, radioErrorText);
        return true;
    }
    else if(activePage[0].classList.contains('file')) {
        // Check if a file is uploaded
        if((activePage.find(".formFileInputBoxUpload")[0].files.length === 0) && filesToAppend.length === 0) {
            // Check if error text is already displayed
            if(activePage[0].classList.contains('error')) { return true; }

            createErrorText(activePage, fileErrorText);
            return true;
        }
        else { activePage[0].classList.remove('error'); disableErrorText(activePage); return false; }
    }
    else if(activePage[0].classList.contains('date')) {
        // Check if a date is input
        if(activePage[0].getElementsByTagName('input')[0].value === '') {
            // Check if error text is already displayed
            if(activePage[0].classList.contains('error')) { return true; }

            createErrorText(activePage, dateErrorText);
            return true;
        }
        else { activePage[0].classList.remove('error'); disableErrorText(activePage); return false; }
    }
    else if(activePage[0].classList.contains('text')) {
        // Check if the input is populated with text
        if(activePage[0].getElementsByTagName('input')[0].value === '') {
            // Check if error text is already displayed
            if(activePage[0].classList.contains('error')) { return true; }

            createErrorText(activePage, textInputErrorText);
            return true;
        }
        else { activePage[0].classList.remove('error'); disableErrorText(activePage); return false; }
    }
    else if(activePage[0].classList.contains('text-multiple')) {
        // Check if the inputs are populated with text
        Array.from(activePage[0].getElementsByTagName('input')).forEach(input => {
            if(input.value === '') {
                // Check if error text is already displayed
                if(activePage[0].classList.contains('error')) { return true; }

                createErrorText(activePage, multiTextInputErrorText);
                return true;
            }
        })
        
        activePage[0].classList.remove('error');
        disableErrorText(activePage);
        return false; 
    }
    else if(activePage[0].classList.contains('text-add')) {
        // Check if the first input is populated with text
        if(activePage[0].getElementsByTagName('input')[0].value === '') {
            // Check if error text is already displayed
            if(activePage[0].classList.contains('error')) { return true; }

            createErrorText(activePage, textInputAddErrorText);
            return true;
        }
        else { activePage[0].classList.remove('error'); disableErrorText(activePage); return false; }
    }

    return false;
}

function createErrorText(page, message) {
    errorMessage = page.find(".errorMessageText");

    errorMessage.css("visibility", "visible");
    errorMessage.html(message);
}

function disableErrorText(page) {
    errorMessage = page.find(".errorMessageText");

    errorMessage.css("visibility", "hidden");
}

// Add an input and input cancel button to a list of inputs
function addInputBox(currentPage) {

    const inputList = currentPage.getElementsByClassName("formInputListWithAddButton")[0];
    
    if(inputList.getElementsByClassName("formInputCancelButtonPair").length >= 5)
        return;

    // Create empty elements for formInputCancelButtonPair, formTextInput, and formInputCancelButton
    const newInputCancelBtnPair = document.createElement("div");
    const newInput = document.createElement("input");
    const newInputCancelBtn = document.createElement("img");

    // Get the number of inputs in the list
    const inputCount = Array.from(inputList.getElementsByClassName("formTextInput")).length;

    // Create container for input and button
    newInputCancelBtnPair.classList.add("formInputCancelButtonPair");

    // Create new input to add to the list
    newInput.id = inputList.id + "Entry" + (inputCount + 1);
    newInput.name = inputList.id + "Entry" + (inputCount + 1);
    newInput.classList.add("formTextInput");
    newInput.classList.add("formTextInputClearBtn");
    newInput.type = "text";
    newInput.placeholder = "Enter RX number here";

    // Create accompanying input cancel button
    newInputCancelBtn.src = "input-cancel.svg";
    newInputCancelBtn.classList.add("formInputCancelButton");
    newInputCancelBtn.id = inputList.id + "CancelBtn" + (inputCount + 1);

    // Add button event listener
    newInputCancelBtn.addEventListener('click', (e) => { 
        e.target.parentElement.remove();
    });


    // Add the elements to the list
    inputList.appendChild(newInputCancelBtnPair);
    newInputCancelBtnPair.appendChild(newInput);
    newInputCancelBtnPair.appendChild(newInputCancelBtn);
}

// Handle file drop event
function dropHandler(ev) {
    ev.preventDefault();

    let dt = ev.dataTransfer;
    filesToAppend = Array.from(dt.files);
}

function dragOverHandler(ev) {
    ev.preventDefault();
}

// Get locations data from the CMS and populate the form
function retrieveLocationData() {
    locationElements = document.querySelectorAll("div[id^='LOCATIONID_");
    locationElements.forEach((element) => {
        var location = document.createElement("option");
        location.value = element.dataset.slug;
        location.text = element.dataset.locname;
        document.getElementById("selectionLocationDropdown").appendChild(location);
    });
}