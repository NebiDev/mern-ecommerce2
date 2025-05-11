import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '../componentStyles/GoBackButton.css';

function GoBackButton({ fallback = '/products', label = 'Go Back' }) {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    <button className="go-back-btn" onClick={handleGoBack}>
      <ArrowBackIcon />
      <span>{label}</span>
    </button>
  );
}

export default GoBackButton;

