const search = document.getElementById('search'),
    submit = document.getElementById('submit'),
    random = document.getElementById('random'),
    mealsEl = document.getElementById('meals'),
    resultHeading = document.getElementById('result-heading'),
    single_mealEl = document.getElementById('single-meal'),
    category = document.querySelectorAll('.category'),
    meal_categories = document.getElementById('meal-categories');


// View category from API

function getMealCategories() {
    fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    .then(res => res.json())
    .then(data => {

        meal_categories.innerHTML = data.categories.map(category => `
            <div class="category">
                <img src="${category.strCategoryThumb}" alt="${category.strCategory}" />
                <div class="category-name" data-categoryName=${category.strCategory}>
                    <h3>${category.strCategory}</h3>
                </div>
            </div>
        `).join('');
    });
}

// Display all meals by category
function getAllMealsByCat(catName){

    if(catName !== null){
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${catName}`)
        .then(res => res.json()) // format to JSON
        .then(data => {
            meal_categories.innerHTML = '';
            resultHeading.innerHTML = `<h2>Recipe results for category '${catName}':</h2>`;
                mealsEl.innerHTML = data.meals.map(meal => `
                    <div class="meal">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                        <div class="meal-info" data-mealID="${meal.idMeal}">
                            <h3>${meal.strMeal}</h3>
                        </div>
                    </div>
                `)
                .join(''); 
        });
    }
}

// Search meal and fetch from API
function searchMeal(e) {
    e.preventDefault();

    // Clear single meal
    single_mealEl.innerHTML = '';

    // Clear meal categories
    meal_categories.innerHTML = '';

    // Get search term
    const term = search.value;

    // Check for empty
    if(term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then(res => res.json()) // format to JSON
            .then(data => {
                console.log(data);
                resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;

                if(data.meals === null){
                    resultHeading.innerHTML = `<p>There are no search results. Try again!</p>`;
                    mealsEl.innerHTML = '';


                }else {
                    mealsEl.innerHTML = data.meals.map(meal => `
                        <div class="meal">
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                            <div class="meal-info" data-mealID="${meal.idMeal}">
                                <h3>${meal.strMeal}</h3>
                            </div>
                        </div>
                    `)
                    .join(''); 
                }

            });
            // Clear search text
            search.value = '';
    }else{
        alert('Please enter a search term');

        // Show meal categories in the home page
         getMealCategories();

    }
}

// Fetch random meal from API
function getRandomMeal () {
    // Clear meals and heading
    mealsEl.innerHTML = '';
    resultHeading.innerHTML = '';

    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];

            addMealToDom(meal);
        });
}

// Fetch meal by ID
function getMealByID(mealID) {
    if( mealID !== null ){
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
            .then(res => res.json())
            .then(data => {
                const meal = data.meals[0];
                addMealToDom(meal);
            });
    }
}

// Add meal to DOM 
function addMealToDom(meal) {
    mealsEl.innerHTML = '';
    resultHeading.innerHTML = '';

    const ingredients = [];

    for(let i = 1; 1<= 20; i++){
        if(meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        }else {
            break; // break loop if there is no new ingredient
        }
    }
    

    single_mealEl.innerHTML = `
        <div class="single-meal">
            <h1>${meal.strMeal}</h1>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <div class="single-meal-info">
              
                ${meal.strCategory ? `<p> <span class="fas fa-list"></span> ${meal.strCategory}</p>` : ''} <!--  if there is a meal.strCategory output p else -->
                ${meal.strArea ? `<p> <span class="fas fa-flag"></span> ${meal.strArea}</p>` : ''}
            </div>

            <div class="main">
                <h3>Ingredients</h3>
                <ul>
                    ${ingredients.map(ingxxx => `<li>${ingxxx}</li>`).join('')}
                </ul>
                <p>${meal.strInstructions}</p>
            </div>
        </div>
    `;
}

    // Show meal categories in the home page
    getMealCategories();

    //Event Listeners   
    submit.addEventListener('submit', searchMeal);
    random.addEventListener('click', getRandomMeal);

    // Show click result for category
    meal_categories.addEventListener('click', e => {
        const tagname = e.target.tagName;

        if(tagname == 'DIV'){

            const showCatMeals = e.target;
            const catName = showCatMeals.getAttribute('data-categoryname');
            getAllMealsByCat(catName);

        }else if(tagname == 'H3'){
            const showCatMeals = e.target.parentElement;

            const catName = showCatMeals.getAttribute('data-categoryname');
            getAllMealsByCat(catName);

        }
    });

    // Show click result for meal info
    mealsEl.addEventListener('click', e => {


        const tagname = e.target.tagName;

        if(tagname == 'DIV'){
            const showMeals = e.target;
            const mealID = showMeals.getAttribute('data-mealid');
            getMealByID(mealID);

        }else if(tagname == 'H3'){
            const showMeals = e.target.parentElement;

            const mealID = showMeals.getAttribute('data-mealid');
            getMealByID(mealID);

        }

    });