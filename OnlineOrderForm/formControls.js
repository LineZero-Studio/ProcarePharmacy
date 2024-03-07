let currentTab = 0;

let locationElements = [];
let locations = [];

const selectionLocationDropdown = document.getElementById("selectionLocationDropdown");

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
        selectionLocationDropdown.appendChild(location);
    });
}

function submitForm() {

}