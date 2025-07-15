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
            <h1>Group Poll Home</h1>
            <p>Enter Group</p>
            <input type='text' onChange={(e) => setRoom(e.target.value)} />
            <br/>
            <button onClick={onCreateClick}>Create</button>
            <br/><br/>
            <button onClick={onJoinClick}>Join</button>
            
        </div>
    );
};
export default Home;