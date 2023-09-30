import { useState, useEffect } from "react";

interface FoodData {
  description: string;
  foodNutrients: Array<{
    nutrientid: number;
    nutrientName: string;
    unitName: string;
    value: number;
  }>;
}

interface NutritionApiResponse {
  foods: FoodData[];
}

interface FetchNutritionProps {
  searchQuery: string;
  selectedApi: string;
}

const FetchNutrition: React.FC<FetchNutritionProps> = ({
  searchQuery,
  selectedApi,
}) => {
  const [data, setData] = useState<NutritionApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (searchQuery && selectedApi) {
      const apiUrl = `https://api.nal.usda.gov/fdc/v1/foods/search`;
      const apiKey = process.env.REACT_APP_USDA_API_KEY;

      const fetchData = async () => {
        try {
          const response = await fetch(
            `${apiUrl}?api_key=${apiKey}&query=${searchQuery}&dataType=Survey%20%28FNDDS%29`
          );

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const responseData: NutritionApiResponse = await response.json();
          setData(responseData);
        } catch (error) {
          console.error("Network response was not ok", error);
          setError("Network response was not ok");
        }
      };
      fetchData();
    }
  }, [searchQuery, selectedApi]);

  useEffect(() => {
    console.log("This is a response", data);
  }, [data]); // This effect runs whenever 'data' changes

  return (
    <div>
      {error ? (
        <div>{error}</div>
      ) : data ? (
        <div>
          {data.foods.map((food) => (
            <div>
              <h3>{food.description}</h3>
              {/* Display other properties as needed */}
              <h3>Nutirion per 100g</h3>
              <ul>
                {food.foodNutrients.map((nutrient) => (
                  <li key={nutrient.nutrientid}>
                    <p>{nutrient.nutrientName}</p>
                    <p>
                      {nutrient.value} {nutrient.unitName}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default FetchNutrition;
