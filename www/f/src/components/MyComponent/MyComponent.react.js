'use strict';

import React from 'react';

export default class MyComponent extends React.Component {

  render() {
    return <span className="MyComponent">Hello, {this.props.name}!!</span>;
  }
};
