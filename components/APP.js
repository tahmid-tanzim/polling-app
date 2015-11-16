var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var io = require('socket.io-client');
var Header = require('./parts/Header');

var APP = React.createClass({
    getInitialState() {
        console.log("APP Initial State");
        return {
            status: 'disconnected',
            title: '',
            /* Both Speaker and Audience is a member */
            member: {},
            audience: [],
            /* Speaker's Information */
            speaker: ''
        }
    },
    componentWillMount() {
        /**
         * Init Socket IO from client side
         * */
        this.socket = io('http://localhost:3000');

        /**
         * Listening emit events from `app-server.js`
         * */
        this.socket.on('connect', this.connect);
        this.socket.on('disconnect', this.disconnect);
        this.socket.on('welcome', this.updateState);
        this.socket.on('joined', this.joined);
        this.socket.on('audience', this.updateAudience);
        this.socket.on('start', this.start);
        this.socket.on('end', this.updateState);
    },
    emit(eventName, payload) {
        /**
         * Sending emit event to `app-server.js`
         * */
        this.socket.emit(eventName, payload);
    },
    connect() {
        /**
         * Note: If member (Audience) already exists in browser sessionStorage,
         * Then Re-join the same member after disconnect or refresh from browser.
         * */
        var member = (sessionStorage.member) ? JSON.parse(sessionStorage.member) : null;
        if(member && member.type === 'audience') {
            this.emit('join', member);
        } else if(member && member.type === 'speaker') {
            this.emit('start', {name: member.name, title: sessionStorage.title});
        }

        console.log("Socket Connected from Client side -> Id: %s", this.socket.id);
        this.setState({status: 'connected'});
    },
    disconnect() {
        console.log("Socket Disconnected from Client side");
        this.setState({
            status: 'disconnected',
            title: 'disconnected',
            speaker: ''
        });
    },
    updateState(serverState) {
        this.setState(serverState);
    },
    joined(member) {
        /**
         * Title: New Audience / Speaker Joined
         * Note: Both Speaker and Audience is a member,
         * Listening emit event `joined` through socket.io from `app-server.js`
         * */
        sessionStorage.member = JSON.stringify(member);
        this.setState({member: member});
    },
    updateAudience(newAudience) {
        /**
         * Update total connected Audience
         * */
        this.setState({audience: newAudience});
    },
    start(presentation) {
        /**
         * Note: If Speaker already exists in browser sessionStorage,
         * Then Re-join the same Speaker after disconnect or refresh from browser.
         * */
        if(this.state.member.type === 'speaker') {
            sessionStorage.title = presentation.title;
        }
        this.setState(presentation);
    },
    /**
     * Note: ES6 shorten pattern `render: function(){}` into `render(){}`
     * */
        render() {
        return (
            <div>
                <Header {...this.state} />
                <RouteHandler emit={this.emit} {...this.state} />
            </div>
        );
    }
});

module.exports = APP;