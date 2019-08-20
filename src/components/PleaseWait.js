import React, { Component } from 'react';
import rotator from './PleaseWait.svg';
import './PleaseWait.scss';

export default class PleaseWait extends Component {

    render() {

        var rotatorStyles = {
            backgroundImage: 'url('+rotator+')'
        };

        if (typeof(this.props.size)!=='undefined' && this.props.size!==null) {
            rotatorStyles.height = this.props.size;
            rotatorStyles.width = this.props.size;
        }

        var prefix;
        if (typeof(this.props.prefix)!=='undefined') {
            prefix = this.props.prefix;
        }
        var suffix;
        if (typeof(this.props.suffix)!=='undefined') {
            suffix = this.props.suffix;
        }

        return (
        <div className="PleaseWait">
            <div className="layout">
                {prefix!==null &&
                    <div className="prefix">{prefix}</div>
                }
                <div className="rotator" style={rotatorStyles} />
                {suffix!==null &&
                    <div className="suffix">{suffix}</div>
                }
            </div>
        </div>
        );
    }

}
