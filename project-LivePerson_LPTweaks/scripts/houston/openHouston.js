console.log("Houston: Working...");

// ##### Main Function #####
try {
    var url = document.location.href;
    
    // URL-specific actions
    if((url.indexOf("https://authentication.liveperson.net/login.html?lpservice=leBackofficeInt&servicepath=a%2F~~accountid~~%2F%23%2C~~ssokey~~") !== -1) && url.match(/acc=([^&]*)/)) {
        var acc = url.match(/acc=([^&]*)/)[1];
        submitAccUserPass(acc);
    } else if(url.indexOf("houston.int.liveperson.net") !== -1 && url.match(/\/(\d+)\//)) {
        var accSearch = url.match(/\/(\d+)\//)[1];
        addLoginButton("Open Conv. Cloud", "normalLPA", accSearch);
        processLpaStatus(accSearch);
    }
}
catch(e){
    console.log(e);
    console.log('Chrome Ext. - Invalid Page, no processes req.');
}

// ##### Supporting Functions #####

// -- Auto-login --

async function submitAccUserPass(accId) {
    // Retrieve & Configure PII Values
    var userStored = await getFromStorage("username");
    var passStored = await getFromStorage("password");
    var accStored = accId;

    // Find & Run
    var name = document.getElementById('userName');
    var pass = document.getElementById('sitePass');
    var acc = document.getElementById("siteNumber");

    // Set values
    name.value = userStored;
    pass.value = passStored;
    acc.value = accStored;

    signIn();
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

// -- Login Button --

function addLoginButton(text, id, acc) {
    // Create the button element
    var button = document.createElement("button");
    button.setAttribute("type", "button");
    button.className = "primary--text btn btn--flat";
    button.id = id;

    // Create the inner div element
    var div = document.createElement("div");
    div.className = "btn__content";
    div.innerHTML = text;

    // Add spacing/styling
    button.style.marginLeft = "10px";
    button.style.marginRight = "10px";

    // Append the inner div element to the button
    button.appendChild(div);

    // Append inside
    var pageTitle = document.getElementById("pageTitle");
    var lastChild = pageTitle.lastElementChild;
    lastChild.insertAdjacentElement("afterend", button);

    //Add Event Listener
    addButtonListener(id, acc);
}

function addButtonListener(id, selectedAccount) {
    var button = document.getElementById(id);
    button.addEventListener('click', function() {
        window.open(`https://authentication.liveperson.net/legacyLogin.html?source=accSelLgcy&stId=${selectedAccount}&autoSignIn=true`, '_blank', 'noopener');
    });
}

// -- LPA Status --

function processLpaStatus(account) {
    console.log("Getting LPA Status...");
    var lastElevationTime = false;
    
    // Get Account & Find Last Elevation Time
    getFromStorage("knownAccounts").then(async (result) => {
        var accountEntry = result.filter(function(obj) { // Filter array of objects
            return obj.accountId === account;
        });
        
        if(accountEntry.length !==0 && accountEntry[0].hasOwnProperty("lastLpaElevation")) { // Get last Elevation Time if available
            lastElevationTime = accountEntry[0].lastLpaElevation;
        }

        var intervalId = setInterval(function() {
            // Call the function and check its return value
            if (!evaluateLpaStatus(lastElevationTime)) {
                console.log("LPA Status not Elevated - Cancelling timer");
                clearInterval(intervalId); // Stop the interval if the function returns false
            }
          }, 5000);
        
    });
}

function evaluateLpaStatus(lastElevationTime) {
    var status, style;
    var currentTime = new Date().getTime();
    var lpaExpireTime = (lastElevationTime + 3600000); // LPA Expiry time (+1hr from last Elevation)

    var timeDiffInMins = Math.floor((lpaExpireTime-currentTime)/60000); // Time to LPA Elevation Expiry -> Rounded down in Mins

    if(lastElevationTime) { // Last Elevation Time Available
        if (timeDiffInMins >= 0) { // LPA Elevated
            status = `Elevated (${timeDiffInMins}m)`;
            style = "background-color: rgb(80, 168, 9);"
            createLPAStatusPill(status, style);
            return true;

        } else { // LPA Normal
            status = "Normal";
            style = "background-color: rgb(255,105,1);"
            createLPAStatusPill(status, style);
            return false;

        }
    } else { // Last Elevation Time NOT Available
        status = "Not yet Recorded";
        style = "background-color: rgb(255,105,1);"
        createLPAStatusPill(status, style);
        return false;

    }

}

function createLPAStatusPill(status, style) {

    // Check if an element with ID "lpaStatus" exists
    var lpaStatusExists = document.querySelector("#lpaStatus") !== null;

    if (lpaStatusExists) { // Exists
        // Remove Element
        var element = document.getElementById("lpaStatus");
        var parentElement = element.parentNode;
        parentElement.removeChild(element);

        // Re-create the span element
        var span = document.createElement("span");
        span.className = "label label-pill label-default";
        span.id = "lpaStatus";
        span.textContent = `LPA Status: ${status}`;
        span.style = style;

        // Get the parent element where you want to append the span
        var pageTitle = document.getElementById("pageTitle");
        var lastChild = pageTitle.lastElementChild;
        lastChild.insertAdjacentElement("afterend", span);

    } else { // Does not exist

        // Create the span element
        var span = document.createElement("span");
        span.className = "label label-pill label-default";
        span.id = "lpaStatus";
        span.textContent = `LPA Status: ${status}`;
        span.style = style;

        // Get the parent element where you want to append the span
        var pageTitle = document.getElementById("pageTitle");
        var lastChild = pageTitle.lastElementChild;
        lastChild.insertAdjacentElement("afterend", span);

    }

}