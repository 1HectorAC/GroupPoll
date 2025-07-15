import { useContext, useState } from "react";
import { SocketContext } from "../context/SocketContext";
import OptionSelector from "../components/OptionSelector";
import { useNavigate } from "react-router-dom";

const Join = () => {
    const screenStates = { START: 1, QUESTION: 2, WAITING: 3, ANSWER: 4 };
    const [question, setQuestion] = useState(null);
    const [options, setOptions] = useState(null);
    const [response, setResponse] = useState(null);
    const [screenState, setScreenState] = useState(screenStates.START);
    const [responses, setResponses] = useState(null);
    const navigate = useNavigate();

    const socket = useContext(SocketContext);

    function onSubmitResponseClick() {
        socket.emit('user_response', response);
        setScreenState(screenStates.WAITING);

    }
    function onDoneClick(){
        socket.emit('leave_rooms')
        navigate('/');
    }

    useState(() => {
        socket.on('get_poll', data => {
            console.log(data);
            setQuestion(data.question);
            setOptions(data.options);
            setScreenState(screenStates.QUESTION);
        });
        socket.on('get_results', data => {
            setResponses(data.responses);
            setScreenState(screenStates.ANSWER);
        })

        return () => {
            socket.off('get_poll');
            socket.off('get_results');
        }
    });
    return (
        <div>
            <h1>Join Page</h1>
            {screenState === screenStates.START && <p>Waiting for creator to send Poll...</p>}
            {screenState === screenStates.QUESTION &&
                <div>
                    <h5>Question: {question}</h5>
                    <OptionSelector options={options} response={response} setResponse={setResponse} />
                    <button onClick={onSubmitResponseClick}>Enter</button>
                </div>
            }
            {screenState === screenStates.WAITING && <p>Waiting on poll to end</p>}
            {screenState === screenStates.ANSWER &&
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
export default Join;