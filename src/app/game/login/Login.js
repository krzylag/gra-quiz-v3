import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';

import { parsePin } from '../../../helpers/parsers';
import { SERVER_URL } from '../../../index';

import './Login.scss';
import Axios from 'axios';

const ERROR_MESSAGE_TIMEOUT = 1500;

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            strings: {
                "game_title": "",
                "pin_request": "Wpisz numer PIN<br />podany przez prowadzacego ćwiczenie.",
                "pin_placeholder": "PIN",
                "name_request": "Wpisz swoje imię",
                "name_placeholder": "imię",
                "start_button": "start"
            },
            tryPin: '',
            tryName: '',
            isButtonDisabled: true,
            isFormDisabled: false,
            showErrorMessage: false
        };
        this.onPinChange=this.onPinChange.bind(this);
        this.onNameChange=this.onNameChange.bind(this);
        this.onStartClicked=this.onStartClicked.bind(this);
        this.errorMessageTimeoutId=null;
    }

    render() {
        return (
            <div className="Login">
                <div className="area">
                    <h3 className="text-dark font-weight-bold">{this.state.strings.game_title}</h3>
                </div>
                {this.props.preselectedPin===null && 
                    <div className="area">
                        <h4 className="text-primary font-weight-bold" dangerouslySetInnerHTML={{__html: this.state.strings.pin_request}} />
                        <input type="text" value={this.state.tryPin} onChange={this.onPinChange} placeholder={this.state.strings.pin_placeholder} disabled={this.state.isFormDisabled} />
                    </div>
                }
                <div className="area">
                    <h4 className="text-primary font-weight-bold">{this.state.strings.name_request}</h4>
                    <input type="text" value={this.state.tryName} onChange={this.onNameChange} placeholder={this.state.strings.name_placeholder} disabled={this.state.isFormDisabled} />
                </div>
                <div className="area">
                    <Button variant="outline-secondary" onClick={this.onStartClicked} size="lg" disabled={this.state.isFormDisabled && this.state.isButtonDisabled}>
                        {this.state.strings.start_button}
                    </Button>
                    {this.state.showErrorMessage && 
                        <div className="user-exists-alert">Gracz istnieje. Użyj innej nazwy.</div>
                    }
                </div>
            </div>
        )
    }

    onPinChange(ev) {
        this.setState({tryPin: parsePin(ev.target.value)}, ()=>{
            this.validateForm();
        });
    }

    onNameChange(ev) {
        this.setState({tryName: ev.target.value}, ()=>{
            this.validateForm();
        });
    }

    onStartClicked() {
        this.hideErrorMessage();
        this.setState({isFormDisabled: true}, ()=>{
            Axios.post(SERVER_URL, {
                action: 'validate-new-login',
                pin: (this.props.preselectedPin===null) ? this.state.tryPin : this.props.preselectedPin,
                name: this.state.tryName.trim()
            }).then((response)=>{
                if (response.data.result) {
                    this.props.onSuccessfullLoginCallback(
                        response.data.package, 
                        response.data.package_css,
                        response.data.user_name,
                        response.data.user_id
                    )
                } else if (!response.data.result && response.data.reason==='user-exists') {
                    this.setState({isFormDisabled: false, showErrorMessage: true}, ()=>{
                        this.errorMessageTimeoutId = setTimeout(() => {
                            this.hideErrorMessage();
                        }, ERROR_MESSAGE_TIMEOUT);
                    });
                } else {
                    console.log(response.data);
                    this.setState({isFormDisabled: false});
                }
            }).catch((error)=>{
                console.error(error.data);
                this.setState({isFormDisabled: false});
            });
        })
        
    }

    validateForm() {
        let isValidPin = (this.props.preselectedPin!==null || (this.state.tryPin!==null && this.state.tryPin!==''));
        let isValidName = (this.state.tryName!==null && this.state.tryName.trim()!=='');
        this.setState({isDisabled: (isValidPin && isValidName)});
    }

    hideErrorMessage() {
        if (this.errorMessageTimeoutId!==null) {
            clearTimeout(this.errorMessageTimeoutId);
            this.errorMessageTimeoutId=null;
        }
        if (this.state.showErrorMessage) this.setState({showErrorMessage: false});
    }
}
