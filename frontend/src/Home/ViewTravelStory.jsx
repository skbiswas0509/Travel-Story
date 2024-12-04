import moment from 'moment'
import React from 'react'
import { GrMapLocation } from 'react-icons/gr'
import { MdClose, MdDeleteOutline, MdUpdate } from 'react-icons/md'

const ViewTravelStory = ({storyInfo, onClose, onEditClick, onDeleteClick}) => {
  return (
    <div className="realtive">
        <div className="flex items-center justify-end">
            <div>
                <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg">
                <button className="btn-small" onClick={onEditClick}>
                    <MdUpdate className='text-lg' /> Update story
                </button>

                <button className="btn-small btn-delete" onClick={onDeleteClick}>
                    <MdDeleteOutline className='text-lg' /> Delete Story
                </button>

                <button className="" onClick={onClose}>
                    <MdClose className='text-xl text-slate-400' />
                </button>
                </div>
            </div>
        </div>

        <div>
            <div className="flex-1 flex flex-col gap-2 py-4">
                <h1 className="text-2xl text-slate-950">
                    {storyInfo && storyInfo.title}
                </h1>
                <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-500">
                        {storyInfo && moment(storyInfo.visitedDate).format("DO MM YYYY")}
                    </span>

                    <div className="inline-flex items-center gap-2 text-[13px] text-cyan-200/40 rounded px-2 py-1">
                        <GrMapLocation className='text-sm' />
                        {storyInfo && storyInfo.visitedLocation.map((item, index) => storyInfo.visitedLocation.length == index+1 ? `${item}` : `${item},`)}
                    </div>                   
                </div>
                <img src="{storyInfo && storyInfo.imageUrl}" 
                    alt="Selected" 
                    className='w-full h-[300px] object-cover rounded-lg'/>

                <div className="mt-4">
                    <p className="text-sm text-slate-500 leading-6 text-justify whitespace-pre-line"></p>
                </div>

            </div>
        </div>
    </div>
  )
}

export default ViewTravelStory