import React from 'react'
import Display from './parts/Display'
import Join from './parts/Join'
import Ask from './parts/Ask'

/**
 * Note: ES6 Class Syntax
 * FROM: var Audience = React.createClass({});
 * TO: class Audience extends React.Component {}
 * */
class Audience extends React.Component {
    render() {
        return (
            <div>
                <Display if={this.props.status === 'connected'}>
                    <Display if={this.props.member.name}>
                        <h2>Welcome {this.props.member.name}</h2>
                        <Display if={!this.props.currentQuestion}>
                            <p>{this.props.audience.length} audience members connected.</p>
                            <p>Questions will appear here.</p>
                        </Display>
                        <Display if={this.props.currentQuestion}>
                            <Ask question={this.props.currentQuestion} emit={this.props.emit} />
                        </Display>
                    </Display>
                    <Display if={!this.props.member.name}>
                        <h2>Join the session</h2>
                        <Join emit={this.props.emit} />
                    </Display>
                </Display>
            </div>
        );
    }
}

module.exports = Audience;