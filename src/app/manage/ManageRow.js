import React, { Component } from 'react';
import './ManageRow.scss';
import InlinePackageUpdate from './InlinePackageUpdate';
import DeleteGroup from './DeleteGroup';
import InlinePinUpdate from './InlinePinUpdate';

export default class ManageRow extends Component {


    render() {

        var isPackageKnown = (typeof(this.props.packageData)!=='undefined');

        return (
            <tr className="ManageRow">
                <td>{this.props.group.id}</td>
                <td><a href={"/"+this.props.group.pin} target="_blank" rel="noopener noreferrer">{this.props.group.name}</a></td>
                <td>
                    <InlinePinUpdate 
                        group={this.props.group}
                        packageData={this.props.packageData}
                        onPinUpdatedCallback={this.props.onRequestRefetchCallback}
                    />
                </td>
                <td><a href={"/report/"+this.props.group.pin} className="report-link" target="_blank" rel="noopener noreferrer">RAPORT</a></td>
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
