import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home';
import { socket, SocketContext } from './context/SocketContext';
import { useEffect, useState } from 'react';
import Create from './pages/Create';
function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }
    function onDisconnect() {
      setIsConnected(false);
    }
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    return () => {
        socket.off('connect', onConnect);
        socket.off('disconnect', onDisconnect);
    };

  },[])

  useEffect(() => {
      socket.connect();
      return () => {
        socket.disconnect();
      }
    },[]);
  return (

    <div className="App">
      <SocketContext.Provider value={socket}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/Create' element={<Create/> } />
          </Routes>
        </BrowserRouter>
      </SocketContext.Provider>

    </div>
  );
};

export default App;
