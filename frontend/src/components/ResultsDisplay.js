const ResultsDisplay = (props) => {
    return (
        <div>
                    <h3>Results</h3>
                    {props.options.split(',').map((opt, i) =>
                        <p key={`test${i}`}>{opt} : {props.responses[i]}</p>
                    )}
                 
        </div>
    )
}
export default ResultsDisplay;