console.log('main: LP Essentials is starting up...');

// Global Variables
var givenReason, accountId, currentLoggedInAccount, u, p;

// ##### Extension Listeners & Functions #####
document.addEventListener('DOMContentLoaded', function() {
    try {
        autoFillValues(); // Auto-fill values
        populateAccountDropDownMenu(); // Populate Known Accounts
    }
    catch(err) {
        console.log(`Error Occurred with creation functions: ${JSON.stringify(err)}`);
    }

    // Drop Down Menu    
    document.getElementById("moreOptions").addEventListener('click', function() {
        var moreOptionsContainer = document.getElementById("moreOptionsContent");
        moreOptionsContainer.classList.toggle('hidden');
    });

    // Drop Down Menu Options
    document.getElementById('developerLink').addEventListener('click', function() {
        chrome.tabs.create({ url: 'https://developers.liveperson.com' });
        var moreOptionsContainer = document.getElementById("moreOptionsContent");
        moreOptionsContainer.classList.add('hidden');
    });

    document.getElementById('knowledgeLink').addEventListener('click', function() {
        chrome.tabs.create({ url: 'https://knowledge.liveperson.com' });
        var moreOptionsContainer = document.getElementById("moreOptionsContent");
        moreOptionsContainer.classList.add('hidden');
    });

    document.getElementById('jiraLink').addEventListener('click', function() {
        chrome.tabs.create({ url: 'https://l-p.atlassian.net/jira/your-work' });
        var moreOptionsContainer = document.getElementById("moreOptionsContent");
        moreOptionsContainer.classList.add('hidden');
    });

    document.getElementById('confluenceLink').addEventListener('click', function() {
        chrome.tabs.create({ url: 'https://l-p.atlassian.net/wiki/home' });
        var moreOptionsContainer = document.getElementById("moreOptionsContent");
        moreOptionsContainer.classList.add('hidden');
    });

    document.getElementById('salesforceLink').addEventListener('click', function() {
        chrome.tabs.create({ url: 'https://liveperson.lightning.force.com/lightning/page/home' });
        var moreOptionsContainer = document.getElementById("moreOptionsContent");
        moreOptionsContainer.classList.add('hidden');
    });

    document.getElementById('chatgptLink').addEventListener('click', function() {
        chrome.tabs.create({ url: 'https://chat.openai.com/' });
        var moreOptionsContainer = document.getElementById("moreOptionsContent");
        moreOptionsContainer.classList.add('hidden');
    });

    document.getElementById('feedbackLink').addEventListener('click', function() {
        chrome.tabs.create({ url: 'https://forms.gle/VrpyZJZDQVg7Kt7j8' });
        var moreOptionsContainer = document.getElementById("moreOptionsContent");
        moreOptionsContainer.classList.add('hidden');
    });

    // User Credential Actions
    document.getElementById('userName').addEventListener('input', function() {
        userPassOnEdit();
    });

    document.getElementById('passWord').addEventListener('input', function() {
        userPassOnEdit();
    });

    document.getElementById('saveCredentials').addEventListener('click', function() {
        toggleButtonsDisabled(true);
        saveUserPass();
    });

    // Hide/Unhide Elevate LPA Action
    var action_elevateLpa = document.getElementById('action_elevateLpa');
    action_elevateLpa.addEventListener('click', function() {
        var elevateLPAContainer = document.getElementById('elevateLPAContainer');
        elevateLPAContainer.classList.toggle('hidden');
    });

    // Do Elevate LPA Action
    var elevateLpaButton = document.getElementById('elevateLpa');
    elevateLpaButton.addEventListener('click', function() {
        elevateLpaButton.textContent = "Running...";
        elevateLpaButton.style.backgroundColor = "#FF6901";
        elevateLpa();
    });

    // Do Supportal Action
    var action_openSupportal = document.getElementById('action_openSupportal');
    action_openSupportal.addEventListener('click', function() {
        openSupportalForAccount();
    });

    // Do Conversational Cloud Action
    var action_openCC = document.getElementById('action_openCC');
    action_openCC.addEventListener('click', function() {
        openCCForAccount();
    });

    // Do Houston Action
    var action_openHouston = document.getElementById('action_openHouston');
    action_openHouston.addEventListener('click', function() {
        openHoustonForAccount();
    });

    // Do Kibana Action
    var action_openKibana = document.getElementById('action_openKibana');
    action_openKibana.addEventListener('click', function() {
        openKibana();
    });

    // Do LP Sandbox Action
    var action_openSandbox = document.getElementById('action_openSandbox');
    action_openSandbox.addEventListener('click', function() {
        openSandbox();
    });

    // Account Dropdown Menu
    var accountDropdown = document.getElementById('accountDropdown');
    accountDropdown.addEventListener('change', function() {
        handleDropDownMenuSelection();
    });

    // Add Account - Go back
    var accountGoBack = document.getElementById('goBack');
    accountGoBack.addEventListener('click', function() {
        var dropdown = document.getElementById("accountDropdown");
        dropdown.value = 123456789;
        handleDropDownMenuSelection();
    });

    // Add Account - Submit
    var accountSubmit = document.getElementById('addAccountButton');
    accountSubmit.addEventListener('click', function() {
        accountSubmit.textContent = "Running...";
        accountSubmit.style.backgroundColor = "#FF6901";
        addAccountInStore();
    });

    // Edit Account - Submit
    var action_editEntry = document.getElementById('action_editEntry');
    action_editEntry.addEventListener('click', function() {
        editAccountInStore();
    });

    // Remove Account - Submit
    var action_removeEntry = document.getElementById('action_removeEntry');
    action_removeEntry.addEventListener('click', function() {
        removeAccountInStore();
    });

});

