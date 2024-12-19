import React, { useState, useEffect } from 'react';

const MealTracking = () => {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    fetch('/api/meal')
      .then((response) => response.json())
      .then((data) => setMeals(data))
      .catch((error) => console.error('Error fetching meal data:', error));
  }, []);

  return (
    <div className="meal-tracking">
      <h2>Meal Tracking</h2>
      <ul>
        {meals.map((meal) => (
          <li key={meal.id}>
            {meal.player} - Meal: {meal.meal_type} - Time: {meal.timestamp}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MealTracking;