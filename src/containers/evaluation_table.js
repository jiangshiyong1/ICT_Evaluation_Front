import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Tooltip, Icon, message } from 'antd';
import logo from '~/assets/ict.png';
import * as homeActions from '../redux/reduces/home';

class App extends Component {
  render() {
    return (
      <div className="ev_container">
        <div className="ev_header">
          <img style={{ height: '45px', width: '45px', marginTop: '8px', marginLeft: '8px' }} src={logo} />
          <div className="ev_title">网络数据科学与技术重点实验室2018年终考评系统</div>
          <Tooltip title="退出登录">
            <Icon className="ev_icon" style={{ paddingRight: '30px' }} type="poweroff" />
          </Tooltip>
          <Tooltip title="修改密码">
            <Icon className="ev_icon" type="user" />
          </Tooltip>
        </div>
        <div className="ev_body">
          <div className="ev_body_card">
            <div className="ev_body_title">
              考评表
            </div>
            <div className="line"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
