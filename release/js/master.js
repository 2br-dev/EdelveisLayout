// Инициализация переменных
var topSlider;
var current = "Главная";
var prev = "";
var levels = 0;

// Закрепление эвентов
$(() => {
    $('.lazy-image').lazy();
    // $('body').on('mouseenter', '.folder', openPopupMega);
    // $('body').on('mouseout', '.folder, .folder-content', closePopupMega);
    $('body').on('click', '.categories .folder-link', innerMenu);
    $('body').on('click', '.categories #folder-back', outerMenu);
    $('body').on('keyup', 'textarea', updateTextarea);
    topSlider = M.Slider.init(document.querySelector('#top-slider'));
});

// Обновление высоты Textarea
function updateTextarea(){
    this.style.height = 0;
    this.style.height = (this.scrollHeight - 7) + 'px';
}

// Боковое меню каталога – выход из папки
function outerMenu(e){
    e.preventDefault();
    var parentFolderName = $($('.expanded').closest('li').parents('li').children()[0]).text();
    var parentFolder = $('.expanded').closest('li').closest('ul').addClass('expanded');

    if(parentFolderName == ""){
        parentFolderName = $(this).data('top');
        $(this).removeClass('link');
    }

    $('#folder-name').text(parentFolderName);
    $('.expanded').removeClass('expanded');
    parentFolder.addClass('expanded');    
}

// Боковое меню каталога – вход в папку
function innerMenu(e){
    
    var folder = $(this).next('ul');
    
    prev = current;
    current = $(this).prev().text();

    e.preventDefault();
    $('#folder-name').text(current);
    $('.expanded').removeClass('expanded');
    folder.addClass('expanded');
    levels ++;

    if(levels > 0){
        $('#folder-back').addClass('link');
    }
}