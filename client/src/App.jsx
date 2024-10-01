import './App.css';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from './components/Home/Home';
import Upload from './components/Upload/Upload';
import About from './components/About/About';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Dashboard from './components/Dashboard/Dashboard';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/upload",
    element: <Upload />
  },
  {
    path: "/about",
    element: <About />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/signup",
    element: <Signup />
  },
  {
    path: "/dashboard",
    element: <Dashboard />
  },
])

function App() {
  return (
    // <div className="App">
      <header className="App-header">
        <RouterProvider router={router} />
      </header>
    // </div>
  );
}


export default App;