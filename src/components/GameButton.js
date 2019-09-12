import React, { Component } from 'react';
import './GameButton.scss';
import Button from 'react-bootstrap/Button';


export default class GameButton extends Component {

    constructor(props) {
        super(props);
        this.onButtonClicked=this.onButtonClicked.bind(this);
    }

    render() {
       
        var componentClasses = "GameButton GameButton-"+this.props.buttonId;
        if (this.props.isGrayedOut) componentClasses += ' is-grayed-out';

        return (
            <div className={componentClasses}>
                <div className="game-button-container">
                    <Button 
                        variant="primary"
                        onClick={this.onButtonClicked}
                    >
                        {this.props.text}
                    </Button>
                </div>
            </div>
        )        
    }

    onButtonClicked() {
        if (!this.props.disabled) {
            if (typeof(this.props.onButtonClicked)==='function') this.props.onButtonClicked(this.props.buttonId);
        } else {
            if (typeof(this.props.onDisabledButtonClicked)==='function') this.props.onDisabledButtonClicked(this.props.buttonId);
        }
    }

}
