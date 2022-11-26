// Main Page
document.addEventListener("DOMContentLoaded", function () {
    //console.log("Domain: " + window.location);
    thisSundayMidnightDate();
    addEventListenersForDropdowns();
    cook();
});

function addEventListenersForDropdowns() {
    var coll = document.getElementsByClassName("collapsible");
    var i;
    // Add Event Listeners
    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.maxHeight){
                content.style.maxHeight = null;
                content.style.padding = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                content.style.padding = "10px";
            } 
        });
    }
}

// Organise Cook Menu
async function cook(recipes) {
    var totalIngredients = {};
    var recipes = (recipes!=null) ? recipes : await getRecipes();
    var ingredientsArray = await getIngredients();
    var randomRecipe = (getCookie("randomRecipe")!="") ? getCookie("randomRecipe").split(",") : await resetRecipes() ;
    for(var i = 1; i <= 7; i++) {
        var recipeNumber = randomRecipe[i];
        var recipeObject = recipes.recipes[recipeNumber];
        //console.log(`Day ${i}... ${recipeObject.recipeDetails.title}!`);
        var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        buildRecipes(i, recipeObject, days, ingredientsArray, totalIngredients);
    }
    buildShoppingList(totalIngredients);
}

function buildShoppingList(totalIngredients) {
    console.log(typeof totalIngredients);
    console.log(JSON.stringify(totalIngredients));
    // Populate Shopping List Title
    var dropdownSection = document.getElementById(`shoppingListTitle`);
    dropdownSection.innerHTML = `Weekly Shopping List`;
    // Populate Shopping List Contents
    var shoppingListContents_FruitVeg = document.getElementById(`shoppingListContents_FruitVeg`);
    var shoppingListContents_Meat = document.getElementById(`shoppingListContents_Meat`);
    var shoppingListContents_Other = document.getElementById(`shoppingListContents_Other`);

    let shoppingList_FruitAndVeg = "";
    let shoppingList_Meat = "";
    let shoppingList_Other = "";
    for (var key of Object.keys(totalIngredients)) {
        let ingredient = totalIngredients[key];
        let name = ingredient.name;
        let amount = ingredient.amount;
        let measurement = ingredient.measurement;
        
        // Make Shopping List Pretty
        measurement = (measurement == null) ? "" : ` ${ingredient.measurement} of`;
        name = (measurement == "" && amount > 1) ? `${name}s` : `${name}`;
        measurement = (measurement.slice(-2) == "of" && amount > 1) ? ` ${ingredient.measurement}s of` : measurement;
        let item = `${ingredient.amount}${measurement} ${name}`;
        if(ingredient.filterType == "FruitVeg") {
            shoppingList_FruitAndVeg += `${item}<br>`;
        } else if(ingredient.filterType == "Meat") {
            shoppingList_Meat += `${item}<br>`;
        } else if(ingredient.filterType == null) {
            shoppingList_Other += `${item}<br>`;
        } else {
            console.warn(`Error with Ingredient Obj: ${JSON.stringify(ingredient)}`);
        }

    }
    shoppingListContents_FruitVeg.innerHTML = shoppingList_FruitAndVeg;
    shoppingListContents_Meat.innerHTML = shoppingList_Meat;
    shoppingListContents_Other.innerHTML = shoppingList_Other;

}

async function buildRecipes(dayInt, recipeObject, days, ingredientsArray, totalIngredients) {
    var recipeTitle = recipeObject.recipeDetails.title;
    var recipeSubTitle = recipeObject.recipeDetails.subtitle;
    var recipeIngredients = recipeObject.recipeIngredients;

    var date = new Date();
    var daysOfWeek = new Date(date - (date.getDay()-dayInt) * 24 * 60 * 60 * 1000);
    
    var dayDate = daysOfWeek.getDate();
    var dayName = days[dayInt-1];
    var dayNameShortUpper = dayName.slice(0, 3).toUpperCase();
    var dayNameShortLower = dayName.slice(0, 3).toLowerCase();
    var monthDate = daysOfWeek.getMonth();

    // Populate Recipe Titles & Subtitles
    var dropdownSection = document.getElementById(`${dayNameShortLower}Title`);
    dropdownSection.innerHTML = `${dayNameShortUpper} - ${dayDate}/${monthDate} - ${recipeTitle}<br>${recipeSubTitle}`;

    // Populate Recipe Ingredients
    let recipeIngredientsString = "";
    for (var i = 0; i < ingredientsArray.length; i++) {
        if(recipeIngredients.includes(ingredientsArray[i].code)) {
            var measurement = (ingredientsArray[i].measurement != null) ? ingredientsArray[i].measurement : "" ;
            recipeIngredientsString += `${ingredientsArray[i].name} - ${ingredientsArray[i].amount} ${measurement}<br>`;
            if(totalIngredients.hasOwnProperty(ingredientsArray[i].code) && typeof ingredientsArray[i].amount == "string") {  // Ingredients noted as "where required"
                totalIngredients[ingredientsArray[i].code] = ingredientsArray[i];
            } else if (totalIngredients.hasOwnProperty(ingredientsArray[i].code) && typeof ingredientsArray[i].measurement != "string") { // Normal Ingredients
                totalIngredients[ingredientsArray[i].code].amount += ingredientsArray[i].amount;
            } else { // New Ingredients
                totalIngredients[ingredientsArray[i].code] = ingredientsArray[i];
            }
        }
    }
    var dropdownSubSection = document.getElementById(`${dayNameShortLower}Contents`);
    dropdownSubSection.innerHTML = recipeIngredientsString;

}

function thisSundayMidnightDate() {
    var date = new Date();
    date.setHours(0,0,0,0);
    var days = date.getDay();
    
    var daysOfWeek = new Date(date + (7-days) * 24 * 60 * 60 * 1000);
    daysOfWeek.setHours(23,0,0,0);
    
    console.log(daysOfWeek);
}

async function getNewRecipes(randomRecipe) {
    console.log("Getting new recipes...");
    var recipes = await getRecipes();
    var randomRecipe = generateRandomNumbers(1, recipes.recipes.length, 7)
    setCookie("randomRecipe", randomRecipe, thisSundayMidnightDate());
    cook(recipes);
}

async function resetRecipes(randomRecipe) {
    var recipes = await getRecipes();
    var randomRecipe = generateRandomNumbers(1, recipes.recipes.length, 7)
    setCookie("randomRecipe", randomRecipe, thisSundayMidnightDate());
    return randomRecipe;
}

async function getRecipes() {
    var recipes_JSON = await fetch("./cookbook/recipes.json")
    .then(response => {
        return response.json();
    });
    return recipes_JSON;
}

async function getIngredients() {
    var ingredients_JSON = await fetch("./cookbook/ingredients.json")
    .then(response => {
        return response.json();
    });
    //console.log(`Ingredients: ${ingredients_JSON}`);
    return ingredients_JSON.ingredients;
}



// General Use functions
function generateRandomNumbers(min, max, times) {
    var randoms = []
    for (let i = 0; i <= times; i++) {
        var randomNumber = Math.floor(Math.random() * (max - min) + min);
        randoms.push(randomNumber);
    }
    return randoms
}

function getCookie(cname) { // Get a cookie when you pass in String cookie name
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(cname, cvalue, date) { // Set a cookie when you pass in String cookie name, String cookie value, and date obj for expiry
    let expires = "expires="+date;
    document.cookie = cname + "=" + cvalue + ";" + expires + ";";
}

function resetCookie(cname) { // Set cookie to nothing
    setCookie(cname, "", "");
}