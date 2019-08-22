import React, { Component } from 'react';
import './ManageRow.scss';
import Button from 'react-bootstrap/Button';
import InlinePackageUpdate from './InlinePackageUpdate';
import DeleteGroup from './DeleteGroup';

export default class ManageRow extends Component {


    render() {

        var isPackageKnown = (typeof(this.props.packageData)!=='undefined');

        return (
            <tr className="ManageRow">
                <td>{this.props.group.id}</td>
                <td><a href={"/report/"+this.props.group.pin}>{this.props.group.name}</a></td>
                <td>{this.props.group.pin}</td>
                <td>
                    {isPackageKnown && this.props.packageData.title}
                    {!isPackageKnown && 
                        <InlinePackageUpdate
                            group={this.props.group}
                            packageData={this.props.packageData}
                            packagesList={this.props.packagesList}
                            onHashUpdatedCallback={this.props.onRequestRefetchCallback}
                        />
                    }
                </td>
                <td>
                    {this.props.group.created_at}
                    <DeleteGroup 
                        group={this.props.group}
                        onGroupDeletedCallback={this.props.onRequestRefetchCallback}
                    />
                </td>
            </tr>
        )
    }

}
