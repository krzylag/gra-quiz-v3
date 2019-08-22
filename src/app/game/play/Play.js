import React, { Component } from 'react';
import './Play.scss';
import PlayHeader from './PlayHeader';
import PlayQuestion from './PlayQuestion';

export default class Play extends Component {

    constructor(props) {
        super(props);
        this.onQuestionAnswerSelected=this.onQuestionAnswerSelected.bind(this);
        console.log(this.props);
    }

    render() {
console.log(this.props.package.questions);
        var correctCount = 0;
        var wrongCount = 0;
        for (var akey in this.props.answers) {
            if (this.props.answers[akey].a) {
                correctCount++;
            } else {
                wrongCount++;
            }
        }

        return (
            <div className="Play">
                <PlayHeader 
                    package={this.props.package}
                    userName={this.props.user.name}
                    max={this.props.package.questions.length}
                    current={this.props.currentQuestionId}
                    correctCount={correctCount}
                    wrongCount={wrongCount}
                />
                <PlayQuestion 
                    package={this.props.package}
                    questionId={this.props.currentQuestionId}
                    answer={this.props.answers[this.props.currentQuestionId]}
                    onQuestionAnswerSelectedCallback={this.onQuestionAnswerSelected}
                    onButtonComponentClickedCallback={this.props.onButtonComponentClickedCallback}
                />
            </div>
        )
    }

    onQuestionAnswerSelected(questionId, answerId) {
        this.props.onReceiveAnswerCallback(questionId, answerId);
    }

}
