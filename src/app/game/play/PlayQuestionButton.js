import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';

import './PlayQuestionButton.scss';

const VIBRATIONS_TIMEOUT = 1000;

export default class PlayQuestionButton extends Component {

    constructor(props) {
        super(props);
        this.state = {
            should_vibrate: false
        }
        this.onButtonClicked = this.onButtonClicked.bind(this);
        this.onComponentClicked = this.onComponentClicked.bind(this);
        this.vibrationsTimeoutId = null;
    }

    componentDidUpdate(prevProps) {
        if (this.props.shouldReveal!=prevProps.shouldReveal) {
            if (this.props.isGood) {
                this.doVibrations();
            } else {
                this.stopVibrations();
            }
        }
        
    }

    doVibrations() {
        if (!this.state.should_vibrate) {
            this.setState({should_vibrate: true}, ()=>{
                this.vibrationsTimeoutId = setTimeout(()=>{
                    this.stopVibrations();
                }, VIBRATIONS_TIMEOUT);
            });
        }
    }

    stopVibrations() {
        if (this.vibrationsTimeoutId!==null) {
            clearTimeout(this.vibrationsTimeoutId);
            this.vibrationsTimeoutId=null;
        }
        if (this.state.should_vibrate) this.setState({should_vibrate: false});
    }

    componentWillUnmount() {
        this.stopVibrations();
    }
    
    render() {        

        var containerClasses = 'PlayQuestionButton';

        var variantColor = 'primary';
        var variantBorder = null;

        if (this.state.should_vibrate) {
            containerClasses += ' should-vibrate';
        }

        if (!this.props.isSelected && (this.props.isGood || this.props.isBad) ) {
            variantBorder = 'outline';
        }

        if (this.props.isGood) {
            containerClasses += ' is-good';
            variantColor = 'success';
        }
        if (this.props.isBad) {
            containerClasses += ' is-bad';
            variantColor = 'danger';
        }

        if (this.props.isSelected) {
            containerClasses += ' is-selected';
        }

        if (this.props.freeButtonSize) {
            containerClasses += ' free-button-size';
        }
        
        var variant = (variantBorder!==null) ? variantBorder+"-"+variantColor : variantColor;

        return (
            <div className={containerClasses} onClick={this.onComponentClicked}>
                <Button 
                    variant={variant}
                    onClick={this.onButtonClicked} 
                >
                    {this.props.answer.text}
                </Button>
                <div className="feedback-image">
                    {this.props.isSelected && this.props.isGood && this.renderGoodSvg() }
                    {this.props.isSelected && this.props.isBad && this.renderBadSvg() }
                </div>
            </div>
        )
    }

    onButtonClicked() {
        var isEnabled = (!this.props.isGood && !this.props.isBad && !this.props.isSelected);
        if (isEnabled) this.props.onAnswerSelectedCallback(this.props.answer.id);
    }

    onComponentClicked() {
        if (this.props.isGood || this.props.isBad) {
            this.props.onComponentClickedCallback();
        }
    }

    renderGoodSvg() {
        return (
            <svg version="1.1" viewBox="0 0 1792 1792">
                <path className="is-correct-image" d="m1671 566q0 40-28 68l-860 860q-28 28-68 28t-68-28l-498-498q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 295 656-657q28-28 68-28t68 28l136 136q28 28 28 68z" fill="#008000"/>
            </svg>
        );
    }

    renderBadSvg() {
        return (
            <svg version="1.1" viewBox="0 0 1792 1792">
                <path className="is-wrong-image" d="m1490 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z" fill="#f00"/>
            </svg>
        );
    }
}
