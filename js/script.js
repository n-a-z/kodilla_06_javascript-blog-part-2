'use strict';

function titleClickHandler(event) {
  event.preventDefault(); //Prevents from changing sites url (will not add #link ad the end)
  const clickedElement = this;
  //console.log('Link was clicked!');

  /* remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');

  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }

  /* add class 'active' to the clicked link */
  //console.log('clickedElement:', clickedElement);
  clickedElement.classList.add('active');

  /* remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts article.active');

  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }

  /* get 'href' attribute from the clicked link */
  const titleLink = clickedElement.getAttribute('href');
  //console.log('Title Link:' + titleLink);

  /* find the correct article using the selector (value of 'href' attribute) */
  const articleSelect = document.querySelector(titleLink);
  //console.log('Article ID:', articleSelect);

  /* add class 'active' to the correct article */
  articleSelect.classList.add('active');
}


//START generating title list
const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector  = '.post-tags .list';

function generateTitleLinks() {
  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';

  /* for each article */
  const articles = document.querySelectorAll(optArticleSelector);
  //console.log(articles);

  let html = '';

  for (let article of articles) {
    /* get the article id */
    const articleSelector = article.getAttribute('id');
    //console.log(articleSelector);

    /* find the title element AND get the title from the title element*/
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    //console.log(articleTitle);

    /* create HTML of the link */
    const linkHTML = '<li><a href="#' + articleSelector + '"><span>' + articleTitle + '</span></a></li>';
    //console.log(linkHTML);

    /* insert link into titleList */
    html += linkHTML;
    //console.log(html);
  }
  titleList.innerHTML = html;

  //Connecting links with clicks
  const links = document.querySelectorAll('.titles a');
  //console.log(links);
  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();


//START generating Tags
function generateTags(){
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);

  /* START LOOP: for every article: */
  for (let article of articles) {

    /* find tags wrapper */
    const tagList = article.querySelector(optArticleTagsSelector);
    //console.log(tagList);

    /* make html variable with empty string */
    let html = '';

    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    //console.log(articleTags);

    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    //console.log(articleTagsArray);

    /* START LOOP: for each tag */
    for(let tag of articleTagsArray) {
      //console.log(tag);

      /* generate HTML of the link */
      const tagHTML = '<li><a href="#tag-' + tag + '"><span>' + tag + '</span></a></li>';
      //console.log(tagHTML);

      /* add generated code to html variable */
      html += tagHTML + ' ';
      //console.log(html);

    /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    tagList.innerHTML = html;

  /* END LOOP: for every article: */
  }
}

generateTags();
