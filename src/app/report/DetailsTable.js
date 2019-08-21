import React, { Component } from 'react';
import './DetailsTable.scss';

export default class DetailsTable extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        var renderedItems = [];
        for (var qkey in this.props.package.json.questions) {
            var questionDef = this.props.package.json.questions[qkey];

            if (questionDef.answer_id!==this.props.selected) continue;

            var count = 0;
            for (var ukey in this.props.report) {
                var user = this.props.report[ukey];
                if (typeof(user.answers.answer)!=='undefined') {
                    for (var akey in user.answers.answer) {
                        var ans = user.answers.answer[akey];
                        if (ans.q===questionDef.id && ans.r===true) count++;
                    }
                }
            }

            renderedItems.push(
                <tr key={questionDef.id}>
                    <td>{questionDef.text}<div className="count">({count})</div></td>
                </tr>
            );
        }

        return (
            <div className="DetailsTable">
                <table className="table table-sm table-borderless">
                    <tbody>
                        {renderedItems}
                    </tbody>
                </table>
            </div>
        )
    }

}
