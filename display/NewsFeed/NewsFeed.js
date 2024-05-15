const newsContainer = document.querySelector(".news");
const apiUrl = "https://api.nytimes.com/svc/topstories/v2/home.json?api-key=tYy3BrvsU0ro6KXAhXJvPjsg3KR9XSsG";

let currentActive = 0;
let totalNews = 0;
let duration = 3000;

const removeAllActive = () => {
  document.querySelectorAll(".news-single").forEach((n) => {
    n.classList.remove("active");
  });
};

const changeNews = () => {
    if (currentActive >= totalNews - 1) {
      currentActive = 0;
    } else {
      currentActive += 1;
    }
  
    removeAllActive();
  
    const newsSingleAll = document.querySelectorAll(".news-single");
  
    const previousActive = (currentActive === 0) ? totalNews - 1 : currentActive - 1;
  
    newsSingleAll[previousActive].style.opacity = 0;
  
    newsSingleAll[currentActive].style.opacity = 0;
    newsSingleAll[currentActive].style.transform = "translateY(-8px)";
    newsSingleAll[currentActive].classList.add("active");
  
    void newsSingleAll[currentActive].offsetWidth;
  
    newsSingleAll[currentActive].style.transition = "opacity 400ms ease, transform 400ms ease";
    newsSingleAll[currentActive].style.opacity = 1;
    newsSingleAll[currentActive].style.transform = "translateY(0)";
  };  

  fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    const articles = data.results;
    totalNews = articles.length;

    newsContainer.innerHTML = "";

    articles.forEach(article => {
      const headline = article.title;
      const url = article.url;

      const newsItem = document.createElement("a");
      newsItem.classList.add("news-single");
      newsItem.href = url;
      newsItem.target = "_blank";
      newsItem.textContent = headline;

      newsContainer.appendChild(newsItem);
    });

    setInterval(changeNews, duration);
  })
  .catch(error => {
    console.error("Error fetching news:", error);
  });

