"use client"

import { zodResolver } from '@hookform/resolvers/zod';
import { toPng } from 'html-to-image';
import { useEffect, useRef, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { BiSave } from "react-icons/bi";
import { MdOutlineFileDownload } from "react-icons/md";
import { dadosTabelaSchema, TabelaFormData } from '../../schemas/responseTabela';
import Cirurgioes from './cirurgioes';
import ConverterData from './converterData';
import Especialidades from './especialidades';
import HeaderTabela from './headerTabela';
import { MontarCabecalhos, montarTabelaFormData, montarValoresLinhas } from './montarDados';
import { Rodape } from './rodape';

export default function Tabela() {
  const [data, setData] = useState(new Date());
  const imgRef = useRef(null);

  function BaixarTabela() {
    toPng(imgRef.current, { cacheBust: false })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "Boletim Saúde - " + ConverterData(data);
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }
  
  return (
    <main className="flex flex-col items-center justify-between bg-[#F8FAFC] overscroll-none">
      <div className="flex flex-col items-center justify-between">
        <div className="flex flex-col items-center justify-between mt-[50px] mb-[25px] border-collapse" ref={imgRef}>
          <HeaderTabela data={data} setData={setData}/> 
          <Linhas dataCalendario={data} BaixarTabela={BaixarTabela}/>
        </div>
      </div>
    </main>
  )
}

function Linhas({dataCalendario, BaixarTabela}) {
  const [dadosTabela, setDadosTabela] = useState(null)
  const [isLoading, setLoading] = useState(true);
  
  const { control, watch, register, handleSubmit, setValue } = useForm<TabelaFormData>({
    resolver: zodResolver(dadosTabelaSchema),
    defaultValues: {  
      data: ConverterData(dataCalendario),
      linhas: montarValoresLinhas(dadosTabela)
    }
  });

  const { fields, replace } = useFieldArray({
    control: control,
    name: "linhas"
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/tabela/' + ConverterData(dataCalendario));   
        const dataResponse = await response.json();
        setDadosTabela(dataResponse);
        setValue("linhas", montarValoresLinhas(dataResponse))
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataCalendario, setValue]);

  if (isLoading) return Carregando()

  async function onSubmit(dadosNovos: TabelaFormData) {
    replace(montarTabelaFormData(dadosTabela, dadosNovos));

    const resultado = {
      data: ConverterData(dataCalendario),
      linhas: dadosNovos.linhas,
      cabecalhos: MontarCabecalhos(dadosTabela)
    }

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resultado)
    };

    fetch('http://localhost:8080/api/tabela', requestOptions)
      .then(response => response)
  }

  const watchLinha = watch("linhas");

  function handleChange() {
    // console.log(watchLinha);
  }

  return (
    <>
      <form className="w-full" onChange={handleChange}>
        {TemDadadosEspecialidades({dadosTabela}) ? 
          <Especialidades dadosTabela={dadosTabela} register={register} watchLinha={watchLinha}/>
        : null}

        {TemDadadosCirurgioes({dadosTabela}) ? 
          <Cirurgioes dadosTabela={dadosTabela}/>
        : null}

        {!TemDadadosEspecialidades({dadosTabela}) && !TemDadadosCirurgioes({dadosTabela}) ?
          <p>Não foi possível encontrar dados para a data</p>
        : null}
      </form>

      <Rodape dadosTabela={dadosTabela} linhasTabela={watchLinha}/>
      
      <div className="flex items-center justify-end gap-8 w-full mt-8">
        <Button texto={"Baixar"} color={"bg-blue-800"} onClick={BaixarTabela}/>
        <Button texto={"Salvar"} color={"bg-green-800"} onClick={handleSubmit(onSubmit)}/>
      </div>
    </>
  )
}

interface ButtomProps {
  texto: string;
  color: string;
  onClick?: () => void;
}

function Button({ texto, color, onClick }: ButtomProps) {
  return (
    <button className={`w-[150px] h-[50px] rounded-[5px] text-white flex items-center justify-start ${color}`} type="button" onClick={onClick}>
      {IconeBotao(texto)}
      <div className="ml-4">{texto}</div>
    </button>
  )
}

const IconeBotao = (texto: String) => {
  if (texto === "Baixar") {
    return <MdOutlineFileDownload className="w-6 h-6 ml-4"/>
  } else if (texto === "Salvar") {
    return <BiSave className="w-6 h-6 ml-4"/>
  } else {
    return <div className="ml-4"></div>
  }
}

function TemDadadosEspecialidades({dadosTabela}) {
  let temDados = false;

  dadosTabela.especialidadesCabecalhos.map((cabecalho) => {
    if (cabecalho.especialidades.length > 0) {
      temDados = true;
    }
  });

  return temDados;
}

function TemDadadosCirurgioes({dadosTabela}) {
  let temDados = false;

  dadosTabela.cirurgioesCabecalhos.map((cabecalho) => {
    if (cabecalho.cirurgioes.length > 0) {
      temDados = true;
    }
  });

  return temDados;
}

function Carregando() {
  return (
    <p>Carregando...</p>
  )
}