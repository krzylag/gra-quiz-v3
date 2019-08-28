import React, { Component } from 'react';
import './ReportHeader.scss';
import Button from 'react-bootstrap/Button';

export default class ReportHeader extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };
        this.onClickR=this.onClickR.bind(this);
        this.onClickS=this.onClickS.bind(this);
        this.onClickF=this.onClickF.bind(this);
        this.onClickW=this.onClickW.bind(this);
    }

    render() {

        var variantR = 'outline-primary';
        var variantS = 'outline-primary';
        switch (this.props.pageId) {
            case 'R':
                variantR = "primary";
                break;
            case 'S':
                variantS = "primary";
                break;
            default:
        }

        return (
            <div className="ReportHeader">
                <div className="rh rh-left">
                    <Button size="sm" variant={variantR} onClick={this.onClickR}>Ranking</Button>
                    <Button size="sm" variant={variantS} onClick={this.onClickS}>Szczegóły</Button>
                </div>
                <div className="rh rh-middle">
                </div>
                <div className="rh rh-right">
                    <Button size="sm" variant="outline-secondary" onClick={this.onClickF} disabled={this.props.isRefreshDisabled}>Odśwież</Button>
                    <Button size="sm" variant="outline-secondary" onClick={this.onClickW}>Wyczyść</Button>
                </div>
            </div>
        )
    }

    onClickR() {
        this.props.onButtonClickCallback('R');
    }
    onClickS() {
        this.props.onButtonClickCallback('S');
    }
    onClickF() {
        this.props.onButtonClickCallback('F');
    }
    onClickW() {
        this.props.onButtonClickCallback('W');
    }

}
