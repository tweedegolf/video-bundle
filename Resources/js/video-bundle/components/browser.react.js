import React from 'react';
import _ from 'lodash';
import api from '../api';

export default class Browser extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            videos: [],
            selected: this.getSelected(),
            expanded: false,
            syncing: false
        };
    }

    getSelected() {
        let selected = {};

        if (this.props.options && this.props.options.selected) {
            this.props.options.selected.forEach((video) => {
                selected[video.id] = video;
            });
        }

        return selected;
    }

    componentDidMount() {
        api.loadVideos((videos) => {
            this.setState({videos: videos});
        }, () => {
            console.error(err);
        });
    }

    render() {
        let loader = this.state.synching  ? <span className="fa fa-circle-o-notch fa-spin" /> : null;

        if (this.state.expanded) {
            return <div className="text-center">
                <div className="toolbar">
                    <button
                        type="button"
                        className="btn btn-default btn-block"
                        onClick={this.onSync.bind(this)}
                        disabled={this.state.synching}>
                        <span className="fa fa-refresh" />
                        <span className="text-label">Updaten</span>
                        {loader}
                    </button>
                </div>
                <div className="video-browser text-left">
                    <div className="row">
                        {_.map(_.reverse(_.sortBy(this.state.videos, 'created')), (video) => {
                            return this.formatVideo(video);
                        })}
                    </div>
                </div>
                 <button
                    type="button"
                    className="btn btn-default btn-block collapse-button"
                    onClick={this.toggleExpand.bind(this)}>
                    <span className="fa fa-chevron-up" />
                 </button>
            </div>;
        }

        return <div>
            <div className="row selected-videos">
                {_.map(this.state.selected, (video) => {
                    return this.formatVideo(video);
                })}
            </div>
            <button
                type="button"
                className="btn btn-default expand-button"
                onClick={this.toggleExpand.bind(this)}>
                <span className="text-label">Bladeren</span>
                <span className="fa fa-video-camera" />
            </button>
        </div>;
    }

    formatVideo(video) {
        let selected = this.state.selected[video.id];
        let class_name = "thumbnail" + (selected ? " selected" : "");

        return <div className="col-xs-12 col-sm-6 col-md-3 col-lg-2" key={video.id}>
            <div className={class_name} onClick={this.onSelect.bind(this, video)}>
                <img src={"https://img.youtube.com/vi/" + video.youtubeId + '/mqdefault.jpg'} alt={video.name} />
                <div className="caption">
                    <h4>{video.name}</h4>
                    <p className="date">{video.created}</p>
                </div>
                {selected ? <input type="hidden" name={this.props.options.name} value={video.id} /> : null}
            </div>
        </div>;
    }

    onSelect(video) {
        let expanded = true;

        if (this.state.selected[video.id]) {
            this.state.selected = {};
        } else {
            this.state.selected = {};
            this.state.selected[video.id] = video;
            expanded = false;
        }

        this.setState({
            selected: this.state.selected,
            expanded: expanded
        });
    }

    onSync() {
        this.setState({
            synching: true
        }, () => {
            api.sync((videos) => {
                this.setState({
                    synching: false,
                    videos: videos
                });
            }, (err) => {
                console.error(err);
            });

        });
    }

    toggleExpand() {
        this.setState({expanded: !this.state.expanded});
    }
}
