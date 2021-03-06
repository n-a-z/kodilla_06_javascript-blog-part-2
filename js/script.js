'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  articleTags: Handlebars.compile(document.querySelector('#template-article-tags').innerHTML),
  articleAuthor: Handlebars.compile(document.querySelector('#template-article-author').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-list-tags').innerHTML),
  authorCloudLink: Handlebars.compile(document.querySelector('#template-list-authors').innerHTML)
};

//Globals
const opts = {
  articleSelector: '.post',
  titleSelector: '.post-title',
  titleListSelector: '.titles',
  articleTagsSelector: '.post-tags .list',
  articleAuthorSelector: '.post-author',
  tagsListSelector: '.tags.list',
  authorsListSelector: '.authors.list',
  cloudClassCount: 5,
  cloudClassPrefix: 'tag-size-'
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
    const linkHTMLData = {id: articleSelector, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
    //const linkHTML = '<li><a href="#' + articleSelector + '"><span>' + articleTitle + '</span></a></li>';
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

function calculateTagsParams(tags) {
  const params = {
    min: 999999999,
    max: 0
  };

  for(let tag in tags) {
    if(tags[tag] > params.max){
      params.max = tags[tag];
    }

    if(tags[tag] < params.min){
      params.min = tags[tag];
    }
  }

  return params;
}

function calculateTagClass(count, params){
  //const normalizedCount = count - params.min;
  //console.log(normalizedCount);

  //const normalizedMax = params.max - params.min;
  //console.log(normalizedMax);

  //const percentage = normalizedCount / normalizedMax;

  //const classNumber = Math.floor( percentage * (opts.cloudClassCount - 1) + 1 );

  //const classNumber = Math.floor( ( (count - params.min) / (params.max - params.min) ) * opts.cloudClassCount + 1 );
  const classNumber = Math.floor( ((count - params.min) / (params.max - params.min)) * (opts.cloudClassCount - 1) + 1 );

  return opts.cloudClassPrefix + classNumber;
}

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
      const linkHTMLData = {articleTag: tag};
      const tagHTML = templates.articleTags(linkHTMLData);
      //const tagHTML = '<li><a href="#tag-' + tag + '"><span>' + tag + '</span></a></li>';
      //console.log(tagHTML);

      /* add generated code to html variable */
      html += tagHTML + ' ';
      //console.log(html);
      //console.log(allTags.indexOf(tagHTML));

      /* [NEW] check if this link is NOT already in allTags */
      //if(!allTags.hasOwnProperty(tag)){
      if(!Object.prototype.hasOwnProperty.call(allTags, tag)){
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

  //console.log(allTags);
  const tagsParams = calculateTagsParams(allTags);
  //console.log('tagsParams: ', tagsParams);

  /* [NEW] create variable for all link HTML cose */
  //let allTagsHTML = '';
  const allTagsData = {tags: []};

  /* [NEW] START LOOP: for each tag in allTags */
  for(let tag in allTags){
    /* [NEW] generate code of a link and add it to AllTagsHTML */
    //allTagsHTML += '<li><a href="#tag-' + tag + '" class="' + calculateTagClass(allTags[tag], tagsParams) + '"><span>' + tag + '</span></a> (' + allTags[tag] + ')</li>';
    //console.log(tag);
    //console.log(allTagsHTML);
    //console.log(allTags[tag], tagsParams);
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
  }

  /* [NEW] add html from allTags to tagList */
  //tagList.innerHTML = allTagsHTML;
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
  //console.log(allTagsHTML);
  //console.log(allTagsData);
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

/* Functions for generating classes for Author Cloud. Not needed if classes are the same as Tag Cloud.
function calculateAuthorParams(authors) {
  const params = {
    min: 999999999,
    max: 0
  };

  for(let author in authors) {
    if(authors[author] > params.max){
      params.max = authors[author];
    }

    if(authors[author] < params.min){
      params.min = authors[author];
    }
  }

  return params;
}

function calculateAuthorClass(count, params){
  const classNumber = Math.floor( ((count - params.min) / (params.max - params.min)) * (opts.cloudClassCount - 1) + 1 );

  return opts.cloudClassPrefix + classNumber;
}
*/

function generateAuthors(){
  /* [NEW] create a new variable allTags with an empty object */
  let allAuthors = {};

  /* find all articles */
  const articles = document.querySelectorAll(opts.articleSelector);
  //console.log(articles);

  /* START LOOP: for every article: */
  for (let article of articles) {

    /* get authors from data-author attribute */
    const articleAuthor = article.getAttribute('data-author');
    //console.log(articleAuthor);

    /* generate HTML of the link */

    const linkHTMLData = {
      articleAuthors: articleAuthor,
      articleAuthorLink: articleAuthor.replace(' ', '-')
    };
    const authorHTML = templates.articleAuthor(linkHTMLData);
    //const authorHTML = '<a href="#author-' + articleAuthor.replace(' ', '-') + '"><span>' + articleAuthor + '</span></a>';
    //console.log(authorHTML);

    /* find authors wrapper */
    const authorList = article.querySelector(opts.articleAuthorSelector);
    //console.log(authorList);

    /* [NEW] check if this link is NOT already in allAuthors */
    if(!Object.prototype.hasOwnProperty.call(allAuthors, articleAuthor)){
      /* [NEW] add generated code to allAuthors array */
      allAuthors[articleAuthor] = 1;
    } else {
      allAuthors[articleAuthor]++;
    }
    //console.log(allAuthors);

    /* insert HTML of all the links into the authors wrapper */
    authorList.innerHTML = 'by ' + authorHTML;
    //console.log(authorList);

  /* END LOOP: for every article: */
  }
  /* [NEW] find list of tags in right column */
  const authorList = document.querySelector(opts.authorsListSelector);

  const authorsParams = calculateTagsParams(allAuthors);

  //let allAuthorsHTML = '';
  const allAuthorsData = {authors: []};

  for(let author in allAuthors){
    /* [NEW] generate code of a link and add it to AllTagsHTML */
    //allAuthorsHTML += '<li><a href="#author-' + author.replace(' ', '-') + '" class="' + calculateTagClass(allAuthors[author], authorsParams) + '"><span>' + author + '</span></a> (' + allAuthors[author] + ')</li>';
    allAuthorsData.authors.push({
      author: author,
      authorLink: author.replace(' ', '-'),
      count: allAuthors[author],
      className: calculateTagClass(allAuthors[author], authorsParams)
    });
  }

  /* [NEW] add html from allAuthorsHTML to authorList */
  //authorList.innerHTML = allAuthorsHTML;
  authorList.innerHTML = templates.authorCloudLink(allAuthorsData);
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
