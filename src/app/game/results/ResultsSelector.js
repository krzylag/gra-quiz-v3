import React, { Component } from 'react';
import './ResultsSelector.scss';
import ResultsSelectorButton from './ResultsSelectorButton';

export default class ResultsSelector extends Component {

    render() {
        
        var renderedButtons = [];
        for (var okey in this.props.options) {
            var buttonId = parseInt(okey);
            renderedButtons.push(
                <ResultsSelectorButton 
                    key={okey}
                    optionId={buttonId}
                    option={this.props.options[okey]}
                    isSelected={this.props.selectedOptionId===buttonId}
                    onButtonClickedCallback={this.props.onSelectorButtonClickedCallback}
                />
            )
        }

        return (
            <div className="ResultsSelector">
                {renderedButtons}
            </div>
        )
    }

}
