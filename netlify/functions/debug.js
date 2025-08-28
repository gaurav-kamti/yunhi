exports.handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      uri: process.env.MONGODB_URI ? "✅ Found" : "❌ Missing",
      db: process.env.MONGODB_DB_NAME,
      collection: process.env.MONGODB_COLLECTION,
    }),
  };
};
