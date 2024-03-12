//Just use comma inbetween them instead of declaring const for everything.
const search=document.getElementById("search"),
     submit=document.getElementById("submit"),
     random=document.getElementById("random"),
     mealsEl=document.getElementById("meals"),
     singleMeal=document.getElementById("single-meal"),
     resultHeading=document.getElementById("result-heading");


     //to automatically focus the input element for good ux
     search.focus();

//searching the meals and fetch from the api
//remember to set them  as preventDefault bcoz this is a submit event.
function searchMeal(e){
        e.preventDefault();

        //clear single meals
        singleMeal.innerHTML='';

        //get the search terms

        const term=search.value;//getting the values no the actual element

        //check for empty spaces
        if(term.trim()){
                fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
                .then(res=>res.json())
                .then(data=>{
                        console.log(data)
                        resultHeading.innerHTML=`<h2>Search results for <i style="color:#001";>' ${term} '</i>:</h2>
                        <p style="color:rgb(24, 23, 23);font-weight:bolder">Click on the dish to explore how to make them:</p>`;
                
                        if(data.meals===null){
                                resultHeading.innerHTML=`<p> There are no search results.Try again!</p>`;
                        }
                        else{
                                // Mapping through the meals element and  getting their thumbnail image 
                                //the  thing to note here is that they are giving the image thumbnail too in API


                                mealsEl.innerHTML=data.meals.map(meal=>
                                        
                                `<div class="meal">
                                <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                                <div class="meal-info" id="data-mealID=${meal.idMeal}">
                                <h3>${meal.strMeal}</h3>
                                </div>
                        </div>
                                `).join("");
                                 // join() bcoz if you observe them we are mapping them and so they are arrays now we should convert them as strings so using join()method.
                        }
                });

                // clearing the search values 

                search.value='';
        }
        else{
                alert("The Search Box can't be empty");
        }

}

        //fetch meal by id 
        function getMealById(mealID) {
                fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
                  .then(res => res.json())
                  .then(data => {
                    const meal = data.meals[0];

                    addMealToDOM(meal);
                  });
              }

              //fetch random meal by the id

              function randomMeal(){
                        //clear the old meals and headings(if we searched before)

                        mealsEl.innerHTML='';
                        resultHeading.innerHTML='';
                        fetch('https://www.themealdb.com/api/json/v1/1/random.php')
                        .then(res=>res.json())
                        .then(data=>{
                                const meal=data.meals[0];
                                addMealToDOM(meal);
                        })
              }

        //function add meal to the dom
         
        function addMealToDOM(meal){

                //basically we are matching the ingredients and their amount from the fetched API
                const ingredients=[];

                for(let i=1;i<=20;i++){
                        if(meal[`strIngredient${i}`]){
                                ingredients.push(`${meal[`strIngredient${i}`]}-${meal[`strMeasure${i}`]}`);
                        }
                        else{
                                break;
                                //using this bcoz some ingredeints are not present even in the 20 so if there is no data then breaks out of the loop
                        }
                        
                }
                singleMeal.innerHTML=`<div class="singleMeal">
                        <h1>${meal.strMeal}</h1>
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                        <div class="singleMealInfo">
                        ${meal.strCategory? `<p>${meal.strCategory}</p>` : ''}
                        ${meal.strArea? `<p>${meal.strArea}</p>` : ''}
                        </div>
                        <div class="main">
                        <p>${meal.strInstructions}</p>
                        <h2>Ingredients</h2>
                        <ul>
                        ${ingredients.map(ing=>`<li>${ing}</li>`).join("")}
                        </ul>
                        </div>
                </div>`;
        }


     //Event listeners 

     submit.addEventListener("submit",searchMeal);
     random.addEventListener("click",randomMeal);

     mealsEl.addEventListener('click', e => {
        const mealInfo = e.composedPath().find(item => {
          if (item.classList) {
            return item.classList.contains('meal-info');
          } else {
            return false;
          }
        });
      
        if (mealInfo) {
                // console.log(mealInfo.getAttribute("id").split("=")[1]);

                //we are etting the mealid unique number by splitting with the equal to operator.
          const mealID = mealInfo.getAttribute("id").split("=")[1];
          getMealById(mealID);
        }
      });





