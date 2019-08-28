import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';

import { parsePin } from '../../../helpers/parsers';
import { comms } from '../../../helpers/communications';

import './Login.scss';

const ERROR_MESSAGE_TIMEOUT = 2500;

const DEFAULT_STRINGS = {
    game_title: "",
    pin_request: "Wpisz numer PIN<br />podany przez prowadzacego ćwiczenie.",
    pin_placeholder: "PIN",
    name_request: "Wpisz swoje imię",
    name_placeholder: "imię",
    start_button: "start",
    player_existing: "Taka nazwa istnieje, użyj innej.",
    no_such_pin: "Błędny kod PIN, logowanie niemożliwe.",
    unknown_hash: "Wybrany schemat gry nie istnieje. Prowadzący grę musi poprawić konfigurację na ekranie zarządzania."
};

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tryPin: '',
            tryName: '',
            isButtonDisabled: true,
            isFormDisabled: false,
            errorMessageText: null
        };
        this.onPinChange=this.onPinChange.bind(this);
        this.onNameChange=this.onNameChange.bind(this);
        this.onStartClicked=this.onStartClicked.bind(this);
        this.onKeyDownPin=this.onKeyDownPin.bind(this);
        this.onKeyDownName=this.onKeyDownName.bind(this);
        this.errorMessageTimeoutId=null;
        this.refPin=React.createRef();
        this.refName=React.createRef();
    }

    render() {
        var game_title = (this.props.package===null) ? DEFAULT_STRINGS.game_title : this.props.package.translations.login_screen.game_title;
        var pin_request = (this.props.package===null) ? DEFAULT_STRINGS.pin_request : this.props.package.translations.login_screen.pin_request;
        var pin_placeholder = (this.props.package===null) ? DEFAULT_STRINGS.pin_placeholder : this.props.package.translations.login_screen.pin_placeholder;
        var name_request = (this.props.package===null) ? DEFAULT_STRINGS.name_request : this.props.package.translations.login_screen.name_request;
        var name_placeholder = (this.props.package===null) ? DEFAULT_STRINGS.name_placeholder : this.props.package.translations.login_screen.name_placeholder;
        var start_button = (this.props.package===null) ? DEFAULT_STRINGS.start_button : this.props.package.translations.login_screen.start_button;

        return (
            <div className="Login">
                <div className="area">
                    <h3 className="text-dark font-weight-bold">{game_title}</h3>
                </div>
                {this.props.preselectedPin===null && 
                    <div className="area">
                        <h4 className="text-primary font-weight-bold" dangerouslySetInnerHTML={{__html: pin_request}} />
                        <input 
                            type="text" 
                            value={this.state.tryPin} 
                            onChange={this.onPinChange} 
                            placeholder={pin_placeholder} 
                            disabled={this.state.isFormDisabled} 
                            ref={this.refPin} 
                            onKeyDown={this.onKeyDownPin}
                            autoFocus 
                        />
                    </div>
                }
                <div className="area">
                    <h4 className="text-primary font-weight-bold">{name_request}</h4>
                    {this.props.preselectedPin===null && 
                        <input 
                            type="text" 
                            value={this.state.tryName} 
                            onChange={this.onNameChange} 
                            placeholder={name_placeholder} 
                            disabled={this.state.isFormDisabled} 
                            onKeyDown={this.onKeyDownName}
                            ref={this.refName} 
                        />
                    }
                    {this.props.preselectedPin!==null && 
                        <input 
                        type="text" 
                        value={this.state.tryName} 
                        onChange={this.onNameChange} 
                        placeholder={name_placeholder} 
                        disabled={this.state.isFormDisabled} 
                        onKeyDown={this.onKeyDownName}
                        ref={this.refName} 
                        autoFocus
                    />
                }
                </div>
                <div className="area">
                    <Button variant="outline-secondary" onClick={this.onStartClicked} size="lg" disabled={this.state.isFormDisabled && this.state.isButtonDisabled}>
                        {start_button}
                    </Button>
                    {this.state.errorMessageText!==null && 
                        <div className="user-exists-alert">{this.state.errorMessageText}</div>
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

            comms.validateNewLogin(
                (this.props.preselectedPin===null) ? this.state.tryPin.trim() : this.props.preselectedPin,
                this.state.tryName.trim()
            ).then((data)=>{
                this.props.onSuccessfullLoginCallback(
                    data.package, 
                    data.package_css,
                    data.user_name,
                    data.user_id
                );
            }).catch((error)=>{
                var message = null;
                if (error==='user-exists') {
                    message = (this.props.package===null) ? DEFAULT_STRINGS.player_existing : this.props.package.translations.login_screen.player_existing; 
                } else if (error==='no-such-pin') {
                    message = (this.props.package===null) ? DEFAULT_STRINGS.no_such_pin : this.props.package.translations.login_screen.no_such_pin;
                } else if (error==='unknown-package-hash') {
                    message = (this.props.package===null) ? DEFAULT_STRINGS.unknown_hash : this.props.package.translations.login_screen.unknown_hash;
                }
                this.setState({isFormDisabled: false, errorMessageText: message}, ()=>{
                    this.errorMessageTimeoutId = setTimeout(() => {
                        this.hideErrorMessage();
                    }, ERROR_MESSAGE_TIMEOUT);
                });
            });

        })
    }

    onKeyDownPin(event) {
        if (event.key === 'Enter' && parsePin(event.target.value)!=='') {
            this.refName.current.focus();
        }
    }

    onKeyDownName(event) {
        if (event.key === 'Enter' && event.target.value.trim()!=='') {
            this.onStartClicked();
        }
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
        if (this.state.errorMessageText!==null) this.setState({errorMessageText: null});
    }
}
