import { createOptimizedPicture } from '../../scripts/aem.js';

async function getData() {
  const respsonse = await fetch('https://dummyjson.com/products?limit=0&delay=5000');
  const respsonseJson = await respsonse.json();
  return respsonseJson;
}

export default async function decorate(block) {
  const data = await getData();

  const newUl = document.createElement('ul');
  const products = data?.products;
  if (products.length > 0) {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < products.length; i++) {
      const newLi = document.createElement('li');
      newLi.textContent = products[i].title;
      newUl.appendChild(newLi);
    }
  }

  document.body.appendChild(newUl);

  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(ul);
}
