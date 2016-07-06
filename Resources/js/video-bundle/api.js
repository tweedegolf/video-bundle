import _ from 'lodash';
import request from 'superagent';
import cache from './cache';

class Api {

   openFolder(folder_id, onSuccess, onError) {
        cache.loadFolder(folder_id, () => {
            // no cache hit
            let url = '/admin/video/list' + (folder_id ? '/' + folder_id : '');
            var req = request.get(url);
            req.end((err, res) => {
                if (err) {
                    onError(err);
                    cache.storeFolder(folder_id, [], []);
                } else {
                    cache.storeFolder(folder_id, res.body.folders, res.body.videos);
                }
            });
        }, (folders, videos) => {
            // cache hit
            onSuccess();
        });
    }

    sync(onSuccess, onError) {
        let url = '/admin/video/sync';
        var req = request.get(url);

        req.end((err, res) => {
            if (err) {
                console.log(err);
            } else {
                cache.storeFolder(null, res.body.folders, res.body.videos);
                onSuccess();
            }
        });
    }
}

export default new Api();
