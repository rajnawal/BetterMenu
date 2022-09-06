import React from 'react'

function MenuContainer() {
  return (
    <div id={this.props.key} className="menuContainer">
        <h6>
            {this.props.key}
        </h6>
        <table>
            <tr>
                <th>Menu Item</th>
                <th>Protein</th>
                <th>Calories</th>
            </tr>
                      
            {Object.keys(this.props.data[this.props.key]).map(foodOption =>
            (
            <tr key={foodOption}>
                <td>{foodOption}</td>
                <td>{this.props.data[this.props.key][foodOption][0]}</td>
                <td>{this.props.data[this.props.key][foodOption][1]}</td>
            </tr>
            ))}
        </table>
    </div>    
  )
}

export default MenuContainer