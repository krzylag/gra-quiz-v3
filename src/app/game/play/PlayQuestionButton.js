import React, { Component } from 'react';
import './PlayQuestionButton.scss';
import GameButton from '../../../components/GameButton';

const VIBRATIONS_TIMEOUT = 1000;

export default class PlayQuestionButton extends Component {

    constructor(props) {
        super(props);
        this.state = {
            should_vibrate: false,
            should_pulse: false,
        }
        this.onButtonClicked = this.onButtonClicked.bind(this);
        this.onComponentClicked = this.onComponentClicked.bind(this);
        this.vibrationsTimeoutId = null;
        this.pulseTimeoutId = null;
    }

    componentDidUpdate(prevProps) {
        if (this.props.isAnswered===true && prevProps.isAnswered===false) {
            if (this.props.isCorrect) {
                if (this.props.isSelected) {
                    this.doPulse();
                    this.stopVibrations();
                } else {
                    this.stopPulsing();
                    this.doVibrations();
                }
            }
        } else if (this.props.isAnswered===false && prevProps.isAnswered===true) {
            this.stopVibrations();
            this.stopPulsing();
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

    doPulse() {
        if (!this.state.should_pulse) {
            this.setState({should_pulse: true}, ()=>{
                this.pulseTimeoutId = setTimeout(()=>{
                    this.stopPulsing();
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

    stopPulsing() {
        if (this.pulseTimeoutId!==null) {
            clearTimeout(this.pulseTimeoutId);
            this.pulseTimeoutId=null;
        }
        if (this.state.should_pulse) this.setState({should_pulse: false});
    }

    componentWillUnmount() {
        this.stopVibrations();
        this.stopPulsing();
    }
    
    render() {        

        var containerClasses = 'PlayQuestionButton';

        if (this.state.should_vibrate) {
            containerClasses += ' should-vibrate';
        }
        if (this.state.should_pulse) {
            containerClasses += ' should-pulse';
        }

        if (this.props.isCorrect) {
            containerClasses += ' is-correct';
        } else {
            containerClasses += ' is-incorrect';
        }

        if (this.props.isSelected) {
            containerClasses += ' is-selected';
        }

        if (this.props.isAnswered) {
            containerClasses += ' is-answered';
        } else {
            containerClasses += ' is-unanswered';
        }

        var isGrayedOut;
        var isDisabled;
        if (this.props.isAnswered) {
            isDisabled = true;
            if (this.props.isCorrect) {
                isGrayedOut = false;
            } else {
                isGrayedOut = true;
            }
        } else {
            isDisabled = false;
            isGrayedOut = false;
        }

        return (
            <div className={containerClasses} onClick={this.onComponentClicked}>
                <GameButton
                    buttonId={this.props.answer.id}
                    text={this.props.answer.text}
                    disabled={isDisabled}
                    isGrayedOut={isGrayedOut}
                    onButtonClicked={this.onButtonClicked}
                    onDisabledButtonClicked={this.props.onComponentClicked}
                />
                <div className="feedback-image feedback-image-good">
                    {this.renderGoodSvg()}
                </div>
                <div className="feedback-image feedback-image-bad">
                    {this.renderBadSvg()}
                </div>
                <div className="feedback-image feedback-image-reservation" />
            </div>
        )
    }

    onButtonClicked(answerId) {
        if (!this.props.isAnswered) {
            this.props.onAnswerSelectedCallback(answerId);
        }
    }

    onComponentClicked() {
        if (this.props.isAnswered) {
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