// ##### Extension Value Storage #####

async function autoFillValues() { // Get User, Pass & Personal Acc. from Storage
    await chrome.storage.local.get(['username', 'password', 'personalAcc'], function(result) {
        var usernameField = document.getElementById('userName');
        var passwordField = document.getElementById('passWord');
        var persAccountId = document.getElementById('persAccountId');
        var accountSelectionContainer = document.getElementById("accountSelectionContainer");
      
        // Auto-fill the credential fields with the saved values
        if (usernameField && result.username && result.username.length !== 0) {
          usernameField.value = result.username;
          u = result.username;
        }
        if (passwordField && result.password && result.password.length !== 0) {
          passwordField.value = result.password;
          p = result.password;
        }

        // If either user or password is not stored
        if(result.username == undefined || result.username.length == 0 || result.password == undefined || result.password.length == 0) {
            accountSelectionContainer.classList.add("invalid");
        } else {
            accountSelectionContainer.classList.remove("invalid");
        }

        // Auto-fill Personal ID field if available
        if(result.personalAcc && result.personalAcc.length !== 0) {
            persAccountId.value = result.personalAcc;
        }

        return true;
    });
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

async function setInStorage(name, value) {
    return new Promise((resolve) => {
        let tempObj = {};
        tempObj[name] = value
        chrome.storage.local.set(tempObj, function() {
            console.log('Saved successfully');
            resolve(true);
        });
    });
}

async function checkUserPass() { // Update if new User or Pass
    var usernameField = document.getElementById('userName').value;
    var passwordField = document.getElementById('passWord').value;
    var personalAccountId = document.getElementById('persAccountId').value;
    var saveCredentialsButton = document.getElementById('saveCredentials');
    var login = await postLogin(usernameField, passwordField, personalAccountId);

    if (!login) { // Invalid Login

        // Present to User
        console.log('Credentials invalid - API Failure');
        saveCredentialsButton.style.backgroundColor = "#FF0000";
        saveCredentialsButton.textContent = "Login Failed";
        setTimeout(() => {
            saveCredentialsButton.style.backgroundColor = "";
            saveCredentialsButton.textContent = "Save";
        }, 1000);

    } else { // Valid Login

        // Present to User
        saveCredentialsButton.style.backgroundColor = "#50a809"; // Green
        saveCredentialsButton.style.color = "#FFFFFF"
        saveCredentialsButton.textContent = "Saved!";
        setTimeout(() => {
            saveCredentialsButton.classList.add('hidden');
            document.getElementById('persAccountId').classList.add('hidden');
            saveCredentialsButton.style.backgroundColor = "";
            saveCredentialsButton.style.color = ""
            saveCredentialsButton.textContent = "Save";
        }, 1000);

        // Save to Storage
        chrome.storage.local.get(['username', 'password'], function(result) {
            if ((result.username !== usernameField) || (result.password !== passwordField)) {
                console.log(`New User/Pass Found - Saving...`);
                setUserPass(usernameField, passwordField);
                autoFillValues();
            }
        });

        // Add personal account to listings
        document.getElementById("accountNumber").value = personalAccountId;
        document.getElementById("brandName").value = "Personal";
        document.getElementById("accountList").value = "dev";
        addAccountInStore();

        // Save Personal Acc. ID to storage
        setInStorage("personalAcc", personalAccountId);

    }
}

async function userPassOnEdit() {
    var usernameField = document.getElementById('userName').value;
    var passwordField = document.getElementById('passWord').value;

    if(u == usernameField && p == passwordField) {
        document.getElementById("saveCredentials").classList.add('hidden');
        document.getElementById("persAccountId").classList.add('hidden');
    } else {
        document.getElementById("saveCredentials").classList.remove('hidden');
        document.getElementById("persAccountId").classList.remove('hidden');
    }

}

function saveUserPass() {
    var usernameField = document.getElementById('userName').value;
    var passwordField = document.getElementById('passWord').value;
    var personalAccountId = document.getElementById('persAccountId').value;
    var saveCredentials = document.getElementById("saveCredentials");

    if(usernameField.length == 0) {
        console.log('Username invalid');
        saveCredentials.style.backgroundColor = "#FF0000";
        saveCredentials.textContent = "Invalid Username";
        setTimeout(() => {
            saveCredentials.style.backgroundColor = "";
            saveCredentials.textContent = "Save";
        }, 1000);
    } else if(passwordField == 0) {
        console.log('Password invalid');
        saveCredentials.style.backgroundColor = "#FF0000";
        saveCredentials.textContent = "Invalid Password";
        setTimeout(() => {
            saveCredentials.style.backgroundColor = "";
            saveCredentials.textContent = "Save";
        }, 1000);
    } else if(personalAccountId == 0) {
        console.log('Acc. ID invalid');
        saveCredentials.style.backgroundColor = "#FF0000";
        saveCredentials.textContent = "Invalid Acc. ID";
        setTimeout(() => {
            saveCredentials.style.backgroundColor = "";
            saveCredentials.textContent = "Save";
        }, 1000);
    } else {
        saveCredentials.style.backgroundColor = "#FF6901";
        saveCredentials.textContent = "Checking...";
        if(usernameField.indexOf("LPA-") == -1) { document.getElementById('userName').value = "LPA-" + usernameField; }
        checkUserPass();
    }
}

async function setUserPass(userName, passWord) { // Set User and Pass in Storage
    if(userName.indexOf("LPA-") == -1) { userName = "LPA-" + userName; }
    await chrome.storage.local.set({ username: userName, password: passWord}, function() {
        console.log('Username & Password saved successfully');
        return true;
    });
}

// ##### Known Accounts / Dropdown List #####
async function populateAccountDropDownMenu() {

    var dropdown = document.getElementById("accountDropdown");

    await getFromStorage("knownAccounts").then((result) => {
        
        try {
            // Sort array of objects alphabetically
            result.sort(function(a, b) {
                return a.name.localeCompare(b.name);
            });

            // Convert array of objects into a string array
            var data = result.map(function(accountEntry) {
                return {
                    text: `${accountEntry.name} (${accountEntry.access}) - ${accountEntry.accountId}`,
                    value: accountEntry.accountId
                };
            });
        }
        catch(err) {
            console.log(`No Stored accounts found.`);
            var data = [];
        }
        

        // Add additional elements
        data.unshift({
            text: '* Select an Account',
            value: 123456789
        });
        data.push({
            text: '* Add New +',
            value: 987654321
        });

        // Clear existing options
        dropdown.innerHTML = '';

        // Create and append new options
        data.forEach(function(option) {
            var newOption = document.createElement('option');
            newOption.value = option.value;
            newOption.text = option.text;
            newOption.classList.add = "accountOption";
            dropdown.appendChild(newOption);
        });

        // Auto-populate with current account or partial fill add account if unavailable
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var url = tabs[0].url;
            console.log(`Current Tab URL: ${url}`);
            var regex = /\/(\d+)\/#/;
            var match = url.match(regex);

            if (match && match[1]) {
                var accId = match[1];
                console.log(`Conv. Cloud Acc ID: ${accId}`);
                currentLoggedInAccount = accId;
                let accPresent = false;
                for (var i = 0; i < dropdown.options.length; i++) {
                    var optionValue = dropdown.options[i].value;
                    if (optionValue === accId) {
                        accPresent = true;
                        break;
                    }
                }

                if(accPresent) {
                    dropdown.value = accId;
                } else {
                    dropdown.value = 987654321; // Add new account
                    document.getElementById("accountNumber").value = accId; // Auto-fill with current Acc. ID
                }

                document.getElementById('accountEditContainer').classList.add('hidden'); // If not already hidden
                handleDropDownMenuSelection();

            }
        });

    });

}

