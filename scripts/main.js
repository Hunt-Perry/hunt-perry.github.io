// Run on every page
document.addEventListener("DOMContentLoaded", function () {
    loadNavBar();
    //loadNavBar2();
});

// Navigation Bar
function loadNavBar() {
    document.getElementById('navigationBar').innerHTML = `
    <ul class="nav-bar">
        <li><a href="./index.html">Home</a></li>
        <li class="dropdown"><a href="#professional">Professional <i class="arrow dropdown-arrow"></i></a>
            <div class="dropdown-content">
                <a href="#1">SE @ LivePerson (1 year - Ongoing) (WIP)</a>
                <a href="#2">BA @ Advice RegTech (1 year) (WIP)</a>
                <a href="#3">More + (WIP)</a>
            </div>
        </li>
        <li class="dropdown"><a href="#personal">Personal <i class="arrow dropdown-arrow"></i></a>
            <div class="dropdown-content">
                <a href="#1">Australian Army (WIP)</a>
                <a href="#2">Surf Life Saving (WIP)</a>
                <a href="#3">More + (WIP)</a>
            </div>
        </li>
        <li class="dropdown"><a href="#personal">Projects <i class="arrow dropdown-arrow"></i></a>
            <div class="dropdown-content">
                <a href="./cookbook.html">Cookbook</a>
                <a href="#3">More + (WIP)</a>
            </div>
        </li>
        <li><a href="#contact">Contact</a></li>
    </ul>
    `;
}

function navigationBarJSON() { // JSON for Navigation Bar
    return JSON.parse(`[
        {
            "innerHTML": "Home",
            "href": "./index.html",
            "dropdowns": []
        },
        {
            "innerHTML": "Professional",
            "href": "./index.html",
            "dropdowns": [
                {
                    "title": "SE @ LivePerson (1 year - Ongoing) (WIP)",
                    "link": "./index.html"
                },
                {
                    "title": "BA @ Advice RegTech (1 year) (WIP)",
                    "link": "./index.html"
                },
                {
                    "title": "More + (WIP)",
                    "link": "./index.html"
                }
            ]
        },{
            "innerHTML": "Personal",
            "href": "./index.html",
            "dropdowns": [
                {
                    "title": "Australian Army (WIP)",
                    "link": "./index.html"
                },
                {
                    "title": "Surf Life Saving (WIP)",
                    "link": "./index.html"
                },
                {
                    "title": "More + (WIP)",
                    "link": "./index.html"
                }
            ]
        },{
            "innerHTML": "Projects",
            "href": "./index.html",
            "dropdowns": [
                {
                    "title": "Cookbook",
                    "link": "./cookbook.html"
                },
                {
                    "title": "More + (WIP)",
                    "link": "./index.html"
                }
            ]
        },{
            "innerHTML": "Contact",
            "href": "./index.html",
            "dropdowns": []
        }
   ]`);
}

// Navigation Bar V2
function loadNavBar2() {
    var navigationBarInformation = navigationBarJSON();
    var navBar = document.getElementById('navigationBar');
    var navBarList = document.createElement('ul');
    navBarList.setAttribute("class", "nav-bar");
    navBar.append(navBarList);

    /*
    for (const key of Object.keys(obj)) {
        console.log(key, obj[key]);
    }
    */

    var navBarList = document.getElementById('nav-bar');

    for (const ul of Object.keys(navigationBarInformation)) {
        //console.log(navigationBarInformation[ul]);
        var navBarL1 = document.createElement('li');
        var specialCharacter_downArrow = ` <i class="arrow dropdown-arrow"></i>`;
        var downArrow = "";
        // Add information from JSON
        if(navigationBarInformation[ul].hasOwnProperty("dropdowns")) { 
            navBarL1.setAttribute("class", "dropdown");
            downArrow = specialCharacter_downArrow;
        }
        var navBarL1A = document.createElement('a');
        navBarL1A.setAttribute("href", "./index.html");
        navBarL1A.innerHTML = `${navigationBarInformation[ul]}${downArrow}`;

        navBarList.append(navBarL1);
        navBarL1.append(navBarL1A);
        

        //var navBarL1_title = navBarL1.createElement('a');
        //var navBarL1_title = navBarL1.setAttribute("href", navigationBarInformation[ul].innerHTML);
        //navBarL1.append(navBarL1_title);
        
    }


    var recipe_Title = document.createElement('h2');
    recipe_Title.setAttribute("id", `day${dayInt}_title`);
    recipe_Title.setAttribute("class", "recipeTitle");
    recipe_Title.innerHTML = `${dayNameShort} ${dayDate}/${monthDate} - ${recipeTitle}`;

    var recipe_SubTitle = document.createElement('h3');
    recipe_SubTitle.setAttribute("id", `day${dayInt}_subtitle`);
    recipe_SubTitle.setAttribute("class", "recipeSubTitle");
    recipe_SubTitle.innerHTML = `${recipeSubTitle}`;

}