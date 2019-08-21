import React, { Component } from 'react';
import './DetailsSelector.scss';
import DetailsSelectorButton from './DetailsSelectorButton';

export default class DetailsSelector extends Component {

   
    render() {

        var renderedButtons = [];
        for (var akey in this.props.package.json.answers) {
            var answerDef = this.props.package.json.answers[akey];
            var isSelected = (this.props.selected === answerDef.id);
            renderedButtons.push(
                <DetailsSelectorButton
                    key={akey}
                    id={answerDef.id}
                    text={answerDef.text}
                    isSelected={isSelected}
                    onSelectedCallback={this.props.onSelectedCallback}
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
