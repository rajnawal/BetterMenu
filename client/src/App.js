import React, {useState} from 'react';
import NutriSlider from './NutriSlider';
import AllergyButton from './AllergyButton';
import "./App.css"
import {
  extendTheme,
  ChakraProvider
} from '@chakra-ui/react'

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const theme = extendTheme({ config })

const restaurants = {
  "64 Degrees" : 64,
  "Cafe Ventanas" : 18,
  "Canyon Vista" : 24,
  "Club Med" : 15,
  "Foodworx" : 11,
  "OceanView" : '05',
  "Pines" : '01',
  "Sixth College" : 37,
  "The Bistro" : 27,
  "Roots" : 32
}

const allergens = {
  "Dairy" : "https://hdh-web.ucsd.edu/images/Dining/allergenicons/ContainsDairy_40x40.png",
  "Tree Nuts" : "https://hdh-web.ucsd.edu/images/Dining/allergenicons/ContainsTreeNuts_40x40.png", 
  "Soy" : "https://hdh-web.ucsd.edu/images/Dining/allergenicons/ContainsSoy_40x40.png", 
  "Wheat" : "https://hdh-web.ucsd.edu/images/Dining/allergenicons/ContainsWheat_40x40.png", 
  "Fish" : "https://hdh-web.ucsd.edu/images/Dining/allergenicons/ContainsFish_40x40.png", 
  "Shellfish" : "https://hdh-web.ucsd.edu/images/Dining/allergenicons/ContainsShellfish_40x40.png", 
  "Peanuts" : "https://hdh-web.ucsd.edu/images/Dining/allergenicons/ContainsPeanuts_40x40.png", 
  "Eggs" : "https://hdh-web.ucsd.edu/images/Dining/allergenicons/ContainsEggs_40x40.png", 
  "Gluten" : "https://hdh-web.ucsd.edu/images/Dining/allergenicons/ContainsGluten_40x40.png",
  "Sesame" : "https://hdh-web.ucsd.edu/images/Dining/allergenicons/ContainsSesame_40x40.png"
}

let handleRestaurantEdit = (passedId, restaurantsToConsider, setRestaurantsToConsider) =>{
  const clickedCheckbox = document.getElementById(passedId)
  
  if (passedId === "selectAll") {
    if (clickedCheckbox.checked) {
      setRestaurantsToConsider({...restaurants})
    }
    else{ 
      setRestaurantsToConsider({})
    }
    let checkboxes = document.querySelectorAll('input[type="checkbox"]');
    for (const element of checkboxes) {
        if (element !== clickedCheckbox)
            element.checked = clickedCheckbox.checked;
    }
  }
  else{
    const temp = {...restaurantsToConsider}
    if (clickedCheckbox.checked) {
      temp[passedId] = restaurants[passedId]
    }
    else{
      delete temp[passedId]
    }
    setRestaurantsToConsider(temp)
  }
}

let handleClick = (allergen, allergensToAvoid, setAllergensToAvoid) => {
  const tempSet = new Set([...allergensToAvoid])

  tempSet.has(allergen)
  ? tempSet.delete(allergen)
  : tempSet.add(allergen)
  setAllergensToAvoid(tempSet)
}

const buildUrls = (
  restaurantsToConsider,
  allergensToAvoid,
  dietaryRestrictions,
  calories,
  protein,
  ingredientsToAvoid
  ) =>{

  allergensToAvoid = allergensToAvoid.size === 0 ? "noAllergensToAvoid" : [...allergensToAvoid]
  dietaryRestrictions = dietaryRestrictions.size === 0 ? "noDietToFollow" : [...dietaryRestrictions]
  ingredientsToAvoid = ingredientsToAvoid || "noIngredientsToAvoid"
    
  let result = {}
  
  for (const restaurant of Object.keys(restaurantsToConsider)) {
    result[restaurant] = 
      "?num=" + restaurants[restaurant]
      + "&allergens=" + allergensToAvoid
      + "&dietary=" + dietaryRestrictions
      + "&calories=" + calories
      + "&protein=" + protein
      + "&ingredients=" + ingredientsToAvoid.split(",").map(element => element.trim()).join()
    
  }
  return result
}

let resultRecorder = {}
let count = 0

