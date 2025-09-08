import classes from '@/styles/Toggler.module.css';

const Toggler = ({ drawerOpen, clicked }) => {
  const classList = [classes.Toggler];
  if (drawerOpen) classList.push(classes.IsOpen);

  return (
    <button
      className={classList.join(' ')}
      type="button"
      onClick={clicked}
      aria-label="Navbar Toggler"
    >
      <span className={classes.TogglerBox}>
        <span className={classes.TogglerInner}></span>
      </span>
    </button>
  );
};

export default Toggler;
