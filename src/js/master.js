// Инициализация переменных
var topSlider;
var current = "Главная";
var prev = "";
var levels = 0;
var about_carousel;
var sidenav;
var storedImage

// Закрепление эвентов
$(() => {
    // $('body').on('mouseenter', '.folder', openPopupMega);
    // $('body').on('mouseout', '.folder, .folder-content', closePopupMega);
    $('body').on('click', '.categories .folder-link', innerMenu);
    $('body').on('click', '.categories .folder-back', outerMenu);
    $('body').on('click', '#product-carousel .carousel-item', enlargeImage);
    $('body').on('keyup', 'textarea', updateTextarea);
    $(window).on('resize', initAboutCarousel);
    $('body').on('click', '.arrow-left', productSliderPrev);
    $('body').on('click', '.arrow-right', productSliderNext);
    $('body').on('click', '.specific-header', openTab);
    
    init();
});

function openTab(e){
    e.preventDefault();
    var target = $(this).attr('href');
    var id = target.replace('#', '');
    var targetEl = $('[data-id="'+id+'"]');
    $('.specific-body, .specific-header').removeClass('active').attr("style", "");
    var specHeight = $(targetEl).find('.title').outerHeight() + $(targetEl).find('.intro').outerHeight() + $(window).outerWidth() *.65;
    
    $('[data-id="'+id+'"').addClass('active').css({
        maxHeight: specHeight+'px'
    });
    $('[href="'+target+'"]').addClass('active');
}

function init(){
    initAboutCarousel();
    initProductCarousel();
    initSideMenu();
    initSpecifics();

    $('.lazy-image').lazy();
    $('.materialboxed').materialbox({
        onOpenStart: e => {
            storedImage = $(e).css('background-image');
        },
        onCloseEnd: e => {
            $(e).css({
                backgroundImage: storedImage
            })
        }
    });

    if($('#top-slider').length){
        topSlider = M.Slider.init(document.querySelector('#top-slider'));
    }
    
    if($('.sidenav').length){
        sidenav = M.Sidenav.init(document.querySelector('.sidenav'));
    }
}

function initSpecifics(){
    var targetEl = $('[data-id="spec-0"]');
    var specHeight = $(targetEl).find('.title').outerHeight() + $(targetEl).find('.intro').outerHeight() + $(window).outerWidth() *.65;
    $($('.specific-header')[0]).addClass('active');
    $($('.specific-body')[0]).addClass('active').css({
        maxHeight: specHeight+'px'
    });
    $('.specific-header').each((index, header) => {
        var clone = $(header).clone();
        $('.specific-headers').append(clone);
    })
}

function productSliderNext(){
    about_carousel[0].next();
}

function productSliderPrev(){
    about_carousel[0].prev();
}

function initSideMenu(){

    if($('.catalog-ul').length){

        var current_id;
        
        $('.categories').each((index, category) => {
            
            currentId = readCookie('current_id') || 0;
            var limit;

            if(!$(category).parents('.sidenav').length){
                if(parseInt(currentId) == 0){
                    currentId="1"
                }
                limit = 1;
            }else{
                limit = 0;
            }

            var current_folder = $(category).find('ul[data-id='+currentId+']');
            if(!current_folder.length){
                var temp = $(category).find('li[data-id='+currentId+']').data('parent');
                current_folder = $(category).find('ul[data-id='+temp+']');
            }

            // var current_folder = $(category).find('[data-id='+currentId+']');
            var current_parent = current_folder.data('parent');
            var folder_name_wrapper = $(category).find('.folder-name');
            current_folder.addClass('expanded');
            folder_name_wrapper.text(current_parent);

            if(parseInt(currentId) == limit){
                $(category).find('.folder-back').removeClass('link');
            }

        });
    }
}

function enlargeImage(){
    var backgroundImage = ($(this).css('backgroundImage'));
    $('.product-image').css({
        backgroundImage: backgroundImage
    })
    $('#product-carousel .carousel-item').removeClass('active');
    $(this).addClass('active');
}

function initAboutCarousel(){
    if($('#certificates').length){
        var elems = document.querySelectorAll('#certificates');
        about_carousel = M.Carousel.init(elems, {
            dist: -50,
            duration: 200
        });
    }
}

function initProductCarousel(){
    if($('#product-carousel').length){
        var elems = document.querySelectorAll('#product-carousel');
        about_carousel = M.Carousel.init(elems, {
            dist: 100,
            numVisible: 8,
            padding: 20,
            fullWidth: true
        });
    }
}

