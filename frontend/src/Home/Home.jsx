import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import TravelStoryCard from '../components/Cards/TravelStoryCard';
import { toast, ToastContainer } from 'react-toastify';
import { MdAdd } from 'react-icons/md';
import Modal from 'react-modal'
import AddEditTravelStory from './AddEditTravelStory';
import ViewTravelStory from './ViewTravelStory';
import EmptyCard from '../components/Cards/EmptyCard';

import { DayPicker } from 'react-day-picker';
import moment from 'moment';
import FilterInfoTitle from '../components/Cards/FilterInfoTitle';
import { getEmptyCardMessage } from '../utils/helper';

const Home = () => {

  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState();
  const [allStories, setAllStories] = useState();
  const [searchQuery, setSearchQuery] = useState();
  const [filterType, setFilterType] = useState('');
  const [dateRange, setDateRange] = useState({form: null, to: null})

  const [OpenAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  })

  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: false,
  });

  //get user info
  const getUserInfo = async() => {
    try {
      const response = await axiosInstance.get("/get-user");
      if(response.data && response.data.user){
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if(error.response.status==401){
        //clear storage if unauthorized
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  //get all travel stories
  const getAllTravelStories = async () => {
    try {
      const response = await axiosInstance.get("/get-all-stories")
      if(response.data && response.data.stories){
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.log("An unexpected error occured.")
    }
  }

  //handle edit story click
  const handleEdit = (data) => {

  }

  //handle travel story click
  const handleViewStory = (data) =>{
    setOpenViewModal({isShown: true, data})
  }

  //handle update favoruite
  const updateIsFavourite = async(storyData) => {
    const storyId = storyData._id;

    try {
      const response = await axiosInstance.put(
        "/update-is-favourite/" + storyId,
        {
          isFavourite: !storyData.isFavourite
        }
      )

      if(response.data && response.data.story){
        toast.success("story updated successfully")

        if(filterType === 'search' && searchQuery){
          onSearchStory(searchQuery);
        }else if (filterType === 'date'){
          filterStoriesByDate(dateRange);
        }else{
          getAllTravelStories();
        }
      }
    } catch (error) {
      console.log("An unexpected error occured")
    }
  }

  // handle filter travel story by date range
  const filterStoriesByDate = async(day) => {
    try {
      const startDate = day.from ? moment(day.from).valueOf() : null;
      const endDate = day.from ? moment(day.to).valueOf(): null;

      if(startDate && endDate){
        const response = await axiosInstance.get("/travel-stories/filter", {
          params: { startDate, endDate},
        });

        if (response.data && response.data.stories){
          setFilterType("data");
          setAllStories(response.data.stories)
        }
      }
    } catch (error) {
      console.log("An unexpected error occured.")
    }
  }

  //handle date range select
  const handleDayClick = (day) => {
    setDateRange(day);
    filterStoriesByDate(date);
  }

  const resetFilter = () => {
    setDateRange({ from: null, to: null});
    setFilterType("");
    getAllTravelStories();
  }

  useEffect(() => {
    getUserInfo();
    getAllTravelStories
    return () => {
    }
  }, [])

  //delete story
  const deleteTravelStory = async() => {
    const storyId = data._id;

    try {
      const response = await axiosInstance.delete("/delete-story" + storyId);

      if(response.data && response.data.error){
        toast.error("Story delete successfully");
        setOpenViewModal((prevState) => ({...prevState, isShown: false}))
      }
    } catch (error) {
      if(
        error.response && 
        error.response.data &&
        error.response.data.message
      ){
        setError(error.response.data.message)
      }else{
        //handle unexpected errors
        console.log("An unexpected error occured")
      }
    }
  }

  //search story
  const onSearchStory  = async () =>{
    try {
      const response = await axiosInstance.get("/search", {
        params: {
          query,
        }
      })

      if(response.data && response.data.stories){
        setFilterType("search");
        setAllStories(response.data.storage)
      }
    } catch (error) {
      console.log("An unexpected error")
    }
  }

  //clear search
  const handleClearSearch = () => {
    setFilterType("");
    getAllTravelStories();
  }

  return (
    <>
    <Navbar userinfo={userInfo}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      onSearchNote={onSearchStory}
      handleClearSearch={handleClearSearch}
      />

    <div className="container mx-auto py-10">

      <FilterInfoTitle 
        filterType={filterType}
        filterDates={dateRange}
        onClear={() => {
          resetFilter();
        }}
      />

      <div className="flex gap-7">
        <div className="flex-1">
          {allStories.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {allStories.map((item) => {
                return (
                  <TravelStoryCard key={item._id}
                   imgUrl={item.imageUrl}
                   title={item.title}
                   story={item.story}
                   date={item.visitedDate}
                   visitedLocation={item.visitedLocation}
                   isFavourite={item.isFavourite}
                   onEdit={() => handleEdit(item)}
                   onClick={() => handleViewStory(item)}
                   onFavouriteClick={() => updateIsFavourite(item)}/>
                )
              })}
            </div>
          ) : (
            <EmptyCard imgsrc={getEmptyCardImg(filterType)} 
            message={getEmptyCardMessage} />
          )
          }
        </div>
        <div className="w-[350px]">
          <div className="bg-white border border-slate-200 shadow-slate-200/50 rounded-lg">
            <div className="p-3">
              <DayPicker
                captionLayout='dropdown-buttons'
                mode='range'
                selected={dateRange}
                onSelect={handleDayClick}
                pagedNavigation
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    
    {/*  add and edit travel story model */}
    <Modal isOpen={OpenAddEditModal.isShown}
    onRequestClose={() => {}}
    style={{
      overlay:{
        backgroundColor: "rgba(0,0,0,0.2)",
        zIndex: 999,
      },
    }}
    appElement = {document.getElementById("root")}
    className='model-box'
    >
    <AddEditTravelStory
    type={OpenAddEditModal.type}
    storyInfo={OpenAddEditModal.data}
    onClose={() => {
      setOpenAddEditModal
    }}
    getAllTravelStories={getAllTravelStories}
    />
    </Modal>

    {/* view travel story model */}
    <Modal
    isOpen={openViewModal.isShown}
    onRequestClose={() => {}}
    style={{
      overlay: {
        backgroundColor: "rgba(0,0,0,0.2)",
        zIndex: 999,
      }
    }}
    appElement={document.getElementById("root")}
    className="model-box">
    <ViewTravelStory
    type={openViewModal.type}
    storyInfo={openViewModal.data || null} onClose={() =>{
      setOpenViewModal((prevState) => ({...prevState, isShown:false}));
    }} 
    onEditClick={() =>{
      setOpenViewModal((prevState) => ({...prevState, isShown: false}));
      handleEdit(openViewModal.data || null)
    }} 
    onDeleteClick={() =>{
      deleteTravelStory(openViewModal.data || null)
    }} 
    />
    </Modal>

    <button className='w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-10 bottom-10' onClick={() => {
      setOpenAddEditModal({ isShown: true, type: "Add", data: null});
    }}>
      <MdAdd className='text-[32px] text-white' /> 
    </button>

    <ToastContainer />
    </>
  )
}

export default Home