import React from 'react';
import ReactDOM from 'react-dom';
import Browser from './components/browser.react.js';
import _ from 'lodash';

// an element with the id 'tg_video_browser' will be converted to a interactive video browser
// note that there can only be one of these
var browser = document.getElementById('tg_video_browser');
if (null !== browser) {
     ReactDOM.render(<Browser browser={true} />, browser);
}

// an element with the class 'tg_file_picker' will be converted to a video selector
// note there can be multiple file selectors in a single form
var pickers = document.getElementsByClassName('tg_video_picker');
if (pickers.length > 0) {
    _.forEach(pickers, (element) => {
        var options = JSON.parse(element.dataset.options);
        ReactDOM.render(<Browser browser={false} options={options} />, element);
    });
}
