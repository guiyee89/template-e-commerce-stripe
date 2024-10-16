import { sendShippingOrderEmail } from "../../../firebaseEmailConfig";

export const useShippingOrdersEmail = async (order, orderId) => {
  try {
    const email = order.buyer.email;
    const subject = "Your order is being delivered";
    const body = `
      <div style="width:100%;">
        <table role="presentation" width="100%" style="border-spacing: 0; margin: 0 auto; padding: 0;">
          <tr>
            <td align="center">
              <table role="presentation" style="width:100%; max-width: 600px; margin: 0 auto; padding: 20px; text-align: left">
                <tr style="background-color: #e2dfdf4a">
                  <td align="center" style="padding-bottom: 6px; padding-top: 20px">
                    <img src="https://res.cloudinary.com/derdim3m6/image/upload/v1689771276/web%20access/samples%20for%20e-commerce/Logos/2023-07-14_09h48_23-removebg-preview_yq3phy.png" alt="Company Logo" style="max-width: 80px; height: auto; margin-bottom:10px">
                  </td>
                </tr>
                <tr>
                  <td>
                    <h1>Your order is being delivered, <span style="text-transform:capitalize">${
                      order.buyer.name
                    }</span>!</h1>
                    <p>Order ID: <strong style="font-size:0.9rem">${orderId}</strong></p>
                                 
                    <p>It will be arriving on <strong style="font-size:0.9rem">(fecha)</strong></p>

                    <table role="presentation" style="width: 100%; margin: 50px 0; border-spacing: 0 10px; border-bottom: 1px solid lightgrey; border-top: 1px solid lightgrey; padding: 40px 0px;">
                      <thead>
                        <tr style="padding-bottom: 10px;">
                          <th style="width:70px; text-align: center"></th>
                          <th style="width:70px; text-align: center">Item</th>
                          <th style="width:70px; text-align: center">Quantity</th>
                          <th style="width:70px; text-align: center">Color</th>
                          <th style="width:70px; text-align: center">Size</th>
                          <th style="width:70px; text-align: center">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${order.items
                          .map(
                            (item) => `
                          <tr style="margin-bottom: 10px;">
                            <td><img src="${item.img[0]}" alt="${
                              item.title
                            }" style="width:90%; height:auto; margin-right:10px;"/></td>
                            <td style="text-align: center; text-transform: capitalize;">${
                              item.title
                            }</td>
                            <td style="text-align: center; text-transform: capitalize;">${
                              item.quantity
                            }</td>
                            <td style="text-align: center; text-transform: capitalize;">${
                              item.color[0]
                            }</td>
                            <td style="text-align: center; text-transform: uppercase;">${
                              item.size
                            }</td>
                            <td style="text-align: center; text-transform: capitalize;">$ <strong>${(item.discountPrice
                              ? item.discountPrice
                              : item.unit_price
                            ).toFixed(2)} </strong></td>
                          </tr>`
                          )
                          .join("")}
                      </tbody>
                    </table>
                    <div style="background-color: #e2dfdfba; color: #090909; padding: 20px 18px;">
                      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse: collapse;">
                        <tr>
                          <td style="font-size: 1rem; padding-bottom: 20px; border-bottom: 1px solid darkgray;">Shipping:</td>
                          <td align="right" style="font-size: 1rem; padding-bottom: 20px; border-bottom: 1px solid darkgray;">$ ${order.shipment_cost.toFixed(
                            2
                          )}</td>
                        </tr>
                        <tr>
                          <td style="font-size: 1.1rem; font-weight: 600; padding-top: 20px;">Total:</td>
                          <td align="right" style="font-size: 1.1rem; font-weight: 600; padding-top: 20px;">$ ${order.total.toFixed(
                            2
                          )}</td>
                        </tr>
                      </table>
                    </div>
                    <p style="margin-top:40px; font-weight:600; font-size:0.9rem">We hope to see you again soon!</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>`;

    await sendShippingOrderEmail(email, subject, body);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
