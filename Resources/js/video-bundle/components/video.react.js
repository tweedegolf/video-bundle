import React from 'react';

export default class Video extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        let video = this.props.video;
        let checked = this.props.clipboard.indexOf(video.id) > -1;
        let selected = this.props.selected.indexOf(video.id) > -1;
        let class_name = 'cutable' + (video.new ? ' success' : '') + (this.props.hovering ? ' selected' : '');
        let preview = <span className={'fa fa-file-video-o file'} />;

        let checkbox = null;
        let actions = null;
        let confirm = null;
        let delete_btn = null;
        let download_btn = null;

        checkbox = <span className={selected ? 'fa fa-check-square-o' : 'fa fa-square-o'} />;
        class_name = selected ? 'selected' : 'selectable';

        if (this.props.clipboard.length > 0) {
            checkbox = <span className={checked ? 'fa fa-thumb-tack' : ''} />;
            class_name = checked ? 'cut' : '';
        }

        if (this.props.confirm_delete === video.id) {
            class_name += ' danger';
        }

        if (video.thumbnail) {
            preview = <img src={video.thumbnail} alt={video.name} />;
        }

        return (
            <tr className={class_name} onClick={this.props.onSelect.bind(this, video.id)}>
                <td>
                    {checkbox}
                </td>
                <td>
                    {preview}
                </td>
                <td>
                    {video.name}
                </td>
                <td>
                    {video.created}
                </td>
            </tr>
        );
    }
}
