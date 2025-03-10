import React, { useState, useEffect } from "react";
import { Article } from "./types.ts";
import { Card, Container, Row, Col } from "react-bootstrap";
import { articles } from "./articles.ts";

const Result = ({ result }) => {
  if (!result) return null;

  const alertClass = result.includes("✅") ? "alert-success" : "alert-danger";

  return (
    <div className={`alert ${alertClass}`} role="alert">
      {result}
    </div>
  );
};

function NewGameButton({ onClick }) {
  return (
    <button
      className="btn btn-online-primary"
      onClick={onClick}
      style={{
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        marginBottom: "0",
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
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1rem",
        }}
      >
        <img
          src="Fakipedia's_F.svg.png"
          alt="Fakipedia Logo"
          style={{
            width: "50px",
            height: "auto",
            margin: "-5px -5px 4px 0",
          }}
        />
        <h2
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "3rem",
            fontWeight: "normal",
            color: "black",
          }}
        >
          akipedia
        </h2>
      </div>
      <h5 style={{ textAlign: "center" }}>
        Can you spot the{" "}
        <span style={{ fontWeight: "bold" }}>FAKE article</span>{" "}
        from the{" "}
        <span style={{ fontWeight: "bold" }}>REAL ones</span>?
      </h5>
    </>
  );
}

export default function App() {
  const [articleList, setArticleList] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [correctArticle, setCorrectArticle] = useState(null);
  const [result, setResult] = useState<string>("");

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = () => {
    let newArticleList = [];
    let newFakeArticle = null;

    do {
      const realArticles = articles
        .filter((article) => !article.isFake)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const fakeArticles = articles.filter((article) => article.isFake);
      const fakeArticle =
        fakeArticles[Math.floor(Math.random() * fakeArticles.length)];

      newArticleList = [...realArticles, fakeArticle]
        .filter(Boolean)
        .sort(() => 0.5 - Math.random());

      newFakeArticle = fakeArticle || null;
    } while (
      newArticleList.some((newArticle) =>
        articleList.some((oldArticle) => oldArticle.id === newArticle.id)
      )
    );

    setArticleList(newArticleList);
    setCorrectArticle(newFakeArticle);
    setResult("");
  };

  const handleSelect = (article) => {
    setSelectedArticle(article);

    if (article.isFake) {
      setResult("✅ Awesome! You got it right!");
      setTimeout(() => {
        fetchArticles();
      }, 1500);
    } else {
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
