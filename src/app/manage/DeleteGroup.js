import React, { Component } from 'react';
import './DeleteGroup.scss';
import Button from 'react-bootstrap/Button';
import { comms } from '../../helpers/communications';

export default class DeleteGroup extends Component {

    constructor(props) {
        super(props);
        this.clickedDelete=this.clickedDelete.bind(this);
    }

    render() {
       
            return (
                <Button 
                    className="DeleteGroup"
                    size="sm"
                    variant="outline-danger"
                    onClick={this.clickedDelete}
                >
                    {this.getTrashSvg()}
                </Button>
            )

        
    }

    getTrashSvg() {
        return (
            <svg version="1.1" viewBox="0 0 1792 1792">
                <path d="m704 736v576q0 14-9 23t-23 9h-64q-14 0-23-9t-9-23v-576q0-14 9-23t23-9h64q14 0 23 9t9 23zm256 0v576q0 14-9 23t-23 9h-64q-14 0-23-9t-9-23v-576q0-14 9-23t23-9h64q14 0 23 9t9 23zm256 0v576q0 14-9 23t-23 9h-64q-14 0-23-9t-9-23v-576q0-14 9-23t23-9h64q14 0 23 9t9 23zm128 724v-948h-896v948q0 22 7 40.5t14.5 27 10.5 8.5h832q3 0 10.5-8.5t14.5-27 7-40.5zm-672-1076h448l-48-117q-7-9-17-11h-317q-10 2-17 11zm928 32v64q0 14-9 23t-23 9h-96v948q0 83-47 143.5t-113 60.5h-832q-66 0-113-58.5t-47-141.5v-952h-96q-14 0-23-9t-9-23v-64q0-14 9-23t23-9h309l70-167q15-37 54-63t79-26h320q40 0 79 26t54 63l70 167h309q14 0 23 9t9 23z"/>
            </svg>
        );
    }

    clickedDelete() {
        if (window.confirm("Czy na pewno usunąć grupę "+this.props.group.name+"?")) {
            comms.deleteGroup(
                this.props.group.pin
            ).then(()=>{
                this.props.onGroupDeletedCallback();
            });
        }
    }
}
