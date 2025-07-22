import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/SocketContext";
import {useNavigate} from 'react-router-dom';

const Home = () => {
    const [room, setRoom] = useState();
    const socket = useContext(SocketContext);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    
    //need to adjust clicks, setting userType is async, so may run socket.emit before setting userType
    function onCreateClick() {
        //need to check if room exists before (shouldnt exists)
        socket.emit('join_room', {room:room, user:'creator'});
    }
    function onJoinClick(){
        //need to check if room exists before (should exists)
        socket.emit('join_room', {room:room,user:'other'});
    }

    useEffect(() => {
        socket.emit('leave_rooms');
        socket.on('join_room_confirmation', confirm_data => {
            if(confirm_data.check){
                const data = {room:room};
                if(confirm_data.userType === 'creator')
                    navigate('/Create', {state:data})
                else if(confirm_data.userType === 'other'){
                    navigate('/Join', {state:data});
                }
            }
            else
                setError('If creating: room already exits.if Joining: room doesnt exist')
        })
        return () => {
            socket.off('join_room_confirmation');
        }
    },[navigate,room,socket])
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
            {error && <p style={{color:'red'}}>{error}</p>}
        </div>
    );
};
export default Home;