// Hide the search result element initially
var numOfRes = document.querySelector("#search-result");
numOfRes.style.display = "none";

// Scroll to the home section when the "home" button is clicked
document.getElementById("home").addEventListener("click", () => {
    let targetSection = document.getElementById("contents");
    targetSection.scrollIntoView({ behavior: 'smooth' });
});

// Hide the modal when it is clicked
document.querySelector(".modal").addEventListener("click", () => {
    document.querySelector(".modal").style.display = "none";
});

// Handle keypress event on the search input
document.querySelector("input").addEventListener("keypress", (event) => {
    console.clear();
    let search = document.querySelector(".search").value;
    localStorage.setItem("search", search);

    // If Enter key is pressed and search input is not empty, filter the dishes
    if (search.length !== "" && event.key === "Enter") {
        filterDish(localStorage.getItem("search"));
        let targetSection = document.getElementById("sectionId");
        targetSection.scrollIntoView({ behavior: 'smooth' });
        document.querySelector("#no-result").innerHTML = "";
    } else {
        document.querySelector(".results").innerHTML = "";
        numOfRes.style.display = "none";
    }
});

// Clear results when search input is focused
document.querySelector("input").addEventListener("focusin", () => {
    document.querySelector(".results").innerHTML = "";
});

// Function to fetch a random dish and display it
async function randomDish() {
    try {
        let randomDishApi = `https://www.themealdb.com/api/json/v1/1/random.php`;
        let res = await axios.get(randomDishApi);
        let datas = res.data.meals[0];
        dataString = JSON.stringify(datas);
        localStorage.setItem("data", dataString);

        // Display the random dish information
        let randomContainer = document.querySelector(".random-food");
        let randomDishHTML = `<p class="dish-name">Random-Dish</p>
        <div class="random-image" id="${datas.idMeal}">
            <img onclick="modal()" class="dish-image" src="${datas.strMealThumb}" alt="">
        </div>
        <div class="dish-name">
            <p class="random-dish-name">${datas.strMeal}</p>
        </div>`;
        randomContainer.innerHTML = randomDishHTML;

    } catch (err) {
        console.log("error");
    }
}

// Call the randomDish function to display a random dish
randomDish();

// Function to filter dishes based on the search input
async function filterDish(search) {
    try {
        let filterDishApi = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${search}`;
        let res = await axios.get(filterDishApi);
        let totalFoods = res.data.meals;
        document.querySelector("#num-of-res").innerHTML = totalFoods.length;
        numOfRes.style.display = "block";

        // Display the filtered dishes
        for (let i = 0; i < totalFoods.length; i++) {
            let filterDishHTML = `<div class="foods-image" id="${totalFoods[i].idMeal}">
                <img id="dish${i}" class="dish-image" src="${totalFoods[i].strMealThumb}" alt="dish${i}">
                <div class="dish-name">
                    <p class="dish-name">${totalFoods[i].strMeal}</p>
                </div>
            </div>`;
            document.querySelector(".results").innerHTML += filterDishHTML;
        }
    } catch (err) {
        console.log("error in fetching file enter a correct category");
        document.querySelector("#no-result").innerHTML = "No Results Found";
        numOfRes.style.display = "none";
        localStorage.clear();
    }
}

// Function to display the modal with additional information on the selected dish
function modal() {
    document.querySelector(".modal").style.display = "flex";
    document.getElementById("ing-list").innerHTML = "";
    let foods = localStorage.getItem("data");
    let food = JSON.parse(foods);

    // Display ingredients list in the modal
    for (let i = 1; i < 21; i++) {
        if (food[`strIngredient${i}`]) {
            document.getElementById("ing-list").innerHTML += `<li>${food[`strIngredient${i}`]}</li>`;
        } else {
            break;
        }
    }
    console.log(food);
    document.getElementById("ing-list").innerHTML += `<br> <a target="_blank" href=${food.strYoutube}> <button id="ytlink">Watch Procedure</button> </a>`

    // Set up modal close behavior
    let content = document.querySelector("#contents");
    window.onclick = function (event) {
        if (event.target == content) {
            document.querySelector(".modal").style.display = "none";
        }
    };

    // Set the random food image in the modal
    document.querySelector("#random-food-img").src = `${food.strMealThumb}`;
}
