import React, { Component } from 'react';
import './ManageRow.scss';
import Button from 'react-bootstrap/Button';

export default class ManageRow extends Component {


    render() {

        return (
            <tr className="ManageRow">
                <td>{this.props.group.id}</td>
                <td>{this.props.group.name}</td>
                <td>{this.props.group.pin}</td>
                <td>{this.props.packageData.title}</td>
                <td>{this.props.group.created_at}</td>
            </tr>
        )
    }

}
