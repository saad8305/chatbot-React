import ChatInterface from './components/ChatInterface';
import { ThemeProvider } from './context/ThemeContext';
function App()
{
  return (
    <ThemeProvider>
      <div className="App">
        <ChatInterface />
      </div>
    </ThemeProvider>
  );
}

export default App;