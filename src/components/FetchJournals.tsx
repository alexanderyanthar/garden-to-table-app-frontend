import { useState, useEffect } from "react";

// API reponse results to ensure proper data saving
interface ApiResponse {
  results: {
    title: string;
    yearPublished: number;
    authors: { name: string }[];
    abstract: string;
    downloadUrl: string;
  }[];
}

interface FetchJournalsProps {
  searchQuery?: string;
}

// Fetch journals function to fetch journals from api call
const FetchJournals = ({ searchQuery = "" }) => {
  // setting useStates to hold data and error handling text
  const [data, setData] = useState<ApiResponse["results"]>([]);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = "https://api.core.ac.uk/v3/search";
  //   Filler api key to hide in git repo
  const apiKey = process.env.REACT_APP_CORE_API_KEY;

  //   calling the api along with query parameters - will update in the coming days
  useEffect(() => {
    // Fetch data function which I'll likely pull out of the useEffect for better code organization
    const fetchData = async () => {
      // Try to call api
      try {
        const response = await fetch(
          `${apiUrl}/works?apiKey=${apiKey}&page=1&pageSize=10&q=title:${searchQuery}`
        );
        // If response not okay, throw error message which will be sent to catch
        // If repsonse okay, set responseData to the ApiResponse interface and away for the response.json()
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const responseData: ApiResponse = await response.json();
        setData(responseData.results);
      } catch (error) {
        console.error("Network response was not ok", error);
        setError("Network response was not ok");
      }
    };
    // Call fetch data at the very end
    fetchData();
    console.log("data", data);
  }, [searchQuery]);

  return (
    <div>
      <h1>Garden To Table</h1>
      {error ? (
        // Display error message if there is an error
        <div>{error}</div>
      ) : // Conditionally render content based on searchQuery
      searchQuery ? (
        data.length > 0 ? (
          <ul>
            {data.map((result, index) => (
              <li key={index}>
                <p>Title: {result.title}</p>
                <p>Year Published: {result.yearPublished}</p>
                {/* Map through authors and display their names */}
                <ul>
                  Authors:
                  {result.authors &&
                    result.authors.map((author, authorIndex) => (
                      <li key={authorIndex}>{author.name}</li>
                    ))}
                </ul>
                <p>Text: {result.abstract}</p>
                <a href={result.downloadUrl} target="_blank">
                  Read the journal here
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>Loading...</p>
        )
      ) : (
        <p>Please enter a search query.</p>
      )}
    </div>
  );
};

export default FetchJournals;
