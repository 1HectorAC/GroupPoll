import { useContext, useEffect, useState } from "react"
import { SocketContext } from "../context/SocketContext";
import OptionSelector from "../components/OptionSelector";
import { useNavigate } from "react-router-dom";

const Create = () => {
    const [question, setQuestion] = useState(null);
    const [options, setOptions] = useState(null);
    const [totalUsers, setTotalUsers] = useState(1);
    const [responses, setResponses] = useState(null);
    const [userResponseCount, setUserResponseCount] = useState(0);
    const [response, setResponse] = useState(null);
    const [doneCheck, setDoneCheck] = useState(false);
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
    };
    function onSubmitResponseClick() {
        console.log('submited responses');
        console.log('responses: ' + responses);
        console.log('response: ' + response);
        if (response !== null) {
            const test = [...responses];
            const x = response;
            test[x] = test[x] + 1;
            console.log("test: " + test);
            setResponses(test);
            //setDoneCheck(true);
            //socket.emit('results', { responses: responses });
            console.log(response);
            //error updating the responses, does show correctly in results
            console.log(responses);
        }


    }
    function onDoneClick() {
        socket.emit('leave_rooms')
        navigate('/');
    }

    useEffect(() => {
        socket.on('user_enter', () => {
            setTotalUsers(totalUsers + 1);
        })
        socket.on('get_user_response', (data) => {
            setUserResponseCount(userResponseCount + 1);
            let test = [...responses];
            test[data] = test[data] + 1;
            setResponses(test);
        })
        return () => {
            socket.off('user_enter');
            socket.off('get_user_response');
        };
    }, [socket, totalUsers, userResponseCount, responses]);

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
                    <OptionSelector options={options} response={response} setResponse={setResponse} />
                    <p>TotalResponses:{userResponseCount}/{totalUsers}</p>
                    <button onClick={onSubmitResponseClick}>Enter</button>
                </div>
            }
            {doneCheck &&
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