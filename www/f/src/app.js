import React from 'react';
import ReactDOM from 'react-dom';

import './styles/main.scss';

import MyComponent from './components/MyComponent/MyComponent.react';

ReactDOM.render(<MyComponent name="MyComponent" />, document.getElementById('react-view'));
