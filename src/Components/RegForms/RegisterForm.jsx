import React, { useEffect } from "react";
import "../../styles/RegisterForm.css";
import { useState } from "react";
import { FormControl, Grid } from "@mui/material";
import axios from "axios";
import RegForm1 from "./RegForm1";
import RegForm2 from "./RegForm2";
import RegForm3 from "./RegForm3";
import FlexAround from '../flexbox/FlexAround'
import {NotificationContainer, NotificationManager} from 'react-notifications';

export default function RegisterForm({setSelected}) {
  let [muiAlert, setAlert] = useState(false);
  let api = process.env.REACT_APP_API_KEY;
  let [penitenciaria, setPenitenciaria] = useState([]);
  let [data, setData] = useState({
        nome: "",sexo: "",cpf: "",rg: "",orgaoExpedidor: "",dataNascimento: "",
        naturalidade: "",ufNaturalidade: "",nacionalidade: "",endereco: "",
        bairro: "",cidade: "",ufResidencial: "",cep: "", email:'',
        celular: "",foneResidencial: "",foneComercial: "",emailPreposto: "",
        nomePreposto: "",vinculo: "",sexoPreposto: "",cpfPreposto: "",
        rgPreposto: "",orgaoExpedidorPreposto: "",grauInstrucao: "",atuacaoHabilitacao: "",
        profissao: "",bloco: "",ala: "",cela: "",condicaoPreso: "",
        regime: "",infopen: "",mae: "",pai: "",
      penitenciaria: { idPenitenciaria: "", uf: "" }
    });

  let keysPenitenciaria = Object.keys(data.penitenciaria),
    keysAluno = Object.keys(data),
    valueElements = [...keysAluno,...keysPenitenciaria];
  let emptyElements = [];
  valueElements.forEach((vl) => {
    if (data[vl] === "" || data.penitenciaria[vl] === "") {
      emptyElements.push(vl);
    }
  });

  function Submit() {
    if (!emptyElements.length > 0) {
      setSelected(2);
      NotificationManager.success('Aluno cadastrado', 'SUCESSO');
    }
    else {
      setAlert(true);
      NotificationManager.error('Há itens incompletos', 'ERRO');
    }
  }
  useEffect(()=>{
    axios.get(`${api}penitenciarias?Limit=400`).then(res=>{
      setPenitenciaria([]);
      let dataPenitenciaria = res.data.data;
      dataPenitenciaria.forEach((item)=>{
      if(data.penitenciaria.uf===item.uf){
        setPenitenciaria((data)=>[...data,item])
      }
    })
    })
  },[data.penitenciaria])
  return (
    <Grid className="bg-white rounded-md pl-20 py-5" >
      <FormControl style={{ fontSize: "20px", marginLeft: "40px"}}>
        <h1 className="titles"> 1 - DADOS DO REEDUCANDO</h1>
        <RegForm1 muiAlert={muiAlert} data={data} setData={setData} />
        <h2 className="titles">
          2 - DADOS DO RESPONSÁVEL: Familiar / Visitante / Advogado
        </h2>
        <RegForm2 muiAlert={muiAlert} data={data} setData={setData} />
        <h3 className="titles">3 - DADOS PRISIONAIS</h3>
        <RegForm3 muiAlert={muiAlert} data={data} setData={setData} penitenciaria={penitenciaria} />
      </FormControl>
      <FlexAround>
        <button
          className="lg:w-1/5 h-fit p-2 rounded-sm bg-red-600 text-white font-bold"
          onClick={() => window.history.back()}
        >
          VOLTAR
        </button>
        <button
          type="submit"
          className="lg:w-1/5 h-fit p-2 rounded-sm text-white font-bold bg-green-500"
          onClick={() => Submit()}
        >
          SALVAR
        </button>
      </FlexAround>
    </Grid>
  );
}
