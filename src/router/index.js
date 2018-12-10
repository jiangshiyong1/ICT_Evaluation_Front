import React from 'react';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import {Provider} from 'react-redux';
import {hot} from 'react-hot-loader';
import store from '../state/store'
import DevTools from '../redux/DevTools';
import Evaluation_table from '../containers/evaluation_table';
import Docs from '../containers/docs';
import Login from '../containers/login';

const Router = ({component: Component, children, ...rest}) => (
  <Route
    {...rest}
    render={props => (
      <Component {...props} ><Switch>{children}</Switch></Component>
    )}
  />
);
const Root = () => (
  <BrowserRouter>
    <Provider store={store}>
        <Switch>
          <Route path='/' exact component={ Login }></Route>
          <Route path='/login' exact component={ Login }></Route>
          <Route path='/evaluation_table' render={props => {return sessionStorage.getItem("isLogin") == 1 ? <Evaluation_table {...props}/> : <Redirect to="/login" />}}/>
        </Switch>
    </Provider>
  </BrowserRouter>
);

export default hot(module)(Root);
