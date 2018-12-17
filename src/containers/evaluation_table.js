import React, { Component } from 'react';
import store from '../state/store'
import axios from 'axios'
import { Link } from "react-router-dom";
import {
  Modal, Button, Tag, Tooltip, Icon, message, Table, Input, InputNumber, Popconfirm, Form,
} from 'antd';
import { Document, Page } from 'react-pdf';
import logo from '~/assets/ict.png';


const data = [];
const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };
  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      ...restProps
    } = this.props;
    return (
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [{
                      required: title == '分数' ? true : false,
                      message: `请填${title}!`,
                    }],
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data, editingKey: '',
      visible: false,
      isdone: false,
      pdfurl: 'http://storage.xuetangx.com/public_assets/xuetangx/PDF/PlayerAPI_v1.0.6.pdf',
      pdfShow: false,
      pageNumber: 1,
      numPages: null
    };
    this.columns = [
      {
        title: '序号',
        dataIndex: 'key',
        width: '8%',
      },
      {
        title: '姓名',
        dataIndex: 'username',
        width: '15%',
      },
      {
        title: '考核登记表',
        dataIndex: 'summary_table',
        width: '19%',
        render: (key, record) => (
          <span >
            {<Tag className = {key ==0 ? 'ant-tag-none' : ''} onClick={() => this.toWord(record.key, key)} color="blue" key={record.key}>点击查看</Tag>}
          </span>
        )
      },
      {
        title: '评价备注',
        dataIndex: 'detail',
        width: '20%',
        editable: true,
      },
      {
        title: '分数',
        dataIndex: 'score',
        editable: true,
      },
      {
        title: '评分',
        width: '18%',
        dataIndex: 'operation',
        render: (text, record) => {
          const editable = this.isEditing(record);
          return (
            <div>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <a
                        href="javascript:;"
                        onClick={() => this.save(form, record.key)}
                        style={{ marginRight: 8 }}
                      >
                        保存
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm
                    title="确定取消吗?"
                    onConfirm={() => this.cancel(record.key)}
                  >
                    <a>取消</a>
                  </Popconfirm>
                </span>
              ) : (
                  <a className={this.state.isdone ? 'done' : 'nodone'} onClick={() => this.edit(record.key)}>点击打分</a>
                )}
            </div>
          );
        },
      },
    ];
  }

  componentWillMount = async () => {
    let state = store.getState()
    let res = await axios.get(`${state.path}/users/summary?id=${sessionStorage.getItem("userId")}`)
    this.setState({ data: res.data, editingKey: '' });
    if (sessionStorage.getItem("isdone") == 1) {
      this.setState({ isdone: true });
    }
  }

  isEditing = record => record.key === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  }

  toWord(path, key) {
    if (key == 0 || key == 2) {
      message.warning("无法查看")
      return false
    }
    let state = store.getState()
    this.setState({ pdfurl: `${state.path}/images/${path}.pdf`, pdfShow: true, pageNumber: 1 }, () => {
    // this.setState({ pdfurl: `http://storage.xuetangx.com/public_assets/xuetangx/PDF/PlayerAPI_v1.0.6.pdf`, pdfShow: true }, () => {
      let proup = document.getElementById("proup")
      proup.style.cssText += 'display: flex';
    })
    // document.getElementById("myframe").src = `${state.path}/images/${path}.pdf`;
    // let ua = navigator.userAgent;
    // let ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
    //   isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
    //   isAndroid = ua.match(/(Android)\s+([\d.]+)/),
    //   isMobile = isIphone || isAndroid;
    // if (!isMobile) {
    //   let proup = document.getElementById("proup")
    //   proup.style.cssText += 'display: flex';
    // }
  }
  save(form, key) {
    let state = store.getState()
    form.validateFields(async (error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        let res = await axios({
          method: 'POST',
          url: `${state.path}/users/saveSummary`,
          data: {
            u_id: sessionStorage.getItem("userId"),
            s_id: item.id,
            sid: item.sid,
            detail: row.detail,
            score: row.score
          },
        })
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ data: newData, editingKey: '' });
      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: '' });
      }
    });
  }

  edit(key) {
    if (this.state.isdone) {
      return false
    }
    this.setState({ editingKey: key });
  }

  hidden() {
    this.setState({ pdfShow: false })
    var proup = document.getElementById("proup")
    proup.style.cssText += 'display: none';
  }

  resetpsd() {
    sessionStorage.setItem("isret", 1)
    document.getElementById('resetpsd').click()
  }

  logout() {
    sessionStorage.clear()
    document.getElementById('logout').click()
  }

  showModal = () => {
    if (this.state.isdone) return false
    this.setState({
      visible: true,
    });
  }

  handleOk = async (e) => {
    let state = store.getState()
    this.setState({
      visible: false,
    });
    let res = await axios({
      method: 'POST',
      url: `${state.path}/users/commit`,
      data: {
        uid: sessionStorage.getItem("userId"),
      },
    })
    if (res.data.length != 0) {
      sessionStorage.setItem("isdone", 1)
      location.reload()
    } else {
      message.error("出错啦")
    }
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  handleNext = (e) => {
    if (this.state.pageNumber == this.state.numPages) {
      return false
    }
    this.setState({
      pageNumber: this.state.pageNumber + 1
    });
  }

  handleBack = (e) => {
    if (this.state.pageNumber == 1) {
      return false
    }
    this.setState({
      pageNumber: this.state.pageNumber - 1
    });
  }


  render() {
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });
    const { pageNumber, numPages } = this.state;
    return (
      <div className="ev_container">
        <div id="proup" className="proup_wrap">
          <div className="proup_content">
            <label style={{ marginRight: '50px' }} onClick={() => this.hidden()} className="handleBtn">返回</label>
            <label style={{ marginRight: '20px' }} onClick={() => this.handleBack()} className="handleBtn">上一页</label>
            <div className="svgContainer">
              {this.state.pdfShow ? <Document
                file={this.state.pdfurl}
                renderMode="svg"
                onLoadSuccess={this.onDocumentLoadSuccess}
              >
                <Page pageNumber={pageNumber} />
              </Document> : null}
            </div>
            <label style={{ marginLeft: '20px' }} onClick={() => this.handleNext()} className="handleBtn">下一页</label>
          </div>
        </div>
        <div className="ev_header">
          <img style={{ height: '45px', width: '45px', marginTop: '8px', marginLeft: '8px' }} src={logo} />
          <div className="ev_title">网络数据科学与技术重点实验室2018年终考评系统</div>
          <Tooltip title="退出登录">
            <Icon onClick={() => this.logout()} className="ev_icon" style={{ paddingRight: '30px' }} type="poweroff" />
          </Tooltip>
          <Tooltip title="修改密码">
            <Icon onClick={() => this.resetpsd()} className="ev_icon" type="user" />
          </Tooltip>
        </div>
        <Link to='/resetpsd' id="resetpsd"></Link>
        <Link to='/' id="logout"></Link>
        <div className="ev_body">
          <div className="ev_body_card">
            <div className="ev_body_title">
              <span style={{ fontSize: '14PX' }}>考评分数分为5个等级，100-90（优秀） ；89-80（良好）；79-70（合格）；69-60（基本合格）；60以下（不合格）
</span>
            </div>
            <div className="line"></div>
            <Table
              style={{ padding: '20px 0 15PX 0' }}
              components={components}
              bordered
              dataSource={this.state.data}
              columns={columns}
              rowClassName="editable-row"
              pagination={{ pageSize: 200 }}
              pagination={false}
            />
            <div className="line"></div>
            <Button className={this.state.isdone ? 'done' : 'nodone'} onClick={this.showModal} style={{ margin: '10px 0', float: 'right' }} type="primary">全部提交</Button>
            <div>
              <Modal
                title="温馨提示"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
              >
                <p>提交后将不可再修改，是否继续？</p>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EditableTable;
