
import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);

  const subtotal = getCartAmount();
  const shippingFee = subtotal > 0 ? delivery_fee : 0;
  const total = subtotal + shippingFee;

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>
            {currency}
            {subtotal.toFixed(2)}
          </p>{" "}
        </div>
        <hr />
        <div className="flex justify-between">
          <p>Shipping Fee</p>
          <p>
            {currency}
            {shippingFee.toFixed(2)}
          </p>{" "}
        </div>
        <hr />
        <div className="flex justify-between">
          <b>Total</b>
          <b>
            {currency}
            {total.toFixed(2)}
          </b>{" "}
        </div>
      </div>
    </div>
  );
};

export default CartTotal;