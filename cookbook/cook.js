document.addEventListener("DOMContentLoaded", function () {
    console.log("Domain: " + window.location);
    cook();
});

async function getRecipes() {
    var recipes_JSON = await fetch("./cookbook/recipes.json")
    .then(response => {
        return response.json();
    });
    console.log(`Recipes: ${recipes_JSON}`);
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

async function cook() {
    var recipes = await getRecipes();
    var randomRecipe = getRandomInt(1, recipes.recipes.length);
    var randomRecipe_Details = recipes.recipes[randomRecipe].recipeDetails;

    var recipeTitle = randomRecipe_Details.title;

    day1 = document.createElement('div');
    day1.setAttribute("id", "day1");

    day1_title = document.createElement('h2');
    day1_title.setAttribute("id", "day1_title");
    day1_title.innerHTML = `Monday - ${recipeTitle}`;

    document.getElementById('cookbook').append(day1);
    document.getElementById('day1').append(day1_title);
}

function getRandomInt(min, max) { // Get Random Integer between 2 Values
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }