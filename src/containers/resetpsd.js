import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Vrifcode from '~/components/vrifcode';
import { Button, Input, Icon, message } from 'antd';
import axios from 'axios'
import store from '../state/store'
import { Link } from "react-router-dom";
import * as homeActions from '../redux/reduces/home';

@connect(
  state => ({ home: state.home }),
  dispatch => bindActionCreators(homeActions, dispatch)
)
class Resetpsd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      password: '',
      vCode: '',
      iCode: ''
    };
  }

  componentDidMount() {
    if (sessionStorage.getItem("isret") == 1) {
      let proup = document.getElementById("btn")
      proup.style.cssText += 'display: block';
    } else {
      let proup = document.getElementById("btn")
      proup.style.cssText += 'display: none';
    }
  }

  async submit () {
    let state = store.getState()
    let opsd = document.getElementById("opsd").value
    let npsd = document.getElementById("npsd").value
    let cpsd = document.getElementById("cpsd").value
    if (!opsd || !npsd || !cpsd) {
      message.error('请输入完整的信息');
      return false
    }
    if (npsd.length < 6) {
      message.error('新密码不能少于6位');
      return false
    }
    if (opsd == npsd ) {
      message.error('新密码不能等于旧密码');
      return false
    }
    if (npsd != cpsd ) {
      message.error('两次输入的密码不一致');
      return false
    }
    let res = await axios({
      method: 'POST',
      url: `${state.path}/users/resetpsd`,
      data: { 
        npsd: npsd,
        opsd: opsd,
        uid: sessionStorage.getItem("userId")
      },
    })
    if (res.data.length == 0) {
      message.error('密码错误');
      return
    } else {
      document.getElementById('login').click()
    }
  }

  ret () {
    document.getElementById('login').click()
  }

  render() {
    return (
      <div className="ev_container">
      <Link to='/evaluation_table' id="login"></Link>
        <div style={{ paddingTop: '50px' }} className="ev_body">
          <div style={{ width: '400px' }} className="ev_body_card">
            <div className="ev_body_title">
              修改密码
            </div>
            <div className="line"></div>
            <Input type="password" id="opsd" style={{ marginTop: '20px' }} placeholder="原始密码" />
            <Input type="password" id="npsd" style={{ marginTop: '20px' }} placeholder="新的密码" />
            <Input type="password" id="cpsd" style={{ marginTop: '20px' }} placeholder="确认密码" />
            <div style={{ marginTop: '20px' }} className="line"></div>
            <Button onClick={this.submit} style={{ margin: '10px 0', float: 'right' }} type="primary">确认提交</Button>
            <Button id ="btn" onClick={this.ret} style={{ margin: '10px 0', float: 'left' }} type="primary">返回</Button>
          </div>
        </div>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Resetpsd)
