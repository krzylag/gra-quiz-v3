import React, { Component } from 'react';
import Axios from 'axios';
import { SERVER_URL } from '../../index';
import PleaseWait from '../../components/PleaseWait';
import Button from 'react-bootstrap/Button';
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
        this.onGroupsListUpdate=this.onGroupsListUpdate.bind(this);
    }

    componentDidMount() {
        this.fetchPackagesList();
        this.fetchGroupsList();
    }

    fetchPackagesList() {
        Axios.get(SERVER_URL, {
            params: {
                action: 'packages-list'
            }
        }).then((response)=>{
            var packages = {};
            for (var pkey in response.data) {
                packages[response.data[pkey].hash]=response.data[pkey];
            }
            this.setState({packages_list: packages});
        }).catch((error)=>{
            console.error(error.data);
        });
    }

    fetchGroupsList() {
        Axios.get(SERVER_URL, {
            params: {
                action: 'groups-list'
            }
        }).then((response)=>{
            this.setState({groups_list: response.data});
        }).catch((error)=>{
            console.error(error.data);
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
                    onGroupsListUpdateCallback={this.onGroupsListUpdate}
                />
            </div>
        )
    }

    onGroupsListUpdate(newList) {
        this.setState({groups_list: newList});
    }
}
