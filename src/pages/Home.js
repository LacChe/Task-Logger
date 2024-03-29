import React, { useRef, useState } from 'react'
import { IoMdAddCircleOutline } from 'react-icons/io'
import { AiOutlineSearch, AiOutlineFilter } from 'react-icons/ai'
import { FiPenTool } from 'react-icons/fi'
import { useNavigate, useParams } from 'react-router-dom'
import { Day, Week, Month, All, Filter } from '../components';
import { useStateContext } from '../utils/stateContext.js';
import { Grid } from  'react-loader-spinner'

const displayComponent = (param) => {
    switch (param) {
        case 'day':
            return (<Day />);
        case 'week':
            return (<Week />);
        case 'month':
            return (<Month />);
        case 'everything':
            return (<All />);
        //case 'range':
            //return (<Range />);
        default: 
            return (<Day />);
    }
}

const Home = () => {
    const { loaded, showTools, setShowTools, showSearch, setShowSearch, searchTerm, setSearchTerm } = useStateContext();
    const { pageParam } = useParams();
    const [display, setDisplay] = useState('');
    const navigate = useNavigate();

    const inputRef = useRef(null);

    if(display === 'filter') return (<Filter setDisplay={setDisplay} />);

    if(!loaded()) {
      return (
        <div className='spinner'>
          <Grid
              height="80"
              width="80"
              color="#002B5B"
              ariaLabel="grid-loading"
              radius="12.5"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
          />
        </div>
      )
    }

    return (
        <div className='home-main'>
            {displayComponent(pageParam)}
            <div className={showSearch?'tools-search search-show':'tools-search search-hide'}>
                <div className='search-bar-icon'><AiOutlineSearch /></div>
                <input 
                    className='search-input' 
                    ref={inputRef} 
                    type='text' 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)}>
                </input>
            </div>
            <button type='button' className='button-add-item' onClick={()=> {
                if(showSearch) {
                    setSearchTerm();
                    document.querySelector('.search-input').value = '';
                    setShowSearch(false);
                } else {
                    setShowTools((prev)=>!prev);
                }
            }}>
                <FiPenTool />
            </button>
            <div className={showTools?'tools-container tools-show':'tools-container tools-hide'}>
                <button type='button' className='button-tool' onClick={()=>{
                    setShowTools(false);
                    setShowSearch((prev) => {
                        if(!prev) inputRef.current.focus();
                        return !prev
                    });
                }}>
                    <AiOutlineSearch />
                </button>
                <button type='button' className='button-tool' onClick={()=>{
                    setShowTools(false);
                    setDisplay('filter');
                }}>
                    <AiOutlineFilter />
                </button>
                <button type='button' className='button-tool' onClick={()=>{
                    setShowTools(false);
                    navigate(`/add`);
                }}>
                    <IoMdAddCircleOutline />
                </button>
            </div>
        </div>
    )
}

export default Home