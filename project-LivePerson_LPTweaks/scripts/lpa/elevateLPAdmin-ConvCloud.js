console.log('LP Essentials is starting up...');

// Global Variables
var givenReason, accountId;
var reasonAvailable = 0;

// ##### Main Function #####
var url = document.location.href;
if(url.indexOf("autoSignIn=true") !== -1) {
    submitUserAndPass();
} else {
    setupLPButton();
}

// ##### Sub Functions #####
function setupLPButton() {
    // Create the input button
    const elpaButton = document.createElement('input');
    elpaButton.type = 'button';
    elpaButton.classList.add('login-button', 'primary');
    elpaButton.id = "elpaButtonId";
    elpaButton.value = 'eLPA';
    elpaButton.name = 'loginButton';
    
    // Append the elpaButton to the document body
    document.querySelector('.remember-me-container').style = "margin-right: 15px;";
    document.querySelector('.button-wrapper').append(elpaButton);

    // Add Event Listener
    document.getElementById('elpaButtonId').addEventListener('click', function() {
        accountId = document.getElementById("siteNumber").value;
        if (accountId == "") { return; } else { reasonAvailable += 1; }
        if (reasonAvailable == 1) { setupReasonInput(); }
        if (reasonAvailable > 1) { elevateLpa(); }
    });
}

function setupReasonInput() {
    // Create the main container element
    const fieldWrapper = document.createElement('div');
    fieldWrapper.classList.add('field-wrapper');

    // Create the user label element
    const reasonLabel = document.createElement('div');
    reasonLabel.id = 'reasonLabel';
    const label = document.createElement('label');
    label.classList.add('label');
    label.setAttribute('for', 'lpaReason');
    label.textContent = 'LPA Elevation Reason';
    reasonLabel.appendChild(label);

    // Create the user ID field container element
    const reasonFieldContainer = document.createElement('div');
    reasonFieldContainer.id = 'reasonFieldContainer';
    reasonFieldContainer.classList.add('field');
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.classList.add('input-field');
    inputField.style = "color: white;"
    inputField.value = '';
    inputField.size = '25';
    inputField.tabIndex = '0';
    inputField.value = "Enabling Admin Settings"
    inputField.name = 'lpaReason';
    inputField.id = 'lpaReason';
    reasonFieldContainer.appendChild(inputField);

    // Append the label and field container to the main container
    fieldWrapper.appendChild(reasonLabel);
    fieldWrapper.appendChild(reasonFieldContainer);

    // Find the last element with the class "field-wrapper"
    const fieldWrappers = document.getElementsByClassName('field-wrapper');
    const lastFieldWrapper = fieldWrappers[fieldWrappers.length - 1];

    // Append the new element after the last "field-wrapper" element
    lastFieldWrapper.parentNode.insertBefore(fieldWrapper, lastFieldWrapper.nextSibling);
    
    // Adjust Formatting & make it pretty
    document.querySelector(".button-wrapper").style = "margin-top: 20px;"

    reasonAvailable = true;

}

async function elevateLpa() {
    accountId = document.getElementById("siteNumber").value;
    accountId = (accountId == "") ? false : accountId;
    givenReason = document.getElementById("lpaReason").value;
    givenReason = (givenReason == "") ? "Enabling Admin Settings" : givenReason;
    userName = document.getElementById("userName").value;
    sitePass = document.getElementById("sitePass").value;
    console.log(`Account ID: ${accountId} & Reason: ${givenReason}`);
    var domain = await getDomain(accountId);
    fast_elevateLPA(accountId, givenReason, domain);
}

async function getDomain(accountId) {
    var domain = await fetch(`https://api.liveperson.net/api/account/${accountId}/service/adminArea/baseURI.json?version=1.0`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
    })
    .then(function(response) {
        if (response.ok) {
        return response.json();
        }
        throw new Error('getDomain() Network response was not OK.');
    })
    .then(function(data) {
        console.log(`getDomain() Response: ${data}`);
        return data.baseURI;
    })
    .catch(function(error) {
        // Handle any errors
        console.log(`getDomain() Error: ${error}`);
    });
    return domain;
}

function fast_elevateLPA(accountId, givenReason, domain) {
    childWindow = window.open(`https://${domain}/hc/web/public/pub/siteadminlogin.jsp?goto=siteadmin/LPAdminAccess.jsp&site=${accountId}&action=extElevate&reason=${givenReason}`, 'elevateLpaWindow', `popup=true,width=400,height=300`).focus();
    window.addEventListener('message', function(event) {
        if (event.data === 'accessGranted') {
            console.log('LPA Elevated. Continue...');
            signIn();
        } else if (event.data === 'accessDenied') {
            console.log('LPA NOT Elevated. Stop...');
            failedElevation();
        }
        
    });
}

function failedElevation() {
    var elpaButtonId = document.getElementById("elpaButtonId");
    elpaButtonId.style.cssText = "background-color: #FF0000 !important;";
    elpaButtonId.value = "XXXX";

    setTimeout(() => {
        elpaButtonId.style.cssText = '';
        elpaButtonId.value = "eLPA";
    }, 1500);
}

function signIn() {
    const button = document.querySelector('input[type="button"].login-button.primary[value="Sign in"][name="loginButton"]');
    var keydownEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        bubbles: true,
        cancelable: true,
        view: window
    });
    button.dispatchEvent(keydownEvent);
}

async function getFromStorage(value) {
    return new Promise((resolve) => {
        chrome.storage.local.get([value], function(result) {
            var res = (result[value]) ? result[value] : false;
            console.log(`Accessing Storage...`);
            resolve(res);
        });
    });
}

async function submitUserAndPass() {
    // Retrieve & Configure Values
    var userStored = await getFromStorage("username");
    var passStored = await getFromStorage("password");

    // Find & Run
    var name = document.getElementById('userName');
    var pass = document.getElementById('sitePass');

    // Set values
    name.value = userStored;
    pass.value = passStored;
    signIn();
}