import {useContext, useEffect, useState } from "react"
import { SocketContext } from "../context/SocketContext";
import OptionSelector from "../components/OptionSelector";

const Create = () => {
    const [question, setQuestion] = useState(null);
    const [options, setOptions] = useState(null);
    const [totalUsers, setTotalUsers] = useState(1);
    const [responses, setResponses] = useState(null);
    const [userResponseCount, setUserResponseCount] = useState(0);
    const [response, setResponse] = useState(null);
    const socket = useContext(SocketContext);

    function onPollClick() {
        socket.emit('poll', { question: question, options: options });

        // setup responses with initial values
        const totalOptions = options.split(',').length;
        let initialResponses = [];
        for (let i = 0; i < totalOptions; i++) {
            initialResponses.push(0);
        }
        setResponses(initialResponses);
    };
    function onSubmitResponseClick() {
        if(response)
            console.log(response);
    }

    useEffect(() => {
        socket.on('user_enter', () => {
            setTotalUsers(totalUsers + 1);
        })
        socket.on('user_response', (data) => {
            setUserResponseCount(userResponseCount + 1);
        })
        return () => {
            socket.off('user_enter')
        };
    }, [socket, totalUsers, userResponseCount]);

    return (
        <div>
            <h1>Create Page</h1>
            <h5>Question</h5>
            <input type='text' onChange={(e) => setQuestion(e.target.value)} />
            <h5>Option</h5>
            <input type='text' onChange={(e) => setOptions(e.target.value)} />
            <br />
            <p>Total Users:{totalUsers}</p>
            <button onClick={onPollClick}>Enter</button>
            {responses &&
                <div>
                    <hr /> 
                    <OptionSelector  options={options} response={response} setResponse={setResponse}/>
                    <p>TotalResponses:{userResponseCount}/{totalUsers}</p>
                    <button onClick={onSubmitResponseClick}>Enter</button>
                </div>
            }
        </div>
    );
};

export default Create;