import React, { Component } from 'react';
import './ReportBodyDetails.scss';
import DetailsSelector from './DetailsSelector';
import DetailsTable from './DetailsTable';

export default class ReportBodyDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedAnswerId: null
        }
        this.onSelected=this.onSelected.bind(this);
    }
 
    render() {

        return (
            <div className="ReportBodyDetails">
                <DetailsSelector 
                    report={this.props.report}
                    package={this.props.package}
                    selected={this.state.selectedAnswerId}
                    onSelectedCallback={this.onSelected}
                />
                {this.state.selectedAnswerId!==null && 
                    <DetailsTable 
                        report={this.props.report}
                        package={this.props.package}
                        selected={this.state.selectedAnswerId}
                    />
                }
                {this.state.selectedAnswerId===null && 
                    <div className="notice">{this.props.package.json.translations.report_screen.details_request}</div>
                }
            </div>
        )
    }

    onSelected(selectedAnswerId) {
        this.setState({selectedAnswerId});
    }

}
