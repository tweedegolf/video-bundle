import React from 'react';
import cache from '../cache';

export default class SelectedVideos extends React.Component {

    render() {
        let videos = _.map(this.props.selected, (id) => {
            let video = cache.findVideo(id);

            let preview = <span className="fa fa-video" />;
            if (video.thumbnail) {
                preview = <img src={video.thumbnail} alt={video.name} />
            }

            return <div key={id} className="btn btn-default" onClick={this.props.onSelect.bind(this, id)}>
                {preview}
                <span className="name">{video.name}</span>
                <span className="remove">&times;</span>
                <input type="hidden" name={this.props.name} value={id} />
            </div>;
        });

        if (videos.length === 0) {
            videos = <span className="none-selected">Geen video(s) geselecteerd.</span>;
        }

        return (
            <div className="text-left video-picker-selection">
                {videos}
            </div>
        );
    }
}
