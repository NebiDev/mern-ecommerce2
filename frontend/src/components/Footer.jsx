import "../componentStyles/Footer.css";
import { Phone, Mail, Facebook, Instagram, YouTube } from "@mui/icons-material";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* section 1 */}
        <div className="footer-section contact">
          <p>
            <Phone fontSize="small" />
            Phone:000000000
          </p>
          <p>
            <Mail fontSize="small" />
            Email: some@email.com
          </p>
        </div>
        {/* section 2 */}
        <div className="footer-section social">
          <h3>Follow Us</h3>
          <div className="social-links">
            <a href="" className="social-icon" target="_blank"> <Facebook /> </a>
            <a href="" className="social-icon" target="_blank"> <Instagram /> </a>
            <a href="" className="social-icon" target="_blank"> <YouTube /> </a>
            <a href="" className="social-icon" target="_blank"> <Facebook /> </a>
            <a href="" className="social-icon" target="_blank">  </a>           
          </div>
        </div>
        {/* section 3 */}
        <div className="footer-section about">
          <h3>About Us</h3>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.</p>
        </div>

      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Your Company Name. All rights reserved.</p>
        <p>Terms of Service | Privacy Policy</p>
      </div>
    </footer>
  );
};

export default Footer;