async function handleDropDownMenuSelection() {
    var dropdown = document.getElementById("accountDropdown");
    var selectedOption = dropdown.value;

    if (selectedOption == 987654321) { // Add New
        var actionsMenu = document.getElementById('actionsMenu');
        var accountSelectionContainer = document.getElementById('accountSelectionContainer');
        var accountEditContainer = document.getElementById('accountEditContainer');

        actionsMenu.classList.add('hidden');
        accountSelectionContainer.classList.add('hidden');
        accountEditContainer.classList.remove('hidden');

    } else if(selectedOption == 123456789) { // Select an Account
        var actionsMenu = document.getElementById('actionsMenu');
        var accountSelectionContainer = document.getElementById('accountSelectionContainer');
        var accountEditContainer = document.getElementById('accountEditContainer');

        actionsMenu.classList.add('hidden');
        accountSelectionContainer.classList.remove('hidden');
        accountEditContainer.classList.add('hidden');

    } else if (selectedOption == "") { // Catch Error
        console.log(`Unable to handle selection option`);
    } else { // All other options
        console.log(`Selected Account: ${selectedOption}`);

        // Update LPA Status Note
        processLpaStatus(selectedOption);

        // Show Actions Menu
        var actionsMenu = document.getElementById('actionsMenu');
        actionsMenu.classList.remove('hidden');

        // Check account has domain stored. If not, updated storage with adminArea domain baseURI
        await getFromStorage("knownAccounts").then(async (result) => {
            var accountEntry = result.filter(function(obj) { // Filter array of objects
                return obj.accountId === selectedOption;
            });

            var adminAreaDomain;
            if(!accountEntry.hasOwnProperty("adminArea") || accountEntry.adminArea == "") {
                adminAreaDomain = await getDomain(selectedOption, "adminArea");
                var updatedAccountEntries = result.filter(function(obj) { // Filter array of objects
                    if(obj.accountId === selectedOption) {
                        obj.adminArea = adminAreaDomain.baseURI;
                        return obj;
                    } else {
                        return obj;
                    }
                });
                await setInStorage("knownAccounts", updatedAccountEntries); // Update storage with domain
            }
        });
    }
}

