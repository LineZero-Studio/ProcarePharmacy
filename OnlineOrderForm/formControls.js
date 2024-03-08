let currentTab = 0;

let locationElements = [];
let locations = [];

const formPages = Array.from(document.querySelectorAll('form .page'));
const nextBtn = document.querySelectorAll('form .nextButton');
const prevBtn = document.querySelectorAll('form .prevButton');
const form = document.querySelector('form');

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
})

// Change the form page after clicking a navigation button
function changePage(btn) {
    let index = 0;
    const active = document.querySelector('form .page.active');
    index = formPages.indexOf(active);
    formPages[index].classList.remove('active');

    if(btn === 'next') {
        index++;
    } else if(btn === 'previous') {
        index--;
    }

    formPages[index].classList.add('active');
    
}

function clickNextButton() {
    // validateFormInput
    // nextTabScrollAnimation
    currentTab += 1;
}

function clickPreviousButton() {
    // previousTabScrollAnimation
    currentTab -= 1;
}

// get locations data from the CMS and populate the form
function retrieveLocationData() {
    locationElements = document.querySelectorAll("div[id^='LOCATIONID_");
    locationElements.forEach((element) => {
        var location = document.createElement("option");
        location.value = element.dataset.slug;
        location.text = element.dataset.locname;
        document.getElementById("selectionLocationDropdown").appendChild(location);
    });
}

function submitForm() {

}