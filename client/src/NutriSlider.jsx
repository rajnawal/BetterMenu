import React, { Component } from 'react'
import {
    RangeSlider,
    RangeSliderTrack,
    RangeSliderFilledTrack,
    RangeSliderThumb
  } from '@chakra-ui/react'

export class NutriSlider extends Component {
constructor(){
    super();
}

  render() {
    return (
      <div className='rangeSliderWrapper'>
        <span className='label'>
            {this.props.label} 
          </span>
        <RangeSlider 
        aria-label={['min', 'max']} 
        min = {this.props.minMax[0]}
        max = {this.props.minMax[1]}
        defaultValue={this.props.values}
        onChange = {(v) => this.props.onChange(v)}
        value={this.props.values}
        >
        <RangeSliderTrack bg={this.props.color[0]}>
            <RangeSliderFilledTrack bg={this.props.color[1]} />
        </RangeSliderTrack>
        <RangeSliderThumb boxSize={6} index={0}>
            <span className='thumb'>
                {this.props.values[0] === undefined ?
                this.props.minMax[0]
                : this.props.values[0]}
            </span>
        </RangeSliderThumb>
        <RangeSliderThumb boxSize={6} index={1}>
            <span className='thumb'>
                {this.props.values[1] === undefined ?
                this.props.minMax[1] 
                : this.props.values[1]}
            </span>
        </RangeSliderThumb>
        </RangeSlider>
      </div>
    )
  }
}

export default NutriSlider