// Обновление высоты Textarea
function updateTextarea(){
    this.style.height = 0;
    this.style.height = (this.scrollHeight - 7) + 'px';
}

// Боковое меню каталога – выход из папки
function outerMenu(e){
    e.preventDefault();

    if(!$(this).hasClass('link')){
        return;
    }

    var parentFolderEl = $(this).parents('.categories').find('.expanded').parents('ul');
    var parentFolder = parentFolderEl.data('parent');
    var parentId = parentFolderEl.data('id');

    $('.categories').each((index, category) => {
        var limit=1;
        // if($(category).parents('.sidenav').length){
        //     limit = 0;
        // }else{
        //     limit = 1;
        // }

        if(parentId >= limit){
            $(category).find('.expanded').removeClass('expanded');
            $(category).find('[data-id='+parentId+']').addClass('expanded');
            $(category).find('.sidebar-navi .folder-name').text(parentFolder);
        }

        // document.cookie = ['current_id='+parentId];
    })


    $('.folder-name').each((index, el) => {
        if(parseInt(parentId) <= 1 && !$(el).parents('.sidebar-navi').find('[data-id='+(parentId-2)+']').length){
            $(el).parent().removeClass('link');
        }
    });
}

// Боковое меню каталога – вход в папку
function innerMenu(e){
    
    e.preventDefault();

    var folder = $(this).next('ul').data('id');
    var folderNameWrapper = $('.sidebar-navi .folder-back');
    var prevText = $(this).next('ul').data('parent');
    var newCurrent = $(this).next('ul').data('id');   

    $('.sidebar-navi .expanded').removeClass('expanded');
    $('[data-id='+folder+']').addClass('expanded');
    $('.folder-name').text(prevText);
    
    // document.cookie = "current_id="+ newCurrent;

    if(newCurrent > 1){
        folderNameWrapper.addClass('link');
    }
}

// Асинхронная загрузка скриптов
loadScript = (url, callback) => {

	var script = document.createElement("script")
	script.type = "text/javascript";

	if (script.readyState){  //IE
		script.onreadystatechange = function(){
			if (script.readyState == "loaded" ||
					script.readyState == "complete"){
				script.onreadystatechange = null;
				callback();
			}
		};
	} else {  //Others
		script.onload = function(){
			callback();
		};
	}

	script.src = url;
	document.getElementsByTagName("head")[0].appendChild(script);
}

// Вызов инициализации карты
if($('#map').length){
    loadScript("https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.4.3/build/ol.js", () => {
        initMap();
    })
}

// Инициализация карты
function initMap(){

    var coords = [38.947735, 45.631237];
    
    var style = new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [.5, 1],
            src: '/img/map_marker.png'
        })
    });
    
    var marker = new ol.Feature({
        type: 'icon',
        geometry: new ol.geom.Point(ol.proj.fromLonLat(coords))
    })

    var vectorSource = new ol.source.Vector({
        features: [marker]
    })

    var vectorLayer = new ol.layer.Vector({
		source: vectorSource,
        style: style
	});

    var map = new ol.Map({
        target: 'map',  // The DOM element that will contains the map
        interactions: ol.interaction.defaults({mouseWheelZoom:false}), //Disable scroll event
		renderer: 'canvas', // Force the renderer to be used
		layers: [
			// Add a new Tile layer getting tiles from OpenStreetMap source
			new ol.layer.Tile({
				source: new ol.source.OSM({
					url: "https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png"
				})
			}),
			vectorLayer
		],
		// Create a view centered on the specified location and zoom level
		view: new ol.View({
			center: ol.proj.fromLonLat(coords),
			zoom: 16
		})
    });  
    
    // Эвент по клику на маркере
    map.on('click', function(evt) {
        var f = map.forEachFeatureAtPixel(
            evt.pixel,
            function(ft, layer){return ft;}
        );
        if (f && f.get('type') == 'icon') {

            var url = "https://yandex.ru/maps/?pt=";
            url += coords[0]+","
                + coords[1]+"&"
                + "z=17&l=map";

            var linkEl = $('<a href="'+url+'" target="_blank">Google</a>');
            $('#map').append(linkEl);
            linkEl[0].click();
            $(linkEl).remove();
        }        
    });

    map.on("pointermove", function (evt) {
        var hit = this.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
            return true;
        }); 
        if (hit) {
            this.getTargetElement().style.cursor = 'pointer';
        } else {
            this.getTargetElement().style.cursor = '';
        }
    });
}

// Чтение куков
function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}