/* @flow */

import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { setCounter, getCounter, decrementCounter, incrementCounter, loadCounter } from '../CounterModule';

class About extends React.Component {

  componentWillMount() {
    if (this.props.value == null) {
      this.props.load(this.props.params.id);
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


About.serverFetch = ({ dispatch, params }) => dispatch(loadCounter(params.id));

const mapStateToProps = state => ({
  value: getCounter(state),
});

const mapDispatchToProps = dispatch => ({
  handleIncrement: () => dispatch(incrementCounter()),
  handleDecrement: () => dispatch(decrementCounter()),
  load: id => dispatch(loadCounter(id)),
  reset: value => dispatch(setCounter(value == null ? 0 : value)),
});


export default connect(mapStateToProps, mapDispatchToProps)(About);
