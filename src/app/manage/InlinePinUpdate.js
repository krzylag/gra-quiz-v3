import React, { Component } from 'react';
import './InlinePinUpdate.scss';
import Button from 'react-bootstrap/Button';
import { comms } from '../../helpers/communications';
import { parsePin } from '../../helpers/parsers';
import PleaseWait from '../../components/PleaseWait';

export default class InlinePinUpdate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isUnderEdit: false,
            isSending: false,
            pin: this.props.group.pin
        };
        this.clickedOpenEditorToggle=this.clickedOpenEditorToggle.bind(this);
        this.pinInputChange=this.pinInputChange.bind(this);
        this.clickedTrySavePinCandidate=this.clickedTrySavePinCandidate.bind(this);
    }

    render() {

        return (
            <div className="InlinePinUpdate">
                {!this.state.isSending && !this.state.isUnderEdit &&
                    <div className="not-under-edit">
                        {this.props.group.pin}
                        <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={this.clickedOpenEditorToggle}
                        >
                            {this.getEditSvg()}
                        </Button>
                    </div>
                }
                {!this.state.isSending && this.state.isUnderEdit &&
                    <div className="is-under-edit">
                        <input type="text" className="pin-value" placeholder="PIN" value={this.state.pin} onChange={this.pinInputChange} />
                        <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={this.clickedOpenEditorToggle}
                        >
                            {this.getAbortSvg()}
                        </Button>
                        <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={this.clickedTrySavePinCandidate}
                        >
                            {this.getSaveSvg()}
                        </Button>
                    </div>
                }
                {this.state.isSending && 
                    <PleaseWait />
                }
            </div>
        )
    }

    clickedOpenEditorToggle() {
        this.setState({isUnderEdit: !this.state.isUnderEdit});
    }

    pinInputChange(event) {
        this.setState({pin: parsePin(event.target.value)});
    }

    clickedTrySavePinCandidate() {
        if (this.state.pin!=='') {
            if (this.state.pin===this.props.pin) {
                this.setState({isUnderEdit: false});
            } else {
                this.setState({isSending: true}, ()=>{
                    comms.updatePin(
                        this.props.group.pin,
                        this.state.pin
                    ).then(()=>{
                        this.setState({isUnderEdit: false, isSending: false}, ()=>{
                            this.props.onPinUpdatedCallback();
                        });
                    }).catch(()=>{
                        this.setState({isSending: false});
                    });
                });
            }
        }
    }
    


    getEditSvg() {
        return (
            <svg version="1.1" viewBox="0 0 1792 1792">
                <path d="m888 1184 116-116-152-152-116 116v56h96v96h56zm440-720q-16-16-33 1l-350 350q-17 17-1 33t33-1l350-350q17-17 1-33zm80 594v190q0 119-84.5 203.5t-203.5 84.5h-832q-119 0-203.5-84.5t-84.5-203.5v-832q0-119 84.5-203.5t203.5-84.5h832q63 0 117 25 15 7 18 23 3 17-9 29l-49 49q-14 14-32 8-23-6-45-6h-832q-66 0-113 47t-47 113v832q0 66 47 113t113 47h832q66 0 113-47t47-113v-126q0-13 9-22l64-64q15-15 35-7t20 29zm-96-738 288 288-672 672h-288v-288zm444 132-92 92-288-288 92-92q28-28 68-28t68 28l152 152q28 28 28 68t-28 68z"/>
            </svg>
        );
    }

    getSaveSvg() {
        return (
            <svg version="1.1" viewBox="0 0 1792 1792">
                <path d="m1671 566q0 40-28 68l-860 860q-28 28-68 28t-68-28l-498-498q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 295 656-657q28-28 68-28t68 28l136 136q28 28 28 68z"/>
            </svg>
        );
    }

    getAbortSvg() {
        return (
            <svg version="1.1" viewBox="0 0 1792 1792">
                <path d="m1490 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z"/>
            </svg>
        );
    }
}
