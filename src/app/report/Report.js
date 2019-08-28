import React, { Component } from 'react';
import './Report.scss';
import { comms } from '../../helpers/communications';
import PleaseWait from '../../components/PleaseWait';
import ReportHeader from './ReportHeader';
import ReportBodyRanking from './ReportBodyRanking';
import ReportBodyDetails from './ReportBodyDetails';
import { MetaTags } from 'react-meta-tags';

export default class Report extends Component {

    constructor(props) {
        super(props);
        this.state = {
            packages_list: null,
            groups_list: null,
            package: null,
            group: null,
            pin: (typeof(this.props.pin)==='undefined' || this.props.pin===null) ? null : this.props.pin,
            report: null,
            pageId: "S",
            noSuchReportError: false,
            isRefreshDisabled: false
        };
        this.onButtonClick=this.onButtonClick.bind(this);
    }

    componentDidMount() {
        this.fetchPackagesList();
        this.fetchGroupsList();
    }

    fetchPackagesList() {
        comms.fetchPackagesList().then((data)=>{
            this.setState({packages_list: data}, ()=>{
                this.fetchReportIfPossible();
                this.fetchPackageIfPossible();
            });
        });
    }

    fetchGroupsList() {
        comms.fetchGroupsList().then((data)=>{
            var group = (typeof(data[this.state.pin])!=='undefined') ? data[this.state.pin] : null;
            if (group===null) {
                this.setState({noSuchReportError: true});
            } else {
                this.setState({groups_list: data, group: group}, ()=>{
                    this.fetchReportIfPossible();
                    this.fetchPackageIfPossible();
                });
            }
        });
    }
    
    fetchPackageIfPossible() {
        if (this.state.packages_list!==null && this.state.groups_list!==null && this.state.pin!==null && typeof(this.state.groups_list[this.state.pin])!=='undefined') {
            comms.fetchPackage(
                this.state.groups_list[this.state.pin].package_hash
            ).then((data)=>{
                this.setState({package: data});
            });
        }
    }

    fetchReportIfPossible() {
        if (this.state.packages_list!==null && this.state.groups_list!==null && this.state.pin!==null && typeof(this.state.groups_list[this.state.pin])!=='undefined') {
            comms.fetchReport(
                this.state.groups_list[this.state.pin].package_hash,
                this.state.pin
            ).then((data)=>{
                this.setState({report: data, isRefreshDisabled: false});
            });
        }
    }

    render() {

        if (this.state.pin===null || this.state.noSuchReportError===true) return (
            <div>
                {this.state.noSuchReportError &&
                    <div>Raport o kodzie PIN=[{this.state.pin}] nie istnieje.</div>
                }
                <div>W celu otwarcia raportu proszę posłużyć się linkiem z zarządzania.</div>
            </div>
        );

        if (this.state.packages_list===null || this.state.groups_list===null || this.state.group===null || this.state.package===null || this.state.report===null) {
            var toFetchCount = 5;
            var fetchedCount = 0;
            if (this.state.packages_list!==null) fetchedCount++;
            if (this.state.groups_list!==null) fetchedCount++;
            if (this.state.group!==null) fetchedCount++;
            if (this.state.package!==null) fetchedCount++;
            if (this.state.report!==null) fetchedCount++;
            return (
                <PleaseWait 
                    suffix={" "+fetchedCount+" / "+toFetchCount}
                />
            );
        }
        
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
                {this.state.package!==null && this.state.package.css!==null &&
                    <MetaTags>
                        <style>
                            {this.state.package.css}
                        </style>
                    </MetaTags>
                }
                <ReportHeader 
                    pageId={this.state.pageId}
                    isRefreshDisabled={this.state.isRefreshDisabled}
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
                    comms.cleanGroup(
                        this.state.pin
                    ).then(()=>{
                        this.fetchReportIfPossible();
                    })
                }
                break;
            case 'F':
                this.setState({isRefreshDisabled: true}, () => {
                    this.fetchReportIfPossible();
                });
                break;
            default:
                this.setState({pageId: newId});
        }
    }

}
