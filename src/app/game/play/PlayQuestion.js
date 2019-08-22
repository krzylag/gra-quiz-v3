import React, { Component } from 'react';
import './PlayQuestion.scss';
import PlayQuestionButton from './PlayQuestionButton';

export default class PlayQuestion extends Component {

    constructor(props) {
        super(props);
        this.onAnswerSelected=this.onAnswerSelected.bind(this);
    }

    render() {

        var renderedButtons = [];
        for (var akey in this.props.package.answers) {
            let ans = this.props.package.answers[akey];

            var isGood = false;
            var isBad = false;
            var isSelected = false;
            var shouldReveal = false;
            if (typeof(this.props.answer)!=='undefined' && this.props.answer!==null) {
                shouldReveal=true;
                isGood = (this.props.package.questions[this.props.questionId].answer_id===ans.id)
                isBad = !isGood;
                isSelected = (this.props.answer.aId===ans.id)
            }

            renderedButtons.push(
                <PlayQuestionButton
                    key={ans.id}
                    answer={ans}
                    onAnswerSelectedCallback={this.onAnswerSelected}
                    onComponentClickedCallback={this.props.onButtonComponentClickedCallback}
                    isGood={isGood}
                    isBad={isBad}
                    isSelected={isSelected}
                    shouldReveal={shouldReveal}
                    freeButtonSize={this.props.package.free_buttons_size}
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
