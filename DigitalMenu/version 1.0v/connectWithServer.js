$(document).ready(function() {
    // Funkcija za učitavanje podataka sa API-ja
    function fetchLokaliData() {
        return fetch('https://digitalmenuservervice.onrender.com/api/lokali/01')
            .then(response => response.json())
            .catch(error => console.error('Error:', error));
    }

    // Funkcija za prikaz entiteta po kategoriji
    function displayEntitiesByCategory(category) {
        fetchLokaliData().then(data => {
            // Očisti trenutni prikaz entiteta
            $('.category-entites-list').empty();
            
            // Filtriraj entitete po kategoriji
            const entiteti = data.entiteti.filter(entitet => entitet.id.startsWith(category));

            // Kreiraj HTML za svaki entitet u kategoriji
            entiteti.forEach(entitet => {
                const entityHTML = `
                    <div class="entity-type-2">
                        <div id="EntityID">${entitet.id}</div>
                        <div class="entity-type-2-image">
                            <img sizes="(max-width: 479px) 268px, 298px"
                                 srcset="${entitet.slika} 500w, ${entitet.slika} 800w, ${entitet.slika} 1500w"
                                 alt="${entitet.naziv}" 
                                 src="${entitet.slika}" 
                                 loading="lazy" class="image-2"/>
                            <div class="entity2-image-gradiant"></div>
                        </div>
                        <div class="entity-type-2-info">
                            <div class="entity-type-2-info-name">${entitet.naziv}</div>
                            <div class="entity-type-2-info-description">${entitet.opis}</div>
                            <div class="entity-type-2-info-price">
                                Ø 39 <span id="entity-price" class="text-span-5">${entitet.cena.toFixed(2).replace('.', ',')} rsd</span>
                            </div>
                        </div>
                        <div class="order-quantity-div">
                            <a href="#" id="quantity-minus" class="quantity-minus w-button">-</a>
                            <div id="entity-quantity" class="text-block-8">0</div>
                            <a href="#" id="quantity-plus" class="quantity-plus w-button">+</a>
                        </div>
                    </div>
                `;
                // Dodaj entitet u DOM
                $('.category-entites-list').append(entityHTML);
            });
        });
    }

    // Kada se klikne na kategoriju
    $('.foodbar-type-1-category').on('click', function() {
        // Ukloni 'selected' klasu sa svih kategorija
        $('.foodbar-type-1-category').removeClass('foodbar-type-1-category-selected');
        
        // Dodaj 'selected' klasu kliknutoj kategoriji
        $(this).addClass('foodbar-type-1-category-selected');
        
        // U zavisnosti od odabrane kategorije, prikaži entitete
        const categoryName = $(this).find('.foodbar-type-1-category-name').text().toLowerCase();

        switch (categoryName) {
            case 'pice':
                displayEntitiesByCategory('1'); // Pice imaju ID koji počinje sa 1
                break;
            case 'burgeri':
                displayEntitiesByCategory('2'); // Burgeri imaju ID koji počinje sa 2
                break;
            case 'palacinke':
                displayEntitiesByCategory('3'); // Palačinke imaju ID koji počinje sa 3
                break;
            case 'supe':
                displayEntitiesByCategory('4'); // Supe imaju ID koji počinje sa 4
                break;
            case 'piva':
                displayEntitiesByCategory('5'); // Piva imaju ID koji počinje sa 5
                break;
            default:
                console.log('Nepoznata kategorija');
        }
    });

    // Inicijalno prikaži entitete iz odabrane kategorije (npr. burgeri)
    displayEntitiesByCategory('2');
});
