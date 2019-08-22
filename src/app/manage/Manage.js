import React, { Component } from 'react';
import PleaseWait from '../../components/PleaseWait';
import { comms } from '../../helpers/communications';
import './Manage.scss';
import ManageRow from './ManageRow';
import NewGroup from './NewGroup';

export default class Manage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            packages_list: null,
            groups_list: null
        };
        this._fetchData=this._fetchData.bind(this);
    }

    componentDidMount() {
        this._fetchData();
    }

    _fetchData() {
        comms.fetchGroupsList().then((data)=>{
            this.setState({groups_list: data});
        });
        comms.fetchPackagesList().then((data)=>{
            this.setState({packages_list: data});
        });
    }

    render() {

        if (this.state.packages_list===null || this.state.groups_list===null) return (<PleaseWait />);

        var renderedRows = [];
        for (var pkey in this.state.groups_list) {
            var group = this.state.groups_list[pkey];
            var packageData = this.state.packages_list[group.package_hash];
            renderedRows.push(
                <ManageRow 
                    key={pkey}
                    group={group}
                    packageData={packageData}
                    packagesList={this.state.packages_list}
                    onRequestRefetchCallback={this._fetchData}
                />
            )
        }
        return (
            <div className="App Manage">
                <h2 className="title">Lista gier:</h2>
                <table className="table table-bordered table-sm">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>gra</th>
                            <th>pin</th>
                            <th>pakiet</th>
                            <th>utworzono</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderedRows}
                    </tbody>
                </table>
                <NewGroup 
                    packagesList={this.state.packages_list}
                    groupsList={this.state.groups_list}
                    onGroupCreatedCallback={this._fetchData}
                />
            </div>
        )
    }

}
