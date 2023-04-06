// Run on every page
document.addEventListener("DOMContentLoaded", function () {
    loadNavBar();
});

// Navigation Bar
function loadNavBar() {
    document.getElementById('navigationBar').innerHTML = `
    <ul class="nav-bar">
        <li></li>
        <li><a href="./index.html">Home</a></li>
        <li><a href="./index.html">Academic</a></li>
        <li><a href="./index.html">Professional</a></li>
        <li><a href="./index.html">Personal</a></li>
        <li><a href="./index.html">Contact</a></li>
        <li></li>
    </ul>
    `;
}

// Navigation Bar V2
function loadNavBar2() {
    var navigationBarInformation = navigationBarJSON();
    var navBar = document.getElementById('navigationBar');
    var navBarList = document.createElement('ul');
    navBarList.setAttribute("class", "nav-bar");
    navBar.append(navBarList);

    var navBarList = document.getElementById('nav-bar');

    for (const ul of Object.keys(navigationBarInformation)) {
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