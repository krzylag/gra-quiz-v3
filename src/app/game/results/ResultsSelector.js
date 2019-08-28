import React, { Component } from 'react';
import './ResultsSelector.scss';
import GameButton from '../../../components/GameButton';

export default class ResultsSelector extends Component {

    render() {
        
        var renderedButtons = [];
        for (var okey in this.props.options) {
            var buttonId = parseInt(okey);
            console.log(this.props.selectedOptionId);
            var isGrayedOut = (this.props.selectedOptionId!==null && this.props.selectedOptionId!==buttonId);
            renderedButtons.push(
                <GameButton 
                    key={okey}
                    buttonId={buttonId}
                    text={this.props.options[okey].text}
                    isGrayedOut={isGrayedOut}
                    onButtonClicked={this.props.onSelectorButtonClickedCallback}
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
