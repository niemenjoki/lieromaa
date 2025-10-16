import {
  faFacebook,
  faGithub,
  faInstagram,
  faLinkedin,
  faQuora,
  faTiktok,
  faWhatsapp,
  faXTwitter,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';
import { faMoon, faRss, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Icon = ({ name, ...rest }) => {
  switch (name) {
    case 'rss':
      return <FontAwesomeIcon icon={faRss} {...rest} />;
    case 'github':
      return <FontAwesomeIcon icon={faGithub} {...rest} />;
    case 'instagram':
      return <FontAwesomeIcon icon={faInstagram} {...rest} />;
    case 'quora':
      return <FontAwesomeIcon icon={faQuora} {...rest} />;
    case 'youtube':
      return <FontAwesomeIcon icon={faYoutube} {...rest} />;
    case 'twitter':
      return <FontAwesomeIcon icon={faXTwitter} {...rest} />;
    case 'linkedin':
      return <FontAwesomeIcon icon={faLinkedin} {...rest} />;
    case 'facebook':
      return <FontAwesomeIcon icon={faFacebook} {...rest} />;
    case 'whatsapp':
      return <FontAwesomeIcon icon={faWhatsapp} {...rest} />;
    case 'sun':
      return <FontAwesomeIcon icon={faSun} {...rest} />;
    case 'moon':
      return <FontAwesomeIcon icon={faMoon} {...rest} />;
    case 'tiktok':
      return <FontAwesomeIcon icon={faTiktok} {...rest} />;
    default:
      return null;
  }
};

export default Icon;
