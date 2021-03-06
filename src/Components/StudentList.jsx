import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import axios from 'axios';
import SearchInput from '../Components/input-fields/SearchInput'
import { Button } from "@mui/material";
import { Grid } from '@mui/material';
import FlexBetween from '../Components/flexbox/FlexBetween'
import {AiOutlineMore} from 'react-icons/ai'
import {BsFillArrowRightCircleFill, BsFillArrowLeftCircleFill} from 'react-icons/bs'
import {Add} from '@mui/icons-material'
import BasicMenu from './BasicMenu';
import SearchIcon from '../icons/SearchIcon';

const columns = [
  {
    id: 'more',
    label: '',
    minWidth: 100
  },
  { 
    id: 'name', 
    label: 'Nome', 
    minWidth: 170 
  },

  { 
    id: 'cpf', 
    label: 'CPF', 
    minWidth: 100 
  },

  {
    id: 'infopen',
    label: 'INFOPEN',
    minWidth: 170
  },

  {
    id: 'agent',
    label: 'Preposto',
    minWidth: 170,
  },


  {
    id: 'ufPeni',
    label: 'UF / Penitenciária',
    minWidth: 170,
  },
];

export default function StudentsContent() {
  const api = process.env.REACT_APP_API_KEY
  const Navigate = useNavigate()
  const [rows, setRows] = useState([])
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [students, setStudents] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [isSearch, setIsSearch] = useState(false)
  const navigateAddUser = ()=> Navigate('/cadastros/adicionar-aluno')
  const handleChangePage = (event, newPage) => {
    if(newPage !== 0 && students.length >= 9){
      setPage(newPage);
    }
  };
  
  const addStudentRow = ()=>{
    let rowsProvisory = []
    students.forEach((st)=>{
      rowsProvisory.push({
        name: st.nome,
        id: st.id,
        cpf: st.cpf,
        agent: st.nomePreposto,
        infopen: '999999',
        ufPeni: `${st.penitenciaria.ufDescricao} / ${st.penitenciaria.nome}`,
        more: <BasicMenu id={st.id}><AiOutlineMore size={25} color='black'/></BasicMenu>
      })
    })
    setRows(rowsProvisory)
  }

  const searchStudent = ()=>{
      setPage(1)
      if(searchValue !== ''){
        setIsSearch(true)
      }else{
        setIsSearch(false)
      }
      getStudentsPage()
  }

  const getStudentsPage = ()=>{
    if(isSearch){
      axios.get(`${api}/alunos?Search=${searchValue}&Page=${page}`).then(response=>{
        setStudents(response.data.data)
      })
    }else{
      axios.get(`${api}/alunos?Page=${page}`).then(response=>{
        setStudents(response.data.data)
      })
    }
  }

  useEffect(()=>{
    axios.get(`${api}/alunos?Page=1`).then(response=>{
      setStudents(response.data.data)
    })
  }, [])

  useEffect(()=>{
    getStudentsPage()
  }, [page])

  useEffect(()=>{
    addStudentRow()
  }, [students])

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Grid>
      <FlexBetween>
        <div className='flex items-center w-3/4'>
          <SearchInput
            value={searchValue}
            placeholder="Pesquisar por Nome ou CPF"
            onChange={(e) => setSearchValue(e.target.value)}/>
            <div className='ml-5'>
              <Button startIcon={<SearchIcon/>} onClick={searchStudent} className='ml-10' variant='contained'>
                Buscar
              </Button>
            </div>
        </div>

        <Button onClick={navigateAddUser} startIcon={<Add/>} variant="contained">
          Adicionar Novo Usuário
        </Button>
      </FlexBetween>
      <Paper className='mt-5' sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 740 }}>
          <table className='w-full table-auto'>
            <thead>
              <tr className='w-full text-sm'>
                <td>

                </td>
                <td className='py-4 px-2'>
                  Nome
                </td>

                <td className='py-4 px-2'>
                  CPF
                </td>

                <td className='py-4 px-2'>
                  INFOPEN
                </td>

                <td className='py-4 px-2'>
                  Preposto
                </td>

                <td className='py-4 px-2'>
                  UF / Penitenciária
                </td>
                <td>

                </td>
              </tr>
            </thead>
            <tbody>
            {rows.map((row) => {
                  return (
                    <tr className='border-t border-b text-sm border-gray-300 w-full' tabIndex={-1} key={row.code}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <td className='p-2' key={column.id} align={column.align}>
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : value}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </TableContainer>
        {/*
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        */}
        
        <div className='flex justify-end p-2 select-none'>
          <BsFillArrowLeftCircleFill onClick={(e)=> handleChangePage(e, page-1)} className={`cursor-pointer ${page <= 1 ? 'text-gray-400' : 'text-black'} hover:text-gray-400 transition-colors mr-10`} size={35}/>
          <BsFillArrowRightCircleFill onClick={(e)=> handleChangePage(e, page+1)} className={`cursor-pointer ${students.length <= 9 ? 'text-gray-400' : 'text-black'}  hover:text-gray-400 transition-colors`} size={35}/>
        </div>
      </Paper>
    </Grid>
  );
}