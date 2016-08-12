import request from 'superagent';

class Api {

    loadVideos(onSuccess, onError) {
        var req = request.get('/admin/video/list');
        req.end((err, res) => {
            if (err) {
                onError(err);
            } else {
                onSuccess(res.body.videos);
            }
        });
    }

    sync(onSuccess, onError) {
        var req = request.get('/admin/video/sync');
        req.end((err, res) => {
            if (err) {
                onError(err);
            } else {
                onSuccess(res.body.videos);
            }
        });
    }
}

export default new Api();
