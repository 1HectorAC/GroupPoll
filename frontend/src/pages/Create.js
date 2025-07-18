import { useContext, useEffect, useState } from "react"
import { SocketContext } from "../context/SocketContext";
import OptionSelector from "../components/OptionSelector";
import { useLocation, useNavigate } from "react-router-dom";

const Create = () => {
    const screenStates = { START: 1, QUESTION: 2, RESULT: 3 };
    const [screenState, setScreenState] = useState(screenStates.START);
    const [question, setQuestion] = useState(null);
    const [options, setOptions] = useState(null);
    const [totalUsers, setTotalUsers] = useState(1);
    const [userResponseCount, setUserResponseCount] = useState(0);
    const [response, setResponse] = useState(null);
    const [responses, setResponses] = useState([]);
    const location = useLocation();
    const {room} = location.state || '';

    const socket = useContext(SocketContext);
    const navigate = useNavigate();

    function onPollClick() {
        // setup responses with initial values
        const totalOptions = options.split(',').length;
        let initialResponses = [];
        for (let i = 0; i < totalOptions; i++) {
            initialResponses.push(0);
        }
        setResponses(initialResponses);

        socket.emit('poll', { question: question, options: options });

        setScreenState(screenStates.QUESTION);
    };
    function onSubmitResponseClick() {
        if (response !== null) {
            // Adding creators response to the responses array
            const temp = [...responses];
            temp[response] = temp[response] + 1;
            setResponses(temp);

            socket.emit('results', { responses: responses });
            setScreenState(screenStates.RESULT);
        }

    }
    function onDoneClick() {
        socket.emit('leave_rooms')
        navigate('/');
    }

    useEffect(() => {
        //Check if in room, need in cases where page is reloaded and auto left room.
        socket.emit('room_check');
        socket.on('room_check_back',(data) => {
            if(data !== room){
                navigate('/');
            }
        })
        if(typeof room === "undefined")
            navigate('/');

        socket.on('user_enter', () => {
            setTotalUsers(totalUsers + 1);
        })
        socket.on('get_user_response', (data) => {
            setUserResponseCount(userResponseCount + 1);
            let temp = [...responses];
            temp[data] = temp[data] + 1;
            setResponses(temp);
        })
        return () => {
            socket.off('user_enter');
            socket.off('get_user_response');
            socket.off('room_check_back');
        };
    }, [socket, totalUsers, userResponseCount, responses, room, navigate]);

    return (
        <div>
            <h1>Poll Creator</h1>
            <p>Room: {room}</p>
            <hr />
            {screenState === screenStates.START &&
                <div>
                    <h3>Question</h3>
                    <input type='text' onChange={(e) => setQuestion(e.target.value)} placeholder="Enter Question Here" />
                    <h3>Options</h3>
                    <p>(seperate with commas)</p>
                    <input type='text' onChange={(e) => setOptions(e.target.value)} placeholder="Ex: one,two,three" />
                    <br />
                    <p>Users Joined:{totalUsers}</p>
                    <p>Click enter when all users have joined</p>
                    <button onClick={onPollClick}>Enter</button>
                </div>
            }
            {screenState === screenStates.QUESTION &&
                <div>
                    <h3>Response</h3>
                    <p>Question: {question}</p>
                    <OptionSelector options={options} response={response} setResponse={setResponse} />
                    <p>Responses (Not counting creator): {userResponseCount}/{totalUsers}</p>
                    <button onClick={onSubmitResponseClick}>Enter</button>
                </div>
            }
            {screenState === screenStates.RESULT &&
                <div>
                    <h3>Results</h3>
                    {options.split(',').map((opt, i) =>
                        <p key={`test${i}`}>{opt} : {responses[i]}</p>
                    )}
                    <button onClick={onDoneClick}>Back Home</button>
                </div>
            }
        </div>
    );
};

export default Create;