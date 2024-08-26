import { addDoc, arrayUnion, collection, doc, updateDoc } from "firebase/firestore"
import { db } from "./firebaseConfig"


// Email Subscribers List
export const updateEmailList = async (newEmail) => {
  try {
    const refDoc = doc(db, "subscribers", "5UX9hU5jE0yPzIPWfQd4");
    await updateDoc(refDoc, {
      emails: arrayUnion(newEmail),
    });
    console.log("Email updated successfully");
  } catch (err) {
    console.error("Error updating email: ", err);
  }
};

// Subscription Automatic Email
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

// Contact Email
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

// Purchase Automatic Email to Customer
export const sendPurchaseOrderEmail = async (email, subject, body) => {
  const createdAt = new Date().toISOString()
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
  return await addDoc(collectionRef, emailContent, createdAt);
};



// Order Automatic Email to Store Owner

// Send Html Email Template