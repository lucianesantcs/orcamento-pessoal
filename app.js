class Despesa {
  constructor(ano, mes, dia, tipo, descricao, valor) {
    this.ano = ano;
    this.mes = mes;
    this.dia = dia;
    this.tipo = tipo;
    this.descricao = descricao;
    this.valor = valor;
  }

  validarDados() {
    for (let i in this) {
      if (this[i] == undefined || this[i] == '' || this[i] == null) {
        return false;
      }
    }
    return true;
  }
}

class Db {
  constructor() {
    let id = localStorage.getItem('id');
    if (id === null) localStorage.setItem('id', 0);
  }

  getProximoId() {
    let proximoId = localStorage.getItem('id');
    return parseInt(proximoId) + 1;
  }

  gravar(despesa) {
    let id = this.getProximoId();
    localStorage.setItem(id, JSON.stringify(despesa));
    localStorage.setItem('id', id);
  }

  recuperarTodosRegistros() {
    let despesas = Array();

    let id = localStorage.getItem('id');
    for (let i = 1; i <= id; i++) {
      let despesa = JSON.parse(localStorage.getItem(i));
      if (despesa === null) {
        continue;
      }
      despesa.id = i;
      despesas.push(despesa);
    }

    return despesas;
  }

  pesquisar(despesa) {
    let despesasFiltradas = Array();
    despesasFiltradas = this.recuperarTodosRegistros();

    if (despesa.ano != '') {
      despesasFiltradas = despesasFiltradas.filter((ano) => ano.ano == despesa.ano);
    }
    if (despesa.mes != '') {
      despesasFiltradas = despesasFiltradas.filter((mes) => mes.mes == despesa.mes);
    }
    if (despesa.dia != '') {
      despesasFiltradas = despesasFiltradas.filter((dia) => dia.dia == despesa.dia);
    }
    if (despesa.tipo != '') {
      despesasFiltradas = despesasFiltradas.filter((tipo) => tipo.tipo == despesa.tipo);
    }
    if (despesa.descricao != '') {
      despesasFiltradas = despesasFiltradas.filter(
        (descricao) => descricao.descricao == despesa.descricao
      );
    }
    if (despesa.valor != '') {
      despesasFiltradas = despesasFiltradas.filter((valor) => valor.valor == despesa.valor);
    }

    return despesasFiltradas;
  }
  remover(id) {
    localStorage.removeItem(id);
  }
}

let db = new Db();

function cadastrarDespesa() {
  let ano = document.getElementById('ano');
  let mes = document.getElementById('mes');
  let dia = document.getElementById('dia');
  let tipo = document.getElementById('tipo');
  let descricao = document.getElementById('descricao');
  let valor = document.getElementById('valor');

  let despesa = new Despesa(
    ano.value,
    mes.value,
    dia.value,
    tipo.value,
    descricao.value,
    valor.value
  );

  if (despesa.validarDados()) {
    db.gravar(despesa);
    $('#modal_titulo').text('Registro inserido com sucesso.');
    $('#modal_titulo_div').addClass('modal-header text-success');
    $('#modal_conteudo').text('Dispesa cadastrada com sucesso!');
    $('#modal_btn').text('Voltar');
    $('#modal_btn').addClass('btn btn-success');
    $('#modalRegistraDespesa').modal('show');

    ano.value = '';
    mes.value = '';
    dia.value = '';
    tipo.value = '';
    descricao.value = '';
    valor.value = '';
  } else {
    $('#modal_titulo').text('Erro na inclusão do registro');
    $('#modal_titulo_div').addClass('modal-header text-danger');
    $('#modal_conteudo').text(
      'Erro na gravação, verifique se todos os campos foram preenchidos corretamente!'
    );
    $('#modal_btn').text('Voltar e corrigir');
    $('#modal_btn').addClass('btn btn-danger');
    $('#modalRegistraDespesa').modal('show');
  }
}

function carregaListaDespesas(despesas = Array(), filtro = false) {
  if (despesas.length == 0 && filtro == false) {
    despesas = db.recuperarTodosRegistros();
  }

  let listaDespesas = document.getElementById('listaDespesas');
  listaDespesas.innerHTML = '';
  despesas.map((despesa) => {
    let linha = listaDespesas.insertRow();
    linha.insertCell(0).innerHTML = `${despesa.dia}/${despesa.mes}/${despesa.ano}`;

    switch (despesa.tipo) {
      case '1':
        despesa.tipo = 'Alimentação';
        break;
      case '2':
        despesa.tipo = 'Educação';
        break;
      case '3':
        despesa.tipo = 'Lazer';
        break;
      case '4':
        despesa.tipo = 'Saúde';
        break;
      case '5':
        despesa.tipo = 'Transporte';
        break;
    }
    linha.insertCell(1).innerHTML = despesa.tipo;

    linha.insertCell(2).innerHTML = despesa.descricao;
    linha.insertCell(3).innerHTML = despesa.valor;

    let btn = document.createElement('button');
    btn.className = 'btn btn-danger';
    btn.innerHTML = '<i class="fas fa-times"></i>';
    btn.id = `id_despesa_${despesa.id}`;
    btn.onclick = function () {
      let id = this.id.replace('id_despesa_', '');
      db.remover(id);
      window.location.reload();
    };
    linha.insertCell(4).append(btn);
  });
}

function pesquisarDespesa() {
  let ano = document.getElementById('ano').value;
  let mes = document.getElementById('mes').value;
  let dia = document.getElementById('dia').value;
  let tipo = document.getElementById('tipo').value;
  let descricao = document.getElementById('descricao').value;
  let valor = document.getElementById('valor').value;

  let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);
  let despesas = db.pesquisar(despesa);
  let listaDespesas = document.getElementById('listaDespesas');
  listaDespesas.innerHTML = '';
  carregaListaDespesas(despesas, true);
}
