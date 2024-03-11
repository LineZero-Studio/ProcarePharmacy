let currentTab = 0;

let locationElements = [];
let locations = [];

var formPages;
var nextBtn;
var prevBtn;
var form;

var addAnotherBtn;
var cancelInputBtn;


$( document ).ready(function() {
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
});



// Change the form page after clicking a navigation button
function changePage(btn) {
    let index = 0;
    const active = document.querySelector('form .page.active');
    index = formPages.indexOf(active);
    formPages[index].classList.remove('active');

    if(btn === 'next' && index + 1 < formPages.length) {
        index++;
    } else if(btn === 'previous' && index > 0) {
        index--;
    }

    formPages[index].classList.add('active');
    
}

// Add an input and input cancel button to a list of inputs
function addInputBox(currentPage) {
    //const inputList = event.target.parentElement.getElementsByClassName("formInputListWithAddButton")[0];
    const inputList = currentPage.getElementsByClassName("formInputListWithAddButton")[0];
    
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