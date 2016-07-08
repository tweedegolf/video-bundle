import React from 'react';
import FileDragAndDrop from 'react-file-drag-and-drop';
import _ from 'lodash';
import api from '../api';
import cache from '../cache';

import List from './list.react.js';
import SortHeader from './sort_header.react.js';
import Toolbar from './toolbar.react.js';
import SelectedVideos from './selected_videos.react.js';
import Errors from './errors.react.js';

export default class Browser extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            videos: [],
            folders: [],
            hover: -1,
            selected: this.getSelected(),
            clipboard: [],
            confirm_delete: null,
            sort: 'name',
            ascending: true,
            uploading: false,
            loading_folder: null,
            expanded: this.props.browser,
            current_folder: cache.findFolder(null),
            errors: []
        };
    }

    getSelected() {
        let selected = [];

        if (this.props.options && this.props.options.selected) {
            selected = this.props.options.selected;
            cache.storeVideos(selected);
            selected = _.map(selected, (video) => {
                return video.id;
            });
        }

        return selected;
    }

    componentDidMount() {
        this.onOpenFolder(this.state.current_folder.id);

        if (this.props.browser) {
            document.addEventListener('keydown', this.onKeyDown.bind(this), false);
        }
    }

    componentWillUnmount() {
        if (this.props.browser) {
            document.removeEventListener('keydown', this.onKeyDown.bind(this), false);
        }
    }

    render() {
        let headers = _.map({
            name: "Naam",
            create_ts: "Aangemaakt"
        }, (name, column) =>
            <SortHeader
                key={column}
                sortBy={this.sortBy.bind(this)}
                sort={this.state.sort}
                ascending={this.state.ascending}
                column={column}
                name={name}
            />
        );

        let toolbar =  <Toolbar
            selected={this.state.selected}
            clipboard={this.state.clipboard}
            current_folder={this.state.current_folder}
            browser={this.props.browser}
        />;

        let selected = null;
        if (!this.props.browser && this.state.selected.length > 0) {
            selected = <SelectedVideos
                selected={this.state.selected}
                name={this.props.options.name}
                onSelect={this.onSelect.bind(this)}
            />;
        }

        let browser = null;
        let browser_class = "video-browser text-left" + (this.props.browser ? " fullpage" : "");

        if (this.state.expanded) {
            browser = (
            <div className="text-center">
                {selected}
                <div className={browser_class}>
                    <FileDragAndDrop>
                        {toolbar}
                        <Errors errors={this.state.errors} onDismiss={this.onDismiss.bind(this)} />
                        <table className="table table-condensed">
                            <thead>
                            <tr>
                                <th />
                                <th />
                                {headers}
                            </tr>
                            </thead>
                            <List
                                videos={this.state.videos}
                                folders={this.state.folders}
                                current_folder={this.state.current_folder}
                                onSelect={this.onSelect.bind(this)}
                                hover={this.state.hover}
                                selected={this.state.selected}
                                clipboard={this.state.clipboard}
                                browser={this.props.browser}
                                confirm_delete={this.state.confirm_delete}
                                loading_folder={this.state.loading_folder}
                                images_only={this.props.options ? this.props.options.images_only : false}
                                onOpenFolder={this.onOpenFolder.bind(this)}
                            />
                        </table>
                    </FileDragAndDrop>
                </div>
                {!this.props.browser
                    ? <button
                        type="button"
                        className="btn btn-default btn-xs collapse-button"
                        onClick={this.toggleExpand.bind(this)}>
                        <span className="fa fa-chevron-up" />
                      </button>
                    : null
                }
            </div>
            );
        } else {
            browser = <div>
                {selected}
                <button
                    type="button"
                    className="btn btn-default expand-button"
                    onClick={this.toggleExpand.bind(this)}>
                    Bladeren
                    <span className="fa fa-folder-open-o" />
                </button>
            </div>
        }

        return browser;
    }

    onKeyDown(event) {
        if (event.keyCode === 38) {
            this.setHover(this.state.hover - 1);
        } else if (event.keyCode === 40) {
            this.setHover(this.state.hover + 1);
        }
    }

    setHover(target) {
        console.log(target);

        let len = this.state.folders.length + this.state.videos.length;
        target = target < 0 ? len - 1 : target % len;

        console.log(target);
        this.setState({hover: target});
    }

    onDismiss(index) {
        this.state.errors.splice(index, 1);
        this.setState({ errors: this.state.errors});
    }

    onSelect(id) {
        if (this.state.clipboard.length > 0) {
            return;
        }

        let index = this.state.selected.indexOf(id);

        if (!this.props.browser && !this.props.options.multiple) {
            if (index > -1) {
                this.state.selected = [];
            } else {
                this.state.selected = [id];
            }
        }

        if (index > -1) {
            this.state.selected.splice(index, 1);
        } else {
            this.state.selected.push(id);
        }

        this.setState({
            selected: this.state.selected
        });
    }

    sortBy(column) {
        if (this.state.sort === column) {
            this.state.ascending = !this.state.ascending;
        }
        this.setState({
            ascending: this.state.ascending,
            sort: column,
            folders: _.sortBy(this.state.folders, column),
            videos: _.sortBy(this.state.videos, column)
        });
    }

    toggleExpand() {
        this.setState({expanded: !this.state.expanded});
    }

    onOpenFolder(id) {
        if (this.state.uploading || this.state.loading_folder) {
            return;
        }

        // store the selected folder
        let folder = cache.findFolder(id);

        this.setState({loading_folder: id});
        api.openFolder(id, () => {
            // success
            this.setState({
                hover: -1,
                folders: _.sortBy(cache.getFolders(id), this.state.sort),
                videos: _.sortBy(cache.getVideos(id), this.state.sort),
                current_folder: folder,
                loading_folder: null
            });
        }, () => {
            // error
            this.setState({
                loading_folder: null
            });
        });
    }
}
