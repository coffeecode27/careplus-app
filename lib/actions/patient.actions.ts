"use server";

import { ID, InputFile, Query } from "node-appwrite";
import { parseStringify } from "../utils";
import {
  BUCKET_ID,
  DATABASE_ID,
  ENDPOINT,
  PATIENT_COLLECTION_ID,
  PROJECT_ID,
  databases,
  storage,
  users,
} from "../appwrite.config";
// fungsi untuk membuat (post auth) user baru (pasien baru)
export const createUser = async (user: CreateUserParams) => {
  try {
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );
    return parseStringify(newUser);
  } catch (error: any) {
    // jika ada error 409, artinya email sudah terdaftar
    if (error && error?.code === 409) {
      // mencari user berdasarkan email yg kita masukkan dengan yg sudah terdaftar
      const documents = await users.list([Query.equal("email", [user.email])]);
      // mengembalikan data user
      return documents?.users[0];
    }
  }
};

// fungsi untuk get user berdasarkan id (mendapatkan data user yg sudah melakukan proses register awal)
export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);
    return parseStringify(user);
  } catch (error) {
    console.log(error);
  }
};

// fungsi untuk get patient berdasarkan id
export const getPatient = async (userId: string) => {
  try {
    const patient = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      // lakukan query dengan nilai userId samadengan userId yg dikirim dari parameter
      [Query.equal("userId", userId)]
    );
    return parseStringify(patient.documents[0]);
  } catch (error) {
    console.error(error);
  }
};

// fungsi untuk menambahkan data user patient sudah terdaftar (yg datanya sudah terisi lengkap pada tahap register akhir)
/*
  note: ketika menggunakan appwrite, untuk file gambar, tidak akan disimpan kedalam appwrite database,
  tapi akan diupload ke appwrite storage (bekerja dengan bucket)
 */
export const registerPatient = async ({
  identificationDocument,
  ...pasientData
}: RegisterUserParams) => {
  try {
    let file;
    if (identificationDocument) {
      // panggil inputfile dari node-appwrite, lalu panggil fungsi fromBlob dari inputfile yg menerima parameter dengan type blob, dan string fileName
      const inputFile =
        identificationDocument &&
        InputFile.fromBlob(
          identificationDocument?.get("blobFile") as Blob,
          identificationDocument?.get("fileName") as string
        );
      // lalu, kita akan mengupload file tersebut ke appwrite storage
      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
    }

    // setelah mengupload file, kita akan membuat document patient baru dengan data patientData ( untuk patient yg datanya sudah terisi lengkap pada tahap register akhir)
    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id ? file.$id : null, // id diambil dari let file yg sudah berisi data gambar yg berhasil diupload ke appwrite storage
        identificationDocumentUrl: file?.$id
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view??project=${PROJECT_ID}`
          : null, // simpan juga url untuk akses file yg diupload ke appwrite storage
        ...pasientData,
      }
    );
    return parseStringify(newPatient);
  } catch (error) {
    console.error("An error occurred while creating a new patient:", error);
  }
};
