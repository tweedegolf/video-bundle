import React from 'react';
import api from '../api';
import cache from '../cache';

export default class Toolbar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show_form: false,
            synching: false
        };
    }

    render() {
        let loader = this.props.uploading ? <span className="fa fa-circle-o-notch fa-spin" /> : null;
        let sync_class = 'btn btn-sm btn-default pull-right ' + (this.state.show_form ? 'hide' : '');
        let actions = null;

        return (
            <div className="toolbar">
                {actions}
                <button
                    type="button"
                    className={sync_class}
                    onClick={this.onSync.bind(this)}
                    disabled={this.state.synching}>
                    <span className="fa" />
                    Sync
                    {this.state.synching ? <span className="fa fa-circle-o-notch fa-spin" /> : null}
                </button>
            </div>
        );
    }

    onSync() {
        this.setState({
            synching: true
        }, () => {

            api.sync(() => {
                this.setState({
                    synching: false,
                    videos: _.sortBy(cache.getVideos(null), this.state.sort)
                });
            }, (err) => {
                console.log(err);
            });

        });
    }
}
