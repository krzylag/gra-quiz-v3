import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './index.scss';
import Manage from './app/manage/Manage';
import Game from './app/game/Game';

let tempServerAddress;
if (typeof(process.env.REACT_APP_OVERRIDE_SERVER_URL)==='string' && process.env.REACT_APP_OVERRIDE_SERVER_URL!=='' && process.env.REACT_APP_OVERRIDE_SERVER_URL!==null) {
    tempServerAddress=process.env.REACT_APP_OVERRIDE_SERVER_URL;
} else {
    tempServerAddress=document.location.origin+"/server/index.php";
}
export const SERVER_URL = tempServerAddress;

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route path="/manage/:param1?/:param2?/:param3?" render={(props)=>(
                <Manage
                    params={{
                        param1: (props.match.params.param1) ? props.match.params.param1 : null,
                        param2: (props.match.params.param2) ? props.match.params.param2 : null,
                        param3: (props.match.params.param3) ? props.match.params.param3 : null
                    }}
                />
            )} />
            <Route path="/:param1?/:param2?/:param3?" render={(props)=>(
                <Game
                    preselectedPin={(props.match.params.param1) ? props.match.params.param1 : null}
                    params={{
                        param2: (props.match.params.param2) ? props.match.params.param2 : null,
                        param3: (props.match.params.param3) ? props.match.params.param3 : null
                    }}
                />
            )} />
        </Switch>
    </BrowserRouter>
    , document.getElementById('root')
);

