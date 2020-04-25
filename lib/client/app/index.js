import routes from './routes';
import ReactDOM from 'react-dom';
import Promise from 'promise-polyfill';

import '../static/assets/styles/index.scss';

if (!window.Promise) {
  window.Promise = Promise;
}

ReactDOM.render(routes, document.getElementById('top-times-react-root'));