async function editAccountInStore() {
    await getFromStorage("knownAccounts").then(async(store) => {

        var accountDropDownValue = document.getElementById("accountDropdown").value;

        // Filter array of objects by the "name" key
        var accountEntry = store.filter(function(obj) {
            return obj.accountId == accountDropDownValue;
        });

        var accountEditContainer = document.getElementById('accountEditContainer');
        var actionsMenu = document.getElementById('actionsMenu');

        actionsMenu.classList.add('hidden');
        accountEditContainer.classList.remove('hidden');

        document.getElementById("accountNumber").value = accountEntry[0].accountId;
        document.getElementById("brandName").value = accountEntry[0].name;
        document.getElementById("accountList").value = accountEntry[0].access;
    });
}

async function addAccountInStore() {
    getFromStorage("knownAccounts").then(async(store) => {
        var accountId = document.getElementById("accountNumber").value;
        var brandName = document.getElementById("brandName").value;
        var accountType = document.getElementById("accountList").value;
        var domainURI = "";
        var validAccount = false;
        var validBrandName = false;
        var validAccountType = false;

        // Check to ensure values formatting is correct
        if(accountId == "") {
            var addAccountButton = document.getElementById("addAccountButton");
            addAccountButton.style.backgroundColor = "#FF0000";
            addAccountButton.textContent = "Invalid Acc. ID";

            setTimeout(() => {
                addAccountButton.style.backgroundColor = "";
                addAccountButton.textContent = "Submit";
            }, 1000);
            return false;
        } else {
            console.log("Account ID Format Valid.");
        }

        // Check & Format Brand Name - 'word' to 'Word'
        if(brandName == "") {
            var addAccountButton = document.getElementById("addAccountButton");
            addAccountButton.style.backgroundColor = "#FF0000";
            addAccountButton.textContent = "Invalid Brand Name";

            setTimeout(() => {
                addAccountButton.style.backgroundColor = "";
                addAccountButton.textContent = "Submit";
            }, 1000);
            return false;
        } else {
            console.log("Brand Name Format Valid.");
            validBrandName = true;
        }

        // Check Acc. Type
        if(accountType === 'none') { // Acc. Type issue
            var addAccountButton = document.getElementById("addAccountButton");
            addAccountButton.style.backgroundColor = "#FF0000";
            addAccountButton.textContent = "Invalid Acc. Type";

            setTimeout(() => {
                addAccountButton.style.backgroundColor = "";
                addAccountButton.textContent = "Submit";
            }, 1000);
            return false;
        } else {
            console.log("Account Type Format Valid.");
            validAccountType = true;
        }

        // Validate Account Entry
        try {
            var accountEntry = store.filter(function(obj) { 
                return obj.accountId === accountId;
            });
            if(accountEntry.length > 1) {
                console.info(`Storage Error - Multiple of same Acc. IDs exist: ${accountEntry[0].accountId}`);
                return false;
            } // Else, Continue...
        }
        catch(err) {
            console.log(`No accounts present.`); // Continue...
        }

        // API Checks
        await getDomain(accountId, "adminArea").then(async(result) => {
            console.log(JSON.stringify(result));

            // Check Acc. ID
            if(result.baseURI == "Not Found") { // Account ID Issue
                console.info(`Account Not Found`);
                var addAccountButton = document.getElementById("addAccountButton");
                addAccountButton.style.backgroundColor = "#FF0000";
                addAccountButton.textContent = "Invalid Acc. ID";

                setTimeout(() => {
                    addAccountButton.style.backgroundColor = "";
                    addAccountButton.textContent = "Submit";
                }, 1000);

                return false;
            } if(result.baseURI == "API Error") { // Account ID Issue
                console.info(`Domain API Error`);
                var addAccountButton = document.getElementById("addAccountButton");
                addAccountButton.style.backgroundColor = "#FF0000";
                addAccountButton.textContent = "API Error";

                setTimeout(() => {
                    addAccountButton.style.backgroundColor = "";
                    addAccountButton.textContent = "Submit";
                }, 1000);
                
                return false;
            } else {
                domainURI = result.baseURI;
                console.log("Account ID Valid. Checking if user can login...");

                if(currentLoggedInAccount) {
                    console.log("User already logged in, skipping Login Check.");
                    validAccount = true;
                } else {
                    var user = document.getElementById("userName").value;
                    var pass = document.getElementById("passWord").value;
                    var userAbleToLogin = await postLogin(user, pass, accountId);
                    if(!userAbleToLogin) {
                        console.info(`Domain API Error`);

                        var addAccountButton = document.getElementById("addAccountButton");
                        addAccountButton.style.backgroundColor = "#FF0000";
                        addAccountButton.textContent = "Unable to Login";

                        setTimeout(() => {
                            addAccountButton.style.backgroundColor = "";
                            addAccountButton.textContent = "Submit";
                        }, 1000);

                        validAccount = false;
                    } else {
                        validAccount = true;
                    }
                    console.info("userAbleToLogin: " + JSON.stringify(userAbleToLogin));
                }
                
            }

            if(validAccount && validAccountType && validBrandName) {
                return true;
            } else {
                return false;
            }
            
        })
        .then((outcome) => {
            if(!outcome) {return false;}
            // No issues, continue...

            try {
                // Filter array of objects
                var accountEntry = store.filter(function(obj) { 
                    return obj.accountId !== accountId;
                });
            }
            catch(err) {
                console.log(`No accounts present.`);
                var accountEntry = [];
            }

            accountEntry.push({
                "name": brandName,
                "access": accountType,
                "accountId": accountId,
                "adminArea": domainURI
            });

            return accountEntry;
        })
        .then(async(accounts) => {
            if(!accounts) {return false;}
            await setInStorage("knownAccounts", accounts).then(() => {
                console.log("Added to List.");

                // Remove all current options
                var elementsToRemove = document.querySelectorAll('.accountOption');
                elementsToRemove.forEach(function(element) {
                    element.remove();
                });

                // Repopulate Options
                populateAccountDropDownMenu();
                var addAccountButton = document.getElementById("addAccountButton");
                addAccountButton.style.backgroundColor = "#50a809"; // Green
                addAccountButton.textContent = "Added!";
                setTimeout(() => {

                    // UI Response to User
                    addAccountButton.style.backgroundColor = "";
                    addAccountButton.textContent = "Submit";
                    document.getElementById("accountDropdown").value = accountId;
                    document.getElementById('accountEditContainer').classList.add('hidden');
                    document.getElementById('accountSelectionContainer').classList.remove('hidden');

                    // Reset values
                    document.getElementById("accountList").value = "none";
                    document.getElementById("accountNumber").value = "";
                    document.getElementById("brandName").value = "";

                    // Redo Drop Down Menu of Accounts
                    handleDropDownMenuSelection();

                }, 1000);
            });
        })
        .catch((error) => {
            console.log("Error:", error);
            var addAccountButton = document.getElementById("addAccountButton");
            addAccountButton.style.backgroundColor = "#FF0000";
            addAccountButton.textContent = "Error";

            setTimeout(() => {
                addAccountButton.style.backgroundColor = "";
                addAccountButton.textContent = "Submit";
            }, 1000);
        });

    });
}

