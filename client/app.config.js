module.exports = {
    name: 'barcode-scanner-client',
    version: '1.0.0',
    extra: {
      apiUrl: process.env.API_URL,
      stripePK: process.env.STRIPE_PK,
      userId: process.env.CUSTOMER_ID
    },
  };
  
