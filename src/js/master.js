// Инициализация переменных
var topSlider;
var current = "Главная";
var prev = "";
var levels = 0;
var about_carousel;
var sidenav;

// Закрепление эвентов
$(() => {
    $('.lazy-image').lazy();
    // $('body').on('mouseenter', '.folder', openPopupMega);
    // $('body').on('mouseout', '.folder, .folder-content', closePopupMega);
    $('body').on('click', '.categories .folder-link', innerMenu);
    $('body').on('click', '.categories #folder-back', outerMenu);
    $('body').on('click', '#product-carousel .carousel-item', enlargeImage);
    $('body').on('keyup', 'textarea', updateTextarea);
    $(window).on('resize', initAboutCarousel);
    $(window).on('resize', initProductCarousel);

    if($('#top-slider').length){
        topSlider = M.Slider.init(document.querySelector('#top-slider'));
    }

    if($('.sidenav').length){
        sidenav = M.Sidenav.init(document.querySelector('.sidenav'));
    }

    initAboutCarousel();
    initProductCarousel();
});

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
            dist: -50
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
    var parentFolderName = $($(this).parents('.categories').find('.expanded').closest('li').parents('li').children()[0]).text();
    var parentFolder = $(this).parents('.categories').find('.expanded').closest('li').closest('ul').addClass('expanded');

    if(parentFolderName == ""){
        parentFolderName = $(this).data('top');
        $(this).removeClass('link');
    }

    $(this).parents('.categories').find('#folder-name').text(parentFolderName);
    $(this).parents('.categories').find('.expanded').removeClass('expanded');
    parentFolder.addClass('expanded');    
}

// Боковое меню каталога – вход в папку
function innerMenu(e){
    
    var folder = $(this).next('ul');
    
    prev = current;
    current = $(this).prev().text();

    e.preventDefault();
    $('#folder-name').text(current);
    $(this).parents('.categories').find('.expanded').removeClass('expanded');
    folder.addClass('expanded');
    levels ++;

    if(levels > 0){
        $(this).parents('.categories').find('#folder-back').addClass('link');
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