async function removeAccountInStore() {
    await getFromStorage("knownAccounts").then(async(store) => {

        var accountDropDownValue = document.getElementById("accountDropdown").value;

        // Filter array of objects by the "name" key
        var accountEntry = store.filter(function(obj) {
            return obj.accountId !== accountDropDownValue;
        });

        await setInStorage("knownAccounts", accountEntry).then(() => {
            // Remove all current options
            var elementsToRemove = document.querySelectorAll('.accountOption');
            elementsToRemove.forEach(function(element) {
                element.remove();
            });
            // Repopulate Options
            populateAccountDropDownMenu();
            // Reformat
            var accountEditContainer = document.getElementById('accountEditContainer');
            accountEditContainer.classList.add('hidden');
            var accountSelectionContainer = document.getElementById('accountSelectionContainer');
            accountSelectionContainer.classList.remove('hidden');
            var actionsMenu = document.getElementById('actionsMenu');
            actionsMenu.classList.add('hidden');
        });
    });
}

function processLpaStatus(selectedOption) {
    // Update with current selected account Id
    var lpaAccountId = document.getElementById('lpaAccountId');
    lpaAccountId.textContent = selectedOption;

    // Get other LPA fields & initialise variables
    var lastElevationTime = false;
    
    // Get Account & Find Last Elevation Time
    getFromStorage("knownAccounts").then(async (result) => {
        var accountEntry = result.filter(function(obj) { // Filter array of objects
            return obj.accountId === selectedOption;
        });
        
        if(accountEntry.length !==0 && accountEntry[0].hasOwnProperty("lastLpaElevation")) { // Get last Elevation Time if available
            lastElevationTime = accountEntry[0].lastLpaElevation;
        }

        evaluateLpaStatus(lastElevationTime);
        
    });
}

