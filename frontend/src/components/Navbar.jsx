import React from 'react'
import ProfileInfo from './Cards/ProfileInfo'
import { useNavigate } from 'react-router-dom'
import SearchBar from './Input/SearchBar';

//import LOGO from "../assets/images/logo.svg"

const Navbar = ({userInfo,
  searchQuery,
  setSearchQuery,
  onSearchNote, handleClearSearch
}) => {

    const isToken = localStorage.getItem("token");

    const navigate = useNavigate();
    const onLogout = () => {
        localStorage.clear();
        navigate("/login");
    }

    const handleSearch = async () => {
      if(searchQuery){
        onSearchNote(searchQuery)
      }
    }

    const onClearSearch = () => {
      handleClearSearch();
      setSearchQuery("")
    }
  return (
    <div>
        <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10">
            <img src="" alt="travel story" className='h-9'/>
            {isToken && (
              <>
              <SearchBar value={searchQuery} 
              onChange={({target}) => {
                setSearchQuery(target.value);
              }}
              handleSearch = {handleSearch}
              onClearSearch={onClearSearch}
              />

              <ProfileInfo userInfo={userInfo} onLogout={onLogout}/> </>)}
        </div>
    </div>
  )
}

export default Navbar