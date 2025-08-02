import './NotFound.css';
import { useNavigate } from 'react-router';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <div className="notfound-graphic">
          <div className="notfound-planet">
            <div className="notfound-crater"></div>
            <div className="notfound-crater"></div>
            <div className="notfound-crater"></div>
          </div>
          <div className="notfound-astronaut">
            <div className="notfound-astronaut-helmet"></div>
            <div className="notfound-astronaut-body"></div>
          </div>
        </div>
        <h1 className="notfound-title">404</h1>
        <p className="notfound-message">We have a problem!</p>
        <p className="notfound-submessage">The page you're looking for seems to have drifted into space.</p>
        <button onClick={() => navigate('/')} className="notfound-button">
          Return to Earth
        </button>
      </div>
    </div>
  );
};

export default NotFound;
