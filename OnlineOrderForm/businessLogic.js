/*---------------------------------------------------------------------------------------------------
* To add new business logic, follow the steps listed below.
*
*   1. Find the div marked with the "page" class and the id matching the name of the 
*   page question. Add the "affectsLogic" class to the end of the class list.
*   ex. "page compoundingMedicationPage" --> "page compoundingMedicationPage affectsLogic"
*
*   2. Look through the radio button groups and find the button with the value you want
*   to affect the logic. Copy + paste the contents of the value attribute (case-sensitive).
*   
*   3. Copy + paste the case statement below. Place it after the last case statement but before both 
*   of the "}" symbols. Replace "**caseStatement**" with the contents of the value attribute from before 
*   including the double quotes.
*
*   4. Replace "**pageIdentifier**" with the id of the page you want to remove from logic. Copy the 
*   "formPages.find" line for each page affected by the choice. If you want to:
*       - Include a page in logic: make sure the line ends with 'classList.remove("outOfLogic");' (no single quotes)
*       - Exclude a page from logic: make sure the line ends with 'classList.add("outOfLogic");' (no single quotes)
*
*   5. Repeat steps 2-4 until each radio button has its effects on the logic included.
*
----------------------------------------------------------------------------------------------------
        case **caseStatement**:
            formPages.find(page => page.id === **pageIdentifier**).classList.add("outOfLogic");
            break;
----------------------------------------------------------------------------------------------------*/
function changeVisiblePages(modifier) {
    switch(modifier) {
        case "My Prescription Is With Another Pharmacy":
            formPages.find(page => page.id === "prescriptionUploadPage").classList.add("outOfLogic");
            formPages.find(page => page.id === "rxNumbersPage").classList.add("outOfLogic");
            formPages.find(page => page.id === "currentPharmacyPage").classList.remove("outOfLogic");
            break;
        case "New Medication":
            formPages.find(page => page.id === "prescriptionUploadPage").classList.remove("outOfLogic");
            formPages.find(page => page.id === "rxNumbersPage").classList.add("outOfLogic");
            formPages.find(page => page.id === "currentPharmacyPage").classList.add("outOfLogic");
            break;
        case "Existing Medication Refill":
            formPages.find(page => page.id === "prescriptionUploadPage").classList.add("outOfLogic");
            formPages.find(page => page.id === "rxNumbersPage").classList.remove("outOfLogic");
            formPages.find(page => page.id === "currentPharmacyPage").classList.add("outOfLogic");
            break;
        case "Both New Medication And Existing Medication Refill":
            formPages.find(page => page.id === "prescriptionUploadPage").classList.remove("outOfLogic");
            formPages.find(page => page.id === "rxNumbersPage").classList.remove("outOfLogic");
            formPages.find(page => page.id === "currentPharmacyPage").classList.add("outOfLogic");
        case "New Patient":
            formPages.find(page => page.id === "allergiesPage").classList.remove("outOfLogic");
            formPages.find(page => page.id === "healthCardNumberPage").classList.remove("outOfLogic");
            formPages.find(page => page.id === "benefitsInsurancePage").classList.remove("outOfLogic");
            formPages.find(page => page.id === "homeAddressPage").classList.remove("outOfLogic");
            break;
        case "Existing Patient":
            formPages.find(page => page.id === "allergiesPage").classList.add("outOfLogic");
            formPages.find(page => page.id === "healthCardNumberPage").classList.add("outOfLogic");
            formPages.find(page => page.id === "benefitsInsurancePage").classList.add("outOfLogic");
            formPages.find(page => page.id === "homeAddressPage").classList.add("outOfLogic");
            break;
        case "Delivery":
            formPages.find(page => page.id === "shippingAddressPage").classList.remove("outOfLogic");
            break;
        case "Pickup":
            formPages.find(page => page.id === "shippingAddressPage").classList.add("outOfLogic");
            break;
    }
}