function createForm(filters, $) {
	function buildCheckboxList(prefix, element_list) {
		var box = $('<div/>').addClass('input-set');
		var name;
		var divTag;
		$(element_list).each(function(idx){
			name = prefix + $(this)[0];
			divTag = $('<div/>');
			divTag.append($('<input/>').attr('type', 'checkbox').attr('name', name).attr('id', 'id_' + name));
			divTag.append($('<label/>').attr('for', 'id_' + name).text($(this)[1]));
			box.append(divTag);
		});
		return box;
	}
	
	function buildTrWithLabel(label, name, data) {
		var trTag = $('<tr/>');
		trTag.append($('<th/>').append($('<label/>').attr('for', 'id_' + name).text(label)));
		trTag.append($('<td/>').append(data));
		return trTag;
	}
	
	function buildTr(label, data) {
		var trTag = $('<tr/>');
		trTag.append($('<th/>').append($('<label/>').html(label)));
		trTag.append($('<td/>').append(data));
		return trTag;
	}
	
	function buildInput(name) {
		return $('<input/>').attr('id', 'id_' + name).attr('name', name);
	}
	
	function buildInputSet(prefix, element_list) {
		var tableTag = $('<table/>').addClass('input-set');
		var name;
		$(element_list).each(function(idx){
			name = prefix + $(this)[0];
			tableTag.append(buildTrWithLabel($(this)[1], name, buildInput(name)));
		});
		return tableTag;
	}
	
	function buildSelect(name, option_list) {
		var selectTag = $('<select/>').attr('name', name);
		$(option_list).each(function(idx) {
			selectTag.append($('<option/>').val($(this)[0]).text($(this)[1]));
		});
		return selectTag;
	}
	
	function buildLi(label, name) {
		var liTag = $('<li/>');
		liTag.append($('<strong/>').text(label));
		liTag.append(buildInput(name));
		return liTag;
	}
	
	function buildAtmSet(prefix, element_list) {
		var ulTag = $('<ul/>').addClass('input-set');
		var liTag;
		var name;
		$(element_list).each(function(idx) {
			name = prefix + 'liczba-' + $(this)[0];
			liTag = buildLi($(this)[1], name);
			name = prefix + 'kwota-' + $(this)[0];
			liTag.append($('<ul/>').append(buildLi('zazwyczaj na kwotę', name)));
			ulTag.append(liTag);
		});
		return ulTag;
	}
	
	var tableTag = $('<table/>');
	var trTag;
	var pTag;
	
	trTag = buildTr('Jakiego rachunku szukasz?',
		buildCheckboxList('typ_rachunku-', filters['typy_rachunkow']));
	tableTag.append(trTag);
	
	trTag = buildTr('Funkcjonalności rachunku',
		buildCheckboxList('funkcjonalnosci_rachunku-', filters['funkcjonalnosci_rachunkow']));
	tableTag.append(trTag);
	
	trTag = buildTr('Ile transakcji miesięcznie wykonujesz?',
		buildInputSet('transakcje-', filters['typy_oplat']));
	tableTag.append(trTag);
	
	trTag = buildTr('Funkcjonalności karty',
		buildCheckboxList('funkcjonalnosci_karty-', filters['funkcjonalnosci_kart']));
	tableTag.append(trTag);
	
	trTag = buildTr('Ilu kart potrzebujesz?',
		buildSelect('liczba_kart', [[1, 1], [2, 2]]));
	tableTag.append(trTag);
	
	trTag = buildTr('Ilu wypłat z&nbsp;bankomatów dokonujesz miesięcznie?',
		buildAtmSet('wyplaty-', filters['typy_bankomatow']));
	tableTag.append(trTag);
	
	trTag = buildTr('Dodatkowe informacje',
		buildInputSet('operacje-', filters['typy_premii']));
	tableTag.append(trTag);
	
	var formTag = $('<form id="id_form" action="http://calc.api.django.bankier.pl/ror/oblicz/"/>').submit(function(event){
		submitForm($(this), event, $);
	});
	formTag.append(tableTag);
	formTag.append('<p><input type="submit" value="oblicz"/></p>');
	$('#' + readVar('target')).append(formTag);
}

function submitForm(form, event, $) {
	event.preventDefault();
	
	function buildTr(label, data) {
		var trTag = $('<tr/>');
		trTag.append($('<th/>').append($('<label/>').text(label)));
		trTag.append($('<td/>').append(data));
		return trTag;
	}
	
	function procesForm(data) {
		var tableTag = $('<table/>');
		tableTag.append(buildTr('sdf', 'asd'));
		var target = $('#' + readVar('result'));
		target.html('').children().remove();
		target.append($('<pre/>').append(data.result));
	}
	
	$.getJSON(_bankier_ror_main_url + '/ror/oblicz/?' + form.serialize() + '&jsonp_callback=?', procesForm);
}

function readVar(key) {
	for (var i = 0; i < _bankier_ror.length; i++) {
		if (_bankier_ror[i][0] == key) {
			return _bankier_ror[i][1];
		}
	}
	return '';
}

// var _bankier_ror_main_url = 'http://127.0.0.1:8210';
var _bankier_ror_main_url = 'http://calc.api.django.bankier.pl';

(function() {
	function rorInit() {
		var $ = jQuery.noConflict(true);
		$.getJSON(
			_bankier_ror_main_url + '/ror/filtry/' +
			'?user=' + readVar('user') +
			'&timestamp=' + readVar('timestamp') +
			'&hash=' + readVar('hash') +
			'&jsonp_callback=?',
			function(data) {createForm(data, $)}
		);
	}
	var s = document.getElementsByTagName('script')[0];
	var scriptTag = document.createElement('script');
	scriptTag.type = 'text/javascript';
	// scriptTag.src = 'jquery.min.js';
	scriptTag.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js';
	scriptTag.onload = rorInit;
	s.parentNode.insertBefore(scriptTag, s);
})();
