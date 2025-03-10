import React, { useState, useEffect } from "react";
import { Article } from "./types";
import { Card, Container, Row, Col } from "react-bootstrap";
import { articles } from "./articles";

const Result: React.FC<{ result: string }> = ({ result }) => {
  if (!result) return null;

  const alertClass = result.includes("✅") ? "alert-success" : "alert-danger";

  return (
    <div className={`alert ${alertClass}`} role="alert">
      {result}
    </div>
  );
};

function NewGameButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="btn btn-online-primary"
      onClick={onClick}
      style={{
        position: "fixed",
        bottom: "20px", // Adjust this value to control the button's vertical position
        left: "50%",
        transform: "translateX(-50%)", // Center the button horizontally
        marginBottom: "0", // Remove any margin
      }}
    >
      Fresh Set
    </button>
  );
}

function Heading() {
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center", // Vertically center the image and text
          justifyContent: "center", // Center the content horizontally
          marginBottom: "1rem", // Slightly bigger bottom margin for more spacing
        }}
      >
        <img
          src="Fakipedia's_F.svg.png"
          alt="Fakipedia Logo"
          style={{
            width: "50px", // Increased logo size to make it bigger
            height: "auto", // Keep aspect ratio
            margin: "-5px -5px 4px 0", // Adjust margin for better alignment
          }}
        />
        <h2
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "3rem", // Larger font size for a bolder title
            fontWeight: "normal", // Keep subtle weight for elegance
            color: "black", // Darker color for a minimalist look
          }}
        >
          akipedia
        </h2>
      </div>
      <h5 style={{ textAlign: "center" }}>
        Can you spot the{" "}
        <span
          style={{
            fontWeight: "bold",
          }}
        >
          FAKE article
        </span>{" "}
        from the{" "}
        <span
          style={{
            fontWeight: "bold",
          }}
        >
          REAL ones
        </span>
        ?
      </h5>
    </>
  );
}

export default function App() {
  const [articleList, setArticleList] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [correctArticle, setCorrectArticle] = useState<Article | null>(null);
  const [result, setResult] = useState<string>("");

  useEffect(() => {
    fetchArticles();
  }, []);

  // Fetch articles and randomly shuffle the selection
  const fetchArticles = () => {
    let newArticleList: Article[] = [];
    let newFakeArticle: Article | null = null;

    do {
      // Shuffle the articles and pick 3 real articles
      const realArticles = articles
        .filter((article) => !article.isFake)
        .sort(() => 0.5 - Math.random()) // Shuffle the real articles
        .slice(0, 3); // Take only 3 real articles

      // Find 1 fake article and randomize it
      const fakeArticles = articles.filter((article) => article.isFake);
      const fakeArticle =
        fakeArticles[Math.floor(Math.random() * fakeArticles.length)];

      // Combine the 3 real articles and the 1 fake article
      newArticleList = [...realArticles, fakeArticle]
        .filter(Boolean)
        .sort(() => 0.5 - Math.random()); // Shuffle again to randomize order

      newFakeArticle = fakeArticle || null;
    } while (
      newArticleList.some((newArticle) =>
        articleList.some((oldArticle) => oldArticle.id === newArticle.id)
      )
    );

    setArticleList(newArticleList as Article[]); // Set the final list of 4 articles
    setCorrectArticle(newFakeArticle); // Set the fake article
    setResult(""); // Clear any previous result when fetching new articles
  };

  // Handle selecting an article
  const handleSelect = (article: Article) => {
    setSelectedArticle(article);

    if (article.isFake) {
      setResult("✅ Awesome! You got it right!");
      setTimeout(() => {
        fetchArticles();
      }, 1500);
    } else {
      // Open the real article URL if it is not fake (open in a new tab)
      window.open(article.url, "_blank");
      setResult("❌ Oops! That's a real article!");
    }
  };

  return (
    <Container className="mt-4">
      <Heading />
      <br />
      <Row>
        {articleList.map((article) => (
          <Col key={article.id} xs={12} md={6}>
            <Card
              className={`mb-3 ${
                selectedArticle?.id === article.id
                  ? article.id === correctArticle?.id
                    ? "border-success"
                    : "border-danger"
                  : ""
              }`}
              onClick={() => handleSelect(article)}
            >
              <Card.Body>
                <Card.Title>{article.title}</Card.Title>
                <Card.Text>{article.snippet}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <div style={{ textAlign: "center", fontSize: "1.2rem" }}>
        <Result result={result} />
      </div>
      <NewGameButton onClick={fetchArticles} />
    </Container>
  );
}
