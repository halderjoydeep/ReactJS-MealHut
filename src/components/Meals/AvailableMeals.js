import { useEffect, useState } from "react";
import useHttp from "../../hooks/use-http";
import Card from "../UI/Card";
import classes from "./AvailableMeals.module.css";
import MealItem from "./MealItem/MealItem";

function AvailableMeals() {
  const { isLoading, sendRequest: fetchMeals, error: httpError } = useHttp();
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    const loadMeals = (mealData) => {
      const loadedMeals = [];
      for (const key in mealData) {
        loadedMeals.push({ id: key, ...mealData[key] });
      }
      setMeals(loadedMeals);
    };

    fetchMeals(
      {
        url: "https://react-movies-b9f74-default-rtdb.firebaseio.com/meals.json",
      },
      loadMeals
    );
  }, [fetchMeals]);

  if (isLoading) {
    return (
      <section className={classes.loading}>
        <p>Loading...</p>
      </section>
    );
  }

  if (httpError) {
    return (
      <section className={classes.error}>
        <p>{httpError}</p>
      </section>
    );
  }

  const mealList = meals.map((meal) => <MealItem key={meal.id} meal={meal} />);

  return (
    <section className={classes.meals}>
      <Card>
        <ul>{mealList}</ul>
      </Card>
    </section>
  );
}

export default AvailableMeals;
