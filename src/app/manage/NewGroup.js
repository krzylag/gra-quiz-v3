import React, { Component } from 'react';
import './NewGroup.scss';
import Button from 'react-bootstrap/Button';
import PleaseWait from '../../components/PleaseWait';
import Axios from 'axios';
import { SERVER_URL } from '../../index';

export default class NewGroup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isCreating: false,
            isPosting: false,
            groupName: '',
            packageHash: ''
        };
        this.visToggleClicked=this.visToggleClicked.bind(this);
        this.saveClicked=this.saveClicked.bind(this);
        this.nameChange=this.nameChange.bind(this);
        this.packageChange=this.packageChange.bind(this);
    }

    render() {
        if (this.state.isPosting) {
            return (
                <PleaseWait />
            );
        }
        else if (this.state.isCreating) {

            var renderedOptions = [];
            renderedOptions.push(
                <option key="0" value=""></option>
            )
            for (var okey in this.props.packagesList) {
                renderedOptions.push(
                    <option key={okey} value={this.props.packagesList[okey].hash}>{this.props.packagesList[okey].title}</option>
                )
            }
            return (
                <div className="NewGroup">
                    <table className="table table-sm table-borderless">
                        <tbody>
                            <tr>
                                <td className="descr">nazwa:</td>
                                <td className="value"><input type="text" value={this.state.groupName} onChange={this.nameChange} /></td>
                            </tr>
                            <tr>
                                <td className="descr">pakiet:</td>
                                <td className="value"><select value={this.state.packageHash} onChange={this.packageChange} >{renderedOptions}</select></td>
                            </tr>
                            <tr>
                                <td className="descr"></td>
                                <td className="descr">
                                    <Button variant="primary" onClick={this.saveClicked}>Utwórz</Button>
                                    <Button variant="outline-danger" onClick={this.visToggleClicked}>Anuluj</Button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )
        } else {
            return (
                <div className="NewGroup">
                    <Button onClick={this.visToggleClicked}>+</Button>
                </div>
            )
        }

        
    }

    nameChange(ev) {
        this.setState({groupName: ev.target.value});
    }

    packageChange(ev) {
        this.setState({packageHash: ev.target.value});
    }

    saveClicked() {
        if (this.state.groupName.trim()!=='' && this.state.packageHash!=='') {
            this.setState({isPosting: true}, ()=>{
                Axios.post(SERVER_URL, {
                    action: 'create-group',
                    name: this.state.groupName.trim(),
                    package: this.state.packageHash
                }).then((response)=>{
                    console.log(response.data);
                    if (response.data.result) {
                        this.setState({isCreating: false, isPosting: false}, ()=>{
                            this.props.onGroupsListUpdateCallback(response.data.groups);
                        });
                    } else {
                        this.setState({isPosting: false});
                    }
                }).catch((error)=>{
                    console.error(error.data);
                    this.setState({isPosting: false});
                })
            });
        }
    }

    visToggleClicked() {
        this.setState({isCreating: !this.state.isCreating});
    }
}
