import { useContext, useState } from "react";
import { SocketContext } from "../context/SocketContext";
import {useNavigate} from 'react-router-dom';

const Home = () => {
    const [room, setRoom] = useState();
    const socket = useContext(SocketContext);
    const navigate = useNavigate();
    
    function onCreateClick() {
        //need to check if room exists before (shouldnt exists)
        socket.emit('join_room', room);
        navigate('/Create');
    }
    function onJoinClick(){
        //need to check if room exists before (should exists)
        socket.emit('join_room', room);
        navigate('/Join');

    }
    return (
        <div>
            <h1>Group Poll</h1>
            <hr/>
            <h3>Room</h3>
            <input type='text' onChange={(e) => setRoom(e.target.value)} placeholder="Enter room name here"/>
            <br/><br/>
            <button onClick={onCreateClick}>Create</button>
            <span>   </span>
            <button onClick={onJoinClick}>Join</button>
        </div>
    );
};
export default Home;