import React, { Component } from 'react';
import './ResultsDetails.scss';

export default class ResultsDetails extends Component {

    render() {
        var renderedQuestions = [];
        for (var akey in this.props.package.questions) {
            var question = this.props.package.questions[akey];
            if (question.answer_id===this.props.selectedAnswerId) {
                var answerClasses= 'answer';
                if (this.props.answers[akey].a) {
                    answerClasses += ' is-good';
                } else {
                    answerClasses += ' is-bad';
                }
                renderedQuestions.push(
                    <li 
                        key={akey}
                        className={answerClasses}
                    >
                        {question.text}
                    </li>
                )
            }
        }
        
        return (
            <ul className="ResultsDetails">
                {renderedQuestions}
            </ul>
        )
    }

}
