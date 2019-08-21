import React, { Component } from 'react';
import MetaTags from 'react-meta-tags';
import Login from './login/Login';

import './Game.scss';
import Welcome from './welcome/Welcome';
import Play from './play/Play';
import Results from './results/Results';
import { SERVER_URL } from '../../index';
import Axios from 'axios';


const NEXT_QUESTION_TIMEOUT_MS = 3000;

export default class Game extends Component {

    constructor(props) {
        super(props);
        this.state = {
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
        this.onUpdateCss=this.onUpdateCss.bind(this);
    }

    render() {

        var screenToRender;

        if (this.state.package===null) screenToRender = (
            <Login 
                preselectedPin={this.props.preselectedPin}
                onSuccessfullLoginCallback={this.onSuccessfullLogin}
                updateCssCallback={this.onUpdateCss}
            />
        );

        else if (!this.state.seenWelcome) screenToRender = (
            <Welcome 
                package={this.state.package}
                package_css={this.state.package_css}
                onClickedSeenWelcomeCallback={this.onClickedSeenWelcome}
            />
        )

        else if (!this.state.completedPlay) screenToRender = (
            <Play 
                user={this.state.user}
                currentQuestionId={this.state.current_question_id}
                answers={this.state.answers}
                package={this.state.package}
                package_css={this.state.package_css}
                onReceiveAnswerCallback={this.onReceiveAnswer}
                onButtonComponentClickedCallback={this.onButtonComponentClicked}
            />
        )

        else screenToRender = (
            <Results 
                user={this.state.user}
                answers={this.state.answers}
                package={this.state.package}
                package_css={this.state.package_css}
            />
        );

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
                this.uploadAnswers();
            });
        } else {
            this.setState({current_question_id: this.state.current_question_id+1});
        }
    }

    uploadAnswers() {
        Axios.post(SERVER_URL, {
            action: 'answer-upload',
            userid: this.state.user.id,
            answers: this.state.answers
        }).then((response)=>{
            
        }).catch((error)=>{
            console.error(error.data);
        })
    }

    onUpdateCss(cssString) {
        this.setState({package_css: cssString});
    }

}
