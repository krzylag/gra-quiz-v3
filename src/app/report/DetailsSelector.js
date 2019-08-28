import React, { Component } from 'react';
import './DetailsSelector.scss';
import GameButton from '../../components/GameButton';

export default class DetailsSelector extends Component {

   
    render() {

        var renderedButtons = [];
        for (var akey in this.props.package.json.answers) {
            var answerDef = this.props.package.json.answers[akey];
            var isColoured = (this.props.selected===null || this.props.selected === answerDef.id);
           
            renderedButtons.push(
                <GameButton
                    key={answerDef.id}
                    buttonId={answerDef.id}
                    text={answerDef.text}
                    isGrayedOut={!isColoured}
                    onButtonClicked={this.props.onSelectedCallback}
                />
            )
        }
        
        return (
            <div className="DetailsSelector">
                {renderedButtons}
            </div>
        )
    }

}
