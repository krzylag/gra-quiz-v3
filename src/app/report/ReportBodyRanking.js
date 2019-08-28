import React, { Component } from 'react';
import './ReportBodyRanking.scss';

export default class ReportBodyRanking extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showEmptyUsers: false
        };
    }
 
    render() {
        var users = [];
        for (var ukey in this.props.report) {
            let user = this.props.report[ukey];
            let points = 0;
            if (typeof(user.answers.answer)==='undefined') {
                if (!this.state.showEmptyUsers) continue;
                points = null;
            }
            for (let akey in user.answers.answer) {
                if (user.answers.answer[akey].r) points++;
            };
            users.push({user, points});
        }
        users.sort(function(a,b) {
            return b.points-a.points;
        });

        var renderedRows = [];
        for (var uord in users) {
            renderedRows.push(
                this.renderRow(users[uord])
            );
        }

        return (
            <div className="ReportBodyRanking">
                <table className="table table-sm table-bordered table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th>uczestnik</th>
                            <th>punkty</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderedRows}
                    </tbody>
                </table>
            </div>
        )
    }

    renderRow(data) {
        return (
            <tr key={data.user.id}>
                <td>{data.user.name}</td>
                <td>{data.points}</td>
            </tr>
        );
    }

}
