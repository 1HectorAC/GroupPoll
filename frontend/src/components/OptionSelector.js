const OptionSelector = (props) => {
    const optionsList = props.options.split(',');
    return (
        <div>
            <h3>Question: {props.question}</h3>
            <div style={{display:'flex', justifyContent:'center'}}>
                <div>
                    {optionsList.map((opt, i) =>
                        <div key={'option' + i}>
                            <label>
                                <input
                                    type="radio"
                                    value={i}
                                    checked={props.response === i}
                                    onChange={(e) => props.setResponse(Number(e.target.value))}
                                />
                                <span class="custom-radio"></span>
                                {opt}
                            </label>
                        </div>
                    )}
                    <br/>
                </div>
            </div>

        </div>
    );
};

export default OptionSelector;