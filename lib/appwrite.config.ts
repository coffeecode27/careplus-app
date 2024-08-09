import * as sdk from "node-appwrite";

// destructuring env variables
export const {
  NEXT_PUBLIC_ENDPOINT: ENDPOINT,
  PROJECT_ID,
  API_KEY,
  DATABASE_ID,
  PATIENT_COLLECTION_ID,
  DOCTOR_COLLECTION_ID,
  APPOINTMENT_COLLECTION_ID,
  NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
} = process.env;

// setup appwrite client (create new instance from node-appwrite dat import as sdk)
const client = new sdk.Client();

// set endpoint, project, dan key (tanda seru artinya menekankan bahwa config ada atau tersedia)
client.setEndpoint(ENDPOINT!).setProject(PROJECT_ID!).setKey(API_KEY!);

// export client yg baru dibuat kedalam sdk.Databases, sdk.Storage, sdk.Messaging, sdk.Users
export const databases = new sdk.Databases(client);
export const users = new sdk.Users(client);
export const messaging = new sdk.Messaging(client);
export const storage = new sdk.Storage(client);
