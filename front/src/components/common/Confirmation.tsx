import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button
} from '@mui/material';

type ConfirmOptions = {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
};

type ConfirmContextType = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConfirmOptions & { resolve?: (value: boolean) => void } | null>(null);

  const confirm: ConfirmContextType = (options) => {
    return new Promise<boolean>((resolve) => {
      setState({ ...options, resolve });
    });
  };

  const handleClose = (result: boolean) => {
    state?.resolve?.(result);
    setState(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Dialog open={!!state} onClose={() => handleClose(false)}>
        <DialogTitle>{state?.title || 'Confirm'}</DialogTitle>
        <DialogContent>
          <DialogContentText>{state?.description || 'Are you sure?'}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(false)}>{state?.cancelText || 'Cancel'}</Button>
          <Button onClick={() => handleClose(true)} color="error" variant="contained">
            {state?.confirmText || 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </ConfirmContext.Provider>
  );
}

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) throw new Error('useConfirm must be used within a ConfirmProvider');
  return context;
};