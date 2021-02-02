'use strict';

function titleClickHandler(event){
  event.preventDefault(); //Prevents from changing sites url (will not add #link ad the end)
  const clickedElement = this;
  //console.log('Link was clicked!');
  
  /* remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');

  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }

  /* add class 'active' to the clicked link */
  //console.log('clickedElement:', clickedElement);
  clickedElement.classList.add('active');
  
  /* remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts article.active');

  for(let activeArticle of activeArticles){
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
  
const links = document.querySelectorAll('.titles a');
  
for(let link of links){
  link.addEventListener('click', titleClickHandler);
}