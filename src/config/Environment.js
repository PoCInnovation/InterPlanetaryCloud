const JWT_SECRET = process.env.REACT_APP_JWT_SECRET;
const KEYVALUE_DB_ADDRESS = process.env.REACT_APP_KEYVALUE_DB_ADDRESS;

if (!JWT_SECRET) throw new Error("JWT_SECRET env variable is undefined.");
if (!KEYVALUE_DB_ADDRESS)
    throw new Error("KEYVALUE_DB_ADDRESS env variable is undefined.");

export { JWT_SECRET };
export { KEYVALUE_DB_ADDRESS };
