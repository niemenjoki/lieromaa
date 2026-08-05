'use client';

import { useEffect, useId, useRef, useState } from 'react';

import classes from './WormHuntSpot.module.css';

function restoreFocus(target) {
  const focusTarget = () => {
    if (target?.isConnected) {
      target.focus({ preventScroll: true });
    }
  };

  if (typeof globalThis.requestAnimationFrame === 'function') {
    globalThis.requestAnimationFrame(focusTarget);
    return;
  }

  focusTarget();
}

export default function WormHuntSpot({ clue }) {
  const triggerRef = useRef(null);
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const generatedId = useId().replaceAll(':', '');
  const dialogId = `worm-hunt-${generatedId}`;
  const titleId = `${dialogId}-title`;
  const descriptionId = `${dialogId}-description`;
  const [isOpen, setIsOpen] = useState(false);
  const alignmentClass = clue.align === 'start' ? classes.AlignStart : classes.AlignEnd;

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const openDialog = () => {
    const dialog = dialogRef.current;

    if (!dialog || dialog.open) {
      return;
    }

    dialog.showModal();
    setIsOpen(true);

    const focusCloseButton = () => closeButtonRef.current?.focus();
    if (typeof globalThis.requestAnimationFrame === 'function') {
      globalThis.requestAnimationFrame(focusCloseButton);
    } else {
      focusCloseButton();
    }
  };

  const closeDialog = () => {
    if (dialogRef.current?.open) {
      dialogRef.current.close();
    }
  };

  const handleCancel = (event) => {
    event.preventDefault();
    closeDialog();
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      closeDialog();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    restoreFocus(triggerRef.current);
  };

  return (
    <div
      className={`${classes.Spot} ${alignmentClass}`}
      data-worm-hunt-position={clue.number}
    >
      <button
        ref={triggerRef}
        type="button"
        className={classes.Trigger}
        aria-controls={dialogId}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={`Mato ${clue.number}/${clue.total}, kirjain ${clue.letter}. Avaa vihje.`}
        onClick={openDialog}
      >
        <svg
          className={classes.WormGraphic}
          viewBox="0 0 58 26"
          aria-hidden="true"
          focusable="false"
        >
          <path className={classes.WormBody} d="M4 19 C7.2 10.2, 11.2 5.8, 16 8.6" />
          <path
            className={classes.WormBody}
            d="M14.7 8 C19.4 6.3, 23.2 9.1, 25.4 15.1 C27.8 21.2, 32.4 22.4, 37.6 19"
          />
          <path className={classes.WormBody} d="M36.7 19.5 C41.2 17.5, 44 11.2, 48.3 9" />
          <path
            className={classes.WormSegment}
            d="M11.8 8.5 14.3 10.5M22.8 11.5 25.7 12.8M33.8 20l.5-3"
          />
          <circle className={classes.WormHead} cx="49" cy="8.6" r="4.2" />
          <circle className={classes.WormEye} cx="50.4" cy="7.5" r="0.75" />
        </svg>
        <span className={classes.Code} aria-hidden="true">
          {clue.number}. {clue.letter}
        </span>
      </button>

      <dialog
        ref={dialogRef}
        id={dialogId}
        className={classes.Dialog}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onCancel={handleCancel}
        onClick={handleBackdropClick}
        onClose={handleClose}
      >
        <div className={classes.DialogPanel}>
          <div className={classes.DialogHeader}>
            <div>
              <p className={classes.FoundCode}>
                Mato {clue.number}/{clue.total} · kirjain {clue.letter}
              </p>
              <h2 id={titleId}>{clue.title}</h2>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              className={classes.CloseButton}
              aria-label="Sulje matovihje"
              onClick={closeDialog}
            >
              <span aria-hidden="true">×</span>
              <span className={classes.CloseLabel}>Sulje</span>
            </button>
          </div>

          <div id={descriptionId} className={classes.DialogContent}>
            {clue.message ? <p>{clue.message}</p> : null}
            {clue.hint ? (
              <div className={classes.Hint}>
                <p className={classes.HintLabel}>Vihje seuraavalle madolle</p>
                <p>{clue.hint}</p>
              </div>
            ) : null}
          </div>
        </div>
      </dialog>
    </div>
  );
}
