document.addEventListener("DOMContentLoaded", function () {
    console.log("Domain: " + window.location);
    cook();
});

async function cook() {
    var options = {
        method: 'GET',
        //mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    fetch("./cookbook/recipes.json", options)
    .then(response => {
        console.log(response);
    });

}

async function readJson() {
    fetch('./cookbook/recipes.json')
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        return response.json();
    })
    .then(json => {
        this.users = json;
        console.log(this.users);
    })
    .catch(function () {
        this.dataError = true;
    });
}
