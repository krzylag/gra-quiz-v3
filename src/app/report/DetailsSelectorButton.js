import React, { Component } from 'react';
import './DetailsSelectorButton.scss';
import Button from 'react-bootstrap/Button';

export default class DetailsSelectorButton extends Component {

    constructor(props) {
        super(props);
        this.clicked=this.clicked.bind(this);
    }

    render() {

        var componentClasses = 'DetailsSelectorButton';
        var variant = 'primary';
        if (this.props.isSelected) {
            componentClasses += " is-selected";
            variant = 'dark';
        }

        if (this.props.freeButtonsSize) componentClasses += ' free-button-size';
        console.log(this.props);
        return (
            <div className={componentClasses}>
                <Button 
                    variant={variant}
                    onClick={this.clicked}
                >
                    {this.props.text}
                </Button>
            </div>
        )
    }

    clicked() {
        this.props.onSelectedCallback(this.props.id);
    }
}
