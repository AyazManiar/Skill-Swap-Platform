import { toast, Bounce } from 'react-toastify';
const defaultOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  transition: Bounce,
};
export const toastDefault = (message, theme = 'light') => {
  toast(message, { ...defaultOptions, theme });
};
const createToast = (type) => (message, theme = 'light') => {
  toast[type](message, { ...defaultOptions, theme });
};
export const toastSuccess = createToast('success');
export const toastError = createToast('error');
export const toastInfo = createToast('info');
export const toastWarn = createToast('warn');