function evaluateLpaStatus(lastElevationTime) {
    var lpaAccountStatus = document.getElementById('lpaAccountStatus');
    var expiryTime = document.getElementById('expiryTime');
    var timeToExpiry = document.getElementById('timeToExpiry');

    var currentTime = new Date().getTime();
    var lpaExpireTime = (lastElevationTime + 3600000); // LPA Expiry time (+1hr from last Elevation)

    var timeDiffInMins = Math.floor((lpaExpireTime-currentTime)/60000); // Time to LPA Elevation Expiry -> Rounded down in Mins

    if(lastElevationTime) { // Last Elevation Time Available
        if (timeDiffInMins >= 0) { // LPA Elevated
            lpaAccountStatus.textContent = "Elevated";
            lpaAccountStatus.style = "font-weight: bold; color: rgb(80, 168, 9);"
            expiryTime.classList.remove('hidden');
            timeToExpiry.textContent = timeDiffInMins;

        } else { // LPA Normal
            lpaAccountStatus.textContent = "Normal";
            lpaAccountStatus.style = "font-weight: bold; color: rgb(255,105,1);"
            expiryTime.classList.add('hidden');
        }
    } else { // Last Elevation Time NOT Available
        lpaAccountStatus.textContent = "Not yet Recorded";
        lpaAccountStatus.style = "font-weight: bold; color: rgb(255,105,1);"
        expiryTime.classList.add('hidden');
    }
}

