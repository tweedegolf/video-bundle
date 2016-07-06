import _ from 'lodash';

class Cache {

    constructor() {
        this.folders = {
            null: {
                id: null,
                name: '..'
            }
        };
        this.videos = {};
        this.data = {};
    }

    findVideo(id) {
        if (!this.videos[id]) {
            console.error('Video not found', id);

            return null;
        }

        return this.videos[id];
    }

    storeVideos(videos, folder_id) {
        _.forEach(videos, (video) => {
            this.videos[video.id] = video;
        });

        if (folder_id !== undefined && this.data[folder_id]) {
            this.data[folder_id].videos = this.data[folder_id].videos.concat(videos);
        }
    }

    removeVideos(video_ids) {
        _.forEach(this.data, (folder) => {
            folder.videos = _.filter(folder.videos, (video) => (video_ids.indexOf(video.id) === -1));
        });
    }

    getVideos(folder_id) {
        if (!this.data[folder_id]) {
            return [];
        }

        console.log(this.data);

        return this.data[folder_id].videos;
    }

    findFolder(id) {
        if (!this.folders[id]) {
            console.error('Folder not found', id);

            return null;
        }

        return this.folders[id];
    }

    getFolders(folder_id) {
        if (!this.data[folder_id]) {
            return [];
        }

        return this.data[folder_id].folders;
    }

    storeFolders(folders, folder_id) {
        _.forEach(folders, (folder) => {
            this.folders[folder.id] = folder;
        });

        if (folder_id !== undefined && this.data[folder_id]) {
            this.data[folder_id].folders = this.data[folder_id].folders.concat(folders);
        }
    }

    loadFolder(key, mis, hit) {
        if (this.data[key]) {
            if(!this.data[key].loading) {
                hit(this.data[key].folders, this.data[key].videos);
            } else {
                this.data[key].waiting.push(hit)
            }
        } else {
            this.data[key] = {
                loading: true,
                waiting: [hit]
            };
            mis();
        }
    }

    storeFolder(key, folders, videos) {
        if (!this.data[key]) {
            this.data[key] = {
                waiting: []
            };
        }

        this.data[key].loading = false;
        this.data[key].folders = folders;
        this.data[key].videos = videos;

        this.storeFolders(folders);
        this.storeVideos(videos);

        _.forEach(this.data[key].waiting, (hit) => {
            hit(folders, videos);
        });
    }
}
export default new Cache();
