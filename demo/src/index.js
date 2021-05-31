import React, {Component} from 'react';
import {render} from 'react-dom';
import {Launcher} from '../../src';
import messageHistory from './messageHistory';
import TestArea from './TestArea';
import Header from './Header';
import Footer from './Footer';
import monsterImgUrl from './../assets/monster.png';
import './../assets/styles';
import $ from 'jquery';



class Demo extends Component {

  constructor() {
    super();
    this.state = {
      messageList: messageHistory,
      newMessagesCount: 0,
      isOpen: false,
      response: 'ariel'
    };
  }

  _onMessageWasSent(message) {
    this.setState({
      messageList: [...this.state.messageList, message]
    });
  }

  _onFilesSelected(fileList) {
    const objectURL = window.URL.createObjectURL(fileList[0]);
    this.setState({
      messageList: [...this.state.messageList, {
        type: 'file', author: 'me',
        data: {
          url: objectURL,
          fileName: fileList[0].name
        }
      }]
    });
  }

  _sendMessage(text) {
    if (text.length > 0) {
      const newMessagesCount = this.state.isOpen ? this.state.newMessagesCount : this.state.newMessagesCount + 1;

      const url = 'http://127.0.0.1:8000/answering_json/';
      this.response = "";
      // let current_obj = this;

      var xhttp = new XMLHttpRequest();
      let that = this;
      xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
          window.setInterval(function () {
            if (xhttp.responseText != "") {
              return;
            }
          }.bind(this), 300);
          this.response = xhttp.responseText;
          // const gimi = this.response;
          this.setState({
            newMessagesCount: newMessagesCount,
            messageList: [...this.state.messageList, {
              author: 'me',
              type: 'text',
              data: { text }
            }
            // , {
            //   author: 'them',
            //   type: 'text',
            //   data: { response }
            // }
            ]
          });

          text = this.response;

          this.setState({
            newMessagesCount: newMessagesCount,
            messageList: [...this.state.messageList, {
              author: 'them',
              type: 'text',
              data: { text }
            }
              // , {
              //   author: 'them',
              //   type: 'text',
              //   data: { response }
              // }
            ]
          });
          // document.getElementById("demo").innerHTML =
          //   this.responseText;
          //   response = JSON.stringify(result);
        }
      }.bind(that);
      xhttp.open("GET", url + "?q=" + text + "&session_id=5", true);
      xhttp.send();

      // var jqXHR=$.ajax({
      //   context: this,
      //   url: url + "?q=" + text + "&session_id=5",
      //   dataType: 'json',
      //   success: function (result) {
      //   // exec_now = true;
      //   response = JSON.stringify(result);
      //
      //   setInterval()
      //
      //   setTimeout( () =>         this.setState({
      //     newMessagesCount: newMessagesCount,
      //     messageList: [...this.state.messageList, {
      //       author: 'me',
      //       type: 'text',
      //       data: { text }
      //     }, {
      //       author: 'them',
      //       type: 'text',
      //       data: { response }
      //     }]
      //   }), 1000 );
      // }});


    }
  }

  _handleClick() {
    this.setState({
      isOpen: !this.state.isOpen,
      newMessagesCount: 0
    });
  }

  render() {
    return <div>
      <Header />
      <TestArea
        onMessage={this._sendMessage.bind(this)}
      />
      <Launcher
        agentProfile={{
          teamName: 'react-chat-window',
          imageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png'
        }}
        onMessageWasSent={this._onMessageWasSent.bind(this)}
        onFilesSelected={this._onFilesSelected.bind(this)}
        messageList={this.state.messageList}
        newMessagesCount={this.state.newMessagesCount}
        handleClick={this._handleClick.bind(this)}
        isOpen={this.state.isOpen}
        showEmoji
      />
      <img className="demo-monster-img" src={monsterImgUrl} />
      <Footer />
    </div>;
  }
}

render(<Demo/>, document.querySelector('#demo'));
