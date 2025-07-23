import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/SocketContext";
import {useNavigate} from 'react-router-dom';

const Home = () => {
    const [room, setRoom] = useState(null);
    const socket = useContext(SocketContext);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    
    function onCreateClick() {
        if(!room){
            setError('Need to enter a room');
            return;
        }

        socket.emit('join_room', {room:room, user:'creator'});
    }
    function onJoinClick(){
        if(!room){
            setError('Need to enter a room');
            return;
        }
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
            {error && <p className="error">{error}</p>}
        </div>
    );
};
export default Home;