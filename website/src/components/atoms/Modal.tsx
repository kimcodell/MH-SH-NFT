import styles from './Modal.module.css';
import Portal from '../utils/Portal';
import styled from '@emotion/styled';
import { ReactElement } from 'react';

interface ModalProps {
  children: ReactElement;
  open: boolean;
}

export default function Modal ({children, open} : ModalProps) {
  return (
  <Portal elementQuery='#modal'>
    <>
      <ModalOverlay open={open} />
      <ModalWrapper open={open}>
        <ModalInner>{children}</ModalInner>
      </ModalWrapper>
    </>
  </Portal>
  )
}

const ModalOverlay = styled.div((props: {open: boolean}) => ({
  boxSizing: 'border-box',
  display: props.open ? 'block' : 'none',
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  zIndex: 999,
}));

const ModalWrapper = styled.div((props: {open: boolean}) => ({
  boxSizing: 'border-box',
  display: props.open ? 'block' : 'none',
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: 1000,
  overflow: 'auto',
  outline: 0,
}));

const ModalInner = styled.div`
  box-sizing: border-box;
  position: relative;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.5);
  background-color: #fff;
  border-radius: 10px;
  width: 360px;
  max-width: 480px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  margin: 0 auto;
  padding: 40px 20px;
`