let handleSubmit = (a,b,c,d,e,f,setData, setQueryBeingProcessed) =>{
  setQueryBeingProcessed([true, false])
  resultRecorder = {}
  count = 0
  const urls = buildUrls(a,b,c,d,e,f)

  const requestOptions = {
    method: 'GET'
  };
  const keyNames = Object.keys(urls)
  for (const r of keyNames) {
    fetch("https://bettermenuapi.onrender.com/getItems" + urls[r], requestOptions).then(
      res => res.json()
    ).then(
      da => {
        resultRecorder[r] = da
        setData(resultRecorder)
        setQueryBeingProcessed([true, false])
      }
    ).then(      
      () => {
        count++
        if(count === keyNames.length) {
          setQueryBeingProcessed([false, true])
        }
      }
    )
  }
}

export default function App(){

  const [data, setData] = useState([{}])
  const [allergensToAvoid, setAllergensToAvoid] = useState(new Set([]))
  const [restaurantsToConsider, setRestaurantsToConsider] = useState({})
  const [dietaryRestrictions, setDietaryRestrictions] = useState(new Set([]))
  const [calories, setCalories] = useState([150,1850])
  const [protein, setProtein] = useState([0,100])
  const [ingredientsToAvoid, setIngredientsToAvoid] = useState("")
  const [queryBeingProcessed, setQueryBeingProcessed] = useState([false, false])

  const handleSavePreferences = (branchControl) =>{
    if(branchControl === "save"){
      try{
        localStorage.setItem("savedPreferences",
          JSON.stringify(
          { "allergensToAvoid" : [...allergensToAvoid],
            "restaurantsToConsider" : restaurantsToConsider,
            "dietaryRestrictions" : [...dietaryRestrictions],
            "calories" : calories,
            "protein" : protein,
            "ingredientsToAvoid" : ingredientsToAvoid
          }
          )
        )
        var x = document.getElementById("snackbar");
        x.className = "show";
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2990);
      }
      catch(e){
        alert("Failed to save")
      }
    }
    else{
      const savedData = JSON.parse(localStorage.getItem("savedPreferences"))
      setAllergensToAvoid(new Set(savedData["allergensToAvoid"]))
      setCalories(savedData["calories"])
      setDietaryRestrictions(new Set(savedData["dietaryRestrictions"]))
      setIngredientsToAvoid(savedData["ingredientsToAvoid"])
      setProtein(savedData["protein"])
      setRestaurantsToConsider(savedData["restaurantsToConsider"])
    }
  }

  const getClassName = () =>{
    let result = "saveButton "
    result += localStorage.getItem("savedPreferences") === null ? "hidden" : ""
    return result
  }

    return(
      <ChakraProvider theme={theme}>
        <section>
        <button onClick={() => handleSavePreferences("load")} className={getClassName()}>
           Load Saved Preferences
        </button>
          <h4>
              Allergens to Avoid:
          </h4>
            {Object.keys(allergens).map(allergy => (
            <AllergyButton
              id = {allergy}
              imgUrl = {allergens[allergy]}
              onClick = {() => handleClick(allergy, allergensToAvoid, setAllergensToAvoid)}
              key={allergy}
              sourceOfTruth={allergensToAvoid}
              />
            ))}
        </section>
        <section>
            <h4>
              Dietary Restrictions
              <sup>
                <a href='https://hdh-web.ucsd.edu/dining/apps/diningservices/Data/WellnessMarketing.pdf' target={'_blank'}>
                  ℹ️
                </a>
              </sup> 
              :
            </h4>
            <AllergyButton
              id = "Vegetarian"
              imgUrl = "https://hdh-web.ucsd.edu/images/Dining/allergenicons/Vegetarian_40x40.png"
              onClick = {() => handleClick("Vegetarian", dietaryRestrictions, setDietaryRestrictions)}
              sourceOfTruth = {dietaryRestrictions}
              />
              <AllergyButton
              id = "Vegan"
              imgUrl = "https://hdh-web.ucsd.edu/images/Dining/allergenicons/Vegan_40x40.png"
              onClick = {() => handleClick("Vegan", dietaryRestrictions, setDietaryRestrictions)}
              sourceOfTruth={dietaryRestrictions}
              />
        </section>
        <p style={{textAlign : 'left', width : '100%', display: dietaryRestrictions.has("Vegetarian") ? "block" : "none", fontSize: "12px"}}>
          Click Vegan if you want to view Vegan results as well
        </p>
              
        <section>
          <h4> Show results from:</h4>
            {Object.keys(restaurants).map(restaurant => (
              <div className='checkboxContainer'>
                  <input
                  type= 'checkbox'
                  id = {restaurant}
                  onChange = {() => handleRestaurantEdit(restaurant, restaurantsToConsider, setRestaurantsToConsider)}
                  className = 'restaurantCheckbox'
                  checked={(new Set(Object.keys(restaurantsToConsider))).has(restaurant) ? true : false}
                />
                <label htmlFor={restaurant}>
                  {restaurant}
                </label>
              </div>
            ))}
            <div className='checkboxContainer'>
              <input
                type='checkbox'
                id = 'selectAll'
                onChange = {() => handleRestaurantEdit('selectAll', restaurantsToConsider, setRestaurantsToConsider)}
                className = 'restaurantCheckbox'
                checked={Object.keys(restaurantsToConsider).length === 10 ? true : false}
              />
              <label htmlFor='selectAll'>
                Select/Unselect All
              </label>
            </div>
        </section>

        <section>
          <h4> Nutrition: </h4>
            <NutriSlider
              minMax = {[0, 2000]}
              label='Calories: '
              color = {['teal.100','green.300']}
              onChange = {setCalories}
              key = "calories"
              values = {calories}
            />
            <NutriSlider
              minMax = {[0, 100]}
              label='Protein(g): '
              color = {['red.200','red.400']}
              onChange = {setProtein}
              key="protein"
              values = {protein}
            />
        </section>

        <section className='textareaContainer'>
            <h4>Ingredients to Avoid(apart from allergens):</h4>
            <textarea 
              placeholder='Gelatin, corn, etc. Separate by comma' 
              rows={'2'}
              value={ingredientsToAvoid}
              onChange = {(event) => setIngredientsToAvoid(event.target.value)}
            />
            <input
                disabled={
                  Object.keys(restaurantsToConsider).length < 1 || queryBeingProcessed[0] ? "a" : ""}
                type={'submit'}
                onClick = {() => handleSubmit(
                  restaurantsToConsider,
                  allergensToAvoid,
                  dietaryRestrictions,
                  calories,
                  protein,
                  ingredientsToAvoid,
                  setData,
                  setQueryBeingProcessed
                  )
                }
                value='Submit'
            />
        </section>
        <button onClick={() => handleSavePreferences("save")} className="saveButton">
          Save Preferences
        </button>
        <div id='snackbar'>
           <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-circle-check" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#000000" fill="none" strokeLinecap="round" strokeLinejoin="round">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
								<circle cx="12" cy="12" r="9" />
								<path d="M9 12l2 2l4 -4" />
							</svg>
          <span>
            Preferences saved successfully!
          </span>
        </div>
        <section className='results'>
                { [...Object.keys(data)].filter(val => val !== "0").length > 0 || queryBeingProcessed[1]
                ? 
                  Object.keys(data).map(resultingRestaurant =>(
                    <div key={resultingRestaurant} className="menuContainer">
                      <h6>
                        {resultingRestaurant}
                      </h6>
                      {Object.keys(data[resultingRestaurant]).length > 0 ? 
                        <table>
                            <thead>
                              <tr>
                                <th>Menu Item</th>
                                <th>Protein</th>
                                <th>Calories</th>
                              </tr>
                            </thead>
                            <tbody>
                          {Object.keys(data[resultingRestaurant]).map(foodOption =>
                            (
                              <tr key={foodOption}>
                                <td>{foodOption}</td>
                                <td>{data[resultingRestaurant][foodOption][0]}</td>
                                <td>{data[resultingRestaurant][foodOption][1]}</td>
                              </tr>
                            ))}
                            </tbody>
                        </table>
                        : <h5>No results to show </h5>
                      }
                    </div>
                  ))
                : <></>
                }
        </section>
        {
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent) 
          && (!window.navigator.standalone || !window.matchMedia('(display-mode: standalone)').matches)
            ? <>
            <h5>Add to homescreen:
              <span>
              <a href='https://www.howtogeek.com/wp-content/uploads/2020/04/add_to_home_screen_iphone.png?trim=1,1&bg-color=000&pad=1,1' target="_blank">
                iOS 
              </a>
               <span>|</span> 
              <a href='https://lifehacker.com/how-to-add-a-website-shortcut-to-your-android-home-scre-1849125415' target="_blank">
                Android
              </a>
              </span>
            </h5>
            </>
            : <></>
        }
        <div style={{display : queryBeingProcessed[0] ? "inline-block" : "none" }}  className="loader"/>
      </ChakraProvider>
    );
    }


// export default App