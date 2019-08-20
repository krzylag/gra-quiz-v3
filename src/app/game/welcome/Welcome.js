import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';

import './Welcome.scss';

export default class Welcome extends Component {

    constructor(props) {
        super(props);
        this.onStartClicked=this.onStartClicked.bind(this);
    }

    render() {
        return (
            <div className="Welcome">
                <div className="textcloud">
                    <div className="text" dangerouslySetInnerHTML={{__html: this.props.package.translations.welcome_screen.welcome_text}} />
                </div>
                <div className="buttons">
                    <Button variant="outline-secondary" size="lg" onClick={this.onStartClicked}>{this.props.package.translations.welcome_screen.start_button}</Button>
                </div>
            </div>
        )
    }


    onStartClicked() {
        this.props.onClickedSeenWelcomeCallback(true);
    }

}
