import { SOCIALS } from '../data/socials';
import Icon from './Icon';

const Socials = () => {
  return (
    <span>
      {SOCIALS.map((social) => (
        <a
          className={social.icon + '-icon'}
          key={social.icon}
          href={social.href}
          target="_blank"
          rel="noreferrer"
          aria-label={social.ariaLabel}
        >
          <Icon name={social.icon} />
        </a>
      ))}
    </span>
  );
};

export default Socials;
