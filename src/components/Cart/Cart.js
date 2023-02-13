import { useContext, useState } from "react";
import useHttp from "../../hooks/use-http";
import CartContext from "../../store/cart-context";
import Modal from "../UI/Modal";
import classes from "./Cart.module.css";
import CartItem from "./CartItem";
import Checkout from "./Checkout";

function Cart(props) {
  const { isLoading: isSubmitting, sendRequest, error } = useHttp();
  const [didSubmit, setDidSubmit] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const cartCtx = useContext(CartContext);

  const hasItems = cartCtx.items.length > 0;

  function addItemHandler(item) {
    cartCtx.addItem({ ...item, amount: 1 });
  }

  function removeItemHandler(id) {
    cartCtx.removeItem(id);
  }

  function orderHandler() {
    setShowCheckout(true);
  }

  function submitOrderHandler(userData) {
    const urlConfig = {
      url: "https://react-movies-b9f74-default-rtdb.firebaseio.com/orders.json",
      method: "POST",
      body: { user: userData, orderedItems: cartCtx.items },
      headers: { "Application-Type": "application/json" },
    };

    const loadResponse = (data) => {
      setDidSubmit(true);
      cartCtx.clearCart();
    };

    sendRequest(urlConfig, loadResponse);

    if (error) {
      setDidSubmit(false);
    }
  }

  const cartList = cartCtx.items.map((item) => (
    <CartItem
      key={item.id}
      item={item}
      onAdd={addItemHandler.bind(null, item)}
      onRemove={removeItemHandler.bind(null, item.id)}
    />
  ));

  const modalActions = (
    <div className={classes.actions}>
      <button onClick={props.onHideCart} className={classes["button--alt"]}>
        Close
      </button>
      {hasItems && (
        <button className={classes.button} onClick={orderHandler}>
          Order
        </button>
      )}
    </div>
  );

  const modalContent = (
    <>
      <ul className={classes["cart-items"]}>{cartList}</ul>
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>${cartCtx.totalAmount.toFixed(2)}</span>
      </div>
      {showCheckout && (
        <Checkout onConfirm={submitOrderHandler} onCancel={props.onHideCart} />
      )}
      {!showCheckout && modalActions}
    </>
  );

  const didSubmitContent = (
    <>
      <p>Order placed successfully</p>
      <div className={classes.actions}>
        <button onClick={props.onHideCart} className={classes.button}>
          Close
        </button>
      </div>
    </>
  );

  return (
    <Modal onClose={props.onHideCart}>
      {!isSubmitting && !didSubmit && modalContent}
      {isSubmitting && <p>Sending the data</p>}
      {!isSubmitting && didSubmit && didSubmitContent}
    </Modal>
  );
}

export default Cart;
