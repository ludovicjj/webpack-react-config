import React, {useCallback, useState} from 'react'
import './app.css'

function App() {
    const [state, setState] = useState({count: 0})

    const handleClick = useCallback(function () {
        setState((state) => {
            return { count: state.count + 1 }
        })
    }, [])

    return (
        <div className="App">
            <h1>I'm configuring setting up Webpack and HMR !!!</h1>
            <p>{`The count now is: ${state.count}`}</p>
            <button onClick={handleClick}>Click me</button>
        </div>
    );
}

export default App