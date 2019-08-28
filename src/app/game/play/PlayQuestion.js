import React, { Component } from 'react';
import './PlayQuestion.scss';
import PlayQuestionButton from './PlayQuestionButton';

export default class PlayQuestion extends Component {

    constructor(props) {
        super(props);
        this.onAnswerSelected=this.onAnswerSelected.bind(this);
    }

    render() {

        let isAnswered=(typeof(this.props.answer)==='object' && typeof(this.props.answer.a)!=='undefined');

        var renderedButtons = [];
        for (var akey in this.props.package.answers) {
            let ans = this.props.package.answers[akey];

            let isSelected=(isAnswered && this.props.answer.aId===ans.id);
            let isCorrect=(this.props.package.questions[this.props.questionId].answer_id===ans.id);

            renderedButtons.push(
                <PlayQuestionButton
                    key={ans.id}
                    answer={ans}
                    isAnswered={isAnswered}
                    isSelected={isSelected}
                    isCorrect={isCorrect}
                    onAnswerSelectedCallback={this.onAnswerSelected}
                    onComponentClickedCallback={this.props.onButtonComponentClickedCallback}
                />
            );
        }
        
        return (
            <div className="PlayQuestion">
                <div className="PlayQuestionFlex">
                    <div>
                        <h4 className="title">{this.props.package.questions[this.props.questionId].text}</h4>
                    </div>
                    <div className="buttons">
                        {renderedButtons}
                    </div>
                </div>
            </div>
        )
    }

    onAnswerSelected(ansId) {
        this.props.onQuestionAnswerSelectedCallback(this.props.questionId, ansId);
    }
}
