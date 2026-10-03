import re

with open('app/contact/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

old_submit = """const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };"""

new_submit = """const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Format the message for WhatsApp
    const message = `Hello, my name is ${formData.name}.\nEmail: ${formData.email}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}`;
    
    // Get the phone number from env, remove any non-numeric characters (except maybe +)
    // Use the default if not provided
    const rawNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2349064982841'; 
    // Usually wa.me requires country code without +, e.g., 2349064982841
    const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
    
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    
    await new Promise((r) => setTimeout(r, 600)); // small delay for UX
    
    window.open(whatsappUrl, '_blank');
    
    setLoading(false);
    setSubmitted(true);
  };"""

c = c.replace(old_submit, new_submit)

with open('app/contact/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print('done')
