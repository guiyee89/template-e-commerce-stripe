import { sendOwnerOrderEmail } from "../../../firebaseEmailConfig";

export const useOwnerOrderEmail = async (order, orderId) => {
  try {
    const email = order.buyer.email;
    const subject = "New Purchase Order";
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
                      <h1 style="color:black!important; text-align:center">New purchase order</h1>


                      <h2 style="font-size:1.1rem ; text-decoration:underline; color:black!important; margin-top:40px">Customer Contact</h2>
                      <p style="width: 100%"> 
                        <table role="presentation" width="100%" style="border-spacing: 0; margin: 0 auto;">
                            <tr style= color:black!important>
                                <td style="text-align: left; width: 15%;">Name:</td>
                                <td style="text-align: left; width: 85%;"><strong style="font-size: 0.8rem;">${order.buyer.name} ${order.buyer.lastName}</strong></td>
                            </tr>
                            <tr style= color:black!important>
                              <td style="text-align: left; width: 15%;">Email:</td>
                              <td style="text-align: left; width: 85%;"><strong style="font-size: 0.8rem;">${order.buyer.email}</strong></td>
                            </tr>
                            <tr style= color:black!important>
                              <td style="text-align: left; width: 15%;">Phone:</td>
                              <td style="text-align: left; width: 85%;"><strong style="font-size: 0.8rem;">${order.buyer.phone}</strong></td>
                            </tr>
                        </table>
                        </p>


                      <h2 style="font-size:1.1rem ; text-decoration:underline ; color:black!important; margin-top:40px">Customer Shipping</h2>
                      <p style="width: 100% ; color:black!important"> 
                        <table role="presentation" width="100%" style="border-spacing: 0; margin: 0 auto;">
                          <tr>
                            <td style="text-align: left; width: 15%;">Country:</td>
                            <td style="text-align: left; width: 85%;"><strong style="font-size: 0.8rem;">${order.buyer.country}</strong></td>
                          </tr>
                          <tr>
                            <td style="text-align: left; width: 15%;">State:</td>
                            <td style="text-align: left; width: 85%;"><strong style="font-size: 0.8rem;">${order.buyer.state}</strong></td>
                          </tr>
                          <tr>
                            <td style="text-align: left; width: 15%;">City:</td>
                            <td style="text-align: left; width: 82%;"><strong style="font-size: 0.8rem;">${order.buyer.ciudad}</strong></td>
                          </tr>
                          <tr>
                            <td style="text-align: left; width: 15%;">Address:</td>
                            <td style="text-align: left; width: 85%;"><strong style="font-size: 0.8rem;">${order.buyer.direccion}</strong></td>
                          </tr>
                          <tr>
                            <td style="text-align: left; width: 15%;">Zip Code:</td>
                            <td style="text-align: left; width: 85%;"><strong style="font-size: 0.8rem;">${order.buyer.cp}</strong></td>
                          </tr>

                          <tr>
                            <td style="text-align: left; width: 15%;">Order ID:</td>
                            <td style="text-align: left; width: 85%;"><strong style="font-size: 0.8rem;">${orderId}</strong></td>
                          </tr>
                        </table>
                      </p>

                     

                      <h2 style="font-size:1.1rem ; text-decoration:underline; margin-top:40px">Customer Items</h2>
                      <table role="presentation" style="width: 100%; margin: 0 0 20px; border-spacing: 0 10px; border-bottom: 1px solid lightgrey; border-top: 1px solid lightgrey; padding: 40px 0px;">
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

                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>`;

    await sendOwnerOrderEmail(email, subject, body);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
