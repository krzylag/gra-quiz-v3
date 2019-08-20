import React, { Component } from 'react';
import './Results.scss';
import ResultsSelector from './ResultsSelector';
import ResultsDetails from './ResultsDetails';

export default class Results extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selected_answer_id: null,
            showCheckRequest: true
        };
        this.onSelectorButtonClicked=this.onSelectorButtonClicked.bind(this);
    }

    render() {
        var correctCount = 0;
        for (var akey in this.props.answers) {
            if (this.props.answers[akey].a) correctCount++;
        }

        return (
            <div className="Results">
                <div className="user-name">{this.props.user.name}</div>
                <div className="screen-title">{this.props.package.translations.results_screen.screen_title}</div>
                <div className="result-summary">{correctCount} / {this.props.answers.length}</div>
                {this.state.showCheckRequest && 
                    <div className="call-to-action">{this.props.package.translations.results_screen.check_request}</div>
                }
                <ResultsSelector 
                    options={this.props.package.answers}
                    selectedOptionId={this.state.selected_answer_id}
                    onSelectorButtonClickedCallback={this.onSelectorButtonClicked}
                />
                {this.state.selected_answer_id!==null && 
                    <ResultsDetails 
                        selectedAnswerId={this.state.selected_answer_id}
                        answers={this.props.answers}
                        package={this.props.package}
                    />
                }
            </div>
        )
    }

    onSelectorButtonClicked(optionId) {
        this.setState({selected_answer_id: optionId});
    }

}
