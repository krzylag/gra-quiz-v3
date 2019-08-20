import React, { Component } from 'react';
import './ResultsSelectorButton.scss';
import Button from 'react-bootstrap/Button';

export default class ResultsSelectorButton extends Component {

    constructor(props) {
        super(props);
        this.onClicked = this.onClicked.bind(this);
    }

    render() {
        var variant = 'outline-primary';
        if (this.props.isSelected) {
            variant = 'primary';
        }
        
        return (
            <div className="ResultsSelectorButton">
                <Button
                    variant={variant}
                    onClick={this.onClicked}
                >
                    {this.props.option.text}
                </Button>
            </div>
        )
    }

    onClicked() {
        this.props.onButtonClickedCallback(this.props.optionId);
    }
}
