
export function Rodape({dadosTabela, linhasTabela}) {
  let totalDia = somarAtendimentosDia(linhasTabela);
  const totalMetaDia = somarMetaDia(dadosTabela);
  let totalAtingidoDia = calculaPorcentagemDia(dadosTabela);

  let totalMes = somarAtendimentosMes(dadosTabela) + totalDia;
  const totalMetaMes = somarMetaMes(dadosTabela);
  let totalAtingidoMes = calcularPorcentagemMes(dadosTabela);

  return (
    <div className="flex border border-t-0 divide-x border-black bg-[#337B5B] w-full">
      <div className="flex items-center justify-center border-black w-[300px]">
        <p className="font-semibold text-white">Total</p>
      </div>

      <div className="flex items-center justify-center border-black w-[100px]">
        <p className="font-semibold text-white">{totalDia}</p>
      </div>
      <div className="flex items-center justify-center border-black w-[100px]">
        <p className="font-semibold text-white">{totalMetaDia}</p>
      </div>
      <div className="flex items-center justify-center border-black w-[100px]">
        <p className="font-semibold text-white">{totalAtingidoDia}%</p>
      </div>

      <div className="flex items-center justify-center border-black w-[100px]">
        <p className="font-semibold text-white">{totalMes}</p>
      </div>
      <div className="flex items-center justify-center border-black w-[100px]">
        <p className="font-semibold text-white">{totalMetaMes}</p>
      </div>
      <div className="flex items-center justify-center border-black w-[100px]">
        <p className="font-semibold text-white">{totalAtingidoMes}%</p>
      </div>
    </div>
  )
}

function somarAtendimentosDia(linhasTabela) {
  let totalDia = 0;

  linhasTabela.map((linha) => {
    if (Number.isNaN(linha.pacientesAtendidos)) {
      totalDia += 0;
    } else {
      totalDia += linha.pacientesAtendidos;
    }
  });

  return totalDia;
}
  
function somarMetaDia(dadosTabela) {
  let totalMetaDia = 0;
  
  dadosTabela.especialidadesCabecalhos.map((cabecalho) => {
      cabecalho.especialidades.map((especialidade) => {
        totalMetaDia += especialidade.metaDiaria;
      });
  });
  
  return totalMetaDia;
}

function somarAtendimentosMes(dadosTabela) {
  let totalMes = 0;

  dadosTabela.especialidadesCabecalhos.map((cabecalho) => {
      cabecalho.especialidades.map((especialidade) => {
        totalMes += especialidade.pacientesAtendidosMes;
      });
  });

  return totalMes;
}

function somarMetaMes(dadosTabela) {
  let totalMetaMes = 0;

  dadosTabela.especialidadesCabecalhos.map((cabecalho) => {
      cabecalho.especialidades.map((especialidade) => {
        totalMetaMes += especialidade.metaMensal;
      });
  });

  return totalMetaMes;
}

function calculaPorcentagemDia(dadosTabela) {
    let totalPorcentagemDia = 0;
    let qtdEspecialidades = 0;

    dadosTabela.especialidadesCabecalhos.map((cabecalho) => {
      cabecalho.especialidades.map((especialidade) => {
        if (especialidade.metaDiaria > 0) {
          totalPorcentagemDia += Number(especialidade.pacientesAtendidosDia / Number(especialidade.metaDiaria));
          qtdEspecialidades++;
        }
      });
    });

    return ((totalPorcentagemDia/qtdEspecialidades) * 100).toFixed(2);
}

function calcularPorcentagemMes(dadosTabela) {
  let totalPorcentagemMes = 0;
  let qtdEspecialidades = 0;

  dadosTabela.especialidadesCabecalhos.map((cabecalho) => {
    cabecalho.especialidades.map((especialidade) => {
      if (especialidade.metaMensal > 0) {
        totalPorcentagemMes += Number(especialidade.pacientesAtendidosMes / Number(especialidade.metaMensal));
        qtdEspecialidades++;
      }
    });
  });

  return ((totalPorcentagemMes/qtdEspecialidades) * 100).toFixed(2);
} 