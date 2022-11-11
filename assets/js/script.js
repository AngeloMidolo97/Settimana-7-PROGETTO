var nome;
var cognome;
var addBtn;
var elencoHTML;
var errore;
var erroreElenco;
var elenco = [];
var toggle = true;
var editId = 0;

window.addEventListener('DOMContentLoaded', init);

function init() {
	nome = document.getElementById('nome');
	cognome = document.getElementById('cognome');
	addBtn = document.getElementById('scrivi');
	elencoHTML = document.getElementById('elenco');
	errore = document.getElementById('errore');
	erroreElenco = document.getElementById('erroreElenco');
	printData();
	eventHandler();
}

function eventHandler() {
	addBtn.addEventListener('click', function () {
		if (toggle == true) {
			controlla()
		}else{
			esegui(editId);
		}
	});
}

function printData() {
	fetch('http://localhost:3000/elenco')
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			elenco = data;
			if (elenco.length > 0) {
				errore.innerHTML = '';
				elencoHTML.innerHTML = '';
				elenco.map(function (element) {
					elencoHTML.innerHTML += `<li class="mt-2 border-bottom p-3"><button type="button" class="btn btn-danger me-1" onClick="elimina(${element.id})"><i class="bi bi-x fs-6"></i></button><button type="button" class="btn btn-success me-1" onClick="edit(${element.id}, '${element.nome}', '${element.cognome}')"><i class="bi bi-pencil-square fs-6 text-white"></i></button>${element.nome} ${element.cognome}</li>`;
				});
			} else {
				erroreElenco.innerHTML = 'Nessun elemento presente in elenco';
			}
		});
}

function controlla() {
	if (nome.value != '' && cognome.value != '') {
		var data = {
			nome: nome.value,
			cognome: cognome.value,
		};
		addData(data);
	} else {
		errore.innerHTML = '<i class="bi bi-exclamation-square-fill"></i> Compilare correttamente i campi! <i class="bi bi-exclamation-square-fill"></i>';
		return;
	}
}

async function addData(data) {
	let response = await fetch('http://localhost:3000/elenco', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify(data),
	});
	clearForm();
}

function clearForm() {
	nome.value = '';
	cognome.value = '';
}

function elimina(data) {

	if(!window.confirm('Sei sicuro di voler eliminare questo utente?')){
		return;
	}

	fetch('http://localhost:3000/elenco/' + data, {
		method: 'DELETE'
	})
}

function edit(data, dataName, surname) {
	toggle = false;
	nome.value = dataName;
	cognome.value = surname;
	editId = data;
}

async function esegui(editId) {
	if (nome.value == '' || cognome.value == '') {
		errore.innerHTML = '<i class="bi bi-exclamation-square-fill"></i> Compilare correttamente i campi! <i class="bi bi-exclamation-square-fill"></i>';
		return;
	}
	if(!window.confirm('Sei sicuro di voler modificare questo utente?')){
		return;
	}
	let data = {
		nome: nome.value,
		cognome: cognome.value
	};
	
	let response = await fetch('http://localhost:3000/elenco/' + editId, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json; charset=utf-8'
		},
		body: JSON.stringify(data),
	})
}