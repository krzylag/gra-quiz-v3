import React, { Component } from 'react';
import MetaTags from 'react-meta-tags';
import Login from './login/Login';
import { comms } from '../../helpers/communications';
import Welcome from './welcome/Welcome';
import Play from './play/Play';
import Results from './results/Results';
import PleaseWait from '../../components/PleaseWait';

import './Game.scss';

const NEXT_QUESTION_TIMEOUT_MS = 3000;

export default class Game extends Component {

    constructor(props) {
        super(props);
        this.state = {
            groups_list: null,
            packages_list: null,
            pin: (typeof(this.props.preselectedPin)!=='undefined' && this.props.preselectedPin!==null && this.props.preselectedPin!=='') ? this.props.preselectedPin : null,
            package: null,
            package_css: null,

            user: null,

            answers: [],
            current_question_id: 0,
            seenWelcome: false,
            completedPlay: false
        };

        this.nextQuestionTimeoutId=null;
        this.onSuccessfullLogin=this.onSuccessfullLogin.bind(this);
        this.onClickedSeenWelcome=this.onClickedSeenWelcome.bind(this);
        this.onReceiveAnswer=this.onReceiveAnswer.bind(this);
        this.onButtonComponentClicked=this.onButtonComponentClicked.bind(this);
    }

    componentDidMount() {
        comms.fetchGroupsList().then((data)=>{
            this.setState({groups_list: data}, ()=>{
                this._fetchPackageIfKnown();
            });
        });
        comms.fetchPackagesList().then((data)=>{
            this.setState({packages_list: data}, ()=>{
                this._fetchPackageIfKnown();
            });
        });
    }

    _fetchPackageIfKnown() {
        if (this.state.groups_list!==null && this.state.packages_list!==null && this.state.pin!==null) {
            let tryGroup = this.state.groups_list[this.state.pin];
            if (typeof(tryGroup)!=='undefined') {
                let tryPackageShort = this.state.packages_list[tryGroup.package_hash];
                if (typeof(tryPackageShort)!=='undefined') {
                    comms.fetchPackage(tryPackageShort.hash).then((data)=>{
                        this.setState({
                            package: data.json,
                            package_css: data.css
                        });
                    })
                }
            }
        }
    }

    render() {

        var screenToRender;

        if (this.state.packages_list===null || this.state.groups_list===null) {
            let total = 2;
            let current = 0;
            if (this.state.groups_list) current++;
            if (this.state.packages_list) current++;
            screenToRender = (
                <PleaseWait suffix={"Łączenie z serwerem: "+current+" / "+total} />
            );

        } else if (this.state.user===null) {

            screenToRender = (
                <Login 
                    package={this.state.package}
                    preselectedPin={this.props.preselectedPin}
                    onSuccessfullLoginCallback={this.onSuccessfullLogin}
                />
            );

        } else if (!this.state.seenWelcome) {

            screenToRender = (
                <Welcome 
                    package={this.state.package}
                    onClickedSeenWelcomeCallback={this.onClickedSeenWelcome}
                />
            );

        } else if (!this.state.completedPlay) {

            screenToRender = (
                <Play 
                    user={this.state.user}
                    currentQuestionId={this.state.current_question_id}
                    answers={this.state.answers}
                    package={this.state.package}
                    onReceiveAnswerCallback={this.onReceiveAnswer}
                    onButtonComponentClickedCallback={this.onButtonComponentClicked}
                />
            );

        } else {

            screenToRender = (
                <Results 
                    user={this.state.user}
                    answers={this.state.answers}
                    package={this.state.package}
                />
            );

        }

        return (
            <div className="App Game">
                {this.state.package_css!==null &&
                    <MetaTags>
                        <style>
                            {this.state.package_css}
                        </style>
                    </MetaTags>
                }
                {screenToRender}
            </div>
        )
    }

    onSuccessfullLogin(packageObj, package_css, userName, userId) {
        this.setState({
            package: packageObj,
            package_css,
            user: {
                name: userName,
                id: userId
            }
        });
    }

    onClickedSeenWelcome(newSeenState) {
        this.setState({seenWelcome: newSeenState});
    }

    onReceiveAnswer(questionId, answerId) {
        var answers = this.state.answers;
        answers[questionId]={
            qId: questionId,
            aId: answerId,
            a: (this.state.package.questions[questionId].answer_id===answerId)
        };
        this.setState({answers}, ()=>{
            this.nextQuestionTimeoutId = setTimeout(()=>{
                this.forwardToNextQuestion();
            }, NEXT_QUESTION_TIMEOUT_MS);
        })
    }

    onButtonComponentClicked() {
        if (this.state.answers[this.state.current_question_id]) {
            this.forwardToNextQuestion();
        }
    }

    forwardToNextQuestion() {
        if (this.nextQuestionTimeoutId!==null) {
            clearTimeout(this.nextQuestionTimeoutId);
            this.nextQuestionTimeoutId=null;
        };
        var completedPlay = this.state.answers.length>=this.state.package.questions.length;
        if (completedPlay) {
            this.setState({completedPlay}, ()=>{
                comms.uploadAnswer(
                    this.state.user.id,
                    this.state.answers
                );
            });
        } else {
            this.setState({current_question_id: this.state.current_question_id+1});
        }
    }

}
