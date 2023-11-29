console.log("Working...");

// ##### Main Function #####
mainFunction();

async function mainFunction() {
    var url = document.location.href;
    if((url.indexOf("/hc/web/public/pub/siteadminlogin.jsp?goto=siteadmin/LPAdminAccess.jsp") !== -1) && (url.indexOf("error") !== -1)) {
        try { // Opened via Conv. Cloud Login page Button
            window.opener.postMessage('accessDenied', '*');
            window.close();
        }
        catch(e) { // Opened via Extension
            chrome.runtime.sendMessage('accessDenied');
        }
    } else if((url.indexOf("/hc/web/public/pub/siteadminlogin.jsp?goto=siteadmin/LPAdminAccess.jsp") !== -1) && (url.indexOf("action=extElevate") !== -1)) { // Page 1 (Credentials Req.)
        submitUserAndPass();
    } else if((url.indexOf("/hc/web/siteadmin/siteadmin/LPAdminAccess.jsp") !== -1) && (url.indexOf("action=extElevate") !== -1) && document.getElementById("reason")) { // Page 2 (Reason Req.)
        var reason = url.match(/reason=([^&]*)/)[1];
        submitReason(reason);
    } else if((url.indexOf("/hc/web/siteadmin/siteadmin/LPAdminAccess.jsp") !== -1) && (url.indexOf("action=extElevate") !== -1) && document.querySelector('p.listheader')) { // Page 3 (Final)
        var completeStatus = validateComplete();
        if(completeStatus.indexOf("access granted") !== -1) { 
            recordAccountElevation(completeStatus).then(function() { // Record account elevation with Chrome Ext. Action
                try { // Opened via Conv. Cloud Login page Button
                    window.opener.postMessage('accessGranted', '*');
                    window.close();
                }
                catch(e) { // Opened via Extension
                    chrome.runtime.sendMessage('accessGranted');
                }
            });
        } else {
            try { // Opened via Conv. Cloud Login page Button
                window.opener.postMessage('accessDenied', '*');
                window.close();
            }
            catch(e) { // Opened via Extension
                chrome.runtime.sendMessage('accessDenied');
            }
        }
    } else if((url.indexOf("/hc/web/siteadmin/siteadmin/LPAdminAccess.jsp") !== -1) && document.querySelector('p.listheader')) {
        var completeStatus = validateComplete();
        recordAccountElevation(completeStatus); // Record account elevation without Chrome Ext. Action
    }
}

// ##### Sub Functions #####
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

async function submitUserAndPass() {
    // Retrieve & Configure Values
    var userStored = await getFromStorage("username");
    var passStored = await getFromStorage("password");
    var userStored_LpaRemoved = userStored.substring(4);

    // Find & Run
    var name = document.querySelector('input[name="user"]');
    var pass = document.querySelector('input[name="pass"]');
    let submitButton = document.querySelector('input[type="submit"][value="Submit"][name="B1"][class="button1"]');
    name.value = userStored_LpaRemoved;
    pass.value = passStored;
    submitButton.click();
    return true;
}

function submitReason(encodedReason) {
    var decodedReason = decodeURIComponent(encodedReason);
    var reason = document.getElementById("reason");
    let submitButton = document.querySelector('input[type="submit"][value="Submit"][name="submit"].lgbutton');
    reason.value = decodedReason;
    submitButton.click();
    return true;
}

function validateComplete() {
    var paragraphElement = document.querySelector('p.listheader').textContent;
    return paragraphElement;
}

async function recordAccountElevation(completeStatus) {
    var currentTime = (new Date()).getTime();
    var accountId = completeStatus.match(/(\d+)/);
    var knownAccounts = await getFromStorage("knownAccounts");

    var updatedAccountEntries = knownAccounts.filter(function(account) { // Filter array of objects - update LPA Elevation attribute with current time
        if(account.accountId === accountId[0]) {
            account.lastLpaElevation = currentTime;
            return account;
        } else {
            return account;
        }
    });

    // Update storage with known accounts
    setInStorage("knownAccounts", updatedAccountEntries).then(function() {
        return true;
    });

}