// ##### Open Houston #####

function openHoustonForAccount() {
    var selectedAccount = document.getElementById("accountDropdown").value;
    window.open(`https://authentication.liveperson.net/login.html?lpservice=leBackofficeInt&servicepath=a%2F~~accountid~~%2F%23%2C~~ssokey~~&acc=${selectedAccount}`);
}

// ##### Open Supportal #####

async function openSupportalForAccount() {
    var selectedAccount = document.getElementById("accountDropdown").value;
    window.open(`https://supportal.lpnet.com/#/?account=${selectedAccount}`);
}

// ##### Open Conversational Cloud #####

async function openCCForAccount() {
    var selectedAccount = document.getElementById("accountDropdown").value;
    window.open(`https://authentication.liveperson.net/legacyLogin.html?source=accSelLgcy&stId=${selectedAccount}&autoSignIn=true`, '_blank', 'noopener');
}

// ##### Open Kibana #####
function openKibana() {
    window.open(`https://kibana.int.liveperson.net/spaces/space_selector`, '_blank', 'noopener');
}


// ##### Open LP Sandbox #####
function openSandbox() {
    var selectedAccount = document.getElementById("accountDropdown").value;
    window.open(`https://lpsandbox.com/?site=${selectedAccount}`, '_blank', 'noopener');
}

// ##### Elevate LPA #####

async function checkLPAValues() { // Return obj with values & bool continuance
    // Outcome Var
    let outcome;

    // Get Values to check
    accountId = document.getElementById("accountDropdown").value;
    givenReason = document.getElementById("reason").value;
    await getFromStorage("username").then((result) => {
        userName = result;
    });
    await getFromStorage("password").then((result) => {
        passWord = result;
    });

    // Validate Values
    accountId = (accountId == "") ? false : accountId;
    userName = (userName == "") ? false : userName;
    passWord = (passWord == "") ? false : passWord;
    givenReason = (givenReason == "") ? "Enabling Admin Settings" : givenReason;

    // Get Domain for Account
    var endResult = await getFromStorage("knownAccounts").then(async(result) => {
        var accountEntry = result.filter(function(obj) { // Filter array of objects
            return obj.accountId === accountId;
        });
        
        if(accountEntry.hasOwnProperty("adminArea")) {
            return accountEntry.adminArea;
        } else {
            var adminAreaURI;
            var accountDetails = await getDomain(accountId, "adminArea");
            var updatedAccountEntries = result.filter(function(obj) { // Filter array of objects
                if(obj.accountId === accountId) {
                    obj.adminArea = accountDetails.baseURI;
                    adminAreaURI = accountDetails.baseURI
                    return obj;
                } else {
                    return obj;
                }
            });
            await setInStorage("knownAccounts", updatedAccountEntries); // Update storage with domain
            return adminAreaURI;
        }
    }).then((adminAreaDomain) => {
        //Evalute & Return Values
        if(!accountId || !userName || !passWord || !adminAreaDomain) { //If any values non-existant, discontinue
            outcome = false;
            return {
                outcome,
                accountId,
                userName,
                passWord,
                givenReason,
                adminAreaDomain
            }
        } else { //If all values exist, continue
            outcome = true;
            return {
                outcome,
                accountId,
                userName,
                passWord,
                givenReason,
                adminAreaDomain
            }
        }
    });

    return endResult;

}

