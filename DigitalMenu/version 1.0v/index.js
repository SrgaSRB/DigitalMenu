$(document).ready(function () {

    // Kada se klikne na div sa klasom .foodbar-type-1-category-icon
    $('.foodbar-type-1-category').on('click', function () {
        $('.foodbar-type-1-category').removeClass('foodbar-type-1-category-selected');

        $(this).closest('.foodbar-type-1-category').addClass('foodbar-type-1-category-selected');
    });

    // Funkcija za ažuriranje ukupne cene
    function updateTotalPrice() {
        var totalPrice = 0;

        // Prođi kroz sve selektovane stavke i saberi njihove cene
        $('.selected-item-type-1').each(function () {
            var price = parseFloat($(this).find('#entity-price').text().replace(' rsd', ''));
            var quantity = parseInt($(this).find('#selected-entity-quantity').text());
            totalPrice += price * quantity;
            console.log("Price " + price)
            console.log("Quantity " + quantity)

        });

        $('#total-price').text(totalPrice.toFixed(2).replace('.', ',') + ' rsd');
        updateItemCounter();
    }

    // Kada se klikne na dugme "+" u glavnom prikazu
    $(document).on('click', '#quantity-plus', function (e) {
        e.preventDefault(); // sprečava reload stranice zbog href-a

        var entity = $(this).closest('.entity-type-2');

        var quantityElement = entity.find('#entity-quantity');
        var currentQuantity = parseInt(quantityElement.text());

        quantityElement.text(currentQuantity + 1);

        var entityID = entity.find('#EntityID').text();

        var itemName = entity.find('.entity-type-2-info-name').text();
        var selectedItem = $('.selected-item-list-entities').find('.selected-item-type-1-info-name:contains(' + itemName + ')');

        if (selectedItem.length > 0) {
            selectedItem.closest('.selected-item-type-1').find('.text-block-4').text(currentQuantity + 1);
        } else {
            var selectedItemHTML = `
            <div class="selected-item-type-1" data-id="${entityID}">
                <div class="selected-item-type-1-image">
                    <img src="${entity.find('.entity-type-2-image img').attr('src')}" alt="" class="image-4"/>
                    <div class="selected-item-type-1-image-gradiant"></div>
                </div>
                <div class="selected-item-type-1-info">
                    <div class="selected-item-type-1-info-name" data-id="${entityID}">${entity.find('.entity-type-2-info-name').text()}</div>
                    <div class="selected-item-type-1-info-description">${entity.find('.entity-type-2-info-description').text()}</div>
                    <div class="selected-item-type-1-info-price">${entity.find('.entity-type-2-info-price').html()}</div>
                    <div class="selected-item-type-1-info-quantity">
                        <a href="#" id="selected-entity-quantity-minus" class="quantity-button w-button">-</a>
                        <div id="selected-entity-quantity" class="text-block-4">${currentQuantity + 1}</div>
                        <a href="#" id="selected-entity-quantity-plus" class="quantity-button w-button">+</a>
                    </div>
                </div>
                <div class="selected-item-type-1-info-delete">
                    <a href="#" class="selected-item-type-1-info-delete-button w-button">X</a>
                </div>
            </div>
        `;

            $('.selected-item-list-entities').append(selectedItemHTML);
        }

        // Ažuriraj ukupnu cenu
        updateTotalPrice();
    });


    // Kada se klikne na dugme "-" u glavnom prikazu
    $(document).on('click', '#quantity-minus', function (e) {
        e.preventDefault(); // sprečava reload stranice zbog href-a

        // Pronađi roditeljski element .entity-type-2
        var entity = $(this).closest('.entity-type-2');

        // Pronađi količinu iz text-block-8
        var quantityElement = entity.find('#entity-quantity');
        var currentQuantity = parseInt(quantityElement.text());

        // Smanji vrednost količine, ali ne dozvoli da ide ispod 0
        if (currentQuantity > 0) {
            quantityElement.text(currentQuantity - 1);
        }

        // Ažuriraj ili ukloni stavku iz liste
        var itemName = entity.find('.entity-type-2-info-name').text();
        var selectedItem = $('.selected-item-list-entities').find('.selected-item-type-1-info-name:contains(' + itemName + ')');

        if (currentQuantity - 1 > 0) {
            selectedItem.closest('.selected-item-type-1').find('#selected-entity-quantity').text(currentQuantity - 1);
        } else {
            selectedItem.closest('.selected-item-type-1').remove();
        }

        // Ažuriraj ukupnu cenu
        updateTotalPrice();
    });

    // Kada se klikne na dugme "+" ili "-" u listi izabranih stavki
    $(document).on('click', '#selected-entity-quantity-plus, #selected-entity-quantity-minus', function (e) {
        e.preventDefault();

        // Pronađi roditeljski element .selected-item-type-1
        var selectedItem = $(this).closest('.selected-item-type-1');

        // Pronađi količinu iz text-block-4
        var quantityElement = selectedItem.find('#selected-entity-quantity');
        var currentQuantity = parseInt(quantityElement.text());

        // Ažuriraj količinu u zavisnosti od dugmeta "+" ili "-"
        if ($(this).is('#selected-entity-quantity-plus')) {
            quantityElement.text(currentQuantity + 1);
        } else if ($(this).is('#selected-entity-quantity-minus') && currentQuantity > 1) {
            quantityElement.text(currentQuantity - 1);
        }

        // Pronađi EntityID ovog artikla
        var entityID = String(selectedItem.find('.selected-item-type-1-info-name').data('id')).trim();

        // Ažuriraj količinu u glavnom prikazu za isti EntityID
        var mainEntity = $('.entity-type-2').filter(function () {
            var mainEntityID = String($(this).find('#EntityID').text()).trim();
            return mainEntityID === entityID;
        });

        var mainQuantityElement = mainEntity.find('#entity-quantity');
        mainQuantityElement.text(quantityElement.text());

        // Ažuriraj ukupnu cenu
        updateTotalPrice();
    });

    $(document).on('click', '.selected-item-type-1-info-delete-button', function (e) {
        e.preventDefault();

        // Pronađi roditeljski .selected-item-type-1 element iz DOM-a
        var selectedItem = $(this).closest('.selected-item-type-1');

        // Pronađi EntityID izabrane stavke
        var entityID = String(selectedItem.find('.selected-item-type-1-info-name').data('id')).trim();

        // Ukloni stavku iz selektovane liste
        selectedItem.remove();

        // Resetuj količinu u glavnom prikazu pomoću ispravnijeg filtera
        var mainEntity = $('.entity-type-2').filter(function () {
            return $(this).find('#EntityID').text().trim() === entityID;
        });

        if (mainEntity.length > 0) {
            mainEntity.find('#entity-quantity').text('0');
        } else {
            console.log('Entitet nije pronađen');
        }

        // Ažuriraj ukupnu cenu
        updateTotalPrice();
    });

    //////////////////////////////////////////////////////////////////////////////////

    $(document).ready(function() {
        // Kada se klikne na dugme za otvaranje liste
        $('#checked-list-open').on('click', function() {
            // Prikaži listu izabranih stavki (ukloni display: none)
            $('.selected-item-list').css('display', 'block');
        });
    
        // Kada se klikne na dugme za zatvaranje liste
        $('#checked-list-close').on('click', function() {
            // Sakrij listu izabranih stavki (dodaj display: none)
            $('.selected-item-list').css('display', 'none');
        });
    });

    function updateItemCounter() {
        var itemCount = $('.selected-item-type-1').length;
    
        if (itemCount > 0) {
            $('#checked-list-open .item-counter').text(itemCount).css('display', 'flex');
        } else {
            $('#checked-list-open .item-counter').css('display', 'none');
        }
    }
    




});
