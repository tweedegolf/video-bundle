import React from 'react';

export default class UploadErrors extends React.Component {

    render() {
        let messages = _.map(this.props.errors, (error, index) => {
            let message = null;
            message = <span>
                {error.messages.join(' ')}
            </span>

            return <div key={index} className="alert alert-danger alert-dismissible">
                <button type="button" className="close" onClick={this.props.onDismiss.bind(this, index)}>&times;</button>
                <span className="fa fa-bell-o" />
                {message}
            </div>
        });

        return  <div>{messages}</div>;
    }
}
