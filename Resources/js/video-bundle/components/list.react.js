import React from 'react';
import _ from 'lodash';
import cache from '../cache';

import Video from './video.react.js';
import Folder from './folder.react.js';

export default class List extends React.Component {

    render() {
        // sorted video listing
        let videos = _.map(this.props.videos, (video, index) => {

            // hide non-images when the images only option is passed to the form
            if (!this.props.browser && this.props.images_only && !video.thumb) {
                return;
            }

            index = this.props.ascending
                ? this.props.folders.length + index
                : this.props.folders.length + this.props.videos.length - index - 1;

            return <Video
                key={'video-' + video.id}
                video={video}
                hovering={this.props.hover === index}
                onSelect={this.props.onSelect.bind(this)}
                selected={this.props.selected}
                clipboard={this.props.clipboard}
                browser={this.props.browser}
            />;
        });

        // sorted folder listing
        let folders = _.map(this.props.folders, (folder, index) => {

            index = this.props.ascending
                ? index
                : this.props.videos.length - index + 1;

            return <Folder
                hovering={this.props.hover === index}
                key={'folder-' + folder.id}
                parent={false}
                folder={folder}
                onOpenFolder={this.props.onOpenFolder.bind(this)}
                onDelete={this.props.onDeleteFolder.bind(this)}
                loading={this.props.loading_folder}
            />;
        });

        // reverse listings when the sort direction is reversed
        if (!this.props.ascending) {
            folders = folders.reverse();
            videos = videos.reverse();
        }

        // show parent directory button
        let parent = null;
        if (this.props.current_folder.parent !== undefined) {
            parent = <Folder
                key={'folder-' + this.props.current_folder.parent}
                parent={true}
                folder={cache.findFolder(this.props.current_folder.parent)}
                loading={this.props.loading_folder}
                onOpenFolder={this.props.onOpenFolder.bind(this)}
            />;
        }

        return <tbody>
            {parent}
            {folders}
            {videos}
        </tbody>;
    }
}
