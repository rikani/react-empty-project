import React from 'react';
import ReactDOM from 'react-dom';

import './styles/main.scss';

import MyComponent from './components/MyComponent/MyComponent.react';
import TodoApp from './components/TodoApp.react';

ReactDOM.render(<MyComponent name="MyComponent" />, document.getElementById('react-view'));
ReactDOM.render(<TodoApp />, document.getElementById('todoapp'));
