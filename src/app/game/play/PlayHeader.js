import React, { Component } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';

import './PlayHeader.scss';

export default class PlayHeader extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        
        return (
            <div className="PlayHeader">
                <div className="username">{this.props.userName}</div>
                <div className="statistics">
                    <div className="pbar">
                        <div className="number">0</div>
                        <ProgressBar
                            min={0}
                            max={this.props.max}
                            now={this.props.current}
                        />
                        <div className="number">{this.props.max}</div>
                    </div>
                    <div className="partialcount">{this.props.package.translations.game_screen.correct_count}: {this.props.correctCount}</div>
                    <div className="partialcount">{this.props.package.translations.game_screen.wrong_count}: {this.props.wrongCount}</div>
                </div>
            </div>
        )
    }


}
