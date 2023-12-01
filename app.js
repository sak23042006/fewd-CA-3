var numOfRes = document.querySelector("#search-result")
numOfRes.style.display = "none"

document.getElementById("home").addEventListener("click",()=> 
{let targetSection = document.getElementById("contents");
targetSection.scrollIntoView({ behavior: 'smooth' })})

document.querySelector(".modal").addEventListener("click",()=>{
    document.querySelector(".modal").style.display="none"
})

document.querySelector("input").addEventListener("keypress",(event)=>{
    console.clear();
    let search = document.querySelector(".search").value
    localStorage.setItem("search",search)
    if(search.length != "" && event.key === "Enter" ){
        filterDish(localStorage.getItem("search"))
        let targetSection = document.getElementById("sectionId");
        targetSection.scrollIntoView({ behavior: 'smooth' });
        document.querySelector("#no-result").innerHTML = ""
    }
    else{
        document.querySelector(".results").innerHTML = ""
        numOfRes.style.display = "none"
    }
})

document.querySelector("input").addEventListener("focusin",()=>{
    document.querySelector(".results").innerHTML = ""
    // numOfRes.innerHTML = ""
})

async function randomDish() {

    try {
        let randomDishApi = `https://www.themealdb.com/api/json/v1/1/random.php`
        let res = await axios.get(randomDishApi)
        let datas = res.data.meals[0]
        dataString = JSON.stringify(datas)
        localStorage.setItem("data",dataString)
        let randomContainer = document.querySelector(".random-food")
        let randomDish =`<p class="dish-name">Random-Dish</p>
        <div class="random-image" id="${datas.idMeal}">
        <img onclick="modal()" class="dish-image" src="${datas.strMealThumb}" alt="">
                    </div>
        <div class="dish-name">
            <p class="random-dish-name">${datas.strMeal}</p>
        </div>`
        randomContainer.innerHTML = randomDish;

    } catch (err) {
        console.log("error");
    }
}

randomDish()



async function filterDish(search) {

    try {
        // console.log(search);
        let filterDishApi = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${search}`
        let res = await axios.get(filterDishApi)
        let totalFoods = res.data.meals
        document.querySelector("#num-of-res").innerHTML = totalFoods.length
        numOfRes.style.display = "block"
        // console.log(totalFoods);
        for (let i = 0; i < totalFoods.length; i++) {
            let filterDish =`<div class="foods-image" id="${totalFoods[i].idMeal}">
        <img id="dish${i}" class="dish-image" src="${totalFoods[i].strMealThumb}" alt="dish${i}">
                    
        <div class="dish-name">
            <p class="dish-name">${totalFoods[i].strMeal}</p>
        </div>
        </div>`
        // console.log(filterDish);
        document.querySelector(".results").innerHTML += filterDish
    }
} catch (err) {
        console.log("error in fetching file enter a correct category");
        document.querySelector("#no-result").innerHTML = "No Results Found"
        numOfRes.style.display = "none"
        localStorage.clear()
    }
}

function modal() {
    document.querySelector(".modal").style.display="flex"
    document.getElementById("ing-list").innerHTML =""
    let foods = localStorage.getItem("data")
    let food = JSON.parse(foods)
    // <button id="source">How to Cook</button>
    // console.log(document.querySelector("#random-food-img"));
    // console.log(food.strYoutube);
    for (let i = 1; i < 21; i++) {
        // console.log(food);
        // console.log(food[`strIngredient${i}`]);
        if(food[`strIngredient${i}`]){
            document.getElementById("ing-list").innerHTML += `<li>${food[`strIngredient${i}`]}</li>` ;
        }
        else{
            break
        }
    }
    let content = document.querySelector("#contents")
    window.onclick = function (event) {
        console.log(event.target);
        if(event.target == content ){
            document.querySelector(".modal").style.display="none"
        }
      };
    document.querySelector("#random-food-img").src = `${food.strMealThumb}`
}