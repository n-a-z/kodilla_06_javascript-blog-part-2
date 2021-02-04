'use strict';

//Globals
const opts = {
  articleSelector: '.post',
  titleSelector: '.post-title',
  titleListSelector: '.titles',
  articleTagsSelector: '.post-tags .list',
  articleAuthorSelector: '.post-author',
  tagsListSelector: '.tags.list',
  authorsListSelector: '.authors.list'
};

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

function generateTitleLinks(customSelector = '') {
  /* remove contents of titleList */
  const titleList = document.querySelector(opts.titleListSelector);
  titleList.innerHTML = '';

  /* for each article */
  const articles = document.querySelectorAll(opts.articleSelector + customSelector);
  //console.log(articles);
  //console.log(customSelector);

  let html = '';

  for (let article of articles) {
    /* get the article id */
    const articleSelector = article.getAttribute('id');
    //console.log(articleSelector);

    /* find the title element AND get the title from the title element*/
    const articleTitle = article.querySelector(opts.titleSelector).innerHTML;
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


function generateTags(){
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};

  /* find all articles */
  const articles = document.querySelectorAll(opts.articleSelector);

  /* START LOOP: for every article: */
  for (let article of articles) {

    /* find tags wrapper */
    const tagList = article.querySelector(opts.articleTagsSelector);
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
      //console.log(allTags.indexOf(tagHTML));

      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags.hasOwnProperty(tag)){
        /* [NEW] add generated code to allTags array */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }

    /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    tagList.innerHTML = html;
    //console.log(tagList);

  /* END LOOP: for every article: */
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(opts.tagsListSelector);
  //console.log(tagList);

  /* [NEW] create variable for all link HTML cose */
  let allTagsHTML = '';

  /* [NEW] START LOOP: for each tag in allTags */
  for(let tag in allTags){
    /* [NEW] generate code of a link and add it to AllTagsHTML */
    allTagsHTML += '<li><a href="#tag-' + tag + '"><span>' + tag + '</span></a> (' + allTags[tag] + ')</li>';
    console.log(tag);
  }

  /* [NEW] add html from allTags to tagList */
  tagList.innerHTML = allTagsHTML;
  //console.log(allTagsHTML);
}

generateTags();

function tagClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault(); //Prevents from changing sites url (will not add #link ad the end)

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  //console.log(href);

  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  //console.log(tag);

  /* find all tag links with class active */
  const activeLinks = document.querySelectorAll('a.active[href^="#tag-"]');

  /* START LOOP: for each active tag link */
  for(let activeLink of activeLinks) {

    /* remove class active */
    activeLink.classList.remove('active');

  /* END LOOP: for each active tag link */
  }

  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagLinks  = document.querySelectorAll('a[href="' + href + '"]');

  /* START LOOP: for each found tag link */
  for(let tagLink of tagLinks) {
  /* add class active */
    tagLink.classList.add('active');

  /* END LOOP: for each found tag link */
  }

  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
  /* find all links to tags */
  const links = document.querySelectorAll('a[href^="#tag-"]');

  /* START LOOP: for each link */
  for(let link of links) {

    /* add tagClickHandler as event listener for that link */
    link.addEventListener('click', tagClickHandler);

  /* END LOOP: for each link */
  }
}

addClickListenersToTags();

//START generating Authors
function generateAuthors(){
  /* find all articles */
  const articles = document.querySelectorAll(opts.articleSelector);
  //console.log(articles);

  /* START LOOP: for every article: */
  for (let article of articles) {

    /* get authors from data-author attribute */
    const articleAuthor = article.getAttribute('data-author');
    //console.log(articleAuthor);

    /* generate HTML of the link */
    const authorHTML = '<a href="#author-' + articleAuthor.replace(' ', '-') + '"><span>' + articleAuthor + '</span></a>';
    //console.log(authorHTML);

    /* find authors wrapper */
    const authorList = article.querySelector(opts.articleAuthorSelector);
    //console.log(authorList);

    /* insert HTML of all the links into the authors wrapper */
    authorList.innerHTML = 'by ' + authorHTML;
    //console.log(authorList);

  /* END LOOP: for every article: */
  }
}

generateAuthors();

function authorClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault(); //Prevents from changing sites url (will not add #link ad the end)

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  //console.log(href);

  /* make a new constant "author" and extract author from the "href" constant */
  let author = href.replace('#author-', '');
  author = author.replace('-', ' ');
  //console.log(author);

  //START This part is only needed for multiple authors and can be deleted for a single author
  /* find all author links with class active */
  const activeLinks = document.querySelectorAll('a.active[href^="#author-"]');

  /* START LOOP: for each active author link */
  for(let activeLink of activeLinks) {

    /* remove class active */
    activeLink.classList.remove('active');

  /* END LOOP: for each active author link */
  }

  /* find all author links with "href" attribute equal to the "href" constant */
  const authorLinks  = document.querySelectorAll('a[href="' + href + '"]');

  /* START LOOP: for each found author link */
  for(let authorLink of authorLinks) {
  /* add class active */
    authorLink.classList.add('active');

  //END This part is only needed for multiple authors and can be deleted for a single author
  /* END LOOP: for each found author link */
  }

  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthors(){
  /* find all links to authors */
  const links = document.querySelectorAll('a[href^="#author-"]');
  //console.log(links);

  /* START LOOP: for each link */
  for(let link of links) {

    /* add authorClickHandler as event listener for that link */
    link.addEventListener('click', authorClickHandler);
    //console.log(link);

  /* END LOOP: for each link */
  }
}

addClickListenersToAuthors();
