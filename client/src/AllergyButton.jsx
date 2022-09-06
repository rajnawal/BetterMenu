import React, { Component } from 'react'

class AllergyButton extends Component{
    render() {
    return (
            <button className={this.handleClassname()} onClick={this.props.onClick} id = {this.props.id}>
                <img src={this.props.imgUrl} />
                <span> {this.props.id} </span>
            </button>
    );
    }
    handleClassname(){
        let result = "allergyButton"
        try{result += this.props.sourceOfTruth.has(this.props.id) ? " selected" : ""}
        catch(error){result+=""}
        return result
    }
}


export default AllergyButton;