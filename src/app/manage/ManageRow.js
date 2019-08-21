import React, { Component } from 'react';
import './ManageRow.scss';
import Button from 'react-bootstrap/Button';

export default class ManageRow extends Component {


    render() {

        return (
            <tr className="ManageRow">
                <td>{this.props.group.id}</td>
                <td><a href={"/report/"+this.props.group.pin}>{this.props.group.name}</a></td>
                <td>{this.props.group.pin}</td>
                <td>{this.props.packageData.title}</td>
                <td>{this.props.group.created_at}</td>
            </tr>
        )
    }

}
