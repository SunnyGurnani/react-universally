/* @flow */

import React from 'react';
import { connect } from "react-redux";
import Helmet from 'react-helmet';
import { setCounter, getCounter, decrementCounter, incrementCounter, loadCounter } from '../CounterModule';

class About extends React.Component {

  componentWillMount() {
    if (process.env.IS_CLIENT && this.props.value == null) {
      this.props.load();
    }
  }

  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <Helmet title="About" />
        <p>
          Counter: {this.props.value}
        </p>
        <p>
          <button onClick={this.props.handleDecrement}>Decrement</button>
          &#160;
          <button onClick={this.props.handleIncrement}>Increment</button>
        </p>
        Produced with ❤️
        by
        &nbsp;
        <a href="https://twitter.com/controlplusb" target="_blank" rel="noopener noreferrer">
          Sean Matheson
        </a>
      </div>
    );
  }

}


About.fetchData = function(props, context)
{
  // Redux' connect() add proxies for static methods, but the top-level HOC
  // does not have our required and connected state/dispatcher props.
  if (props.load) {
    return props.load();
  }

  return Promise.resolve();
}


const mapStateToProps = (state, ownProps) => ({
  value: getCounter(state)
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleIncrement: () => dispatch(incrementCounter()),
  handleDecrement: () => dispatch(decrementCounter()),
  load: () => dispatch(loadCounter()),
  reset: (value) => dispatch(setCounter(value == null ? 0 : value))
});

export default connect(mapStateToProps, mapDispatchToProps)(About);
