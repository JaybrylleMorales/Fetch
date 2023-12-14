let input = document.getElementById('input');
let outputDiv = document.getElementById('output');

 input.addEventListener('keydown', keyPress);

 async function keyPress(event) {
   if (event.key === 'Enter') {
     await searchManga();
   }
 }

 async function searchManga() {
  let Term = input.value.trim();

   if (Term === '') {
     alert('Please Enter the Accurate Manga');
     return;
   }

   let API = `https://api.mangadex.org/manga?title=${encodeURIComponent(Term)}`;

   try {
     let response = await fetch(API);

     if (!response.ok) {
       throw new Error('Invalid Network Response');
    }

     let data = await response.json();
     displayOutput(data);
   } catch (error) {
     console.error('Error fetching data:', error);
     outputDiv.innerHTML = 'Error fetching data. Please try again later.';
   }
 }
async function displayOutput(data) {
  outputDiv.innerHTML = '';

  if (data.data.length === 0) {
    outputDiv.innerHTML = 'Manga not found.';
    return;
  }

  for (let manga of data.data) {
    let title = manga.attributes.title.en || 'Title is not Found';
    let description = manga.attributes.description.en || 'Description is not Found';
    let coverRelationship = manga.relationships.find(rel => rel.type === 'cover_art');
    let coverId = coverRelationship ? coverRelationship.id : null;

    if (coverId) {
      try {
        let coverResponse = await fetch(`https://api.mangadex.org/cover/${coverId}`);

        if (coverResponse.ok) {
          let coverData = await coverResponse.json();
          let imageUrl = coverData.data.attributes.fileName;
          let coverUrl = `https://uploads.mangadex.org/covers/${manga.id}/${imageUrl}`;

          // Create a four-column layout for each manga
          let mangaDiv = document.createElement('div');
          mangaDiv.classList.add('manga-card'); 
          mangaDiv.innerHTML = 
            `<div class="manga-title">${title}</div>
             <div class="manga-cover"><img src="${coverUrl}" alt="${title} cover"></div>
             <div class="manga-description">${description}</div>
             <div class="manga-empty"></div>`; // Empty column for spacing

          outputDiv.appendChild(mangaDiv);
        } else {
          throw new Error('Fetching Error.');
        }
      } catch (error) {
        console.error('Fetching Error:', error);
      }
    } else {
      console.error('Manga Cover is not available:', manga.id);
    }
  }
}
