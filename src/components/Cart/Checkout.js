import { useRef, useState } from "react";
import classes from "./Checkout.module.css";

const Checkout = (props) => {
  const nameInputRef = useRef();
  const streetInputRef = useRef();
  const postalInputRef = useRef();
  const cityInputRef = useRef();

  const [isValid, setIsValid] = useState({
    name: true,
    street: true,
    postal: true,
    city: true,
  });

  const isLongEnough = (value, chars = 3) => value.trim().length >= chars;
  const isEqual = (value, chars = 6) => value.trim().length === chars;

  const confirmHandler = (event) => {
    event.preventDefault();
    const name = nameInputRef.current.value;
    const street = streetInputRef.current.value;
    const postal = postalInputRef.current.value;
    const city = cityInputRef.current.value;

    const isNameValid = isLongEnough(name);
    const isStreetValid = isLongEnough(street);
    const isCityValid = isLongEnough(city);
    const isPostalValid = isEqual(postal);

    setIsValid({
      name: isNameValid,
      street: isStreetValid,
      city: isCityValid,
      postal: isPostalValid,
    });

    let isFormValid =
      isNameValid && isCityValid && isStreetValid && isPostalValid;

    if (!isFormValid) {
      return;
    }

    // Submit the cart data
    const userData = {
      name: name,
      street: street,
      city: city,
      postal: postal,
    };
    props.onConfirm(userData);
  };

  return (
    <form className={classes.form} onSubmit={confirmHandler}>
      <div className={`${classes.control} ${!isValid.name && classes.invalid}`}>
        <label htmlFor="name">Your Name</label>
        <input ref={nameInputRef} type="text" id="name" />
        {!isValid.name && <p>Please enter a valid name</p>}
      </div>
      <div
        className={`${classes.control} ${!isValid.street && classes.invalid}`}
      >
        <label htmlFor="street">Street</label>
        <input ref={streetInputRef} type="text" id="street" />
        {!isValid.street && <p>Please enter a valid street</p>}
      </div>
      <div
        className={`${classes.control} ${!isValid.postal && classes.invalid}`}
      >
        <label htmlFor="postal">Postal Code</label>
        <input ref={postalInputRef} type="text" id="postal" />
        {!isValid.postal && <p>Please enter a valid Postal Code</p>}
      </div>
      <div className={`${classes.control} ${!isValid.city && classes.invalid}`}>
        <label htmlFor="city">City</label>
        <input ref={cityInputRef} type="text" id="city" />
        {!isValid.city && <p>Please enter a valid City</p>}
      </div>
      <div className={classes.actions}>
        <button type="button" onClick={props.onCancel}>
          Cancel
        </button>
        <button className={classes.submit}>Confirm</button>
      </div>
    </form>
  );
};

export default Checkout;
