import { Toaster } from 'react-hot-toast';

const GlobalToaster = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#0D1117',
          color: 'white',
          border: '1px solid #161C22',
        },
        success: {
          iconTheme: { primary: '#10B981', secondary: 'white' },
        },
        error: {
          iconTheme: { primary: '#EF4444', secondary: 'white' },
        },
        loading: {
          iconTheme: { primary: '#3B82F6', secondary: 'white' },
        },
      }}
    />
  );
};

export default GlobalToaster;