import React, { Component } from 'react';
import './InlinePackageUpdate.scss';
import Button from 'react-bootstrap/Button';
import { comms } from '../../helpers/communications';

export default class InlinePackageUpdate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            canSend: false,
            option: "none"
        };
        this.onOptionSelected=this.onOptionSelected.bind(this);
        this.sendClicked=this.sendClicked.bind(this);
    }

    render() {

        var renderedOptions = [];
        renderedOptions.push(
            <option key="0" value="none">--- nieznany ---</option>
        )
        for (var pkey in this.props.packagesList) {
            renderedOptions.push(
                <option key={pkey} value={this.props.packagesList[pkey].hash}>{this.props.packagesList[pkey].title}</option>
            )
        }

        return (
            <div className="InlinePackageUpdate">
                <select onChange={this.onOptionSelected} value={this.state.option}>
                    {renderedOptions}
                </select>
                <Button size="sm" variant="outline-primary" disabled={!this.state.canSend} onClick={this.sendClicked} >zapisz</Button>
            </div>
        )
    }

    onOptionSelected(event) {
        if (event.target.value!=='none') {
            this.setState({option: event.target.value, canSend: true});
        } else if (this.state.canSend) {
            this.setState({canSend: false});
        }
    }

    sendClicked() {
        comms.updateHash(
            this.props.group.pin,
            this.state.option
        ).then(()=>{
            this.props.onHashUpdatedCallback();
        });
    }
}
