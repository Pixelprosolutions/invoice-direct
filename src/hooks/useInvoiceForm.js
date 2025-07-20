import { useForm } from 'react-hook-form';
import { useInvoice } from '../context/InvoiceContext';

export const useInvoiceForm = () => {
  const { invoiceData, updateInvoiceData } = useInvoice();
  
  // Initialize the form with the current invoice data
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    setValue, 
    watch 
  } = useForm({
    defaultValues: invoiceData || {}
  });

  const onSubmit = (data) => {
    updateInvoiceData(data);
  };

  const handleLineItemsChange = (lineItems) => {
    updateInvoiceData({ lineItems });
  };

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateInvoiceData({ logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    updateInvoiceData({ logo: null });
  };

  return {
    register,
    handleSubmit,
    errors,
    setValue,
    watch,
    onSubmit,
    handleLineItemsChange,
    handleLogoChange,
    removeLogo,
    invoiceData
  };
};

export default useInvoiceForm;
