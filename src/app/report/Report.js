import React, { Component } from 'react';
import './Report.scss';
import Axios from 'axios';
import { SERVER_URL } from '../../index';
import PleaseWait from '../../components/PleaseWait';
import ReportHeader from './ReportHeader';
import ReportBodyRanking from './ReportBodyRanking';
import ReportBodyDetails from './ReportBodyDetails';


const TO_FETCH_COUNT = 4;
export default class Report extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fetchedCount: 0,
            packages_list: null,
            groups_list: null,
            package: null,
            group: null,
            pin: (typeof(this.props.pin)==='undefined' || this.props.pin===null) ? null : this.props.pin,
            report: null,
            pageId: "S"
        };
        this.onButtonClick=this.onButtonClick.bind(this);
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
            this.setState({packages_list: packages, fetchedCount: this.state.fetchedCount+1}, ()=>{
                this.dispatch();
            });
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
            var groups = {};
            for (var gkey in response.data) {
                groups[response.data[gkey].pin]=response.data[gkey];
            }
            this.setState({groups_list: groups, fetchedCount: this.state.fetchedCount+1}, ()=>{
                this.dispatch();
            });
        }).catch((error)=>{
            console.error(error.data);
        });
    }
    
    fetchPackage() {
        if (this.state.packages_list!==null && this.state.groups_list!==null) {
            var hash = this.state.groups_list[this.state.pin].package_hash;
            Axios.get(SERVER_URL,{
                params: {
                    action: 'package-get',
                    hash: hash
                }
            }).then((response)=>{
                if (response.data.result) {
                    this.setState({
                        package: response.data.package,
                        fetchedCount: this.state.fetchedCount+1
                    })
                }
            }).catch((error)=>{
                console.error(error.data);
            });
        }
    }

    fetchReport() {
        if (this.state.packages_list!==null && this.state.groups_list!==null) {
            var hash = this.state.groups_list[this.state.pin].package_hash;
            Axios.get(SERVER_URL,{
                params: {
                    action: 'report-get',
                    hash: hash
                }
            }).then((response)=>{
                if (response.data.result) {
                    this.setState({
                        group: this.state.groups_list[this.state.pin],
                        report: response.data.users, 
                        fetchedCount: this.state.fetchedCount+1
                    })
                }
            }).catch((error)=>{
                console.error(error.data);
            });
        }
    }

    dispatch() {
        if (this.state.packages_list!==null && this.state.groups_list!==null) {
            this.fetchReport();
            this.fetchPackage();
        }
    }

    render() {

        if (this.state.pin===null) return (
            <div>W celu otwarcia raportu proszę posłużyć się linkiem z zarządzania.</div>
        );

        if (this.state.report===null) return (
            <PleaseWait 
                suffix={" "+this.state.fetchedCount+" / "+TO_FETCH_COUNT}
            />
        );

        if (this.state.package===null || this.state.group===null) return (
            <div>W celu otwarcia raportu proszę posłużyć się linkiem z zarządzania.</div>
        );
        
        var renderedBody = '';
        switch (this.state.pageId) {
            case 'R':
                renderedBody = (
                    <ReportBodyRanking
                        package={this.state.package}
                        group={this.state.group}
                        report={this.state.report}
                    />
                );
                break;
            case 'S':
                renderedBody = (
                    <ReportBodyDetails 
                        package={this.state.package}
                        group={this.state.group}
                        report={this.state.report}
                    />
                );
                break;
        }
        return (
            <div className="App Report">
                <ReportHeader 
                    pageId={this.state.pageId}
                    onButtonClickCallback={this.onButtonClick}
                />
                <div className="report-body">
                    {renderedBody}
                </div>
            </div>
        )
    }

    onButtonClick(newId) {
        switch (newId) {
            case 'W':
                if(window.confirm("Czy na pewno usunąć wszystkich graczy i ich odpowiedzi?")) {
                    Axios.post(SERVER_URL, {
                        action: 'group-delete',
                        hash: this.state.group.package_hash
                    }).then((response)=>{
                        console.log(response.data);
                        if (response.data.result) {
                            this.fetchReport();
                        }
                    }).catch((error)=>{
                        console.error(error.data);
                    })
                }
                break;
            default:
                this.setState({pageId: newId});
        }
    }

}
