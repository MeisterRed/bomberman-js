import { Component } from 'react';
import Button from 'react-bootstrap/Button';
import {Link} from "react-router-dom";
import { io } from 'socket.io-client';
import './lobby.css'

class Lobby extends Component {
  

    /*constructor(props) {
      super(props)
      this.state = {
        rooms: [],
        socket: io()
      };
    }
  
    componentDidMount() {
      this.state.socket.emit('join lobby');
  
      this.state.socket.on('room data', (room_data) => {
        this.setState({rooms: room_data})
      });
      console.log("Testing 1 2 3")
    }*/
  
  
    /*setName(name) {
      this.state.socket.emit('set name', name);
    };
  
    quickplay() {
      this.state.socket.emit('quickplay');
    }
  
    createRoom() {
      this.state.socket.emit('create room');
    }
  
    joinRoom(roomId) {
      this.state.socket.emit('join room', roomId);
    }
  
    seeRooms() {
      this.state.socket.emit('see rooms');
    } */
  
    render() {
      return (
          <div>
              <div className="leftside">
                  <h3 id="tutorial1">How to Play</h3>
                  <p id="tutorial2">Movement - WASD Keys</p>
                  <p id="tutorial3">Placing Bombs - Z Key</p>
              </div>
  
              <div className="rightside">
                  <h3 id="roomlist">Room List</h3>
                  <Button variant="primary" id="createroom" onclick="window.createRoom()">Create Room</Button>{' '}
  
                  <Link to="/room">
                      <Button variant="primary" id="quickplay">Quickplay</Button>{' '}
                  </Link>
  
                  <Button variant="primary" id="changename">Change Name</Button>{' '}
                  <p id="playername">Placeholder Name</p>
              </div>
          </div>
      )
    }
}

export default Lobby