async function elevateLpa() {
    var values = await checkLPAValues();
    if(!values.outcome) {
        failedElevation();
    } else {
        openPopUp_elevateLPA(values.accountId, values.givenReason, values.adminAreaDomain);
    }
}

async function openPopUp_elevateLPA(accountId, givenReason, domain) {
    if(!accountId || !domain) { failedElevation(); return; }
    chrome.windows.create({ url: `https://${domain}/hc/web/public/pub/siteadminlogin.jsp?goto=siteadmin/LPAdminAccess.jsp&site=${accountId}&action=extElevate&reason=${givenReason}`, type: 'popup', width: 400, height: 300 }, function(window) {
        popupWindowId = window.id;
        var eLPAListener = chrome.runtime.onMessage.addListener(function(message) {
            console.log('Received message from popup:', message);
            if(message == "accessGranted") {
                successfulElevation();
                chrome.windows.remove(popupWindowId, function() {
                    console.log("Window has been closed");
                });
                openCCForAccount();
                chrome.runtime.onMessage.removeListener(eLPAListener);
            } else {
                failedElevation();
                chrome.windows.remove(popupWindowId, function() {
                    console.log("Window has been closed");
                });
                chrome.runtime.onMessage.removeListener(eLPAListener);
            }
        });
        chrome.runtime.onMessage.addListener(eLPAListener);
    });
}

function successfulElevation() {
    var elevateLpaButton = document.getElementById("elevateLpa");
    elevateLpaButton.style.backgroundColor = "#008000";
    elevateLpaButton.textContent = 'Success!';

    setTimeout(() => {
        elevateLpaButton.style.backgroundColor = "";
        elevateLpaButton.textContent = "Start";
    }, 2000);
}

function failedElevation() {
    var elevateLpaButton = document.getElementById("elevateLpa");
    elevateLpaButton.style.backgroundColor = "#FF0000";
    elevateLpaButton.textContent = "Error";

    setTimeout(() => {
        elevateLpaButton.style.backgroundColor = "";
        elevateLpaButton.textContent = "Start";
    }, 2000);
}

// ##### API Calls #####

async function getDomain(accountId, serviceName) { // Domain API
    var domain = await fetch(`https://api.liveperson.net/api/account/${accountId}/service/${serviceName}/baseURI.json?version=1.0`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
    })
    .then(function(response) {
        if (response.status === 200) {
            let data = response.json();
            return data;
        } else if(response.status === 404) {
            console.log(`getDomain() 404 Error: ${JSON.stringify(response)}`);
            return {baseURI: 'Not Found'}
        } else {
            console.log(`getDomain() ? Error: ${JSON.stringify(response)}`);
            return {baseURI: 'API Error'}
        }
    })
    .catch(function(error) {
        console.log(`getDomain() Error: ${error}`);
        return {baseURI: 'Not Found'}
    });
    return domain;
}

async function postLogin(user, pass, accountId) { // Login Service API
    var domain = await getDomain(accountId, "agentVep");
    var url = `https://${domain.baseURI}/api/account/${accountId}/login?v=1.3`;
    var data = {
        username: user,
        password: pass
    };

    var response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/JSON',
            'Accept': 'Application/JSON'
        },
        body: JSON.stringify(data)
    })
    .then(function(response) {
        if (response.status === 200) {
            return response.json(); // Valid login
        } else if(response.status === 500) {
            return false; // Invalid login
        } else {
            throw new Error('postLogin() Network response was Unexpected');
        }
    })
    .catch(function(error) {
        console.info('Error Logging In:' + error.message);
        return error;
    });

    return response;
}

