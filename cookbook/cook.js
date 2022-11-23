// Main Page
document.addEventListener("DOMContentLoaded", function () {
    //console.log("Domain: " + window.location);
    cook();
});

            

document.getElementsByClassName("collapsible").addEventListener("click", function() {
    var coll = document.getElementsByClassName("collapsible");
    var i;
        
    for (i = 0; i < coll.length; i++) {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.maxHeight){
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        } 
    }
});

// Organise Cook Menu

async function cook() {
    var recipes = await getRecipes();
    var randomRecipe = generateRandomNumbers(1, recipes.recipes.length, 7);

    for(var i = 1; i <= 7; i++) {

        var recipeNumber = randomRecipe[i]
        var recipeObject = recipes.recipes[recipeNumber];
        console.log(`Day ${i}... ${recipeObject.title}!`);

        buildRecipes(i, recipeObject);

    }
    
    
}

function buildRecipes(dayInt, recipeObject) {
    var recipeTitle = recipeObject.recipeDetails.title;
    var recipeSubTitle = recipeObject.recipeDetails.subtitle;
    var recipeIngredients = recipeObject.recipeIngredients;

    var date = new Date();
    var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    var daysOfWeek = new Date(date - (date.getDay()-dayInt) * 24 * 60 * 60 * 1000);
    console.log(daysOfWeek);
    
    var dayDate = daysOfWeek.getDay();
    var dayName = days[dayInt-1];
    var dayNameShort = dayName.slice(0, 3).toUpperCase()
    var monthDate = daysOfWeek.getMonth();

    var day = document.createElement('div');
    day.setAttribute("id", `day${dayInt}`);
    day.setAttribute("class", "recipeProfile");

    var recipe_Title = document.createElement('h2');
    recipe_Title.setAttribute("id", `day${dayInt}_title`);
    recipe_Title.setAttribute("class", "recipeTitle");
    recipe_Title.innerHTML = `${dayNameShort} ${dayDate}/${monthDate} - ${recipeTitle}`;

    var recipe_SubTitle = document.createElement('h3');
    recipe_SubTitle.setAttribute("id", `day${dayInt}_subtitle`);
    recipe_SubTitle.setAttribute("class", "recipeSubTitle");
    recipe_SubTitle.innerHTML = `${recipeSubTitle}`;

    var recipe_Ingredients = document.createElement('h3');
    recipe_Ingredients.setAttribute("id", `day${dayInt}_ingredients`);
    recipe_Ingredients.setAttribute("class", "recipeIngredients");
    recipe_Ingredients.innerHTML = `Ingredients: ${recipeIngredients.length}`;

    document.getElementById('cookbook').append(day);
    document.getElementById(`day${dayInt}`).append(recipe_Title);
    document.getElementById(`day${dayInt}`).append(recipe_SubTitle);
    document.getElementById(`day${dayInt}`).append(recipe_Ingredients);
}

async function getRecipes() {
    var recipes_JSON = await fetch("./cookbook/recipes.json")
    .then(response => {
        return response.json();
    });
    //console.log(`Recipes: ${recipes_JSON}`);
    return recipes_JSON;
}

async function getIngredients() {
    var ingredients_JSON = await fetch("./cookbook/ingredients.json")
    .then(response => {
        return response.json();
    });
    console.log(`Ingredients: ${ingredients_JSON}`);
    return ingredients_JSON;
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

