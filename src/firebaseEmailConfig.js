import { addDoc, collection } from "firebase/firestore"
import { db } from "./firebaseConfig"


export const sendContactEmail = async (name, email, phone, message) => {
  const collectionRef = collection(db, "email");
  const emailContent = {
    to: "guillermodinanno@gmail.com",
    message: {
      subject: "Customer Message",
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    },
  };
  console.log("Ready to be sent");
  return await addDoc(collectionRef, emailContent);
};

  export const sendSubscribeEmail = async (email, subject, body) => {
    const collectionRef = collection(db, "email");
    const emailContent = {
      to: [email],
      message: {
        subject: subject,
        text: body,
        html: `<p>${body}</p>`
      }
    };
    console.log("Listo para ser enviado");
    return await addDoc(collectionRef, emailContent);
  };

  