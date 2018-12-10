import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Vrifcode from '~/components/vrifcode';
import { Input, Icon, message } from 'antd';
import axios from 'axios'
import store from '../state/store'
import { Link } from "react-router-dom";
import * as homeActions from '../redux/reduces/home';

@connect(
  state => ({ home: state.home }),
  dispatch => bindActionCreators(homeActions, dispatch)
)
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      password: '',
      vCode: '',
      iCode: ''
    };
  }
  uemitEmpty = () => {
    this.userNameInput.focus();
    this.setState({ userName: '' });
  }

  pemitEmpty = () => {
    this.pswInput.focus();
    this.setState({ password: '' });
  }

  onChangeUserName = (e) => {
    this.setState({ userName: e.target.value });
  }

  onChangePassword = (e) => {
    this.setState({ password: e.target.value });
  }

  onChangeVcode = (e) => {
    this.setState({ vCode: e.target.value });
  }

  handleCode = (res) => {
    this.setState({ iCode: res.join("") });
  }

  componentWillMount() {
    var self = this
    const { history, initalLogo } = this.props;
    history.push('/login');
    initalLogo();
    document.onkeydown = function (event) {
      var e = event || window.event;
      if (e && e.keyCode == 13) {
        self.login()
      }
    };
  }

  onRef = (ref) => {
    this.vrifcode = ref
  }

  refresh = () => {
    this.vrifcode.rfresh()
  }

  login = async () => {
    if (this.state.userName == "") {
      message.error('用户名不可为空');
      return
    } else if (this.state.password == "") {
      message.error('密码不可为空');
      return
    } else if (this.state.iCode == "") {
      message.error('验证码不可为空');
      this.vrifcode.rfresh()
      return
    } else if (this.state.iCode != this.state.vCode) {
      message.error('验证码错误');
      this.vrifcode.rfresh()
      return
    }
    let state = store.getState()
    let { username, password } = this.state
    // let res = await axios({
    //   method: 'get',
    //   url: `${state.path}/api/login`,
    //   data: { username, password },
    //   withCredentials: true
    // })
    // store.dispatch({ type: 'SET_IS_LOGIN', isLogin: true })
    sessionStorage.setItem("isLogin", 1)
    store.dispatch({ type: 'SET_USER', user: [] })
    document.onkeydown = function (event) {
      var e = event || window.event;
      if (e && e.keyCode == 13) {
        return false
      }
    };
    document.getElementById('login').click()
  }

  render() {
    const { userName, password, vCode } = this.state;
    const usuffix = userName ? <Icon type="close-circle" onClick={this.uemitEmpty} /> : null;
    const psuffix = password ? <Icon type="close-circle" onClick={this.pemitEmpty} /> : null;
    return (
      <div className="login_container">
        <div className="container">
          <div className="list">
            <div style={{ fontSize: '20px', fontWeight: '800', textAlign: 'center', paddingBottom: '10px' }}>
              <span>网络数据科学与技术重点实验室2018年终考评系统</span>
            </div>
            <div className="line"></div>
            <div style={{ paddingTop: '25px' }}>
              <Input
                style={{ height: '40px' }}
                placeholder="请输入用户名"
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                suffix={usuffix}
                value={userName}
                onChange={this.onChangeUserName}
                ref={node => this.userNameInput = node}
              />
            </div>
            <div style={{ paddingTop: '25px' }}>
              <Input
                style={{ height: '40px' }}
                placeholder="请输入密码"
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                suffix={psuffix}
                value={password}
                type="password"
                onChange={this.onChangePassword}
                ref={node => this.pswInput = node}
              />
            </div>
            <div style={{ paddingTop: '25px' }}>
              <div className="main_Ver_input" >
                <Input value={vCode} onChange={this.onChangeVcode} placeholder="请输入验证码" style={{ height: '40px', textAlign: 'center' }} />
              </div>
              <div className="main_Ver_info">
                <Vrifcode handleCode={this.handleCode} onRef={this.onRef} />
              </div>
              <div onClick={this.refresh} className="main_Ver_zi_su">
                <p>刷新</p>
              </div>
            </div>
            <div style={{ paddingTop: '25px' }}>
              <div className="loginBtn">
                <div onClick={this.login} className="btn">登录</div>
                <Link to='/evaluation_table' id="login"></Link>
              </div>
            </div>
          </div>
        </div>
      </div >
    );
  }
}

let mapStateToProps = () => {
  return {}
}
let mapDispatchToProps = dispatch => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
