import React, { Component } from 'react'
import AllergyButton from './AllergyButton.jsx';
import "./App.css"
import {
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  ChakraProvider,
} from '@chakra-ui/react'

class MainContent extends Component {
    state = {
        allergensToAvoid : new Set([]),
        restaurantsToConsider : new Set([])
     }
     allergens = {
       "Dairy" : "https://hdh-web.ucsd.edu/images/Dining/allergenicons/ContainsDairy_40x40.png",
       "Tree Nuts" : "https://hdh-web.ucsd.edu/images/Dining/allergenicons/ContainsTreeNuts_40x40.png", 
       "Soy" : "https://hdh-web.ucsd.edu/images/Dining/allergenicons/ContainsSoy_40x40.png", 
       "Wheat" : "https://hdh-web.ucsd.edu/images/Dining/allergenicons/ContainsWheat_40x40.png", 
       "Fish" : "https://hdh-web.ucsd.edu/images/Dining/allergenicons/ContainsFish_40x40.png", 
       "Shell Fish" : "https://hdh-web.ucsd.edu/images/Dining/allergenicons/ContainsShellfish_40x40.png", 
       "Peanuts" : "https://hdh-web.ucsd.edu/images/Dining/allergenicons/ContainsPeanuts_40x40.png", 
       "Eggs" : "https://hdh-web.ucsd.edu/images/Dining/allergenicons/ContainsEggs_40x40.png", 
       "Gluten" : "https://hdh-web.ucsd.edu/images/Dining/allergenicons/ContainsGluten_40x40.png"
     }
     restaurants = {
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
   
     handleClick = (event) => {
       event.preventDefault()
       let pressedButton = document.getElementById(event.currentTarget.id) 
       pressedButton.className = pressedButton.className === "allergyButton" ? "allergyButton selected" : "allergyButton"
   
       let trash = this.state.allergensToAvoid.has(event.currentTarget.id)
       ? this.state.allergensToAvoid.delete(event.currentTarget.id)
       : this.state.allergensToAvoid.add(event.currentTarget.id)
       this.setState
         (
           {
           allergensToAvoid : this.state.allergensToAvoid
           }
         )
     }
   
     handleRestaurantEdit = (event) =>{
       const clickedCheckbox = event.currentTarget
   
       if (clickedCheckbox.id === "selectAll") {
         if (clickedCheckbox.checked) {
           this.setState({
             restaurantsToConsider : new Set(Object.values(this.restaurants))
           })
         }
         else{ 
           this.setState({
           restaurantsToConsider : new Set([])
           })
         }
         let checkboxes = document.querySelectorAll('input[type="checkbox"]');
         for (const element of checkboxes) {
             if (element !== clickedCheckbox)
                 element.checked = clickedCheckbox.checked;
         }
       }
       else{
         if (clickedCheckbox.checked) {
           this.state.restaurantsToConsider.add(this.restaurants[clickedCheckbox.id])
           this.setState({
             restaurantsToConsider : this.state.restaurantsToConsider
           })
         }
         else{
           this.state.restaurantsToConsider.delete(this.restaurants[clickedCheckbox.id])
           this.setState({
             restaurantsToConsider : this.state.restaurantsToConsider
           })
         }
       }
     }

  render(){
    return (
    <div>
            <h2>
            Allergens to Avoid:
            </h2>
            {Object.keys(this.allergens).map(allergy => (
                <AllergyButton
                id = {allergy}
                imgUrl = {this.allergens[allergy]}
                onClick = {this.handleClick}
                />
                ))}

            <h4> Show results from:</h4>
            {Object.keys(this.restaurants).map(restaurant => (
                <div>
                    <input
                    type= 'checkbox'
                    id = {restaurant}
                    onClick = {this.handleRestaurantEdit}
                    className = 'restaurantCheckbox'
                    />
                    <label htmlFor={restaurant}>
                    {restaurant}
                    </label>
                    </div>
                    ))}
                    <div>
                    <input
                    type='checkbox'
                    id = 'selectAll'
                    onClick = {this.handleRestaurantEdit}
                    className = 'restaurantCheckbox'
                    />
                    <label htmlFor='selectAll'>
                    Select/Unselect All
                    </label>
                </div>

            <h4> Nutrition: </h4>
            <div className='range'>
                <RangeSlider
                aria-label={['min', 'max']}
                onChangeEnd={(val) => console.log(val)}
                defaultValue={[0, 100]}
                >
                <RangeSliderTrack>
                    <RangeSliderFilledTrack />
                </RangeSliderTrack>
                <RangeSliderThumb index={0} />
                <RangeSliderThumb index={1} />
                </RangeSlider>
            </div>

            <h4>Ingredients to Avoid:</h4>
            <textarea/>
            <input
                type={'submit'}
                onSubmit = {this.props.onSubmit}
            />
    </div>
  )
}
}

export default MainContent