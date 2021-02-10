import { Component } from 'react';
import Button from 'react-bootstrap/Button';
import {Link} from "react-router-dom";
import './room.css'

class Room extends Component {

    componentDidMount() {
  
    }
  
    render() {
    return(
          <div>
              <div className="leftside">
                  <h3 id="players">Players</h3>
                  <h3 id="spectators">Spectators</h3>
              </div>
  
              <div className="rightside">
                  <h3 id="rules">Rule Set</h3>
                  <Button variant="primary" id="ready">Ready</Button>{' '}
  
                  <Link to="/">
                    <Button variant="primary" id="leaveroom">Leave Room</Button>{' '}
                  </Link>
              </div>
          </div>
      )
    }
}

export default Room